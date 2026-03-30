import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/utils';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { AdminCategoryActions } from '@/components/admin/AdminCategoryActions';

export const metadata = { title: 'Categories — Giftora Admin' };

export default async function AdminCategoriesPage() {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) redirect('/login');

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Categories</h1>
          <p className="text-gray-500 mt-1">{categories.length} categories</p>
        </div>
        <Link href="/admin/categories/new" className="btn-gold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Category
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center text-lg">
                        {cat.icon ?? '🎁'}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-navy-900">{cat.name}</p>
                      {cat.description && (
                        <p className="text-xs text-gray-400 truncate max-w-xs">{cat.description}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{cat.slug}</td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-navy-900">{cat._count.products}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {cat.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-500">{cat.sortOrder}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/categories/${cat.id}/edit`}
                      className="text-sm text-navy-700 hover:text-navy-900 font-medium"
                    >
                      Edit
                    </Link>
                    <AdminCategoryActions categoryId={cat.id} productCount={cat._count.products} />
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-gray-400">
                  No categories yet. <Link href="/admin/categories/new" className="text-gold-600 underline">Create one</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
