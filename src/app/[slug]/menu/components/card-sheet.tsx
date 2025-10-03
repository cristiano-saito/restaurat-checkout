import Image from 'next/image';
import { useContext } from 'react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { CartContext } from '../contexts/cart';

interface CardSheetProps {
  isOpen: boolean;
  toggleCart: () => void;
}

const CardSheet = ({ isOpen, toggleCart }: CardSheetProps) => {
  const { products } = useContext(CartContext);
  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Carrinho</SheetTitle>
          <SheetDescription>Seus itens selecionados</SheetDescription>
        </SheetHeader>
        {products.map(product => (
          <div key={product.id}>
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={100}
              height={100}
            />
            <p>{product.name}</p>
            <p>{product.price}</p>
          </div>
        ))}
      </SheetContent>
    </Sheet>
  );
};

export default CardSheet;
