import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Edit Product | Admin' };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
  ]);

  if (!product) notFound();

  const serialized = {
    ...product,
    id: product.id,
    basePrice: Number(product.basePrice),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-6">Edit: {product.name}</h1>
      <ProductForm categories={categories} product={serialized as any} />
    </div>
  );
}
