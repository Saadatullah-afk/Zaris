import React from 'react';
import Header from '@/components/customer/Header';
import Footer from '@/components/customer/Footer';
import CartDrawer from '@/components/customer/CartDrawer';
import { CartProvider } from '@/context/CartContext';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-[#070709] text-zinc-100">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
