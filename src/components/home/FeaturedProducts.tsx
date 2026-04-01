import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/shop/ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDesc?: string | null;
  basePrice: number;
  salePrice?: number | null;
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  images: { url: string; isPrimary: boolean }[];
  category: { name: string; slug: string };
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="section-padding">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-cream-300" />
              <p className="text-gold-600 text-xs font-semibold uppercase tracking-[0.2em]">Our Bestsellers</p>
            </div>
            <h2 className="font-serif text-3xl lg:text-5xl font-bold text-navy-950">
              Featured Gift Boxes
            </h2>
          </div>
          <Link
            href="/products?featured=true"
            className="hidden sm:flex items-center gap-2 text-gold-600 font-medium hover:gap-3 transition-all"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10 sm:hidden">
          <Link href="/products?featured=true" className="btn-outline inline-flex items-center gap-2">
            View All Boxes <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
