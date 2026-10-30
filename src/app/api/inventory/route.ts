import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: { name: 'asc' },
    });

    const transactions = await prisma.inventoryTransaction.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: { name: true, sku: true },
        },
      },
    });

    const lowStockSetting = await prisma.setting.findUnique({
      where: { key: 'low_stock_threshold' },
    });
    const lowStockThreshold = parseInt(lowStockSetting?.value || '5');

    const inventoryItems = products.map((product: any) => {
      let status = 'IN_STOCK';
      if (product.stock === 0) status = 'OUT_OF_STOCK';
      else if (product.stock <= lowStockThreshold) status = 'LOW_STOCK';

      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        category: product.category.name,
        costPrice: product.costPrice,
        price: product.price,
        stock: product.stock,
        status,
      };
    });

    return NextResponse.json({
      inventory: inventoryItems,
      transactions,
      lowStockThreshold,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId, stockChange, type, reason, reference } = await request.json();

    if (!productId || !stockChange || !reason) {
      return NextResponse.json({ error: 'Product, change amount, and reason are required' }, { status: 400 });
    }

    const changeAmount = parseInt(stockChange);
    const isAddition = type === 'ADD';

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const newStock = isAddition ? product.stock + changeAmount : Math.max(0, product.stock - changeAmount);

    const transaction = await prisma.$transaction(async (tx: any) => {
      await tx.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });

      return await tx.inventoryTransaction.create({
        data: {
          productId,
          stockIn: isAddition ? changeAmount : 0,
          stockOut: !isAddition ? changeAmount : 0,
          remainingStock: newStock,
          reason,
          reference: reference || 'MANUAL-ADJUSTMENT',
          adminName: session.name || 'Admin',
        },
      });
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update inventory' }, { status: 500 });
  }
}
