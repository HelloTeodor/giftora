import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/utils';
import { CollectionForm } from '@/components/admin/CollectionForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'New Collection — Giftora Admin' };

export default async function NewCollectionPage() {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) redirect('/login');

  const products = await prisma.product.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">New Collection</h1>
        <p className="text-gray-500 mt-1">Create a new product collection</p>
      </div>
      <CollectionForm products={products} />
    </div>
  );
}
