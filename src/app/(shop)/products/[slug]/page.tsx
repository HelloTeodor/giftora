import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductDetail } from '@/components/shop/ProductDetail';
import { ProductCard } from '@/components/shop/ProductCard';
import type { Metadata } from 'next';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, shortDesc: true, metaTitle: true, metaDesc: true },
  });
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.metaTitle || product.name,
    description: product.metaDesc || product.shortDesc || undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug, status: 'ACTIVE' },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: true,
      tags: true,
      variants: true,
      reviews: {
        where: { status: 'APPROVED' },
        include: { user: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: {
      status: 'ACTIVE',
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
    include: { images: { orderBy: { sortOrder: 'asc' } }, category: true },
    orderBy: { soldCount: 'desc' },
  });

  const serialized = {
    ...product,
    basePrice: Number(product.basePrice),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
    rating: Number(product.rating),
    variants: product.variants.map(v => ({
      ...v,
      price: v.price ? Number(v.price) : null,
      salePrice: v.salePrice ? Number(v.salePrice) : null,
      options: (v.options ?? {}) as Record<string, string>,
    })),
  };

  const serializedRelated = related.map(p => ({
    ...p,
    basePrice: Number(p.basePrice),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    rating: Number(p.rating),
  }));

  return (
    <div className="bg-white">
      <ProductDetail product={serialized} />

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-16 bg-cream-50">
          <div className="section-padding">
            <h2 className="font-serif text-2xl font-bold text-navy-950 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {serializedRelated.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
