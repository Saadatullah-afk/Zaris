import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const phone = searchParams.get('phone');

    if (!orderId || !phone) {
      return NextResponse.json({ error: 'Order ID and Phone Number are required' }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        orderId: orderId.trim(),
        phone: phone.trim(),
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found with provided credentials' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track order' }, { status: 500 });
  }
}
