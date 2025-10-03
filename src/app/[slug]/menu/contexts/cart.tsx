'use client';
import { Product } from '@prisma/client';
import { createContext, useState } from 'react';

interface CartProduct
  extends Pick<Product, 'id' | 'name' | 'price' | 'imageUrl'> {
  quantity: number;
}

interface ICartContext {
  isOpen: boolean;
  products: CartProduct[];
  toggleCart: () => void;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (product: CartProduct) => void;
  clearCart: () => void;
}

export const CartContext = createContext<ICartContext>({
  isOpen: false,
  products: [],
  toggleCart: () => { },
  addToCart: () => { },
  removeFromCart: () => { },
  clearCart: () => { },
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<CartProduct[]>([]);
  const toggleCart = () => {
    setIsOpen(!isOpen);
  };
  const addToCart = (product: CartProduct) => {
    setProducts(prevProducts => {
      const existingProduct = prevProducts.find(p => p.id === product.id);
      if (existingProduct) {
        return prevProducts.map(p =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + product.quantity }
            : p
        );
      }
      return [...prevProducts, product];
    });
  };
  const removeFromCart = (product: CartProduct) => {
    setProducts(products.filter(p => p.id !== product.id));
  };
  const clearCart = () => {
    setProducts([]);
  };

  return (
    <CartContext.Provider
      value={{
        isOpen,
        products,
        toggleCart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
