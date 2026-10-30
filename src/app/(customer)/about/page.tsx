import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, ShieldCheck, Gift, Truck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16 text-zinc-100">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em]">
          Our Brand Philosophy
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold tracking-wider gold-gradient-text uppercase">
          About ZARIS by Zakia
        </h1>
        <p className="font-serif-luxury italic text-xl sm:text-2xl text-zinc-300">
          &ldquo;Little Details. Lasting Impressions.&rdquo;
        </p>
        <div className="w-20 h-0.5 bg-[#D4AF37] mx-auto opacity-70" />
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <h2 className="font-serif-luxury text-2xl font-bold text-zinc-100">
            Crafting Elegance for Fashion Lovers & Students
          </h2>
          <p>
            Founded by <strong>Zakia Sultana</strong>, ZARIS was born out of a deep passion for fine craftsmanship, delicate aesthetics, and high-contrast luxury jewelry tailored for everyday fashion.
          </p>
          <p>
            Whether you are looking for stackable gold wave rings, freshwater pearl drop earrings, vibrant meenakari bangles, or curated gift boxes for your loved ones, ZARIS blends royal Bangladeshi heritage with modern minimalist styling.
          </p>
          <p>
            We take special pride in catering to university students—offering affordable pricing without compromising on quality, alongside <strong>FREE DELIVERY for Daffodil International University (DIU)</strong> students!
          </p>
        </div>

        <div className="relative aspect-square rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl gold-border-glow">
          <img
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80"
            alt="Zaris Packaging & Craftsmanship"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Brand Values */}
      <div className="bg-[#101117] border border-[#D4AF37]/20 p-10 rounded-3xl space-y-8 gold-border-glow">
        <h2 className="font-serif-luxury text-3xl font-bold text-center text-zinc-100">
          What Sets ZARIS Apart?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
          <div className="space-y-2 p-4 bg-[#070709] rounded-2xl border border-zinc-800">
            <Sparkles className="w-6 h-6 text-[#D4AF37] mx-auto" />
            <h3 className="font-serif-luxury text-lg font-bold text-zinc-100">Timeless Aesthetic</h3>
            <p className="text-zinc-400">Non-tarnish electro-plated metals, freshwater pearls, and hand-painted enamel.</p>
          </div>
          <div className="space-y-2 p-4 bg-[#070709] rounded-2xl border border-zinc-800">
            <Gift className="w-6 h-6 text-[#D4AF37] mx-auto" />
            <h3 className="font-serif-luxury text-lg font-bold text-zinc-100">Signature Gift Boxes</h3>
            <p className="text-zinc-400">Hand-embossed gold wax seals, velvet pouches, and custom handwritten cards.</p>
          </div>
          <div className="space-y-2 p-4 bg-[#070709] rounded-2xl border border-zinc-800">
            <Truck className="w-6 h-6 text-[#D4AF37] mx-auto" />
            <h3 className="font-serif-luxury text-lg font-bold text-zinc-100">Free DIU Campus Shipping</h3>
            <p className="text-zinc-400">Dedicated express rider delivery right inside Daffodil Smart City campus.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h3 className="font-serif-luxury text-2xl font-bold text-zinc-100">Ready to Explore Zaris?</h3>
        <Link
          href="/shop"
          className="inline-block gold-gradient-bg text-black font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl hover:scale-105 transition-transform"
        >
          View Full Product Catalog
        </Link>
      </div>
    </div>
  );
}
