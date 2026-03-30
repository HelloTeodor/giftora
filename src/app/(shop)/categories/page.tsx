import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop by Occasion',
  description: 'Find the perfect gift box for every occasion — new hires, birthdays, Christmas, and more.',
};

const categoryImages: Record<string, string> = {
  'new-hire': 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500',
  'christmas': 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500',
  'birthday': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500',
  'newborn': 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500',
  'valentines': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
  'easter': 'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=500',
  'self-care': 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=500',
  'corporate': 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=500',
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="bg-cream-50 border-b border-cream-200 py-16 text-center">
        <p className="text-gold-600 text-sm font-semibold uppercase tracking-widest mb-3">Shop by Occasion</p>
        <h1 className="font-serif text-4xl font-bold text-navy-950 mb-3">Every Occasion, Perfectly Gifted</h1>
        <p className="text-cream-500 max-w-lg mx-auto">Browse our curated gift box collections for every milestone and celebration.</p>
      </div>

      <div className="section-padding py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map(cat => {
            const img = cat.image || categoryImages[cat.slug];
            return (
              <Link key={cat.id} href={`/categories/${cat.slug}`} className="group card-premium overflow-hidden">
                <div className="aspect-[4/3] relative overflow-hidden">
                  {img ? (
                    <Image src={img} alt={cat.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 640px) 100vw, 50vw" />
                  ) : (
                    <div className="w-full h-full bg-cream-100 flex items-center justify-center text-5xl">{cat.icon}</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xl">{cat.icon}</span>
                        <h2 className="font-serif font-semibold text-navy-950 group-hover:text-gold-600 transition-colors">{cat.name}</h2>
                      </div>
                      <p className="text-xs text-cream-500">{cat._count.products} gift boxes</p>
                    </div>
                    <ArrowRight size={16} className="text-cream-300 group-hover:text-gold-500 transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
