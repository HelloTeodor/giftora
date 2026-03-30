import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { isAdmin } from '@/lib/utils';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { CategoryForm } from '@/components/admin/CategoryForm';

export const metadata = { title: 'Edit Category — Giftora Admin' };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) redirect('/login');

  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/categories" className="hover:text-navy-700">Categories</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-navy-900 font-medium">Edit</span>
      </div>
      <h1 className="text-2xl font-bold text-navy-900 mb-8">Edit: {category.name}</h1>
      <CategoryForm category={category} />
    </div>
  );
}
