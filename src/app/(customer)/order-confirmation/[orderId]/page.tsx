import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { CheckCircle2, Package, Truck, ArrowRight, Sparkles, MapPin, Phone } from 'lucide-react';
import OrderConfirmationClient from '@/components/customer/OrderConfirmationClient';

export const revalidate = 0;

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const order = await prisma.order.findFirst({
    where: { orderId: orderId },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8 text-zinc-100">
      <OrderConfirmationClient order={order} />

      <div className="bg-[#101117] border border-[#D4AF37]/30 rounded-3xl p-8 space-y-6 shadow-2xl gold-border-glow">
        <div className="text-center space-y-3 border-b border-zinc-800 pb-6">
          <div className="w-16 h-16 rounded-full bg-[#1A1813] border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em]">
            Order Successfully Placed!
          </span>
          <h1 className="font-serif-luxury text-3xl font-bold">
            Thank You For Supporting Zaris by Zakia
          </h1>
          <div className="inline-block bg-[#070709] border border-[#D4AF37]/40 px-4 py-2 rounded-xl text-sm font-bold text-[#D4AF37] tracking-widest uppercase">
            Order ID: {order.orderId}
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-zinc-800 pb-6">
          <div className="space-y-2">
            <span className="font-bold text-[#D4AF37] uppercase tracking-wider block">Shipping Address:</span>
            <p className="font-semibold text-zinc-200">{order.customerName}</p>
            <p className="text-zinc-400">{order.address}</p>
            <p className="text-zinc-400">{order.area}, {order.district}</p>
            <p className="text-zinc-400">Phone: {order.phone}</p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-[#D4AF37] uppercase tracking-wider block">Payment & Status:</span>
            <p>Payment Method: <strong className="text-zinc-200">{order.paymentMethod}</strong></p>
            <p>Payment Status: <strong className="text-amber-400">{order.paymentStatus}</strong></p>
            <p>Order Status: <strong className="text-emerald-400">{order.orderStatus}</strong></p>
            <p>Delivery Fee: <strong className="text-[#D4AF37]">{order.deliveryCharge === 0 ? 'FREE (DIU)' : `৳${order.deliveryCharge}`}</strong></p>
          </div>
        </div>

        {/* Itemized List */}
        <div className="space-y-3">
          <span className="font-bold text-xs text-zinc-300 uppercase tracking-wider block">Ordered Items:</span>
          {order.items.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center bg-[#070709] p-3 rounded-xl border border-zinc-800 text-xs">
              <div>
                <p className="font-semibold text-zinc-200">{item.productName}</p>
                <p className="text-zinc-500">Qty: {item.quantity} &bull; SKU: {item.sku}</p>
              </div>
              <span className="font-bold text-[#D4AF37]">৳{item.subtotal}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-zinc-800 pt-4 flex justify-between items-center text-sm font-bold">
          <span>Total Amount Paid / Due:</span>
          <span className="text-[#D4AF37] text-xl">৳{order.total}</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <Link
            href={`/track-order?orderId=${order.orderId}&phone=${order.phone}`}
            className="flex-1 gold-gradient-bg text-black font-bold text-xs uppercase py-3.5 rounded-xl text-center flex items-center justify-center gap-2 hover:opacity-90"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Status</span>
          </Link>
          <Link
            href="/shop"
            className="px-6 py-3.5 border border-zinc-700 hover:border-[#D4AF37] rounded-xl text-xs uppercase font-semibold text-zinc-300 hover:text-[#D4AF37] text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
