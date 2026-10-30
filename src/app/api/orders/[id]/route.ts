import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderId: id }],
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
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
    const { orderStatus, paymentStatus, notes } = await request.json();

    const existingOrder = await prisma.order.findFirst({
      where: { OR: [{ id }, { orderId: id }] },
      include: { items: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const prevOrderStatus = existingOrder.orderStatus;
    const nextOrderStatus = orderStatus || prevOrderStatus;
    const nextPaymentStatus = paymentStatus || existingOrder.paymentStatus;

    const activeDeductionStatuses = ['CONFIRMED', 'PROCESSING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED'];
    const wereStockDeducted = activeDeductionStatuses.includes(prevOrderStatus);
    const shouldStockBeDeducted = activeDeductionStatuses.includes(nextOrderStatus);

    const updatedOrder = await prisma.$transaction(async (tx: any) => {
      // 1. Handle stock deduction if transition from PENDING -> CONFIRMED/DELIVERED
      if (!wereStockDeducted && shouldStockBeDeducted) {
        for (const item of existingOrder.items) {
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          if (product) {
            const newStock = Math.max(0, product.stock - item.quantity);
            await tx.product.update({
              where: { id: product.id },
              data: { stock: newStock },
            });

            await tx.inventoryTransaction.create({
              data: {
                productId: product.id,
                stockIn: 0,
                stockOut: item.quantity,
                remainingStock: newStock,
                reason: `Order Confirmed Fulfillment #${existingOrder.orderId}`,
                reference: existingOrder.orderId,
                adminName: session.name || 'Admin',
              },
            });

            // Log Sales Record
            await tx.salesRecord.create({
              data: {
                type: 'SALE',
                categoryName: 'Product Sale',
                productId: product.id,
                productName: item.productName,
                quantity: item.quantity,
                costPrice: item.costPrice,
                sellingPrice: item.price,
                total: item.subtotal,
                profit: item.subtotal - item.quantity * item.costPrice,
                paymentMethod: existingOrder.paymentMethod,
                customerName: existingOrder.customerName,
                notes: `Order #${existingOrder.orderId}`,
              },
            });
          }
        }
      }

      // 2. Handle stock return if transition from ACTIVE -> CANCELLED
      if (wereStockDeducted && nextOrderStatus === 'CANCELLED') {
        for (const item of existingOrder.items) {
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          if (product) {
            const newStock = product.stock + item.quantity;
            await tx.product.update({
              where: { id: product.id },
              data: { stock: newStock },
            });

            await tx.inventoryTransaction.create({
              data: {
                productId: product.id,
                stockIn: item.quantity,
                stockOut: 0,
                remainingStock: newStock,
                reason: `Order Cancelled Stock Return #${existingOrder.orderId}`,
                reference: existingOrder.orderId,
                adminName: session.name || 'Admin',
              },
            });

            // Log Return Record
            await tx.salesRecord.create({
              data: {
                type: 'RETURN',
                categoryName: 'Order Return',
                productId: product.id,
                productName: item.productName,
                quantity: item.quantity,
                costPrice: item.costPrice,
                sellingPrice: item.price,
                total: -item.subtotal,
                profit: -(item.subtotal - item.quantity * item.costPrice),
                paymentMethod: existingOrder.paymentMethod,
                customerName: existingOrder.customerName,
                notes: `Cancelled Order #${existingOrder.orderId}`,
              },
            });
          }
        }
      }

      // Update order details
      return await tx.order.update({
        where: { id: existingOrder.id },
        data: {
          orderStatus: nextOrderStatus,
          paymentStatus: nextPaymentStatus,
          notes: notes !== undefined ? notes : existingOrder.notes,
        },
        include: { items: true },
      });
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
  }
}
