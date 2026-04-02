import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { AdminProductActions } from '@/components/admin/AdminProductActions';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Products | Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const { q, status: statusParam, page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const perPage = 20;

  const where: Record<string, unknown> = {
    ...(q && {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
      ],
    }),
    ...(statusParam && statusParam !== 'ALL' && { status: statusParam }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        images: { take: 1, orderBy: { sortOrder: 'asc' } },
        category: true,
        _count: { select: { orderItems: true, reviews: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);
  const activeFilter = statusParam || 'ALL';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{total} {activeFilter !== 'ALL' ? activeFilter.toLowerCase() : 'total'} products</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 bg-gold-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gold-600 transition-colors">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-card flex flex-wrap gap-3 items-center">
        <form method="GET" className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search products, SKUs..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
          {statusParam && statusParam !== 'ALL' && (
            <input type="hidden" name="status" value={statusParam} />
          )}
        </form>
        <div className="flex gap-2">
          {['ALL', 'ACTIVE', 'DRAFT', 'ARCHIVED'].map(s => (
            <Link
              key={s}
              href={`/admin/products?status=${s}${q ? `&q=${q}` : ''}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeFilter === s
                  ? 'bg-navy-950 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100">
                <th className="text-left px-5 py-3">Product</th>
                <th className="text-left px-5 py-3">Category</th>
                <th className="text-left px-5 py-3">Price</th>
                <th className="text-left px-5 py-3">Stock</th>
                <th className="text-left px-5 py-3">Sales</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">
                    No products found
                  </td>
                </tr>
              )}
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.images[0] ? (
                          <Image src={product.images[0].url} alt={product.name} width={48} height={48} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={18} className="text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{product.category.name}</td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{formatPrice(Number(product.basePrice))}</p>
                      {product.salePrice && (
                        <p className="text-xs text-green-600">Sale: {formatPrice(Number(product.salePrice))}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-600' : product.stock <= 5 ? 'text-amber-600' : 'text-gray-700'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{product._count.orderItems}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      product.status === 'ACTIVE' ? 'bg-green-100 text-green-700'
                      : product.status === 'DRAFT' ? 'bg-gray-100 text-gray-600'
                      : 'bg-red-100 text-red-600'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${product.id}/edit`} className="p-1.5 text-gray-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-all">
                        <Edit size={15} />
                      </Link>
                      <AdminProductActions productId={product.id} productStatus={product.status} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Link
                key={p}
                href={`/admin/products?page=${p}${q ? `&q=${q}` : ''}${statusParam ? `&status=${statusParam}` : ''}`}
                className={`w-9 h-9 rounded-lg text-sm font-medium flex items-center justify-center transition-all ${
                  page === p ? 'bg-navy-950 text-white' : 'border border-gray-200 text-gray-600 hover:border-gold-400'
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
