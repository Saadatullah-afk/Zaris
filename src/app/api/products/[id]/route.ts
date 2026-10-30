import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }],
      },
      include: {
        category: true,
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      slug,
      sku,
      description,
      price,
      costPrice,
      discountPrice,
      stock,
      categoryId,
      featured,
      bestSeller,
      status,
      images,
      tags,
      specs,
      careInfo,
    } = body;

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const newStock = parseInt(stock);
    const oldStock = existingProduct.stock;
    const stockDiff = newStock - oldStock;

    const updatedProduct = await prisma.$transaction(async (tx: any) => {
      const prod = await tx.product.update({
        where: { id },
        data: {
          name,
          slug: slug ? slug.trim().toLowerCase().replace(/\s+/g, '-') : existingProduct.slug,
          sku,
          description,
          price: parseFloat(price),
          costPrice: parseFloat(costPrice),
          discountPrice: discountPrice ? parseFloat(discountPrice) : null,
          stock: newStock,
          categoryId,
          featured: Boolean(featured),
          bestSeller: Boolean(bestSeller),
          status: status || 'ACTIVE',
          images: typeof images === 'string' ? images : JSON.stringify(images || []),
          tags: typeof tags === 'string' ? tags : JSON.stringify(tags || []),
          specs: typeof specs === 'string' ? specs : JSON.stringify(specs || {}),
          careInfo,
        },
      });

      if (stockDiff !== 0) {
        await tx.inventoryTransaction.create({
          data: {
            productId: id,
            stockIn: stockDiff > 0 ? stockDiff : 0,
            stockOut: stockDiff < 0 ? Math.abs(stockDiff) : 0,
            remainingStock: newStock,
            reason: stockDiff > 0 ? 'Admin Manual Restock' : 'Admin Manual Stock Reduction',
            reference: `PRODUCT-EDIT-${id}`,
            adminName: session.name || 'Admin',
          },
        });
      }

      return prod;
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}
