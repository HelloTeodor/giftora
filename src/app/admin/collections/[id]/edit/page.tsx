import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { isAdmin } from '@/lib/utils';
import { CollectionForm } from '@/components/admin/CollectionForm';
import type { Metadata } from 'next';

interface Props { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: 'Edit Collection — Giftora Admin' };

export default async function EditCollectionPage({ params }: Props) {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) redirect('/login');

  const { id } = await params;

  const [collection, products] = await Promise.all([
    prisma.collection.findUnique({
      where: { id },
      include: { products: { select: { id: true } } },
    }),
    prisma.product.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!collection) notFound();

  const initialData = {
    ...collection,
    productIds: collection.products.map((p) => p.id),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Edit Collection</h1>
        <p className="text-gray-500 mt-1">{collection.name}</p>
      </div>
      <CollectionForm products={products} initialData={initialData} collectionId={id} />
    </div>
  );
}
