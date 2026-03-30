import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Customers | Admin' };

export default async function AdminCustomersPage({
  searchParams,
}: { searchParams: { q?: string; page?: string } }) {
  const page = Number(searchParams.page) || 1;
  const perPage = 25;

  const where: Record<string, unknown> = {
    role: 'CUSTOMER',
    ...(searchParams.q && {
      OR: [
        { name: { contains: searchParams.q, mode: 'insensitive' } },
        { email: { contains: searchParams.q, mode: 'insensitive' } },
      ],
    }),
  };

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        _count: { select: { orders: true, reviews: true } },
        orders: { select: { total: true }, where: { paymentStatus: 'PAID' } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500 text-sm mt-1">{total} registered customers</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100">
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3">Joined</th>
                <th className="text-left px-5 py-3">Orders</th>
                <th className="text-left px-5 py-3">Total Spent</th>
                <th className="text-left px-5 py-3">Reviews</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map(c => {
                const totalSpent = c.orders.reduce((s, o) => s + Number(o.total), 0);
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-navy-950 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {c.name?.[0]?.toUpperCase() || c.email[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{c.name || '—'}</p>
                          <p className="text-xs text-gray-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{formatDate(c.createdAt)}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">{c._count.orders}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">€{totalSpent.toFixed(2)}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{c._count.reviews}</td>
                    <td className="px-5 py-4 text-right">
                      <Link href={`/admin/customers/${c.id}`} className="text-xs text-gold-600 hover:underline">View</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
