'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <ShoppingBag className="w-16 h-16 text-zinc-600 mx-auto" />
        <h1 className="font-serif-luxury text-3xl font-bold text-zinc-100">Your Shopping Bag is Empty</h1>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Explore our handcrafted collection of earrings, rings, bangles, and gift boxes.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 gold-gradient-bg text-black font-bold text-xs uppercase px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          <span>Explore Shop Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h1 className="font-serif-luxury text-3xl font-bold text-zinc-100">Shopping Cart ({cart.length} items)</h1>
        <button
          onClick={clearCart}
          className="text-xs text-red-400 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-[#101117] border border-[#D4AF37]/20 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 justify-between"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl border border-zinc-800 shrink-0"
                />
                <div>
                  <h3 className="font-serif-luxury text-lg font-semibold text-zinc-100">{item.name}</h3>
                  <p className="text-xs text-zinc-400">SKU: {item.sku}</p>
                  <p className="text-xs text-[#D4AF37] font-bold mt-1">
                    ৳{item.discountPrice || item.price} each
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                <div className="flex items-center border border-zinc-700 rounded-xl bg-[#070709] p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2.5 py-1 text-zinc-400 hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-bold text-sm text-zinc-200">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2.5 py-1 text-zinc-400 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-20">
                  <span className="text-base font-bold text-[#D4AF37] block">
                    ৳{(item.discountPrice || item.price) * item.quantity}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-[#D4AF37] pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-[#101117] border border-[#D4AF37]/30 p-6 rounded-2xl space-y-6 h-fit gold-border-glow">
          <h2 className="font-serif-luxury text-xl font-bold text-zinc-100 border-b border-zinc-800 pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs text-zinc-300">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span className="font-bold text-zinc-100">৳{subtotal}</span>
            </div>
            <div className="flex justify-between text-amber-200">
              <span>DIU Delivery:</span>
              <span className="font-bold text-[#D4AF37]">FREE (৳0)</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Inside Dhaka Courier:</span>
              <span>৳70</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Outside Dhaka Courier:</span>
              <span>৳130</span>
            </div>
            <div className="border-t border-zinc-800 pt-3 flex justify-between text-base font-bold text-zinc-100">
              <span>Estimated Total:</span>
              <span className="text-[#D4AF37]">৳{subtotal} + delivery</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
