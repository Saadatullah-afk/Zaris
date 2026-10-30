'use client';

import React, { useState, useEffect } from 'react';
import { Users, Eye, Search, X } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch customers', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query) ||
      (c.email && c.email.toLowerCase().includes(query)) ||
      (c.area && c.area.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6 text-zinc-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em]">
            Client Management
          </span>
          <h1 className="font-serif-luxury text-3xl font-bold">Customer Directory</h1>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by customer name, phone, area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#101117] border border-zinc-800 focus:border-[#D4AF37] rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 focus:outline-none"
        />
      </div>

      <div className="bg-[#101117] border border-[#D4AF37]/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161822] text-[#D4AF37] uppercase tracking-wider font-bold border-b border-zinc-800">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact Phone</th>
                <th className="p-4">Area & District</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Total Spent (৳)</th>
                <th className="p-4">Notes</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    Loading customer directory...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    No customer profiles found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#14151F] transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-zinc-100 block">{cust.name}</span>
                      {cust.email && <span className="text-[10px] text-zinc-500">{cust.email}</span>}
                    </td>
                    <td className="p-4 font-semibold text-zinc-200">{cust.phone}</td>
                    <td className="p-4 text-zinc-300">
                      <span>{cust.area || cust.district}</span>
                    </td>
                    <td className="p-4 font-bold text-zinc-100">{cust.totalOrders}</td>
                    <td className="p-4 font-bold text-[#D4AF37] text-sm">৳{cust.totalSpent}</td>
                    <td className="p-4 text-zinc-400 max-w-xs truncate">{cust.notes || 'None'}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="p-1.5 bg-[#161822] hover:bg-[#D4AF37] text-zinc-300 hover:text-black rounded-lg transition-colors"
                        title="View Order History"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#101117] border border-[#D4AF37]/40 rounded-3xl max-w-xl w-full p-6 relative space-y-4 text-zinc-100 gold-border-glow">
            <button onClick={() => setSelectedCustomer(null)} className="absolute top-4 right-4 p-2 text-zinc-400">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-serif-luxury text-xl font-bold border-b border-zinc-800 pb-2">
              Customer History: {selectedCustomer.name}
            </h2>

            <div className="grid grid-cols-2 gap-2 text-xs bg-[#070709] p-3 rounded-xl border border-zinc-800">
              <p>Phone: <strong>{selectedCustomer.phone}</strong></p>
              <p>Total Orders: <strong>{selectedCustomer.totalOrders}</strong></p>
              <p>Address: <strong>{selectedCustomer.address}</strong></p>
              <p>Total Lifetime Spent: <strong className="text-[#D4AF37]">৳{selectedCustomer.totalSpent}</strong></p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-xs text-[#D4AF37] uppercase tracking-wider block">Recent Orders</span>
              {selectedCustomer.orders?.length === 0 ? (
                <p className="text-xs text-zinc-500">No order history found.</p>
              ) : (
                selectedCustomer.orders?.map((ord: any) => (
                  <div key={ord.id} className="flex justify-between items-center bg-[#070709] p-3 rounded-xl border border-zinc-800 text-xs">
                    <div>
                      <span className="font-bold text-[#D4AF37]">{ord.orderId}</span>
                      <span className="text-zinc-400 text-[10px] block">{new Date(ord.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-zinc-100 block">৳{ord.total}</span>
                      <span className="text-[10px] text-amber-300 uppercase">{ord.orderStatus}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
