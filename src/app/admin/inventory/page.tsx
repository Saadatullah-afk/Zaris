'use client';

import React, { useState, useEffect } from 'react';
import { Boxes, Plus, AlertTriangle, History, X, Check } from 'lucide-react';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [threshold, setThreshold] = useState(5);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [stockChange, setStockChange] = useState('10');
  const [type, setType] = useState<'ADD' | 'REMOVE'>('ADD');
  const [reason, setReason] = useState('Manual Restock');
  const [reference, setReference] = useState('');

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      setInventory(data.inventory || []);
      setTransactions(data.transactions || []);
      setThreshold(data.lowStockThreshold || 5);
    } catch (e) {
      console.error('Failed to fetch inventory', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleOpenStockModal = (item: any) => {
    setSelectedProduct(item);
    setStockChange('10');
    setType('ADD');
    setReason('Manual Restock Batch');
    setReference(`RESTOCK-${Date.now().toString().slice(-4)}`);
    setIsModalOpen(true);
  };

  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          stockChange: parseInt(stockChange),
          type,
          reason,
          reference,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchInventory();
      }
    } catch (e) {
      console.error('Failed to adjust stock', e);
    }
  };

  return (
    <div className="space-y-8 text-zinc-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em]">
            Stock & Inventory Auditing
          </span>
          <h1 className="font-serif-luxury text-3xl font-bold">Inventory Control</h1>
        </div>

        <div className="flex items-center gap-2 bg-[#101117] border border-amber-500/30 px-4 py-2 rounded-xl text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Low Stock Threshold: <strong className="text-[#D4AF37]">{threshold} units</strong></span>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="space-y-4">
        <h2 className="font-serif-luxury text-xl font-bold text-zinc-100">Product Stock Overview</h2>
        <div className="bg-[#101117] border border-[#D4AF37]/20 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161822] text-[#D4AF37] uppercase tracking-wider font-bold border-b border-zinc-800">
                <tr>
                  <th className="p-4">Product Name & SKU</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Cost Price (৳)</th>
                  <th className="p-4">Selling Price (৳)</th>
                  <th className="p-4">Remaining Stock</th>
                  <th className="p-4">Stock Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-500">
                      Loading inventory levels...
                    </td>
                  </tr>
                ) : (
                  inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-[#14151F] transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-zinc-100 block">{item.name}</span>
                        <span className="text-[10px] text-zinc-500">SKU: {item.sku}</span>
                      </td>

                      <td className="p-4">
                        <span className="text-zinc-300 font-medium">{item.category}</span>
                      </td>

                      <td className="p-4 text-zinc-400">৳{item.costPrice}</td>
                      <td className="p-4 font-bold text-[#D4AF37]">৳{item.price}</td>

                      <td className="p-4 font-bold text-base text-zinc-100">{item.stock}</td>

                      <td className="p-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                            item.status === 'OUT_OF_STOCK'
                              ? 'bg-red-950/80 text-red-400 border-red-500/50'
                              : item.status === 'LOW_STOCK'
                              ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                          }`}
                        >
                          {item.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleOpenStockModal(item)}
                          className="gold-gradient-bg text-black font-bold text-[11px] uppercase px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Transaction History Log Table */}
      <div className="space-y-4 pt-6">
        <h2 className="font-serif-luxury text-xl font-bold text-zinc-100 flex items-center gap-2">
          <History className="w-5 h-5 text-[#D4AF37]" />
          <span>Recent Inventory Transactions Audit Log</span>
        </h2>
        <div className="bg-[#101117] border border-zinc-800 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#161822] text-zinc-400 uppercase font-semibold border-b border-zinc-800">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Product</th>
                <th className="p-3">Stock In</th>
                <th className="p-3">Stock Out</th>
                <th className="p-3">Remaining</th>
                <th className="p-3">Reason / Ref</th>
                <th className="p-3">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-[#14151F]">
                  <td className="p-3 text-zinc-500">
                    {new Date(trx.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="p-3 font-semibold text-zinc-200">{trx.product?.name || 'N/A'}</td>
                  <td className="p-3 font-bold text-emerald-400">+{trx.stockIn}</td>
                  <td className="p-3 font-bold text-red-400">-{trx.stockOut}</td>
                  <td className="p-3 font-bold text-zinc-100">{trx.remainingStock}</td>
                  <td className="p-3 text-zinc-300">{trx.reason} ({trx.reference || 'N/A'})</td>
                  <td className="p-3 text-zinc-400">{trx.adminName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#101117] border border-[#D4AF37]/40 rounded-3xl max-w-md w-full p-6 relative space-y-4 text-zinc-100 gold-border-glow">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-zinc-400">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-serif-luxury text-xl font-bold border-b border-zinc-800 pb-2">
              Adjust Stock: {selectedProduct.name}
            </h2>
            <form onSubmit={handleStockSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-zinc-300 mb-1">Adjustment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('ADD')}
                    className={`py-2 rounded-xl font-bold uppercase ${
                      type === 'ADD' ? 'bg-emerald-600 text-white' : 'bg-[#070709] border border-zinc-800 text-zinc-400'
                    }`}
                  >
                    + Stock In (Add)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('REMOVE')}
                    className={`py-2 rounded-xl font-bold uppercase ${
                      type === 'REMOVE' ? 'bg-red-600 text-white' : 'bg-[#070709] border border-zinc-800 text-zinc-400'
                    }`}
                  >
                    - Stock Out (Remove)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Quantity Units</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={stockChange}
                  onChange={(e) => setStockChange(e.target.value)}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Reason</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Supplier Restock Batch 4 / Damaged return"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Reference Code</label>
                <input
                  type="text"
                  placeholder="e.g. PO-98123"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-zinc-100 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full gold-gradient-bg text-black font-bold text-xs uppercase py-3 rounded-xl hover:opacity-90"
              >
                Confirm Inventory Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
