'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@zaris.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#101117] border border-[#D4AF37]/30 rounded-3xl p-8 space-y-8 shadow-2xl gold-border-glow text-zinc-100">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#1A1813] border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-6 h-6" />
          </div>
          <span className="font-serif-luxury text-2xl font-bold tracking-[0.2em] gold-gradient-text uppercase block">
            ZARIS
          </span>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-medium">
            Management Portal
          </p>
        </div>

        {error && (
          <div className="bg-red-950/80 border border-red-500/50 p-3 rounded-xl text-xs text-red-200 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 text-xs">
          <div>
            <label className="block font-medium text-zinc-300 mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl pl-10 pr-4 py-2.5 text-zinc-100 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl pl-10 pr-4 py-2.5 text-zinc-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-[#14120B] p-3 rounded-xl border border-amber-500/20 text-[11px] text-amber-200/90">
            Default Demo Credentials: <strong className="text-[#D4AF37]">admin@zaris.com</strong> / <strong className="text-[#D4AF37]">admin123</strong>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In To Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
