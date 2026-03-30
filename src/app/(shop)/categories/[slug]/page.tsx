import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/shop/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) return { title: 'Category Not Found' };
  return { title: `${cat.name} Gift Boxes`, description: cat.description || undefined };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
  });
  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, status: 'ACTIVE' },
    include: { images: { orderBy: { sortOrder: 'asc' } }, category: true },
    orderBy: [{ featured: 'desc' }, { soldCount: 'desc' }],
  });

  const serialized = products.map(p => ({
    ...p,
    basePrice: Number(p.basePrice),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    rating: Number(p.rating),
  }));

  return (
    <div>
      {/* Header */}
      <div className="bg-navy-gradient py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="relative z-10">
          <div className="text-5xl mb-4">{category.icon}</div>
          <h1 className="font-serif text-4xl font-bold text-white mb-3">{category.name}</h1>
          {category.description && <p className="text-cream-300 max-w-lg mx-auto">{category.description}</p>}
          <div className="flex items-center justify-center gap-2 mt-4 text-cream-400 text-sm">
            <Link href="/" className="hover:text-gold-400">Home</Link>
            <ArrowRight size={12} />
            <Link href="/categories" className="hover:text-gold-400">Occasions</Link>
            <ArrowRight size={12} />
            <span className="text-cream-200">{category.name}</span>
          </div>
        </div>
      </div>

      <div className="section-padding py-12">
        {serialized.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-xl text-navy-700 mb-4">Coming soon!</p>
            <p className="text-cream-500">We're curating the perfect {category.name.toLowerCase()} gift boxes. Check back soon!</p>
          </div>
        ) : (
          <>
            <p className="text-cream-500 text-sm mb-8">{serialized.length} gift boxes available</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {serialized.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
