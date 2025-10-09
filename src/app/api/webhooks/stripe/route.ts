import { OrderStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { db } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  const secretKey = process.env.STRIPE_WEBHOOK_SECRET_KEY as string;
  if (!secretKey) {
    return new Response('No secret', { status: 400 });
  }
  const stripe = new Stripe(secretKey as string);

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    secretKey as string
  );

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    return NextResponse.json({ received: true }, { status: 400 });
  }
  switch (event.type) {
    case 'checkout.session.completed':
      const orderPaymentConfirmed = await db.order.update({
        where: { id: Number(orderId) },
        data: { status: OrderStatus.PAYMENT_CONFIRMED as OrderStatus },
        include: {
          restaurant: {
            select: {
              slug: true,
            },
          },
        },
      });
      revalidatePath(`/${orderPaymentConfirmed.restaurant.slug}/orders`);
      break;

    case 'charge.failed':
      const orderPaymentFailed = await db.order.update({
        where: { id: Number(orderId) },
        data: { status: OrderStatus.PAYMENT_FAILED as OrderStatus },
        include: {
          restaurant: {
            select: {
              slug: true,
            },
          },
        },
      });
      revalidatePath(`/${orderPaymentFailed.restaurant.slug}/orders`);
      break;
    default:
      return NextResponse.json({ received: true }, { status: 200 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
