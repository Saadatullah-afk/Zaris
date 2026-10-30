'use client';

import React, { useState, useEffect } from 'react';
import { BadgeDollarSign, Plus, X, Search, TrendingUp } from 'lucide-react';

export default function AdminSalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({ totalSales: 0, totalProfit: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    type: 'SALE',
    categoryName: 'General',
    productName: '',
    quantity: '1',
    costPrice: '100',
    sellingPrice: '250',
    paymentMethod: 'COD',
    customerName: '',
    notes: 'Paid',
  });

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sales');
      const data = await res.json();
      setSales(data.sales || []);
      setSummary(data.summary || { totalSales: 0, totalProfit: 0 });
    } catch (e) {
      console.error('Failed to fetch sales', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchSales();
      }
    } catch (e) {
      console.error('Error adding sale entry', e);
    }
  };

  return (
    <div className="space-y-6 text-zinc-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em]">
            Financial Accounting & Profit Ledger
          </span>
          <h1 className="font-serif-luxury text-3xl font-bold">Sales & Accounts</h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span>Record Custom Sale Entry</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#101117] border border-[#D4AF37]/30 p-5 rounded-2xl space-y-1 gold-border-glow">
          <span className="text-xs text-zinc-400">Total Recorded Sales</span>
          <p className="text-3xl font-bold text-[#D4AF37]">৳{summary.totalSales}</p>
        </div>
        <div className="bg-[#101117] border border-emerald-500/30 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-zinc-400">Total Net Profit</span>
          <p className="text-3xl font-bold text-emerald-400">৳{summary.totalProfit}</p>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-[#101117] border border-[#D4AF37]/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161822] text-[#D4AF37] uppercase tracking-wider font-bold border-b border-zinc-800">
              <tr>
                <th className="p-4">Date & Type</th>
                <th className="p-4">Category & Product</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Cost Price (৳)</th>
                <th className="p-4">Selling Price (৳)</th>
                <th className="p-4">Total (৳)</th>
                <th className="p-4">Profit (৳)</th>
                <th className="p-4">Payment & Customer</th>
                <th className="p-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-zinc-500">
                    Loading sales records...
                  </td>
                </tr>
              ) : sales.map((item) => (
                <tr key={item.id} className="hover:bg-[#14151F] transition-colors">
                  <td className="p-4">
                    <span className="text-zinc-300 font-medium block">
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-amber-400">{item.type}</span>
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-zinc-100 block">{item.productName}</span>
                    <span className="text-[10px] text-zinc-500">{item.categoryName}</span>
                  </td>

                  <td className="p-4 font-bold text-zinc-100">{item.quantity}</td>
                  <td className="p-4 text-zinc-400">৳{item.costPrice}</td>
                  <td className="p-4 font-bold text-zinc-100">৳{item.sellingPrice}</td>
                  <td className="p-4 font-bold text-[#D4AF37]">৳{item.total}</td>
                  <td className="p-4 font-bold text-emerald-400">৳{item.profit}</td>

                  <td className="p-4">
                    <span className="font-semibold text-zinc-200 block">{item.customerName}</span>
                    <span className="text-[10px] text-zinc-400">{item.paymentMethod}</span>
                  </td>

                  <td className="p-4 text-zinc-400">{item.notes || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Sale Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#101117] border border-[#D4AF37]/40 rounded-3xl max-w-lg w-full p-6 relative space-y-4 text-zinc-100 gold-border-glow">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-zinc-400">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-serif-luxury text-xl font-bold border-b border-zinc-800 pb-2">
              Record Offline / Social Sale Entry
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Entry Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-zinc-100 focus:outline-none"
                  >
                    <option value="SALE">SALE</option>
                    <option value="RETURN">RETURN</option>
                    <option value="ADJUSTMENT">ADJUSTMENT</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Cost Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Selling Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-zinc-100 focus:outline-none"
                  >
                    <option value="COD">Cash on Delivery</option>
                    <option value="BKASH">bKash</option>
                    <option value="NAGAD">Nagad</option>
                    <option value="BANK">Bank</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full gold-gradient-bg text-black font-bold text-xs uppercase py-3 rounded-xl hover:opacity-90"
              >
                Log Sales Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
