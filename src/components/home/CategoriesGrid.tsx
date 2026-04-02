import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
}

const fallbackCards = [
  {
    slug: 'gift-boxes',
    name: 'Beautiful Gift Boxes',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop',
    href: '/products',
  },
  {
    slug: 'self-care',
    name: 'Relaxing Spa Gift Sets',
    image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600&auto=format&fit=crop',
    href: '/categories/self-care',
  },
  {
    slug: 'personalized',
    name: 'Personalized Gifts',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&auto=format&fit=crop',
    href: '/products',
  },
];

const displayNames: Record<string, string> = {
  'new-hire':  'Corporate Gift Boxes',
  'christmas': 'Christmas Spirit Gift Sets',
  'birthday':  'Birthday Surprise Box',
};

const categoryImages: Record<string, string> = {
  'new-hire':  'https://i.pinimg.com/1200x/81/f9/d0/81f9d00a58dcc5b99b979faf4e626a46.jpg',
  'christmas': 'https://i.imgur.com/axKWpfD.jpeg',
  'birthday':  'https://i.imgur.com/MzTsBQi.jpeg',
  'newborn':   'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&auto=format&fit=crop',
  'valentines':'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop',
  'easter':    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&auto=format&fit=crop',
  'self-care': 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600&auto=format&fit=crop',
  'corporate': 'https://images.unsplash.com/photo-1497700003451-e1df943a194b?w=600&auto=format&fit=crop',
};

export function CategoriesGrid({ categories }: { categories: Category[] }) {
  // Use first 3 real categories, or fallback cards
  const cards = categories.slice(0, 3).length === 3
    ? categories.slice(0, 3).map((cat) => ({
        slug: cat.slug,
        name: displayNames[cat.slug] || cat.name,
        image: cat.image || categoryImages[cat.slug] || fallbackCards[0].image,
        href: `/categories/${cat.slug}`,
      }))
    : fallbackCards;

  return (
    <section className="py-14 lg:py-20 bg-white">
      <div className="section-padding">
        <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-gold-500 mb-8">
          Featured Collections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card) => (
            <div key={card.slug} className="flex flex-col items-center text-center group bg-cream-100 rounded-xl overflow-hidden shadow-card">
              {/* Image — full width, flush top */}
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {/* Text area */}
              <div className="px-5 pt-5 pb-7 w-full">
                <h3 className="font-serif text-xl font-semibold text-navy-950 mb-4">
                  {card.name}
                </h3>
                <Link href={card.href} className="btn-gold px-8">
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-right">
          <Link href="/collections" className="text-gold-500 font-semibold hover:text-gold-600 transition-colors">
            View all →
          </Link>
        </div>
      </div>
    </section>
  );
}
