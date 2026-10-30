'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Truck, CheckCircle2, Clock, PackageCheck, AlertCircle } from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any | null>(null);

  const fetchTrack = async (id: string, ph: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/track?orderId=${encodeURIComponent(id)}&phone=${encodeURIComponent(ph)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order not found');
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Could not find order. Please verify Order ID and Phone number.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId && phone) {
      fetchTrack(orderId, phone);
    }
  }, []);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId && phone) {
      fetchTrack(orderId, phone);
    }
  };

  const statusSteps = [
    { key: 'PENDING', label: 'Order Placed' },
    { key: 'CONFIRMED', label: 'Confirmed' },
    { key: 'PROCESSING', label: 'Packaging' },
    { key: 'READY_TO_SHIP', label: 'Ready to Dispatch' },
    { key: 'SHIPPED', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  const currentStepIdx = order ? statusSteps.findIndex((s) => s.key === order.orderStatus) : -1;

  return (
    <div className="space-y-10">
      {/* Form */}
      <form onSubmit={handleTrackSubmit} className="bg-[#101117] border border-[#D4AF37]/30 p-6 rounded-2xl max-w-2xl mx-auto space-y-4 gold-border-glow">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Order ID</label>
            <input
              type="text"
              required
              placeholder="e.g. ZARIS-2026-0001"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none uppercase"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Phone Number</label>
            <input
              type="tel"
              required
              placeholder="e.g. 01711223344"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Search className="w-4 h-4" />
          <span>{loading ? 'Searching Order...' : 'Track Order Now'}</span>
        </button>
      </form>

      {error && (
        <div className="bg-red-950/80 border border-red-500/50 p-4 rounded-xl text-center text-red-200 text-xs font-medium max-w-2xl mx-auto flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div className="bg-[#101117] border border-[#D4AF37]/30 p-8 rounded-3xl space-y-8 animate-in fade-in duration-300 gold-border-glow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
            <div>
              <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-widest block">
                Order Status Details
              </span>
              <h2 className="font-serif-luxury text-2xl font-bold text-zinc-100">
                Order #{order.orderId}
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-zinc-400 block">Current Status</span>
              <span className="inline-block bg-[#1A1813] border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full uppercase mt-1">
                {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Progress Timeline</h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
              {statusSteps.map((step, idx) => {
                const isPassed = currentStepIdx >= idx && order.orderStatus !== 'CANCELLED';
                const isCurrent = currentStepIdx === idx && order.orderStatus !== 'CANCELLED';

                return (
                  <div
                    key={step.key}
                    className={`p-3 rounded-xl border text-xs space-y-2 ${
                      isCurrent
                        ? 'border-[#D4AF37] bg-[#1A1813] gold-border-glow text-[#D4AF37] font-bold'
                        : isPassed
                        ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                        : 'border-zinc-800 bg-[#070709] text-zinc-500 opacity-60'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center mx-auto text-[10px] font-bold">
                      {idx + 1}
                    </div>
                    <span className="block text-[11px] leading-tight">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs bg-[#070709] p-6 rounded-2xl border border-zinc-800">
            <div className="space-y-2">
              <span className="font-bold text-[#D4AF37] uppercase tracking-wider block">Recipient Info</span>
              <p>Name: <strong>{order.customerName}</strong></p>
              <p>Address: <strong>{order.address}</strong></p>
              <p>Area: <strong>{order.area}</strong></p>
              <p>Phone: <strong>{order.phone}</strong></p>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-[#D4AF37] uppercase tracking-wider block">Financial Details</span>
              <p>Subtotal: <strong>৳{order.subtotal}</strong></p>
              <p>Delivery Fee: <strong>{order.deliveryCharge === 0 ? 'FREE (DIU)' : `৳${order.deliveryCharge}`}</strong></p>
              <p>Grand Total: <strong className="text-[#D4AF37] text-sm">৳{order.total}</strong></p>
              <p>Payment Method: <strong>{order.paymentMethod} ({order.paymentStatus})</strong></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 text-zinc-100">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em]">
          Real-Time Tracking
        </span>
        <h1 className="font-serif-luxury text-4xl font-bold">Customer Order Tracking</h1>
        <p className="text-xs text-zinc-400">Enter your Order ID (e.g. ZARIS-2026-0001) and Phone Number</p>
      </div>

      <Suspense fallback={<div className="text-center text-xs text-zinc-500 py-10">Loading tracking form...</div>}>
        <TrackOrderContent />
      </Suspense>
    </div>
  );
}
