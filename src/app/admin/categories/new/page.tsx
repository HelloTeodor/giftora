import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/utils';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { CategoryForm } from '@/components/admin/CategoryForm';

export const metadata = { title: 'New Category — Giftora Admin' };

export default async function NewCategoryPage() {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) redirect('/login');

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/categories" className="hover:text-navy-700">Categories</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-navy-900 font-medium">New Category</span>
      </div>
      <h1 className="text-2xl font-bold text-navy-900 mb-8">Create Category</h1>
      <CategoryForm />
    </div>
  );
}
