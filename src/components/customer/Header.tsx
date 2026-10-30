'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, Heart, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { itemCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-glass border-b border-[#D4AF37]/20">

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-zinc-300 hover:text-[#D4AF37] p-2"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex flex-col items-center group">
          <span className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-[0.25em] gold-gradient-text uppercase group-hover:scale-105 transition-transform duration-300">
            ZARIS
          </span>
          <span className="text-[9px] sm:text-[10px] tracking-[0.35em] text-zinc-400 font-light -mt-1 uppercase">
            by zakia
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-zinc-300">
          <Link href="/" className="hover:text-[#D4AF37] transition-colors py-1">
            Home
          </Link>
          <Link href="/shop" className="hover:text-[#D4AF37] transition-colors py-1">
            Shop
          </Link>
          <Link href="/categories" className="hover:text-[#D4AF37] transition-colors py-1">
            Categories
          </Link>
          <Link href="/shop?bestSeller=true" className="hover:text-[#D4AF37] transition-colors py-1 text-[#D4AF37]">
            Best Sellers
          </Link>
          <Link href="/shop?category=gift-boxes" className="hover:text-[#D4AF37] transition-colors py-1">
            Gift Collection
          </Link>
          <Link href="/about" className="hover:text-[#D4AF37] transition-colors py-1">
            About Zaris
          </Link>
          <Link href="/contact" className="hover:text-[#D4AF37] transition-colors py-1">
            Contact
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-zinc-300 hover:text-[#D4AF37] transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            href="/track-order"
            className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-300 hover:text-[#D4AF37] border border-zinc-800 hover:border-[#D4AF37]/40 px-3 py-1.5 rounded-full transition-all"
          >
            <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Track Order</span>
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 bg-[#161822] hover:bg-[#1f2230] border border-[#D4AF37]/30 rounded-full text-[#D4AF37] transition-all hover:scale-105"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Search Drawer */}
      {isSearchOpen && (
        <div className="bg-[#12131C] border-t border-[#D4AF37]/20 p-4 animate-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
            <input
              type="text"
              placeholder="Search earrings, rings, gift boxes, stone bangles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#070709] border border-[#D4AF37]/30 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
              autoFocus
            />
            <button
              type="submit"
              className="gold-gradient-bg text-black font-semibold text-xs tracking-wider uppercase px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0D0E14] border-b border-[#D4AF37]/20 px-6 py-6 space-y-4 text-sm font-medium tracking-wider uppercase text-zinc-200">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 hover:text-[#D4AF37] border-b border-zinc-900"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 hover:text-[#D4AF37] border-b border-zinc-900"
          >
            Shop Catalog
          </Link>
          <Link
            href="/categories"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 hover:text-[#D4AF37] border-b border-zinc-900"
          >
            All Categories
          </Link>
          <Link
            href="/shop?bestSeller=true"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-[#D4AF37] border-b border-zinc-900"
          >
            Best Sellers
          </Link>
          <Link
            href="/shop?category=gift-boxes"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 hover:text-[#D4AF37] border-b border-zinc-900"
          >
            Gift Collections
          </Link>
          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 hover:text-[#D4AF37] border-b border-zinc-900"
          >
            About Zaris
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 hover:text-[#D4AF37] border-b border-zinc-900"
          >
            Contact
          </Link>
          <Link
            href="/track-order"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-[#D4AF37] font-semibold"
          >
            Track Order
          </Link>
        </div>
      )}
    </header>
  );
}
