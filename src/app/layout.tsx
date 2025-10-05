import './globals.css';

import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';

import { CartProvider } from './[slug]/menu/contexts/cart';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Restaurant Self Checkout',
  description: 'Self Checkout for Restaurant App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body suppressHydrationWarning={true} className={poppins.className}>
        <CartProvider>{children}</CartProvider>
        <Toaster />
      </body>
    </html>
  );
}
