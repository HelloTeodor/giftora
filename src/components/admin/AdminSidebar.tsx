'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag,
  BarChart3, Settings, LogOut, Layers, MessageSquare,
  Gift, Percent, BookOpen, ArrowLeft, FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Layers },
  { href: '/admin/collections', label: 'Collections', icon: FolderOpen },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/coupons', label: 'Coupons', icon: Percent },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/blog', label: 'Blog', icon: BookOpen },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

interface Props {
  user: { name?: string | null; email?: string | null; role?: string };
}

export function AdminSidebar({ user }: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-navy-950 flex flex-col min-h-screen flex-shrink-0 border-r border-navy-800">
      {/* Logo */}
      <div className="p-6 border-b border-navy-800">
        <Link href="/" className="block mb-1">
          <span className="font-serif text-xl font-bold tracking-widest text-white">
            GIFT<span className="text-gold-500">ORA</span>
          </span>
        </Link>
        <span className="text-xs text-cream-500 font-medium uppercase tracking-wide">Admin Panel</span>
      </div>

      {/* User */}
      <div className="px-4 py-3 border-b border-navy-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-navy-950 font-bold text-sm">
            {user.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user.name}</p>
            <p className="text-cream-500 text-xs capitalize">{user.role?.toLowerCase().replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                active
                  ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                  : 'text-cream-400 hover:bg-white/5 hover:text-cream-200'
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-navy-800 space-y-0.5">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-cream-400 hover:bg-white/5 hover:text-cream-200 transition-all">
          <ArrowLeft size={16} /> Back to Store
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
