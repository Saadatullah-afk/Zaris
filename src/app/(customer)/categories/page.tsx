import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowRight } from 'lucide-react';

export const revalidate = 0;

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em]">
          ZARIS Jewelry & Accessories
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-zinc-100">
          All Product Categories
        </h1>
        <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto opacity-70" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat: any) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="group relative rounded-3xl overflow-hidden bg-[#101117] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-300 shadow-xl gold-border-glow block"
          >
            <div className="aspect-video relative overflow-hidden bg-black">
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101117] via-transparent to-transparent" />
            </div>

            <div className="p-6 space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="font-serif-luxury text-2xl font-bold text-zinc-100 group-hover:text-[#D4AF37] transition-colors">
                  {cat.name}
                </h2>
                <span className="text-xs font-bold text-[#D4AF37] bg-[#1A1813] px-3 py-1 rounded-full border border-[#D4AF37]/30">
                  {cat._count.products} Items
                </span>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-2">{cat.description}</p>
              <div className="pt-2 flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
                <span>Browse {cat.name}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
