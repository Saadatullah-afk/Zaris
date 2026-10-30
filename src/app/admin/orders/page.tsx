'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Eye, Printer, Filter, CheckCircle, Clock, AlertTriangle, X } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = `/api/orders?search=${encodeURIComponent(search)}`;
      if (statusFilter !== 'ALL') url += `&status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleUpdateStatus = async (orderId: string, orderStatus: string, paymentStatus?: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus, paymentStatus }),
      });
      if (res.ok) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          const updated = await res.json();
          setSelectedOrder(updated);
        }
      }
    } catch (e) {
      console.error('Status update failed', e);
    }
  };

  return (
    <div className="space-y-6 text-zinc-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em]">
            Store Operations
          </span>
          <h1 className="font-serif-luxury text-3xl font-bold">Order Management</h1>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#101117] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-xs font-semibold uppercase text-zinc-200"
          >
            <option value="ALL">All Order Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="READY_TO_SHIP">Ready to Ship</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search Order ID, customer name, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#101117] border border-zinc-800 focus:border-[#D4AF37] rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 focus:outline-none"
        />
      </form>

      {/* Orders Table */}
      <div className="bg-[#101117] border border-[#D4AF37]/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161822] text-[#D4AF37] uppercase tracking-wider font-bold border-b border-zinc-800">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer Info</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    Loading customer orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    No orders match your criteria.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#14151F] transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-[#D4AF37] block">{ord.orderId}</span>
                      <span className="text-[10px] text-zinc-500">
                        {new Date(ord.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-zinc-200 block">{ord.customerName}</span>
                      <span className="text-zinc-400 block">{ord.phone}</span>
                      <span className="text-[10px] text-amber-200/80 block">{ord.area}</span>
                    </td>

                    <td className="p-4">
                      <span className="text-zinc-300 font-medium">
                        {ord.items?.length || 0} product(s)
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-zinc-100 block">৳{ord.total}</span>
                      <span className="text-[10px] text-zinc-500">Fee: ৳{ord.deliveryCharge}</span>
                    </td>

                    <td className="p-4">
                      <span className="text-zinc-300 font-medium block">{ord.paymentMethod}</span>
                      <select
                        value={ord.paymentStatus}
                        onChange={(e) => handleUpdateStatus(ord.id, ord.orderStatus, e.target.value)}
                        className="bg-[#070709] border border-zinc-800 text-[10px] rounded px-1.5 py-0.5 text-amber-300 font-bold mt-1"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="DUE">DUE</option>
                        <option value="REFUNDED">REFUNDED</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className={`text-[10px] font-bold rounded-lg px-2.5 py-1 border uppercase ${
                          ord.orderStatus === 'DELIVERED'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                            : ord.orderStatus === 'CANCELLED'
                            ? 'bg-red-950/80 text-red-400 border-red-500/50'
                            : 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="READY_TO_SHIP">READY TO SHIP</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 bg-[#1A1813] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black rounded-lg transition-colors"
                          title="View Full Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/admin/orders/invoice/${ord.orderId}`}
                          target="_blank"
                          className="p-1.5 bg-[#161822] hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors"
                          title="Print Zaris Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#101117] border border-[#D4AF37]/40 rounded-3xl max-w-3xl w-full p-6 sm:p-8 relative space-y-6 text-zinc-100 max-h-[90vh] overflow-y-auto gold-border-glow">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <div>
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block">
                  ZARIS Order Specification
                </span>
                <h2 className="font-serif-luxury text-2xl font-bold">Order #{selectedOrder.orderId}</h2>
              </div>
              <Link
                href={`/admin/orders/invoice/${selectedOrder.orderId}`}
                target="_blank"
                className="gold-gradient-bg text-black font-bold text-xs uppercase px-4 py-2 rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Invoice</span>
              </Link>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#070709] p-4 rounded-2xl border border-zinc-800">
              <div className="space-y-1">
                <span className="font-bold text-[#D4AF37] uppercase block">Customer Information</span>
                <p>Name: <strong>{selectedOrder.customerName}</strong></p>
                <p>Phone: <strong>{selectedOrder.phone}</strong></p>
                <p>Email: <strong>{selectedOrder.email || 'N/A'}</strong></p>
                <p>Social ID: <strong>{selectedOrder.socialUsername || 'N/A'}</strong></p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-[#D4AF37] uppercase block">Shipping Address</span>
                <p>Address: <strong>{selectedOrder.address}</strong></p>
                <p>Area: <strong>{selectedOrder.area}</strong></p>
                <p>District: <strong>{selectedOrder.district}</strong></p>
                <p>Notes: <strong>{selectedOrder.deliveryNote || 'None'}</strong></p>
              </div>
            </div>

            {/* Itemized Snapshot Table */}
            <div className="space-y-3">
              <span className="font-bold text-xs text-zinc-300 uppercase tracking-wider block">Line Items</span>
              <div className="space-y-2">
                {selectedOrder.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center bg-[#070709] p-3 rounded-xl border border-zinc-800 text-xs">
                    <div>
                      <p className="font-bold text-zinc-200">{item.productName}</p>
                      <p className="text-zinc-500">SKU: {item.sku} &bull; Qty: {item.quantity} x ৳{item.price}</p>
                    </div>
                    <span className="font-bold text-[#D4AF37]">৳{item.subtotal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Total Summary */}
            <div className="border-t border-zinc-800 pt-4 flex justify-between items-center text-sm font-bold">
              <div>
                <span className="text-xs text-zinc-400 block font-normal">Subtotal: ৳{selectedOrder.subtotal} &bull; Delivery: ৳{selectedOrder.deliveryCharge}</span>
                <span className="text-zinc-100">Grand Total Amount:</span>
              </div>
              <span className="text-2xl text-[#D4AF37]">৳{selectedOrder.total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
