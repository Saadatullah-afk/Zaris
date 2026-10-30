'use client';

import React, { useState, useEffect } from 'react';
import { Download, BarChart3, TrendingUp, Calendar, Sparkles } from 'lucide-react';

export default function AdminReportsPage() {
  const [range, setRange] = useState('this-month');
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async (selectedRange: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?range=${selectedRange}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error('Failed to fetch reports', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(range);
  }, [range]);

  const handleExportCSV = () => {
    window.open(`/api/reports?range=${range}&export=csv`, '_blank');
  };

  const summary = data?.summary || {};

  return (
    <div className="space-y-8 text-zinc-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em]">
            Financial Statements & Auditing
          </span>
          <h1 className="font-serif-luxury text-3xl font-bold">Business Analytical Reports</h1>
        </div>

        <button
          onClick={handleExportCSV}
          className="gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Date Filter Buttons */}
      <div className="flex items-center bg-[#101117] border border-zinc-800 p-1.5 rounded-xl text-xs w-fit">
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
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              range === btn.key
                ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Sparkles className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#101117] border border-[#D4AF37]/30 p-6 rounded-3xl space-y-2 gold-border-glow">
            <span className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Total Sales</span>
            <p className="text-4xl font-bold text-[#D4AF37]">৳{summary.totalSales || 0}</p>
            <p className="text-xs text-zinc-500">Gross customer orders total</p>
          </div>

          <div className="bg-[#101117] border border-zinc-800 p-6 rounded-3xl space-y-2">
            <span className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Cost of Goods Sold (COGS)</span>
            <p className="text-4xl font-bold text-zinc-200">৳{summary.totalCost || 0}</p>
            <p className="text-xs text-zinc-500">Inventory cost sum</p>
          </div>

          <div className="bg-[#101117] border border-zinc-800 p-6 rounded-3xl space-y-2">
            <span className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Gross Profit</span>
            <p className="text-4xl font-bold text-emerald-400">৳{summary.grossProfit || 0}</p>
            <p className="text-xs text-zinc-500">Total Sales minus COGS</p>
          </div>

          <div className="bg-[#101117] border border-zinc-800 p-6 rounded-3xl space-y-2">
            <span className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Total Expenses</span>
            <p className="text-4xl font-bold text-red-400">৳{summary.totalExpenses || 0}</p>
            <p className="text-xs text-zinc-500">Operational & packaging costs</p>
          </div>

          <div className="bg-[#14120B] border border-[#D4AF37]/50 p-6 rounded-3xl space-y-2 md:col-span-2 gold-border-glow">
            <span className="text-xs font-bold text-amber-200 uppercase tracking-widest">Net Profit</span>
            <p className="text-5xl font-extrabold text-[#D4AF37]">৳{summary.netProfit || 0}</p>
            <p className="text-xs text-amber-200/80">
              Net Profit Margin: <strong>{summary.profitMargin}</strong> (Gross Profit minus Total Expenses)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
