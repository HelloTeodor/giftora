import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { User, Package, Heart, MapPin, Settings, LogOut, Shield } from 'lucide-react';

const navLinks = [
  { href: '/account/profile', label: 'Profile', icon: User },
  { href: '/account/orders', label: 'My Orders', icon: Package },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/security', label: 'Security', icon: Shield },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/login?callbackUrl=/account/profile');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-cream-50">
        <div className="section-padding py-8 lg:py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="card-premium p-5 sticky top-24">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-cream-100">
                  <div className="w-12 h-12 rounded-full bg-navy-950 flex items-center justify-center text-white font-bold text-lg">
                    {session.user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-navy-950">{session.user.name}</p>
                    <p className="text-xs text-cream-500 truncate">{session.user.email}</p>
                  </div>
                </div>
                <nav className="space-y-1">
                  {navLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-navy-700 hover:bg-cream-50 hover:text-gold-600 transition-colors"
                    >
                      <Icon size={16} /> {label}
                    </Link>
                  ))}
                  <div className="pt-2 mt-2 border-t border-cream-100">
                    <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut size={16} /> Sign Out
                    </Link>
                  </div>
                </nav>
              </div>
            </aside>

            {/* Content */}
            <main className="lg:col-span-3">{children}</main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
