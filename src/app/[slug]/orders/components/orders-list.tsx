'use client';
import { OrderStatus, Prisma } from '@prisma/client';
import { ChevronLeftIcon, ScrollTextIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/helpers-currency';

interface OrdersListProps {
  orders: Prisma.OrderGetPayload<{
    include: {
      restaurant: true;
      user: true;
      orderProducts: {
        include: {
          product: true;
        };
      };
    };
  }>[];
}

const getStatusLabel = (status: OrderStatus) => {
  if (status === 'FINISHED') return 'Finalizado';
  if (status === 'IN_PREPARATION') return 'Em preparo';
  if (status === 'PENDING') return 'Pendente';
  if (status === 'PAYMENT_CONFIRMED') return 'Pagamento confirmado';
  if (status === 'PAYMENT_FAILED') return 'Pagamento falhou';
  return '';
};

const OrdersList = ({ orders }: OrdersListProps) => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <div className='space-y-6 p-6'>
      <Button
        variant='secondary'
        size='icon'
        className='rounded-full'
        onClick={handleBack}
      >
        <ChevronLeftIcon />
      </Button>
      <div className='flex items-center gap-3'>
        <ScrollTextIcon />
        <h2 className='text-lg font-semibold'>Meus pedidos</h2>
      </div>
      {orders.map(order => (
        <Card key={order.id}>
          <CardContent className='space-y-4 p-5'>
            <div
              className={`w-fit rounded-full px-2 py-1 text-xs font-semibold ${([OrderStatus.IN_PREPARATION, OrderStatus.FINISHED, OrderStatus.PAYMENT_CONFIRMED] as OrderStatus[]).includes(order.status) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'} `}
            >
              {getStatusLabel(order.status)}
            </div>
            <div className='flex items-center gap-2'>
              <div className='relative h-5 w-5'>
                {order.restaurant.avatarImageUrl && (
                  <Image
                    src={order.restaurant.avatarImageUrl}
                    alt={order.restaurant.name}
                    fill
                    className='rounded-full object-cover'
                  />
                )}
              </div>
              <p className='text-sm font-semibold'>{order.restaurant.name}</p>
            </div>
            <Separator />
            {order.orderProducts.map(orderProduct => (
              <div key={orderProduct.id}>
                <div className='flex items-center gap-2'>
                  <div className='flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-white'>
                    <p className='text-xs'>{orderProduct.quantity}</p>
                  </div>
                  <p className='text-sm font-semibold'>
                    {orderProduct.product.name}
                  </p>
                  <Separator orientation='vertical' />
                  <p className='text-sm font-semibold'>
                    {formatCurrency(order.total)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrdersList;
