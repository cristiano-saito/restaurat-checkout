'use client';
import { MenuCategory, Prisma } from '@prisma/client';
import { Clock10Icon } from 'lucide-react';
import Image from 'next/image';
import { useContext, useState } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/helpers-currency';

import { CartContext } from '../contexts/cart';
import CartSheet from './cart-sheet';
import RestaurantMenuProducts from './products';

interface RestaurantMenuCategoriesProps {
  restaurant: Prisma.RestaurantGetPayload<{
    include: {
      menuCategories: {
        include: {
          products: true;
        };
      };
    };
  }>;
}

type MenuCategoryWithProducts = Prisma.MenuCategoryGetPayload<{
  include: {
    products: true;
  };
}>;

const RestaurantMenuCategories = ({
  restaurant,
}: RestaurantMenuCategoriesProps) => {
  const [selectedCategory, setSelectedCategory] =
    useState<MenuCategoryWithProducts>(restaurant.menuCategories[0]);
  const { products, toggleCart } = useContext(CartContext);
  const handleCategoryClick = (category: MenuCategoryWithProducts) => {
    setSelectedCategory(category);
  };
  const getCategoryButtonVariant = (
    category: MenuCategory
  ): ButtonProps['variant'] => {
    return selectedCategory.name === category.name ? 'default' : 'secondary';
  };

  const totalProducts = products.reduce(
    (acc, product) => acc + product.quantity,
    0
  );
  return (
    <div className='relative z-50 mt-[-1.5rem] rounded-t-3xl bg-white p-5'>
      <div className='flex items-center gap-3'>
        <Image
          src={restaurant.avatarImageUrl}
          alt={restaurant.name}
          width={45}
          height={45}
        />
        <div>
          <h2 className='text-lg font-semibold'>{restaurant.name}</h2>
          <p className='text-xs opacity-50'>{restaurant.description}</p>
        </div>
      </div>
      <div className='mt-3 flex items-center gap-1 text-xs text-green-500'>
        <Clock10Icon size={12} />
        <p className='text-xs opacity-50'>aberto!</p>
      </div>
      <ScrollArea className='w-full'>
        <div className='flex w-max space-x-4 pb-4 pt-2'>
          {restaurant.menuCategories.map(category => (
            <Button
              className='rounded-full'
              key={category.id}
              variant={getCategoryButtonVariant(category)}
              size='sm'
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      <h3 className='px-5 pt-2 text-sm font-semibold'>
        {selectedCategory.name}
      </h3>
      <RestaurantMenuProducts
        products={selectedCategory.products}
        slug={restaurant.slug}
      />
      {products.length > 0 && (
        <div className='fixed bottom-0 left-0 right-0 flex w-full items-center justify-between border-t bg-white px-5 py-3'>
          <div>
            <p className='text-xs text-muted-foreground'>Total do pedido</p>
            <p className='text-sm font-semibold'>
              {formatCurrency(
                products.reduce(
                  (acc, product) => acc + product.price * product.quantity,
                  0
                )
              )}
              <span className='text-xs font-normal text-muted-foreground'>
                /{totalProducts > 1 ? `${totalProducts} items` : '1 item'}
              </span>
            </p>
          </div>
          <Button className='rounded-full' onClick={() => toggleCart()}>
            Ver sacola
          </Button>
          <CartSheet />
        </div>
      )}
    </div>
  );
};

export default RestaurantMenuCategories;
