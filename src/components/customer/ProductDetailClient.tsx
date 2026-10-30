'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Zap, Truck, ShieldCheck, Heart, Sparkles, Plus, Minus, Star, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: any;
  relatedProducts: any[];
}) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const images: string[] = JSON.parse(product.images || '[]');
  const [activeImage, setActiveImage] = useState<string>(
    images[0] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'
  );

  const specs = JSON.parse(product.specs || '{}');
  const tags: string[] = JSON.parse(product.tags || '[]');
  const effectivePrice = product.discountPrice || product.price;
  const isOutOfStock = product.stock <= 0;

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="space-y-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-wider">
        <Link href="/" className="hover:text-[#D4AF37]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <Link href="/shop" className="hover:text-[#D4AF37]">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[#D4AF37]">
          {product.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-zinc-200 truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-[#101117] border border-[#D4AF37]/30 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discountPrice && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                SPECIAL DISCOUNT
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === imgUrl ? 'border-[#D4AF37] scale-105' : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em] block">
              {product.category.name} &bull; SKU: {product.sku}
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-zinc-100 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Price & Rating */}
          <div className="flex items-center justify-between border-y border-zinc-800 py-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#D4AF37]">
                ৳{effectivePrice}
              </span>
              {product.discountPrice && (
                <span className="text-base text-zinc-500 line-through">
                  ৳{product.price}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[#D4AF37] text-xs font-semibold">
              <Star className="w-4 h-4 fill-current" />
              <span>4.9 (Zaris Verified)</span>
            </div>
          </div>

          {/* DIU Delivery Highlight Badge */}
          <div className="bg-[#16140D] border border-[#D4AF37]/40 rounded-2xl p-4 flex items-center gap-3 text-amber-200">
            <Truck className="w-6 h-6 text-[#D4AF37] shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-[#D4AF37] uppercase tracking-wider block">
                DIU Special Free Shipping
              </span>
              <p>Delivery is ৳0 for Daffodil International University (DIU) campus and hall orders!</p>
            </div>
          </div>

          {/* Stock Status */}
          <div className="text-xs">
            Status:{' '}
            {isOutOfStock ? (
              <span className="font-bold text-red-500 uppercase">Out of Stock</span>
            ) : (
              <span className="font-bold text-emerald-400 uppercase">In Stock ({product.stock} units available)</span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-zinc-700 rounded-xl bg-[#101117] p-1">
                <button
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-zinc-400 hover:text-white disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-bold text-sm text-zinc-100">{quantity}</span>
                <button
                  disabled={quantity >= product.stock || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1.5 text-zinc-400 hover:text-white disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                disabled={isOutOfStock}
                onClick={() => addToCart(product, quantity)}
                className="w-full bg-[#1A1813] hover:bg-[#252219] text-[#D4AF37] border border-[#D4AF37]/50 font-bold text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Cart</span>
              </button>

              <button
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="w-full gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Product Specifications & Care */}
          <div className="border-t border-zinc-800 pt-6 space-y-4 text-xs">
            {Object.keys(specs).length > 0 && (
              <div>
                <h3 className="font-serif-luxury text-base font-bold text-zinc-200 mb-2">Specifications</h3>
                <div className="grid grid-cols-2 gap-2 bg-[#101117] p-3 rounded-xl border border-zinc-800">
                  {Object.entries(specs).map(([key, val]: any) => (
                    <div key={key}>
                      <span className="text-zinc-500 uppercase text-[10px]">{key}:</span>{' '}
                      <span className="text-zinc-200 font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.careInfo && (
              <div>
                <h3 className="font-serif-luxury text-base font-bold text-zinc-200 mb-1">Care Instructions</h3>
                <p className="text-zinc-400 leading-relaxed bg-[#101117] p-3 rounded-xl border border-zinc-800">
                  {product.careInfo}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-zinc-800 pt-12 space-y-6">
          <h2 className="font-serif-luxury text-2xl font-bold text-zinc-100">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => {
              const relImg = JSON.parse(rel.images || '[]')[0];
              return (
                <Link
                  key={rel.id}
                  href={`/shop/${rel.category.slug}/${rel.slug}`}
                  className="group bg-[#101117] border border-zinc-800 hover:border-[#D4AF37]/60 rounded-xl overflow-hidden p-3 transition-all block"
                >
                  <img src={relImg} alt={rel.name} className="w-full h-40 object-cover rounded-lg mb-2" />
                  <h3 className="font-serif-luxury text-sm font-semibold text-zinc-200 truncate group-hover:text-[#D4AF37]">
                    {rel.name}
                  </h3>
                  <span className="text-xs font-bold text-[#D4AF37] block mt-1">
                    ৳{rel.discountPrice || rel.price}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
