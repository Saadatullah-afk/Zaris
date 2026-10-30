'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Boxes,
  BadgeDollarSign,
  Receipt,
  Users,
  BarChart3,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Skip auth check if on login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if (!res.ok || !data.authenticated) {
          router.push('/admin/login');
        } else {
          setAdminUser(data.user);
        }
      } catch (err) {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center text-zinc-400 space-y-4">
        <Sparkles className="w-8 h-8 text-[#D4AF37] animate-spin" />
        <p className="text-xs uppercase tracking-widest font-semibold">Verifying Zaris Admin Session...</p>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { name: 'Sales / Accounts', href: '/admin/sales', icon: BadgeDollarSign },
    { name: 'Expenses', href: '/admin/expenses', icon: Receipt },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-[#101117] border-b border-[#D4AF37]/20 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 text-zinc-300 hover:text-[#D4AF37]"
          >
            {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-serif-luxury text-lg font-bold tracking-widest text-[#D4AF37]">
            ZARIS ADMIN
          </span>
        </div>
        <Link
          href="/"
          target="_blank"
          className="text-[10px] text-zinc-400 hover:text-[#D4AF37] border border-zinc-800 px-3 py-1 rounded-full flex items-center gap-1 uppercase"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0D0E14] border-r border-[#D4AF37]/20 flex flex-col justify-between transform transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Brand Header */}
          <div className="border-b border-zinc-800 pb-4">
            <Link href="/admin/dashboard" className="flex flex-col">
              <span className="font-serif-luxury text-2xl font-bold tracking-[0.2em] gold-gradient-text uppercase">
                ZARIS
              </span>
              <span className="text-[9px] tracking-[0.3em] text-zinc-400 uppercase -mt-0.5">
                Business Management
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-[#1A1813] text-[#D4AF37] border border-[#D4AF37]/40 font-bold gold-border-glow'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#14151F]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-zinc-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Profile & Actions */}
        <div className="p-4 border-t border-zinc-800 space-y-3 bg-[#090A0F]">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-1.5 border border-zinc-800 hover:border-[#D4AF37]/40 text-zinc-400 hover:text-[#D4AF37] py-2 rounded-xl text-[11px] font-semibold uppercase transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <div className="flex items-center justify-between pt-1">
            <div className="truncate">
              <p className="text-xs font-bold text-zinc-200 truncate">{adminUser?.name || 'Zakia Sultana'}</p>
              <p className="text-[10px] text-zinc-500 uppercase">{adminUser?.role || 'ADMIN'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">{children}</main>
    </div>
  );
}
