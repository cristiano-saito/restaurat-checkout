'use server';

import Stripe from 'stripe';

import { db } from '@/lib/prisma';

interface CreateStripeCheckoutInput {
  slug: string;
  orderId: number;
  products: Array<{
    id: string;
    quantity: number;
    name: string;
    imageUrl: string;
    price: number;
  }>;
}

const createStripeCheckout = async (
  input: CreateStripeCheckoutInput
): Promise<{ sessionId: string } | null> => {
  const { products, slug, orderId } = input;

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-02-24.acacia',
  });

  const productsWithPrices = await db.product.findMany({
    where: {
      id: {
        in: products.map(product => product.id),
      },
    },
  });

  if (!productsWithPrices) {
    throw new Error('Products not found');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'] as const,
      mode: 'payment',
      line_items: products.map(product => ({
        price_data: {
          currency: 'brl',
          product_data: {
            name: product.name,
            images: [product.imageUrl],
          },
          unit_amount:
            productsWithPrices.find(p => p.id === product.id)!.price * 100,
        },
        quantity: product.quantity,
      })),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${slug}/confirmation?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${slug}/confirmation?success=false`,
      metadata: {
        orderId: orderId,
      },
    });
    return {
      sessionId: session.id as string,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default createStripeCheckout;
