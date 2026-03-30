import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { ProductsClient } from '@/components/shop/ProductsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Gift Boxes',
  description: 'Browse our full collection of premium gift boxes for every occasion.',
};

async function getProducts(searchParams: Record<string, string | undefined>) {
  const { q, category, sort, minPrice, maxPrice, sale, featured, page } = searchParams;
  const pageNum = Number(page) || 1;
  const perPage = 12;
  const skip = (pageNum - 1) * perPage;

  const where: Record<string, unknown> = {
    status: 'ACTIVE',
    ...(q && {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { shortDesc: { contains: q, mode: 'insensitive' } },
      ],
    }),
    ...(category && { category: { slug: category } }),
    ...(sale === 'true' && { salePrice: { not: null } }),
    ...(featured === 'true' && { featured: true }),
    ...((minPrice || maxPrice) && {
      basePrice: {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      },
    }),
  };

  const orderBy: Record<string, string> =
    sort === 'price-asc' ? { basePrice: 'asc' }
    : sort === 'price-desc' ? { basePrice: 'desc' }
    : sort === 'rating' ? { rating: 'desc' }
    : sort === 'newest' ? { createdAt: 'desc' }
    : { soldCount: 'desc' };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      take: perPage,
      skip,
      orderBy,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: true,
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
  ]);

  return {
    products: products.map((p) => ({
      ...p,
      basePrice: Number(p.basePrice),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
      rating: Number(p.rating),
    })),
    total,
    totalPages: Math.ceil(total / perPage),
    page: pageNum,
    categories,
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const data = await getProducts(await searchParams);

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-white border-b border-cream-200 py-12">
        <div className="section-padding text-center">
          <p className="text-gold-600 text-sm font-semibold uppercase tracking-widest mb-3">Our Collection</p>
          <h1 className="font-serif text-4xl font-bold text-navy-950">All Gift Boxes</h1>
          <p className="text-cream-500 mt-3 max-w-lg mx-auto">
            Discover our complete range of premium gift boxes, curated for every occasion and budget.
          </p>
        </div>
      </div>
      <Suspense fallback={<div className="h-96" />}>
        <ProductsClient initialData={data} />
      </Suspense>
    </div>
  );
}
