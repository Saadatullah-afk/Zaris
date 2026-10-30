import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, Phone, Mail, Sparkles } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '@/components/common/Icons';

export default function Footer() {
  return (
    <footer className="bg-[#050507] border-t border-[#D4AF37]/20 text-zinc-400 text-sm">
      {/* DIU Special Notice Banner */}
      <div className="bg-[#12100B] border-b border-[#D4AF37]/15 py-4 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-xs tracking-wider uppercase">
            <Sparkles className="w-4 h-4" />
            <span>DIU Special Delivery Rule</span>
          </div>
          <p className="text-xs text-amber-200/90 font-medium">
            FREE DELIVERY AT DAFFODIL INTERNATIONAL UNIVERSITY (DIU) CAMPUS & HALLS
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="font-serif-luxury text-3xl font-bold tracking-[0.25em] gold-gradient-text uppercase">
              ZARIS
            </span>
            <span className="text-[10px] tracking-[0.35em] text-zinc-400 font-light -mt-1 uppercase">
              by zakia
            </span>
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-medium">
            JEWELLERY | ACCESSORIES | GIFTS
          </p>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Little Details. Lasting Impressions. Crafted with love for fashion lovers, university students, and gift connoisseurs all over Bangladesh.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://facebook.com/zaris.byzakia"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#12131C] border border-[#D4AF37]/30 flex items-center justify-center text-zinc-300 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors"
              aria-label="Facebook"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com/zaris_byzakia"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#12131C] border border-[#D4AF37]/30 flex items-center justify-center text-zinc-300 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-3">
          <h3 className="font-serif-luxury text-lg text-zinc-100 tracking-wider font-semibold border-b border-[#D4AF37]/20 pb-2">
            Quick Links
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/shop" className="hover:text-[#D4AF37] transition-colors">
                Shop Product Catalog
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:text-[#D4AF37] transition-colors">
                Browse Categories
              </Link>
            </li>
            <li>
              <Link href="/shop?category=gift-boxes" className="hover:text-[#D4AF37] transition-colors">
                Gift Boxes & Sets
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#D4AF37] transition-colors">
                About Zaris by Zakia
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#D4AF37] transition-colors">
                Contact & Support
              </Link>
            </li>
            <li>
              <Link href="/track-order" className="hover:text-[#D4AF37] transition-colors text-[#D4AF37]">
                Track Customer Order
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Customer Care */}
        <div className="space-y-3">
          <h3 className="font-serif-luxury text-lg text-zinc-100 tracking-wider font-semibold border-b border-[#D4AF37]/20 pb-2">
            Customer Care
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/faq" className="hover:text-[#D4AF37] transition-colors">
                Frequently Asked Questions (FAQ)
              </Link>
            </li>
            <li>
              <Link href="/faq#delivery" className="hover:text-[#D4AF37] transition-colors">
                Delivery & Shipping Info
              </Link>
            </li>
            <li>
              <Link href="/faq#diu" className="hover:text-[#D4AF37] transition-colors">
                DIU Campus Delivery Details
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-[#D4AF37] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#D4AF37] transition-colors">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Location */}
        <div className="space-y-3">
          <h3 className="font-serif-luxury text-lg text-zinc-100 tracking-wider font-semibold border-b border-[#D4AF37]/20 pb-2">
            Contact Zaris
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>Daffodil Smart City, Ashulia, Dhaka, Bangladesh</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>+880 1700-123456</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>info@zaris.com.bd</span>
            </div>
            <div className="pt-2">
              <Link
                href="/admin/login"
                className="text-[11px] text-zinc-500 hover:text-zinc-300 underline tracking-widest uppercase"
              >
                Staff Admin Login &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        <p>&copy; {new Date().getFullYear()} ZARIS by Zakia. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
