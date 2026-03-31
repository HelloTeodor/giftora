import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/shop/ProductCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await prisma.collection.findUnique({ where: { slug } });
  if (!collection) return { title: 'Collection Not Found' };
  return {
    title: `${collection.name} | Giftora`,
    description: collection.description || undefined,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;

  const collection = await prisma.collection.findUnique({
    where: { slug, isActive: true },
    include: {
      products: {
        where: { status: 'ACTIVE' },
        include: { images: { orderBy: { sortOrder: 'asc' } }, category: true },
        orderBy: { soldCount: 'desc' },
      },
    },
  });

  if (!collection) notFound();

  const serialized = collection.products.map(p => ({
    ...p,
    basePrice: Number(p.basePrice),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    rating: Number(p.rating),
  }));

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <div className="bg-white border-b border-cream-200 py-12">
        <div className="section-padding">
          <nav className="flex items-center gap-2 text-sm text-cream-500 mb-6">
            <Link href="/" className="hover:text-gold-600 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/collections" className="hover:text-gold-600 transition-colors">Collections</Link>
            <ChevronRight size={14} />
            <span className="text-navy-700 font-medium">{collection.name}</span>
          </nav>
          <div className="text-center">
            <p className="text-gold-600 text-sm font-semibold uppercase tracking-widest mb-3">Collection</p>
            <h1 className="font-serif text-4xl font-bold text-navy-950">{collection.name}</h1>
            {collection.description && (
              <p className="text-cream-500 mt-3 max-w-lg mx-auto">{collection.description}</p>
            )}
            <p className="text-cream-400 text-sm mt-2">{serialized.length} gift boxes</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="section-padding py-12">
        {serialized.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-xl text-navy-700 mb-2">No products yet</p>
            <p className="text-cream-500 text-sm mb-6">Check back soon — we're adding more to this collection.</p>
            <Link href="/products" className="btn-gold px-6 py-2.5 text-sm">Shop All Gift Boxes</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serialized.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
