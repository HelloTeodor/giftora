import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/utils';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { AdminCollectionActions } from '@/components/admin/AdminCollectionActions';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Collections — Giftora Admin' };

export default async function AdminCollectionsPage() {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) redirect('/login');

  const collections = await prisma.collection.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Collections</h1>
          <p className="text-gray-500 mt-1">{collections.length} collections</p>
        </div>
        <Link href="/admin/collections/new" className="btn-gold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Collection
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Collection</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {collections.map((col) => (
              <tr key={col.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {col.image ? (
                      <img src={col.image} alt={col.name} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center text-lg">
                        🎁
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-navy-900">{col.name}</p>
                      {col.description && (
                        <p className="text-xs text-gray-400 truncate max-w-xs">{col.description}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{col.slug}</td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-navy-900">{col._count.products}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${col.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {col.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-500">{col.sortOrder}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/collections/${col.id}/edit`}
                      className="text-sm text-navy-700 hover:text-navy-900 font-medium"
                    >
                      Edit
                    </Link>
                    <AdminCollectionActions collectionId={col.id} />
                  </div>
                </td>
              </tr>
            ))}
            {collections.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-gray-400">
                  No collections yet. <Link href="/admin/collections/new" className="text-gold-600 underline">Create one</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
