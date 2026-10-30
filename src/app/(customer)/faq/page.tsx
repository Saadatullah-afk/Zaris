import React from 'react';
import { HelpCircle, Truck, Sparkles, ShieldCheck } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      q: 'How does the DIU FREE DELIVERY offer work?',
      a: 'If your delivery address or location is inside Daffodil International University (DIU) campus, halls, or academic buildings, select "DIU Delivery" during checkout. Your delivery charge will be automatically calculated as ৳0!',
    },
    {
      q: 'What are the delivery charges for other locations in Bangladesh?',
      a: 'Inside Dhaka Metropolitan delivery is ৳70 (takes 24-48 hours). Outside Dhaka delivery across all 64 districts in Bangladesh is ৳130 (takes 2-4 business days).',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept Cash on Delivery (COD) as well as manual bKash and Nagad payments. Payment instructions for bKash/Nagad are displayed on the checkout page.',
    },
    {
      q: 'How can I track my order status?',
      a: 'You can easily track your order anytime by visiting our "Track Order" page and entering your unique Order ID (e.g. ZARIS-2026-0001) along with your phone number.',
    },
    {
      q: 'How do I care for my Zaris jewelry items?',
      a: 'Keep your gold-plated and stone jewelry dry. Avoid direct contact with perfume sprays, hair products, or harsh household chemicals. Store in your signature Zaris airtight velvet pouch after wearing.',
    },
    {
      q: 'Can I add a custom handwritten message inside a gift box?',
      a: 'Yes! When placing an order for a gift box, simply add your custom note in the "Delivery Note" box during checkout or send us a message on Instagram @zaris_byzakia.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12 text-zinc-100">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em]">
          Help & Support
        </span>
        <h1 className="font-serif-luxury text-4xl font-bold">Frequently Asked Questions (FAQ)</h1>
        <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto opacity-70" />
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-[#101117] border border-[#D4AF37]/20 p-6 rounded-2xl space-y-2 gold-border-glow"
          >
            <h2 className="font-serif-luxury text-lg font-bold text-[#D4AF37] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>{faq.q}</span>
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed pl-6">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
