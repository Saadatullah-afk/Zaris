'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0D0E14] border-l border-[#D4AF37]/30 text-zinc-100 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#12131C]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif-luxury text-xl font-bold text-zinc-100 tracking-wider">
                Your Shopping Bag ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto" />
                <p className="text-zinc-400 text-sm">Your shopping bag is currently empty.</p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block gold-gradient-bg text-black font-semibold text-xs uppercase px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-[#14151F] border border-zinc-800 rounded-xl items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg border border-zinc-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-zinc-200 truncate">{item.name}</h3>
                    <p className="text-xs text-zinc-400">SKU: {item.sku}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-zinc-700 rounded-lg bg-[#070709]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-zinc-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-zinc-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-zinc-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[#D4AF37]">
                        ৳{(item.discountPrice || item.price) * item.quantity}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#D4AF37]/20 bg-[#12131C] space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Subtotal:</span>
                <span className="text-lg font-bold text-[#D4AF37]">৳{subtotal}</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Delivery charges & DIU free delivery discount calculated at checkout.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center border border-[#D4AF37]/40 text-amber-200 hover:bg-[#D4AF37]/10 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 gold-gradient-bg text-black py-3 rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
