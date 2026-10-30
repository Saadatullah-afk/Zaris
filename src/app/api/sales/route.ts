import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const sales = await prisma.salesRecord.findMany({
      orderBy: { date: 'desc' },
      include: {
        product: {
          select: { name: true, sku: true },
        },
      },
    });

    const summary = sales.reduce(
      (acc: any, curr: any) => {
        acc.totalSales += curr.total;
        acc.totalProfit += curr.profit;
        return acc;
      },
      { totalSales: 0, totalProfit: 0 }
    );

    return NextResponse.json({ sales, summary });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sales records' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      type,
      categoryName,
      productName,
      quantity,
      costPrice,
      sellingPrice,
      paymentMethod,
      customerName,
      notes,
      productId,
    } = body;

    if (!productName || !quantity || sellingPrice === undefined || !customerName) {
      return NextResponse.json({ error: 'Product name, quantity, selling price, and customer name are required' }, { status: 400 });
    }

    const qty = parseInt(quantity);
    const sellPrice = parseFloat(sellingPrice);
    const cPrice = costPrice !== undefined && costPrice !== null && costPrice !== '' ? parseFloat(costPrice) : 0;
    const total = qty * sellPrice;
    const profit = total - qty * cPrice;

    const salesRecord = await prisma.salesRecord.create({
      data: {
        type: type || 'SALE',
        categoryName: categoryName || 'General',
        productId: productId || null,
        productName,
        quantity: qty,
        costPrice: cPrice,
        sellingPrice: sellPrice,
        total,
        profit,
        paymentMethod: paymentMethod || 'COD',
        customerName,
        notes,
      },
    });

    return NextResponse.json(salesRecord, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to add sales record' }, { status: 500 });
  }
}
