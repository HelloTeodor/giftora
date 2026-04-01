'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import {
  ShoppingBag, Search, Heart, User, Menu, X, ChevronDown,
  Package, LogOut, Settings, LayoutDashboard, Bell
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { cn, isAdmin } from '@/lib/utils';
import { CartSidebar } from '@/components/shop/CartSidebar';

const navLinks = [
  { label: 'Shop All', href: '/products' },
  {
    label: 'Occasions',
    href: '/categories',
    children: [
      { label: 'New Hire', href: '/categories/new-hire', icon: '🎉' },
      { label: 'Christmas', href: '/categories/christmas', icon: '🎄' },
      { label: 'Birthday', href: '/categories/birthday', icon: '🎂' },
      { label: 'Newborn', href: '/categories/newborn', icon: '👶' },
      { label: "Valentine's Day", href: '/categories/valentines', icon: '❤️' },
      { label: 'Easter', href: '/categories/easter', icon: '🐣' },
      { label: 'Self Care', href: '/categories/self-care', icon: '🌸' },
      { label: 'Corporate', href: '/categories/corporate', icon: '💼' },
    ],
  },
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
];

export function Header() {
  const { data: session } = useSession();
  const { getTotalItems, openCart, isOpen } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const totalItems = getTotalItems();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-navy-950 text-cream-300 text-xs text-center py-2.5 px-4 tracking-[0.14em] uppercase font-medium">
        Free shipping on orders over €75 &nbsp;·&nbsp; Use code <span className="font-bold text-gold-300 tracking-widest">WELCOME10</span> for 10% off your first order
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300 border-b',
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-cream-200'
            : 'bg-white border-cream-200'
        )}
      >
        <div className="section-padding">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex flex-col items-center flex-shrink-0 group">
              <span className="font-serif text-2xl lg:text-3xl font-bold tracking-[0.22em] text-navy-950 group-hover:text-navy-800 transition-colors">
                GIFT<span className="text-gold-500">ORA</span>
              </span>
              <span className="text-[9px] tracking-[0.3em] uppercase text-cream-500 font-medium -mt-0.5 hidden lg:block">Curated Gift Boxes</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8" ref={dropdownRef}>
              {navLinks.map((link) => (
                <div key={link.label} className="relative">
                  {link.children ? (
                    <button
                      className="flex items-center gap-1 text-sm font-medium text-navy-800 hover:text-gold-600 transition-colors group"
                      onClick={() =>
                        setActiveDropdown(activeDropdown === link.label ? null : link.label)
                      }
                      onMouseEnter={() => setActiveDropdown(link.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={cn(
                          'transition-transform',
                          activeDropdown === link.label ? 'rotate-180' : ''
                        )}
                      />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-navy-800 hover:text-gold-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}

                  {/* Dropdown */}
                  {link.children && (
                    <div
                      className={cn(
                        'absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200',
                        activeDropdown === link.label
                          ? 'opacity-100 pointer-events-auto translate-y-0'
                          : 'opacity-0 pointer-events-none -translate-y-2'
                      )}
                      onMouseEnter={() => setActiveDropdown(link.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="bg-white rounded-2xl shadow-premium border border-cream-200 p-4 w-72 grid grid-cols-2 gap-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-cream-50 text-sm text-navy-800 hover:text-gold-600 transition-colors group"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <span className="text-lg">{child.icon}</span>
                            <span className="font-medium">{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-navy-700 hover:text-gold-600 hover:bg-cream-100 rounded-full transition-all"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              {session && (
                <Link
                  href="/account/wishlist"
                  className="p-2 text-navy-700 hover:text-gold-600 hover:bg-cream-100 rounded-full transition-all hidden sm:flex"
                  aria-label="Wishlist"
                >
                  <Heart size={20} />
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={openCart}
                className="p-2 text-navy-700 hover:text-gold-600 hover:bg-cream-100 rounded-full transition-all relative"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gold-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              {/* User */}
              {session ? (
                <div className="relative group hidden sm:block">
                  <button className="flex items-center gap-2 p-1.5 text-navy-700 hover:text-gold-600 hover:bg-cream-100 rounded-full transition-all">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={28}
                        height={28}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 bg-navy-950 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {session.user.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </button>
                  <div className="absolute right-0 top-full pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 -translate-y-1 group-hover:translate-y-0">
                    <div className="bg-white rounded-2xl shadow-premium border border-cream-200 py-2 w-52">
                      <div className="px-4 py-2 border-b border-cream-100 mb-1">
                        <p className="font-semibold text-navy-950 text-sm truncate">{session.user.name}</p>
                        <p className="text-xs text-cream-500 truncate">{session.user.email}</p>
                      </div>
                      {isAdmin(session.user.role) && (
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-navy-700 hover:bg-cream-50 hover:text-gold-600 transition-colors">
                          <LayoutDashboard size={15} /> Admin Dashboard
                        </Link>
                      )}
                      <Link href="/account/orders" className="flex items-center gap-3 px-4 py-2 text-sm text-navy-700 hover:bg-cream-50 hover:text-gold-600 transition-colors">
                        <Package size={15} /> My Orders
                      </Link>
                      <Link href="/account/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-navy-700 hover:bg-cream-50 hover:text-gold-600 transition-colors">
                        <Settings size={15} /> Account Settings
                      </Link>
                      <div className="border-t border-cream-100 mt-1">
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-navy-950 text-white text-sm font-medium rounded-lg hover:bg-navy-800 transition-colors"
                >
                  <User size={15} /> Sign In
                </Link>
              )}

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-navy-700 hover:bg-cream-100 rounded-full transition-all"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="border-t border-cream-200 py-3 animate-fade-in">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gift boxes, occasions..."
                  autoFocus
                  className="input-field text-sm flex-1"
                />
                <button type="submit" className="btn-gold px-5 py-2 text-sm">
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-cream-200 animate-fade-in">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href}
                    className="block py-3 text-navy-800 font-medium border-b border-cream-100"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="grid grid-cols-2 gap-1 pt-1 pb-2 pl-4">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-1.5 py-2 text-sm text-navy-600 hover:text-gold-600"
                          onClick={() => setMobileOpen(false)}
                        >
                          <span>{child.icon}</span> {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {session ? (
                <div className="pt-3 space-y-2">
                  <Link href="/account/orders" className="block py-2 text-navy-700 font-medium" onClick={() => setMobileOpen(false)}>My Orders</Link>
                  <Link href="/account/profile" className="block py-2 text-navy-700 font-medium" onClick={() => setMobileOpen(false)}>Account Settings</Link>
                  {isAdmin(session.user.role) && (
                    <Link href="/admin" className="block py-2 text-gold-600 font-medium" onClick={() => setMobileOpen(false)}>Admin Dashboard</Link>
                  )}
                  <button onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }); }} className="text-red-500 font-medium py-2">
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-3 flex gap-3">
                  <Link href="/login" className="flex-1 text-center py-2.5 bg-navy-950 text-white rounded-lg font-medium" onClick={() => setMobileOpen(false)}>
                    Sign In
                  </Link>
                  <Link href="/register" className="flex-1 text-center py-2.5 border border-gold-400 text-gold-600 rounded-lg font-medium" onClick={() => setMobileOpen(false)}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <CartSidebar />
    </>
  );
}
