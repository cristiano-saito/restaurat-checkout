import { useContext } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { formatCurrency } from '@/helpers-currency';

import { CartContext } from '../contexts/cart';
import CartItem from './cart-product-item';

interface CardSheetProps {
  isOpen: boolean;
  toggleCart: () => void;
}

const CardSheet = ({ isOpen, toggleCart }: CardSheetProps) => {
  const { products } = useContext(CartContext);
  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className='w-[90%]'>
        <SheetHeader>
          <SheetTitle className='text-left'>Carrinho</SheetTitle>
        </SheetHeader>
        <div className='flex h-[calc(100%-100px)] flex-col py-5'>
          <div className='flex-auto'>
            {products.map(product => (
              <CartItem key={product.id} product={product} />
            ))}
          </div>
          <Card>
            <CardContent className='p-5'>
              <div className='flex justify-between'>
                <p className='text-sm text-muted-foreground'>Total</p>
                <p className='text-sm font-semibold'>
                  {formatCurrency(
                    products.reduce(
                      (acc, product) => acc + product.price * product.quantity,
                      0
                    )
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Button className='w-full rounded-full'>Finalizar compra</Button>
      </SheetContent>
    </Sheet>
  );
};

export default CardSheet;
