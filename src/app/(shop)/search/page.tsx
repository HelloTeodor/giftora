import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/shop/ProductCard';
import { Search } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Search: "${q}"` : 'Search' };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: rawQ } = await searchParams;
  const q = rawQ || '';

  const products = q.length >= 2
    ? await prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { shortDesc: { contains: q, mode: 'insensitive' } },
            { category: { name: { contains: q, mode: 'insensitive' } } },
          ],
        },
        include: { images: { orderBy: { sortOrder: 'asc' } }, category: true },
        orderBy: [{ featured: 'desc' }, { soldCount: 'desc' }],
      })
    : [];

  const serialized = products.map(p => ({
    ...p,
    basePrice: Number(p.basePrice),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    rating: Number(p.rating),
  }));

  return (
    <div className="section-padding py-12">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-navy-950 mb-1">
          {q ? `Search results for "${q}"` : 'Search'}
        </h1>
        {q && <p className="text-cream-500">{products.length} result{products.length !== 1 ? 's' : ''} found</p>}
      </div>

      {!q && (
        <div className="text-center py-16 text-cream-400">
          <Search size={48} className="mx-auto mb-4 opacity-50" />
          <p className="font-serif text-xl">What are you looking for?</p>
        </div>
      )}

      {q && products.length === 0 && (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto mb-4 text-cream-300" />
          <h2 className="font-serif text-xl text-navy-950 mb-2">No results found</h2>
          <p className="text-cream-500">Try different keywords or browse our collections.</p>
        </div>
      )}

      {serialized.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {serialized.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
