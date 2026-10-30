import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import InvoicePrintClient from '@/components/admin/InvoicePrintClient';

export const revalidate = 0;

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id }, { orderId: id }],
    },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-black p-8 max-w-4xl mx-auto font-sans">
      <InvoicePrintClient />

      {/* Top Header & Logo */}
      <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
        <div>
          <h1 className="font-serif text-4xl font-bold tracking-widest uppercase">ZARIS</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-600 font-semibold">by zakia</p>
          <p className="text-[10px] tracking-widest text-amber-800 font-bold uppercase mt-1">
            JEWELLERY | ACCESSORIES | GIFTS
          </p>
          <p className="text-xs text-gray-500 mt-2">Daffodil Smart City, Ashulia, Dhaka &bull; +880 1700-123456</p>
        </div>

        <div className="text-right">
          <h2 className="text-2xl font-bold uppercase tracking-wider text-amber-800">OFFICIAL INVOICE</h2>
          <p className="text-sm font-bold text-black mt-1">INVOICE #{order.orderId}</p>
          <p className="text-xs text-gray-600">
            Date: {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Customer & Shipping Details Grid */}
      <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs mb-8">
        <div>
          <h3 className="font-bold text-gray-700 uppercase tracking-wider mb-1">Billed & Shipped To:</h3>
          <p className="font-bold text-sm text-black">{order.customerName}</p>
          <p className="text-gray-700">{order.address}</p>
          <p className="text-gray-700">{order.area}, {order.district}</p>
          <p className="text-gray-700 font-semibold mt-1">Phone: {order.phone}</p>
          {order.email && <p className="text-gray-500">Email: {order.email}</p>}
        </div>

        <div>
          <h3 className="font-bold text-gray-700 uppercase tracking-wider mb-1">Order Details:</h3>
          <p>Payment Method: <strong className="uppercase">{order.paymentMethod}</strong></p>
          <p>Payment Status: <strong className="uppercase">{order.paymentStatus}</strong></p>
          <p>Order Status: <strong className="uppercase">{order.orderStatus}</strong></p>
          {order.deliveryNote && <p className="text-gray-500 mt-1">Note: {order.deliveryNote}</p>}
        </div>
      </div>

      {/* Line Items Table */}
      <table className="w-full text-left text-xs mb-8 border-collapse">
        <thead>
          <tr className="border-b-2 border-black bg-gray-100">
            <th className="py-2.5 px-3 uppercase font-bold text-gray-700">Item Description</th>
            <th className="py-2.5 px-3 uppercase font-bold text-gray-700">SKU</th>
            <th className="py-2.5 px-3 uppercase font-bold text-gray-700 text-center">Qty</th>
            <th className="py-2.5 px-3 uppercase font-bold text-gray-700 text-right">Unit Price</th>
            <th className="py-2.5 px-3 uppercase font-bold text-gray-700 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {order.items.map((item: any) => (
            <tr key={item.id}>
              <td className="py-3 px-3 font-semibold text-black">{item.productName}</td>
              <td className="py-3 px-3 text-gray-600">{item.sku}</td>
              <td className="py-3 px-3 text-center">{item.quantity}</td>
              <td className="py-3 px-3 text-right">৳{item.price}</td>
              <td className="py-3 px-3 text-right font-bold">৳{item.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Calculations */}
      <div className="flex justify-end mb-12">
        <div className="w-64 space-y-2 text-xs border-t border-black pt-4">
          <div className="flex justify-between text-gray-700">
            <span>Items Subtotal:</span>
            <span>৳{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Delivery Charge ({order.area}):</span>
            <span>{order.deliveryCharge === 0 ? 'FREE (৳0)' : `৳${order.deliveryCharge}`}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-black border-t-2 border-black pt-2">
            <span>Total Payable:</span>
            <span>৳{order.total}</span>
          </div>
        </div>
      </div>

      {/* Invoice Footer */}
      <div className="border-t border-gray-300 pt-6 text-center text-xs space-y-2 text-gray-600">
        <p className="font-serif italic text-base text-gray-900 font-semibold">
          &ldquo;Thank you for supporting Zaris by Zakia.&rdquo;
        </p>
        <p className="text-[10px] uppercase tracking-widest">
          For any order queries, call +880 1700-123456 or email info@zaris.com.bd
        </p>
      </div>
    </div>
  );
}
