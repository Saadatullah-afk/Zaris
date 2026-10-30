import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 text-zinc-300 text-xs leading-relaxed">
      <div className="text-center space-y-2 border-b border-zinc-800 pb-6">
        <h1 className="font-serif-luxury text-3xl font-bold text-zinc-100">Privacy Policy</h1>
        <p className="text-zinc-500 uppercase tracking-widest text-[10px]">ZARIS by Zakia &bull; Last Updated 2026</p>
      </div>

      <div className="space-y-6 bg-[#101117] border border-zinc-800 p-8 rounded-2xl">
        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#D4AF37]">1. Information We Collect</h2>
          <p>
            When you place an order with ZARIS by Zakia, we collect personal information necessary to fulfill your order: full name, phone number, email address, physical delivery address, and optional social media handle.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#D4AF37]">2. How We Use Your Data</h2>
          <p>
            Your information is used strictly for processing orders, scheduling courier deliveries, validating DIU campus free shipping eligibility, and sending status updates regarding your purchase.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#D4AF37]">3. Data Security & Protection</h2>
          <p>
            We enforce server-side security measures to prevent unauthorized disclosure of customer records. We never sell, rent, or trade your personal information to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#D4AF37]">4. Contact Us</h2>
          <p>
            For privacy inquiries or data removal requests, contact us at info@zaris.com.bd or call +880 1700-123456.
          </p>
        </section>
      </div>
    </div>
  );
}
