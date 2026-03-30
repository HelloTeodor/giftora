import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Collections' };

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: { products: { take: 1, include: { images: { take: 1 } } } },
  });

  return (
    <div>
      <div className="bg-cream-50 border-b border-cream-200 py-16 text-center">
        <p className="text-gold-600 text-sm font-semibold uppercase tracking-widest mb-3">Curated for You</p>
        <h1 className="font-serif text-4xl font-bold text-navy-950 mb-3">Our Collections</h1>
        <p className="text-cream-500 max-w-lg mx-auto">Handpicked gift box sets for special moments and people.</p>
      </div>
      <div className="section-padding py-12">
        {collections.length === 0 ? (
          <div className="text-center py-20 text-cream-400">
            <p className="font-serif text-xl">Collections coming soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map(col => (
              <Link key={col.id} href={`/collections/${col.slug}`} className="group card-premium overflow-hidden">
                <div className="aspect-video relative overflow-hidden bg-cream-100">
                  {col.image ? <Image src={col.image} alt={col.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /> : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h2 className="font-serif text-xl font-bold">{col.name}</h2>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <p className="text-cream-500 text-sm">{col.description}</p>
                  <ArrowRight size={16} className="text-cream-300 group-hover:text-gold-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
