'use client';

import React from 'react';
import { Printer, ArrowLeft } from 'lucide-react';

export default function InvoicePrintClient() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="no-print mb-6 bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center text-white">
      <div className="flex items-center gap-2">
        <Printer className="w-5 h-5 text-[#D4AF37]" />
        <span className="text-xs font-bold uppercase tracking-wider">ZARIS Invoice Print Preview</span>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => window.close()}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-semibold"
        >
          Close Window
        </button>
        <button
          onClick={handlePrint}
          className="px-5 py-2 gold-gradient-bg text-black font-bold rounded-lg text-xs uppercase tracking-wider hover:opacity-90"
        >
          Print Invoice Now
        </button>
      </div>
    </div>
  );
}
