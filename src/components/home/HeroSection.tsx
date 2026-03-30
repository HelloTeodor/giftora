'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Gift, Star, Truck, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { value: '10k+', label: 'Happy Customers' },
  { value: '50+', label: 'Gift Collections' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '2-day', label: 'Fast Delivery' },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-navy-gradient min-h-[85vh] flex items-center">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-20" />

      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />

      <div className="section-padding relative z-10 w-full py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 rounded-full px-4 py-1.5 mb-6">
              <Gift size={14} className="text-gold-400" />
              <span className="text-gold-300 text-xs font-medium tracking-wide uppercase">Premium Gift Boxes</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Give the Gift of{' '}
              <span className="text-transparent bg-clip-text bg-gold-gradient">
                Pure Joy
              </span>
            </h1>

            <p className="text-cream-300 text-lg leading-relaxed mb-8 max-w-lg">
              Beautifully curated gift boxes for every occasion. From new hires to newborns, birthdays to Christmas — we make every moment unforgettable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/products" className="btn-gold inline-flex items-center gap-2 text-base">
                Shop Gift Boxes <ArrowRight size={18} />
              </Link>
              <Link href="/categories" className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-all font-medium">
                Explore Occasions
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-gold-400 font-serif">{stat.value}</p>
                  <p className="text-cream-400 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — hero images collage */}
          <div className="relative hidden lg:block">
            <div className="relative h-[520px]">
              {/* Main image */}
              <div className="absolute top-0 right-0 w-72 h-80 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600"
                  alt="Premium gift box"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Secondary image */}
              <div className="absolute bottom-0 left-0 w-64 h-72 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600"
                  alt="Christmas gift box"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-premium p-4 w-48 z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center">
                    <Star size={14} className="text-gold-600 fill-gold-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy-950">4.9 / 5</p>
                    <p className="text-xs text-cream-500">10,000+ reviews</p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-200 to-cream-300 border-2 border-white" />
                  ))}
                  <div className="w-7 h-7 rounded-full bg-navy-950 border-2 border-white flex items-center justify-center text-xs text-white font-bold">+</div>
                </div>
              </div>
              {/* Shipping badge */}
              <div className="absolute bottom-16 right-0 bg-navy-800 rounded-xl p-3 flex items-center gap-2 shadow-lg">
                <Truck size={16} className="text-gold-400" />
                <div>
                  <p className="text-white text-xs font-semibold">Free Shipping</p>
                  <p className="text-cream-400 text-xs">Orders over €75</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L48 51.5C96 43 192 26 288 22.2C384 18.3 480 27.7 576 35.2C672 42.7 768 48.3 864 46.8C960 45.3 1056 36.7 1152 31.5C1248 26.3 1344 24.7 1392 23.8L1440 23V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="#faf7f2"/>
        </svg>
      </div>
    </section>
  );
}
