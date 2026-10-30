'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '@/components/common/Icons';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-12 text-zinc-100">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em]">
          We Would Love to Hear From You
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold">Contact ZARIS by Zakia</h1>
        <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto opacity-70" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="bg-[#101117] border border-[#D4AF37]/30 p-8 rounded-3xl space-y-6 gold-border-glow">
          <h2 className="font-serif-luxury text-2xl font-bold text-zinc-100">Send Us a Message</h2>

          {submitted ? (
            <div className="bg-emerald-950/40 border border-emerald-500/50 p-6 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-serif-luxury text-xl font-bold text-emerald-200">Message Received!</h3>
              <p className="text-xs text-zinc-300">
                Thank you for contacting Zaris by Zakia. We will reply to your message shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-zinc-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faria Hossain"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-zinc-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 01700123456"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-zinc-300 mb-1">Your Inquiry / Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ask about custom gift box packaging, DIU campus delivery, or order inquiries..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full gold-gradient-bg text-black font-bold text-xs uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Contact Info & Socials */}
        <div className="space-y-8 flex flex-col justify-between">
          <div className="bg-[#101117] border border-[#D4AF37]/20 p-8 rounded-3xl space-y-6">
            <h2 className="font-serif-luxury text-2xl font-bold text-zinc-100">Get In Touch</h2>
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-200 block">Primary Location:</span>
                  <span className="text-zinc-400">Daffodil Smart City, Ashulia, Dhaka, Bangladesh</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <span className="font-bold text-zinc-200 block">Customer Helpline:</span>
                  <span className="text-zinc-400">+880 1700-123456</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <span className="font-bold text-zinc-200 block">Email Address:</span>
                  <span className="text-zinc-400">info@zaris.com.bd</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Channels */}
          <div className="bg-[#101117] border border-[#D4AF37]/20 p-8 rounded-3xl space-y-4">
            <h3 className="font-serif-luxury text-xl font-bold text-zinc-100">Connect On Social Media</h3>
            <div className="space-y-3 text-xs">
              <a
                href="https://facebook.com/zaris.byzakia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#070709] border border-zinc-800 p-3 rounded-xl hover:border-[#D4AF37] transition-colors"
              >
                <FacebookIcon className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <p className="font-bold text-zinc-200">Facebook Page</p>
                  <p className="text-zinc-500">facebook.com/zaris.byzakia</p>
                </div>
              </a>
              <a
                href="https://instagram.com/zaris_byzakia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#070709] border border-zinc-800 p-3 rounded-xl hover:border-[#D4AF37] transition-colors"
              >
                <InstagramIcon className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <p className="font-bold text-zinc-200">Instagram Handle</p>
                  <p className="text-zinc-500">@zaris_byzakia</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
