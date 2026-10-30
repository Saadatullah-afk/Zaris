'use client';

import React, { useState, useEffect } from 'react';
import { Receipt, Plus, Trash2, X } from 'lucide-react';

export default function AdminExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    category: 'PACKAGING',
    description: '',
    amount: '',
    paymentMethod: 'CASH',
    notes: '',
  });

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/expenses');
      const data = await res.json();
      setExpenses(data.expenses || []);
      setTotalExpenses(data.totalExpenses || 0);
    } catch (e) {
      console.error('Failed to fetch expenses', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ category: 'PACKAGING', description: '', amount: '', paymentMethod: 'CASH', notes: '' });
        fetchExpenses();
      }
    } catch (e) {
      console.error('Failed to add expense', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense entry?')) return;
    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchExpenses();
    } catch (e) {
      console.error('Delete expense failed', e);
    }
  };

  return (
    <div className="space-y-6 text-zinc-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em]">
            Operational Cost Tracking
          </span>
          <h1 className="font-serif-luxury text-3xl font-bold">Expense Management</h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Expense</span>
        </button>
      </div>

      {/* Expense Summary Header */}
      <div className="bg-[#101117] border border-red-500/30 p-6 rounded-2xl space-y-1">
        <span className="text-xs text-zinc-400">Total Recorded Expenses</span>
        <p className="text-3xl font-bold text-red-400">৳{totalExpenses}</p>
      </div>

      {/* Expense List Table */}
      <div className="bg-[#101117] border border-[#D4AF37]/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161822] text-[#D4AF37] uppercase tracking-wider font-bold border-b border-zinc-800">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Category</th>
                <th className="p-4">Description</th>
                <th className="p-4">Amount (৳)</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Notes</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    Loading expense log...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    No expense entries recorded yet.
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[#14151F] transition-colors">
                    <td className="p-4 text-zinc-400">
                      {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 font-bold text-amber-300 uppercase">{exp.category}</td>
                    <td className="p-4 font-semibold text-zinc-100 max-w-xs">{exp.description}</td>
                    <td className="p-4 font-bold text-red-400 text-sm">৳{exp.amount}</td>
                    <td className="p-4 text-zinc-300">{exp.paymentMethod}</td>
                    <td className="p-4 text-zinc-500">{exp.notes || 'N/A'}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="p-1.5 bg-[#161822] hover:bg-red-600 text-zinc-300 hover:text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#101117] border border-[#D4AF37]/40 rounded-3xl max-w-md w-full p-6 relative space-y-4 text-zinc-100 gold-border-glow">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-zinc-400">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-serif-luxury text-xl font-bold border-b border-zinc-800 pb-2">
              Add New Business Expense
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-zinc-300 mb-1">Expense Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-zinc-100 focus:outline-none uppercase text-xs"
                >
                  <option value="PACKAGING">Packaging (Pouches & Boxes)</option>
                  <option value="DELIVERY">Delivery / Courier Rider Fees</option>
                  <option value="MARKETING">Marketing (FB & IG Ads)</option>
                  <option value="RAW_MATERIALS">Raw Materials / Import</option>
                  <option value="PRODUCT_PURCHASE">Product Purchase</option>
                  <option value="PLATFORM">Platform / Service Fee</option>
                  <option value="OTHER">Other Expense</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Purchased 500 gold embossed velvet pouches"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Amount (৳)</label>
                <input
                  type="number"
                  required
                  step="any"
                  min={1}
                  placeholder="e.g. 2500"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
                  <option value="CASH">Cash</option>
                  <option value="BKASH">bKash</option>
                  <option value="NAGAD">Nagad</option>
                  <option value="BANK">Bank Transfer</option>
                  <option value="CARD">Credit/Debit Card</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Batch 2 invoice #981"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-zinc-100 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full gold-gradient-bg text-black font-bold text-xs uppercase py-3 rounded-xl hover:opacity-90"
              >
                Log Expense Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
