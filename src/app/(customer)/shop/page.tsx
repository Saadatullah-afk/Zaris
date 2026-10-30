import React, { Suspense } from 'react';
import ShopCatalogClient from '@/components/customer/ShopCatalogClient';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { status: 'ACTIVE' },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em]">
          ZARIS Jewelry & Accessories
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-zinc-100 tracking-wider">
          Complete Product Catalog
        </h1>
        <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto opacity-70" />
      </div>

      <Suspense fallback={<div className="text-center text-xs text-zinc-500 py-10">Loading catalog...</div>}>
        <ShopCatalogClient initialProducts={products} categories={categories} />
      </Suspense>
    </div>
  );
}
