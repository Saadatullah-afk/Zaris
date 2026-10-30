'use client';

import React, { useState, useEffect } from 'react';
import {
  BadgeDollarSign,
  TrendingUp,
  Receipt,
  Wallet,
  ShoppingBag,
  Clock,
  Boxes,
  AlertTriangle,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AdminDashboardPage() {
  const [range, setRange] = useState('this-month');
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async (selectedRange: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?range=${selectedRange}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error('Failed to fetch dashboard metrics', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics(range);
  }, [range]);

  const summary = data?.summary || {};
  const charts = data?.charts || {};

  const COLORS = ['#D4AF37', '#F3E5AB', '#997A15', '#E5C158', '#C5A059', '#3b82f6'];

  return (
    <div className="space-y-8 text-zinc-100">
      {/* Header & Date Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em]">
            Real-Time Analytics & Financial Ledger
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold">
            Executive Business Dashboard
          </h1>
        </div>

        {/* Date Filter Buttons */}
        <div className="flex items-center bg-[#101117] border border-zinc-800 p-1 rounded-xl text-xs">
          {[
            { key: 'today', label: 'Today' },
            { key: 'this-week', label: 'This Week' },
            { key: 'this-month', label: 'This Month' },
            { key: 'last-month', label: 'Last Month' },
            { key: 'this-year', label: 'This Year' },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => setRange(btn.key)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                range === btn.key
                  ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 space-y-3">
          <Sparkles className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto" />
          <p className="text-xs text-zinc-400 uppercase tracking-widest">Compiling Zaris Business Metrics...</p>
        </div>
      ) : (
        <>
          {/* Top Summary Cards (8 Grid Cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Sales */}
            <div className="bg-[#101117] border border-[#D4AF37]/30 p-5 rounded-2xl space-y-2 gold-border-glow">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Total Sales</span>
                <BadgeDollarSign className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <p className="text-2xl font-bold text-[#D4AF37]">৳{summary.totalSales || 0}</p>
              <p className="text-[10px] text-zinc-500">Gross customer revenue</p>
            </div>

            {/* Card 2: Total Cost */}
            <div className="bg-[#101117] border border-zinc-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Total Cost of Goods</span>
                <TrendingUp className="w-4 h-4 text-zinc-400" />
              </div>
              <p className="text-2xl font-bold text-zinc-200">৳{summary.totalCost || 0}</p>
              <p className="text-[10px] text-zinc-500">Wholesale cost price sum</p>
            </div>

            {/* Card 3: Total Expenses */}
            <div className="bg-[#101117] border border-zinc-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Total Expenses</span>
                <Receipt className="w-4 h-4 text-red-400" />
              </div>
              <p className="text-2xl font-bold text-red-400">৳{summary.totalExpenses || 0}</p>
              <p className="text-[10px] text-zinc-500">Packaging, ads & delivery</p>
            </div>

            {/* Card 4: Net Profit */}
            <div className="bg-[#14120B] border border-[#D4AF37]/50 p-5 rounded-2xl space-y-2 gold-border-glow">
              <div className="flex items-center justify-between text-xs text-amber-200">
                <span className="font-bold">Net Profit</span>
                <Wallet className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <p className="text-3xl font-extrabold text-[#D4AF37]">৳{summary.netProfit || 0}</p>
              <p className="text-[10px] text-amber-200/80">Margin: {summary.profitMargin}</p>
            </div>

            {/* Card 5: Total Orders */}
            <div className="bg-[#101117] border border-zinc-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-zinc-100">{summary.totalOrders || 0}</p>
              <p className="text-[10px] text-zinc-500">Total submitted orders</p>
            </div>

            {/* Card 6: Pending Orders */}
            <div className="bg-[#101117] border border-zinc-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Pending Orders</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-amber-400">{summary.pendingOrders || 0}</p>
              <p className="text-[10px] text-zinc-500">Requires fulfillment action</p>
            </div>

            {/* Card 7: In Stock Products */}
            <div className="bg-[#101117] border border-zinc-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Products In Stock</span>
                <Boxes className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-emerald-400">{summary.inStockProducts || 0}</p>
              <p className="text-[10px] text-zinc-500">Active catalog items</p>
            </div>

            {/* Card 8: Low Stock Alert */}
            <div className="bg-[#101117] border border-zinc-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Low Stock Alert</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-amber-500">{summary.lowStockProducts || 0}</p>
              <p className="text-[10px] text-zinc-500">Below threshold level</p>
            </div>
          </div>

          {/* Interactive Recharts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Graph 1: Sales vs Profit Over Time */}
            <div className="bg-[#101117] border border-[#D4AF37]/20 p-6 rounded-3xl space-y-4">
              <h2 className="font-serif-luxury text-xl font-bold text-zinc-100 flex items-center justify-between">
                <span>Sales & Profit Trend</span>
                <span className="text-xs text-[#D4AF37] font-sans font-normal uppercase">Filtered Range</span>
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.salesOverTime || []}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#71717a" fontSize={10} />
                    <YAxis stroke="#71717a" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#070709', borderColor: '#D4AF37', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="sales" name="Sales (৳)" stroke="#D4AF37" fillOpacity={1} fill="url(#colorSales)" />
                    <Area type="monotone" dataKey="profit" name="Profit (৳)" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 2: Best Selling Products */}
            <div className="bg-[#101117] border border-[#D4AF37]/20 p-6 rounded-3xl space-y-4">
              <h2 className="font-serif-luxury text-xl font-bold text-zinc-100">
                Top Performing Products
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.bestSellingProducts || []}>
                    <XAxis dataKey="name" stroke="#71717a" fontSize={10} />
                    <YAxis stroke="#71717a" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#070709', borderColor: '#D4AF37', borderRadius: '12px' }} />
                    <Bar dataKey="quantity" name="Units Sold" fill="#D4AF37" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 3: Expenses by Category */}
            <div className="bg-[#101117] border border-[#D4AF37]/20 p-6 rounded-3xl space-y-4">
              <h2 className="font-serif-luxury text-xl font-bold text-zinc-100">
                Expense Breakdown
              </h2>
              <div className="h-64 flex items-center justify-center">
                {charts.expensesByCategory?.length === 0 ? (
                  <p className="text-xs text-zinc-500">No expense records in this range.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={charts.expensesByCategory || []}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ category, amount }) => `${category}: ৳${amount}`}
                      >
                        {(charts.expensesByCategory || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#070709', borderColor: '#D4AF37', borderRadius: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Graph 4: Order Status Distribution */}
            <div className="bg-[#101117] border border-[#D4AF37]/20 p-6 rounded-3xl space-y-4">
              <h2 className="font-serif-luxury text-xl font-bold text-zinc-100">
                Order Status Distribution
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.orderStatusDistribution || []}>
                    <XAxis dataKey="status" stroke="#71717a" fontSize={9} />
                    <YAxis stroke="#71717a" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#070709', borderColor: '#D4AF37', borderRadius: '12px' }} />
                    <Bar dataKey="count" name="Orders Count" fill="#F3E5AB" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
