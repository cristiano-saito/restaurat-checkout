'use server';

import { db } from '@/lib/prisma';

export const getOrders = async (cpf: string) => {
  const orders = await db.order.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      user: {
        cpf: cpf,
      },
    },
    include: {
      restaurant: true,
      user: true,
      orderProducts: {
        include: {
          product: true,
        },
      },
    },
  });
  return orders;
};
