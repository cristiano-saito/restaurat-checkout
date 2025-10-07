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
    <div className='flex items-center justify-between'>
      <div className='flex w-full items-center justify-between gap-3'>
        <div className='relative h-20 w-[20%] rounded-xl bg-gray-100'>
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className='rounded-lg object-contain'
          />
        </div>
        <div className='w-[60%] space-y-1'>
          <p className='max-w-[90%] truncate text-ellipsis text-xs'>
            {product.name}
          </p>
          <p className='text-sm font-semibold'>
            {formatCurrency(product.price)}
          </p>
          <div className='flex w-[20%] items-center gap-1 text-center'>
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
        <div className='flex w-[10%] items-center gap-1'>
          <Button
            variant='outline'
            className='h-7 w-7 rounded-lg'
            size='icon'
            onClick={handleRemoveAllFromCart}
          >
            <TrashIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartProductItem;
