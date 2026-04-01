import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
}

const categoryImages: Record<string, string> = {
  'new-hire': 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&auto=format&fit=crop',
  'christmas': 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&auto=format&fit=crop',
  'birthday': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&auto=format&fit=crop',
  'newborn': 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&auto=format&fit=crop',
  'valentines': 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&auto=format&fit=crop',
  'easter': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&auto=format&fit=crop',
  'self-care': 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400&auto=format&fit=crop',
  'corporate': 'https://images.unsplash.com/photo-1497700003451-e1df943a194b?w=400&auto=format&fit=crop',
};

export function CategoriesGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="py-16 lg:py-24 bg-cream-50">
      <div className="section-padding">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-cream-300" />
            <p className="text-gold-600 text-xs font-semibold uppercase tracking-[0.2em]">Shop by Occasion</p>
            <div className="h-px w-12 bg-cream-300" />
          </div>
          <h2 className="font-serif text-3xl lg:text-5xl font-bold text-navy-950 mb-4">
            Find the Perfect Gift
          </h2>
          <p className="text-cream-600 max-w-xl mx-auto">
            Whether it's a celebration, a milestone, or simply showing you care — we have a gift box for every occasion.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((cat, i) => {
            const img = cat.image || categoryImages[cat.slug];
            const isLarge = i === 0 || i === 3;
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className={`group relative overflow-hidden rounded-2xl ${
                  isLarge ? 'sm:col-span-1' : ''
                }`}
              >
                <div className="aspect-square relative">
                  {img ? (
                    <Image
                      src={img}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-cream-200 flex items-center justify-center text-5xl">
                      {cat.icon}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
                    <span className="text-2xl mb-1">{cat.icon}</span>
                    <h3 className="font-serif text-white font-semibold text-base lg:text-lg leading-tight">
                      {cat.name}
                    </h3>
                    <span className="mt-2 inline-flex items-center gap-1 text-gold-300 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Shop now <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link href="/categories" className="btn-outline inline-flex items-center gap-2">
            View All Occasions <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
