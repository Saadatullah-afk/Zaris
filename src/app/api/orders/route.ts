import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const search = searchParams.get('search');

    const where: any = {};

    if (status) where.orderStatus = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (search) {
      where.OR = [
        { orderId: { contains: search } },
        { customerName: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      phone,
      email,
      address,
      district,
      area,
      deliveryNote,
      socialUsername,
      paymentMethod,
      items, // array of { productId, quantity }
    } = body;

    if (!customerName || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Customer information and items are required' }, { status: 400 });
    }

    // 1. Fetch site settings
    const settingsList = await prisma.setting.findMany();
    const settingsMap = new Map<string, string>(settingsList.map((s: any) => [s.key, s.value]));

    const diuFreeEnabled = settingsMap.get('diu_free_delivery') === 'true';
    const insideDhakaFee = parseFloat(settingsMap.get('inside_dhaka_delivery') || '70');
    const outsideDhakaFee = parseFloat(settingsMap.get('outside_dhaka_delivery') || '130');
    const prefix = settingsMap.get('order_prefix') || 'ZARIS-2026-';

    // 2. Determine delivery charge
    let deliveryCharge = insideDhakaFee;
    const isDIU = area?.toLowerCase().includes('daffodil') || area?.toLowerCase().includes('diu');
    
    if (isDIU && diuFreeEnabled) {
      deliveryCharge = 0;
    } else if (district?.toLowerCase() !== 'dhaka') {
      deliveryCharge = outsideDhakaFee;
    }

    // 3. Process items and validate stock
    let subtotal = 0;
    const orderItemData: any[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Only ${product.stock} available.` },
          { status: 400 }
        );
      }

      const itemPrice = product.discountPrice || product.price;
      const itemSubtotal = itemPrice * item.quantity;
      subtotal += itemSubtotal;

      orderItemData.push({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        price: itemPrice,
        costPrice: product.costPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }

    const total = subtotal + deliveryCharge;

    // 4. Generate Order ID
    const count = await prisma.order.count();
    const orderSeq = (count + 1).toString().padStart(4, '0');
    const generatedOrderId = `${prefix}${orderSeq}`;

    // 5. Execute DB Transaction
    const newOrder = await prisma.$transaction(async (tx: any) => {
      // Find or create customer
      let customer = await tx.customer.findUnique({ where: { phone: phone.trim() } });
      if (!customer) {
        customer = await tx.customer.create({
          data: {
            name: customerName,
            phone: phone.trim(),
            email,
            address,
            district,
            area,
            totalOrders: 1,
            totalSpent: total,
            notes: isDIU ? 'DIU Student Customer' : undefined,
          },
        });
      } else {
        await tx.customer.update({
          where: { id: customer.id },
          data: {
            totalOrders: { increment: 1 },
            totalSpent: { increment: total },
            address,
          },
        });
      }

      // Create Order
      const createdOrder = await tx.order.create({
        data: {
          orderId: generatedOrderId,
          customerId: customer.id,
          customerName,
          phone: phone.trim(),
          email,
          address,
          district,
          area,
          deliveryNote,
          socialUsername,
          deliveryCharge,
          subtotal,
          total,
          paymentMethod: paymentMethod || 'COD',
          paymentStatus: 'PENDING',
          orderStatus: 'PENDING',
          items: {
            create: orderItemData,
          },
        },
        include: {
          items: true,
        },
      });

      return createdOrder;
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
  }
}
