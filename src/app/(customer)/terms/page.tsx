import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 text-zinc-300 text-xs leading-relaxed">
      <div className="text-center space-y-2 border-b border-zinc-800 pb-6">
        <h1 className="font-serif-luxury text-3xl font-bold text-zinc-100">Terms & Conditions</h1>
        <p className="text-zinc-500 uppercase tracking-widest text-[10px]">ZARIS by Zakia &bull; Standard Operating Policy</p>
      </div>

      <div className="space-y-6 bg-[#101117] border border-zinc-800 p-8 rounded-2xl">
        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#D4AF37]">1. Order Placement & Confirmation</h2>
          <p>
            By submitting an order on ZARIS by Zakia, you confirm that the contact and shipping details provided are accurate. All orders are subject to stock availability and admin verification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#D4AF37]">2. DIU Free Delivery Policy</h2>
          <p>
            Free delivery applies exclusively to orders delivered within Daffodil International University (DIU) campus grounds and hall residences. Admin reserves the right to verify student delivery addresses.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#D4AF37]">3. Pricing & Payment</h2>
          <p>
            All prices are quoted in Bangladeshi Taka (৳). Payment must be made via Cash on Delivery or confirmed manual bKash/Nagad transfer.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-luxury text-lg font-bold text-[#D4AF37]">4. Exchanges & Returns</h2>
          <p>
            Unopened items with manufacturing defects may be reported within 24 hours of delivery with unboxing video proof.
          </p>
        </section>
      </div>
    </div>
  );
}
