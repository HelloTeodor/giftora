import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'New Product | Admin' };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-6">Add New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
