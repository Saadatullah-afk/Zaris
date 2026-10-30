'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Sparkles } from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const [settings, setSettings] = useState({
    brand_name: 'ZARIS by Zakia',
    tagline: 'Little Details. Lasting Impressions.',
    phone: '+880 1700-123456',
    email: 'info@zaris.com.bd',
    facebook_url: 'https://facebook.com/zaris.byzakia',
    instagram_url: 'https://instagram.com/zaris_byzakia',
    address: 'Daffodil Smart City, Ashulia, Dhaka, Bangladesh',
    inside_dhaka_delivery: '70',
    outside_dhaka_delivery: '130',
    diu_free_delivery: 'true',
    low_stock_threshold: '5',
    currency_symbol: '৳',
    order_prefix: 'ZARIS-2026-',
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data && Object.keys(data).length > 0) {
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.error('Failed to fetch settings', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
      }
    } catch (e) {
      console.error('Save settings error', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 text-zinc-100">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em]">
            System Preferences
          </span>
          <h1 className="font-serif-luxury text-3xl font-bold">Business Settings</h1>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 bg-emerald-950 border border-emerald-500/50 px-4 py-2 rounded-xl text-emerald-300 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-xs text-zinc-500 py-10 text-center">Loading site settings...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Section 1: Brand & Contact */}
          <div className="bg-[#101117] border border-[#D4AF37]/20 p-6 rounded-3xl space-y-4 gold-border-glow">
            <h2 className="font-serif-luxury text-xl font-bold text-[#D4AF37] border-b border-zinc-800 pb-2">
              Brand & Contact Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-zinc-300 mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  value={settings.brand_name}
                  onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Tagline / Slogan</label>
                <input
                  type="text"
                  required
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Support Email</label>
                <input
                  type="email"
                  required
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Facebook Page URL</label>
                <input
                  type="text"
                  value={settings.facebook_url}
                  onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Instagram URL</label>
                <input
                  type="text"
                  value={settings.instagram_url}
                  onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">Business Address</label>
              <input
                type="text"
                required
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Delivery & Shipping Rules */}
          <div className="bg-[#101117] border border-[#D4AF37]/20 p-6 rounded-3xl space-y-4 gold-border-glow">
            <h2 className="font-serif-luxury text-xl font-bold text-[#D4AF37] border-b border-zinc-800 pb-2">
              Delivery Rates & DIU Special Rule
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium text-zinc-300 mb-1">Inside Dhaka Delivery (৳)</label>
                <input
                  type="number"
                  required
                  value={settings.inside_dhaka_delivery}
                  onChange={(e) => setSettings({ ...settings, inside_dhaka_delivery: e.target.value })}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Outside Dhaka Delivery (৳)</label>
                <input
                  type="number"
                  required
                  value={settings.outside_dhaka_delivery}
                  onChange={(e) => setSettings({ ...settings, outside_dhaka_delivery: e.target.value })}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">DIU Free Delivery Setting</label>
                <select
                  value={settings.diu_free_delivery}
                  onChange={(e) => setSettings({ ...settings, diu_free_delivery: e.target.value })}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none font-bold text-amber-300"
                >
                  <option value="true">ENABLED (FREE ৳0 for DIU Students)</option>
                  <option value="false">DISABLED (Standard Rates)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Inventory & Order Configuration */}
          <div className="bg-[#101117] border border-[#D4AF37]/20 p-6 rounded-3xl space-y-4 gold-border-glow">
            <h2 className="font-serif-luxury text-xl font-bold text-[#D4AF37] border-b border-zinc-800 pb-2">
              Stock & System Configuration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium text-zinc-300 mb-1">Low Stock Threshold Level</label>
                <input
                  type="number"
                  required
                  value={settings.low_stock_threshold}
                  onChange={(e) => setSettings({ ...settings, low_stock_threshold: e.target.value })}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Currency Symbol</label>
                <input
                  type="text"
                  required
                  value={settings.currency_symbol}
                  onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Order ID Prefix</label>
                <input
                  type="text"
                  required
                  value={settings.order_prefix}
                  onChange={(e) => setSettings({ ...settings, order_prefix: e.target.value })}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full gold-gradient-bg text-black font-extrabold text-xs uppercase py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-xl disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save Site Settings'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
