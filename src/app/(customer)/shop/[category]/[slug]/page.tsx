import React from 'react';
import ProductDetailClient from '@/components/customer/ProductDetailClient';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: { slug: slug },
    include: {
      category: true,
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: 'ACTIVE',
    },
    take: 4,
    include: { category: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
