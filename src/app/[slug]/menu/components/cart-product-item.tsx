import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { useContext } from 'react';

import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/helpers-currency';

import { CartContext, CartProduct } from '../contexts/cart';

interface CartItemProps {
  product: CartProduct;
}

const CartProductItem = ({ product }: CartItemProps) => {
  const { removeFromCart, addToCart, removeAllFromCart } =
    useContext(CartContext);

  const handleRemoveFromCart = () => {
    removeFromCart(product);
  };

  const handleAddToCart = () => {
    addToCart(product);
  };
  const handleRemoveAllFromCart = () => {
    removeAllFromCart(product);
  };

  return (
    <div className='flex items-center justify-between pb-3'>
      <div className='flex items-center gap-1'>
        <div className='relative h-20 w-20 rounded-xl bg-gray-200'>
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className='rounded-lg object-contain'
          />
        </div>
        <div className='space-y-1'>
          <p className='max-w-[80%] truncate text-ellipsis text-xs'>
            {product.name}
          </p>
          <p className='text-sm font-semibold'>
            {formatCurrency(product.price)}
          </p>
          <div className='flex items-center gap-1 text-center'>
            <Button
              variant='default'
              className='h-7 w-7 rounded-lg'
              onClick={handleRemoveFromCart}
            >
              <ChevronLeftIcon />
            </Button>
            <p className='w-7 text-xs'>{product.quantity}</p>
            <Button
              variant='destructive'
              className='h-7 w-7 rounded-lg'
              onClick={handleAddToCart}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className='flex items-center gap-1'>
        <Button
          variant='destructive'
          className='h-7 w-7 rounded-lg'
          onClick={handleRemoveAllFromCart}
        >
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
};

export default CartProductItem;
