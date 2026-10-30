'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Truck, ShieldCheck, CreditCard, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [areaOption, setAreaOption] = useState<'DIU' | 'INSIDE_DHAKA' | 'OUTSIDE_DHAKA'>('DIU');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [socialUsername, setSocialUsername] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BKASH' | 'NAGAD'>('COD');

  // Site Delivery Charges
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  useEffect(() => {
    if (areaOption === 'DIU') {
      setDeliveryCharge(0);
    } else if (areaOption === 'INSIDE_DHAKA') {
      setDeliveryCharge(70);
    } else {
      setDeliveryCharge(130);
    }
  }, [areaOption]);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-zinc-600 mx-auto" />
        <h1 className="font-serif-luxury text-2xl font-bold text-zinc-100">No Items to Checkout</h1>
        <button
          onClick={() => router.push('/shop')}
          className="gold-gradient-bg text-black font-bold text-xs uppercase px-6 py-3 rounded-lg"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const grandTotal = subtotal + deliveryCharge;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setError('Please fill in your Name, Phone number, and Delivery Address.');
      return;
    }

    setLoading(true);

    try {
      const areaLabel =
        areaOption === 'DIU'
          ? 'Daffodil International University (DIU)'
          : areaOption === 'INSIDE_DHAKA'
          ? 'Inside Dhaka'
          : 'Outside Dhaka';

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phone,
          email,
          address,
          district: areaOption === 'OUTSIDE_DHAKA' ? district : 'Dhaka',
          area: areaLabel,
          deliveryNote: socialUsername ? `[Social ID: ${socialUsername}] ${deliveryNote}` : deliveryNote,
          socialUsername,
          paymentMethod,
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit order');
      }

      clearCart();
      router.push(`/order-confirmation/${data.orderId}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em]">
          ZARIS Secure Checkout
        </span>
        <h1 className="font-serif-luxury text-4xl font-bold text-zinc-100">
          Complete Your Order
        </h1>
      </div>

      {error && (
        <div className="max-w-4xl mx-auto bg-red-950/80 border border-red-500/50 p-4 rounded-xl text-red-200 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns: Customer Info & Shipping */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Information Card */}
          <div className="bg-[#101117] border border-[#D4AF37]/20 p-6 rounded-2xl space-y-4">
            <h2 className="font-serif-luxury text-xl font-bold text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <span className="w-6 h-6 rounded-full bg-[#1A1813] border border-[#D4AF37] text-[#D4AF37] text-xs flex items-center justify-center font-sans">
                1
              </span>
              <span>Customer Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nusrat Jahan"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 01700123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Email Address <span className="text-zinc-500">(Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. nusrat@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Facebook / Instagram Username <span className="text-zinc-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. @nusrat_jahan"
                  value={socialUsername}
                  onChange={(e) => setSocialUsername(e.target.value)}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Delivery & Shipping Option Card */}
          <div className="bg-[#101117] border border-[#D4AF37]/20 p-6 rounded-2xl space-y-4">
            <h2 className="font-serif-luxury text-xl font-bold text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <span className="w-6 h-6 rounded-full bg-[#1A1813] border border-[#D4AF37] text-[#D4AF37] text-xs flex items-center justify-center font-sans">
                2
              </span>
              <span>Delivery & Shipping Area</span>
            </h2>

            {/* Delivery Area Selection Radio Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Option 1: DIU FREE */}
              <div
                onClick={() => setAreaOption('DIU')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  areaOption === 'DIU'
                    ? 'border-[#D4AF37] bg-[#1A1813] gold-border-glow'
                    : 'border-zinc-800 bg-[#070709] hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">DIU Delivery</span>
                  <span className="text-xs font-extrabold text-emerald-400">FREE (৳0)</span>
                </div>
                <p className="text-[11px] text-amber-100 font-medium">
                  Daffodil International University (DIU) Smart City & Halls.
                </p>
              </div>

              {/* Option 2: Inside Dhaka */}
              <div
                onClick={() => setAreaOption('INSIDE_DHAKA')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  areaOption === 'INSIDE_DHAKA'
                    ? 'border-[#D4AF37] bg-[#1A1813] gold-border-glow'
                    : 'border-zinc-800 bg-[#070709] hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Inside Dhaka</span>
                  <span className="text-xs font-bold text-[#D4AF37]">৳70</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Standard Dhaka Metropolitan courier delivery (24-48 hours).
                </p>
              </div>

              {/* Option 3: Outside Dhaka */}
              <div
                onClick={() => setAreaOption('OUTSIDE_DHAKA')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  areaOption === 'OUTSIDE_DHAKA'
                    ? 'border-[#D4AF37] bg-[#1A1813] gold-border-glow'
                    : 'border-zinc-800 bg-[#070709] hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Outside Dhaka</span>
                  <span className="text-xs font-bold text-[#D4AF37]">৳130</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Steadfast / Redx Courier across all 64 districts in BD.
                </p>
              </div>
            </div>

            {areaOption === 'OUTSIDE_DHAKA' && (
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  District / City Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chittagong, Sylhet, Rajshahi"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Full Address / Hall Name <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder={
                  areaOption === 'DIU'
                    ? 'e.g. DIU Female Hall 2, Room 402 / Knowledge Tower Ground Floor'
                    : 'e.g. House 14, Road 5, Block B, Mirpur 11, Dhaka'
                }
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-xs text-zinc-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Special Delivery Notes / Instructions <span className="text-zinc-500">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Call before delivery / Please deliver after 2 PM"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-[#101117] border border-[#D4AF37]/20 p-6 rounded-2xl space-y-4">
            <h2 className="font-serif-luxury text-xl font-bold text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <span className="w-6 h-6 rounded-full bg-[#1A1813] border border-[#D4AF37] text-[#D4AF37] text-xs flex items-center justify-center font-sans">
                3
              </span>
              <span>Payment Option</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-xl border cursor-pointer ${
                  paymentMethod === 'COD'
                    ? 'border-[#D4AF37] bg-[#1A1813]'
                    : 'border-zinc-800 bg-[#070709]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-bold text-zinc-100">Cash on Delivery</span>
                </div>
                <p className="text-[11px] text-zinc-400">Pay cash upon receiving package.</p>
              </div>

              <div
                onClick={() => setPaymentMethod('BKASH')}
                className={`p-4 rounded-xl border cursor-pointer ${
                  paymentMethod === 'BKASH'
                    ? 'border-[#D4AF37] bg-[#1A1813]'
                    : 'border-zinc-800 bg-[#070709]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-pink-500">bKash Manual</span>
                </div>
                <p className="text-[11px] text-zinc-400">Send money to bKash Personal.</p>
              </div>

              <div
                onClick={() => setPaymentMethod('NAGAD')}
                className={`p-4 rounded-xl border cursor-pointer ${
                  paymentMethod === 'NAGAD'
                    ? 'border-[#D4AF37] bg-[#1A1813]'
                    : 'border-zinc-800 bg-[#070709]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-orange-500">Nagad Manual</span>
                </div>
                <p className="text-[11px] text-zinc-400">Send money to Nagad Personal.</p>
              </div>
            </div>

            {(paymentMethod === 'BKASH' || paymentMethod === 'NAGAD') && (
              <div className="bg-[#14120B] border border-amber-500/30 p-4 rounded-xl text-xs space-y-2 text-amber-200">
                <p className="font-bold">
                  Payment Instructions ({paymentMethod}):
                </p>
                <p>
                  Please Send Money to <strong>01700-123456</strong> ({paymentMethod} Personal). Write your Phone number in reference.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Submit Button */}
        <div className="space-y-6">
          <div className="bg-[#101117] border border-[#D4AF37]/40 p-6 rounded-2xl space-y-6 gold-border-glow sticky top-28">
            <h2 className="font-serif-luxury text-xl font-bold text-zinc-100 border-b border-zinc-800 pb-3">
              Order Breakdown
            </h2>

            {/* Item List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={item.image} alt={item.name} className="w-9 h-9 object-cover rounded-md border border-zinc-800 shrink-0" />
                    <div className="truncate">
                      <p className="font-semibold text-zinc-200 truncate">{item.name}</p>
                      <p className="text-zinc-500">{item.quantity} x ৳{item.discountPrice || item.price}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#D4AF37] shrink-0">
                    ৳{(item.discountPrice || item.price) * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-zinc-800 pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-zinc-300">
                <span>Subtotal:</span>
                <span className="font-bold text-zinc-100">৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Delivery Charge ({areaOption}):</span>
                <span className="font-bold text-[#D4AF37]">
                  {deliveryCharge === 0 ? 'FREE (৳0)' : `৳${deliveryCharge}`}
                </span>
              </div>
              <div className="border-t border-zinc-800 pt-3 flex justify-between text-lg font-bold text-zinc-100">
                <span>Grand Total:</span>
                <span className="text-[#D4AF37]">৳{grandTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <span>Placing Your Order...</span>
              ) : (
                <>
                  <span>Confirm & Place Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
