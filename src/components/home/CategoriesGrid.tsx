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
    description: 'Elegant packaging for every special occasion.',
    image: 'https://res.cloudinary.com/dwastb4mg/image/upload/v1775335470/ChatGPT_Image_Apr_1_2026_at_11_13_21_PM_vl6zr5.jpg',
    href: '/products',
  },
  {
    slug: 'luxury',
    name: 'Luxury Packaging',
    description: 'Premium materials with a refined finish.',
    image: 'https://res.cloudinary.com/dwastb4mg/image/upload/v1775335487/ChatGPT_Image_Apr_1_2026_at_11_13_21_PM_1_vlqz2o.jpg',
    href: '/products',
  },
  {
    slug: 'special-gifts',
    name: 'Special Gifts',
    description: 'Thoughtful selections made to impress.',
    image: 'https://res.cloudinary.com/dwastb4mg/image/upload/v1775335480/ChatGPT_Image_Apr_1_2026_at_11_13_21_PM_2_nkavuk.jpg',
    href: '/products',
  },
  {
    slug: 'personalized',
    name: 'Personalized Gifts',
    description: 'One-of-a-kind gifts crafted just for them.',
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

const categoryDescriptions: Record<string, string> = {
  'new-hire':   'Impress your new team members with a thoughtful welcome.',
  'christmas':  'Spread joy and warmth this festive season.',
  'birthday':   'Make their birthday extra memorable.',
  'newborn':    'Welcome the little ones with love.',
  'valentines': 'Share your love with a beautiful gift.',
  'easter':     'Celebrate spring with delightful surprises.',
  'self-care':  'Treat yourself or someone special.',
  'corporate':  'Professional gifts that leave a lasting impression.',
};

export function CategoriesGrid({ categories }: { categories: Category[] }) {
  const cards = categories.slice(0, 4).length === 4
    ? categories.slice(0, 4).map((cat) => ({
        slug: cat.slug,
        name: displayNames[cat.slug] || cat.name,
        description: cat.description || categoryDescriptions[cat.slug] || 'Discover our curated collection.',
        image: cat.image || categoryImages[cat.slug] || fallbackCards[0].image,
        href: `/categories/${cat.slug}`,
      }))
    : fallbackCards;

  return (
    <section className="bg-white">
      <div className="w-[90%] mx-auto py-20">

        {/* Header Row */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif text-[#d39b2c]">
            Featured collections
          </h2>
          <Link
            href="/collections"
            className="text-[#d39b2c] font-semibold hover:translate-x-1 transition-transform inline-block"
          >
            View all
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card) => (
            <Link
              key={card.slug}
              href={card.href}
              className="bg-[#FAF9F6] rounded-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.03] overflow-hidden flex flex-col group"
            >
              <div className="relative aspect-[2/1]">
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4 text-start">
                <h3 className="text-xl font-serif text-gray-800 mb-1">
                  {card.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {card.description}
                </p>
                <span className="text-[#d39b2c] text-lg font-semibold group-hover:translate-x-1 transition-transform inline-block">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
