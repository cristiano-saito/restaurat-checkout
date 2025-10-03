'use client';
import { Prisma } from '@prisma/client';
import { ChefHatIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/helpers-currency';

interface ProductDetailsProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          name: true;
          avatarImageUrl: true;
        };
      };
    };
  }>;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className='mt-[-1.5rem relative z-50 flex flex-auto flex-col overflow-hidden rounded-t-3xl p-5'>
      <div className='flex-auto overflow-hidden'>
        <div className='flex items-center gap-1.5 px-5'>
          <Image
            src={product.restaurant.avatarImageUrl}
            alt={product.restaurant.name}
            width={16}
            height={16}
            className='rounded-full'
          />
          <p className='text-xs text-muted-foreground'>
            {product.restaurant.name}
          </p>
        </div>
        <h2 className='mt-1 px-5 text-lg font-semibold'>{product.name}</h2>
        <div className='mt-3 flex items-center justify-between'>
          <h3 className='px-5 text-xl font-semibold'>
            {formatCurrency(product.price)}
          </h3>
          <div className='flex items-center text-center'>
            <Button
              variant='outline'
              className='h-8 w-8 rounded-full'
              onClick={() => quantity > 0 && setQuantity(quantity - 1)}
            >
              <ChevronLeftIcon />
            </Button>
            <p className='px-2 text-sm font-medium'>{quantity}</p>
            <Button
              variant='destructive'
              className='h-8 w-8 rounded-full'
              onClick={() => setQuantity(quantity + 1)}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>

        <ScrollArea className='h-full'>
          <div className='mt-6 space-y-3 px-5'>
            <h4 className='font-semibold'>Sobre:</h4>
            <p className='text-sm text-muted-foreground'>
              {product.description}
            </p>
          </div>
          <div className='mt-6 space-y-3 px-5'>
            <ChefHatIcon />
            <h4 className='font-semibold'>Ingredientes:</h4>
            <ul className='list-disc pl-5 text-sm text-muted-foreground'>
              {product.ingredients.map(ingredient => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          </div>
        </ScrollArea>
      </div>
      <Button className='mt-6 w-full rounded-full'>
        Adicionar ao carrinho
      </Button>
    </div>
  );
};

export default ProductDetails;
