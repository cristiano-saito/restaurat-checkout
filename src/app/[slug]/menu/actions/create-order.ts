'use server';
import { ConsumptionMethod, OrderStatus, UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';

import { db } from '@/lib/prisma';

import { removeCpfPunctuation } from '../helpers/cpf';

interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCpf: string;
  products: Array<{
    id: string;
    quantity: number;
  }>;
  restaurantSlug: string;
  consumptionMethod: ConsumptionMethod;
}

export const createOrder = async (order: CreateOrderInput) => {
  const restaurant = await db.restaurant.findFirst({
    where: {
      slug: order.restaurantSlug,
    },
  });
  if (!restaurant || !restaurant.id) {
    throw new Error('Restaurant not found');
  }

  const user = {
    name: order.customerName,
    email: order.customerEmail,
    phone: order.customerPhone,
    cpf: removeCpfPunctuation(order.customerCpf),
  };
  const customer = await createUser(user);
  const productsWithPrice = await db.product.findMany({
    where: {
      id: { in: order.products.map(product => product.id) },
    },
  });
  const productsWithQuantity = order.products.map(product => ({
    productId: product.id,
    quantity: product.quantity,
    price: productsWithPrice.find(p => p.id === product.id)?.price || 0,
  }));
  const total = productsWithQuantity.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  const newOrder = {
    total: total,
    status: OrderStatus.PENDING,
    restaurantId: restaurant.id,
    consumptionMethod: order.consumptionMethod,
    userId: customer.id,
    orderProducts: {
      createMany: {
        data: productsWithQuantity,
      },
    },
  };
  await db.order.create({
    data: newOrder,
  });
  //return createdOrder;
  redirect(`/${order.restaurantSlug}/orders?cpf=${order.customerCpf}`);
};

const createUser = async (user: {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}) => {
  const existingUser = await db.user.findUnique({
    where: {
      email: user.email,
    },
  });
  if (existingUser) {
    return existingUser;
  }
  const newUser = await db.user.create({
    data: { ...user, role: UserRole.CUSTOMER },
  });
  return newUser;
};
