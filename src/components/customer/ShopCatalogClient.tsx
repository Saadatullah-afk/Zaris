'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, ShoppingBag, Eye, X, Check, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ShopCatalogClient({
  initialProducts,
  categories,
}: {
  initialProducts: any[];
  categories: any[];
}) {
  const { addToCart } = useCart();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('newest'); // newest, price-low, price-high, best-selling
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(3000);

  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category filter
      if (selectedCategory !== 'ALL' && product.category.slug !== selectedCategory) {
        return false;
      }
      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchSku = product.sku.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        if (!matchName && !matchSku && !matchDesc) return false;
      }
      // Availability filter
      if (onlyInStock && product.stock <= 0) return false;
      // Price filter
      const effectivePrice = product.discountPrice || product.price;
      if (effectivePrice > maxPriceFilter) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'best-selling') return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // newest
    });
  }, [initialProducts, search, selectedCategory, sortBy, onlyInStock, maxPriceFilter]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Toolbar */}
      <div className="bg-[#101117] border border-[#D4AF37]/20 p-6 rounded-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-5 h-5 text-zinc-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by ring, earring, SKU, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl pl-11 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none uppercase text-xs tracking-wider"
            >
              <option value="ALL">All Categories ({initialProducts.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none text-xs uppercase tracking-wider"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="best-selling">Sort: Best Selling</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800/80 pt-4 text-xs">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 accent-[#D4AF37] rounded"
              />
              <span>In Stock Only</span>
            </label>

            <div className="flex items-center gap-3 text-zinc-400">
              <span>Max Price: <strong className="text-[#D4AF37]">৳{maxPriceFilter}</strong></span>
              <input
                type="range"
                min={50}
                max={3000}
                step={50}
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="accent-[#D4AF37] cursor-pointer"
              />
            </div>
          </div>

          <div className="text-zinc-400">
            Showing <strong className="text-zinc-100">{filteredProducts.length}</strong> of {initialProducts.length} products
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#101117] border border-zinc-800 rounded-2xl p-16 text-center space-y-4">
          <Search className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="font-serif-luxury text-xl text-zinc-200">No products match your filter</h3>
          <p className="text-xs text-zinc-400">Try adjusting your search keyword or clearing category filters.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('ALL');
              setOnlyInStock(false);
              setMaxPriceFilter(3000);
            }}
            className="gold-gradient-bg text-black font-bold text-xs uppercase px-5 py-2.5 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const images = JSON.parse(product.images || '[]');
            const mainImg = images[0] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80';
            const isOutOfStock = product.stock <= 0;

            return (
              <div
                key={product.id}
                className="group bg-[#101117] border border-[#D4AF37]/20 rounded-2xl overflow-hidden hover:border-[#D4AF37]/60 transition-all flex flex-col justify-between"
              >
                <div className="relative block overflow-hidden aspect-square bg-[#070709]">
                  <img
                    src={mainImg}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.discountPrice && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      SALE
                    </span>
                  )}
                  {isOutOfStock && (
                    <span className="absolute inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center text-xs font-bold text-red-400 uppercase tracking-widest">
                      Out of Stock
                    </span>
                  )}

                  {/* Quick Action Overlay */}
                  <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="flex-1 bg-black/80 hover:bg-black text-white text-xs py-2 rounded-lg backdrop-blur-md border border-zinc-700 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Quick View</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest block font-medium">
                      {product.category.name}
                    </span>
                    <Link
                      href={`/shop/${product.category.slug}/${product.slug}`}
                      className="font-serif-luxury text-base font-semibold text-zinc-100 hover:text-[#D4AF37] line-clamp-1 transition-colors"
                    >
                      {product.name}
                    </Link>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-zinc-900">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-[#D4AF37]">
                        ৳{product.discountPrice || product.price}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs text-zinc-500 line-through">
                          ৳{product.price}
                        </span>
                      )}
                    </div>

                    <button
                      disabled={isOutOfStock}
                      onClick={() => addToCart(product, 1)}
                      className="p-2 bg-[#1A1813] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#101117] border border-[#D4AF37]/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative space-y-6 text-zinc-100">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <img
                src={JSON.parse(quickViewProduct.images || '[]')[0]}
                alt={quickViewProduct.name}
                className="w-full h-64 object-cover rounded-2xl border border-zinc-800"
              />
              <div className="space-y-4">
                <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-widest">
                  {quickViewProduct.category.name} &bull; SKU: {quickViewProduct.sku}
                </span>
                <h2 className="font-serif-luxury text-2xl font-bold">{quickViewProduct.name}</h2>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-[#D4AF37]">
                    ৳{quickViewProduct.discountPrice || quickViewProduct.price}
                  </span>
                  {quickViewProduct.discountPrice && (
                    <span className="text-sm text-zinc-500 line-through">
                      ৳{quickViewProduct.price}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-300 line-clamp-3">{quickViewProduct.description}</p>
                <div className="text-xs space-y-1 text-zinc-400">
                  <p>Stock Status: <strong className="text-green-400">{quickViewProduct.stock > 0 ? `${quickViewProduct.stock} Available` : 'Out of stock'}</strong></p>
                  <p>Campus Shipping: <strong className="text-[#D4AF37]">FREE at DIU</strong></p>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    disabled={quickViewProduct.stock <= 0}
                    onClick={() => {
                      addToCart(quickViewProduct, 1);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 gold-gradient-bg text-black font-bold text-xs uppercase py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add To Cart</span>
                  </button>
                  <Link
                    href={`/shop/${quickViewProduct.category.slug}/${quickViewProduct.slug}`}
                    className="px-4 py-3 border border-zinc-700 hover:border-[#D4AF37] rounded-lg text-xs uppercase font-semibold text-zinc-300 hover:text-[#D4AF37] transition-colors"
                  >
                    Full Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
