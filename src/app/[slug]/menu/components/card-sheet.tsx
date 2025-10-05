import { useContext, useState } from 'react';

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
import FinishOrderDialog from './finish-order-dialog';

const CardSheet = () => {
  const { isOpen, products, toggleCart } = useContext(CartContext);
  const [finishOrderDialogIsOpen, setFinishOrderDialogIsOpen] = useState(false);
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
          <Button
            className='w-full rounded-full'
            onClick={() => setFinishOrderDialogIsOpen(true)}
          >
            Finalizar pedido
          </Button>
        </div>
        <FinishOrderDialog
          open={finishOrderDialogIsOpen}
          onOpenChange={setFinishOrderDialogIsOpen}
        />
      </SheetContent>
    </Sheet>
  );
};

export default CardSheet;
