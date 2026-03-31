import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { formatDate, formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils';
import { AdminOrderStatusUpdater } from '@/components/admin/AdminOrderStatusUpdater';
import { AdminDeleteOrderButton } from '@/components/admin/AdminDeleteOrderButton';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Orders | Admin' };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const { status: statusParam, q, page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const perPage = 25;

  const where: Record<string, unknown> = {
    ...(statusParam && statusParam !== 'ALL' && { status: statusParam }),
    ...(q && {
      OR: [
        { orderNumber: { contains: q, mode: 'insensitive' } },
        { guestEmail: { contains: q, mode: 'insensitive' } },
        { user: { email: { contains: q, mode: 'insensitive' } } },
      ],
    }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        user: { select: { name: true, email: true } },
        items: { take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);

  const statuses = ['ALL', 'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">{total} total orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-card flex flex-wrap gap-3 items-center">
        <div className="flex flex-wrap gap-1.5">
          {statuses.map(s => (
            <Link
              key={s}
              href={`/admin/orders?status=${s}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                (statusParam || 'ALL') === s ? 'bg-navy-950 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100">
                <th className="text-left px-5 py-3">Order</th>
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Items</th>
                <th className="text-left px-5 py-3">Total</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900 text-sm">#{order.orderNumber}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">{order.user?.name || 'Guest'}</p>
                    <p className="text-xs text-gray-400">{order.user?.email || order.guestEmail}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{order.items.length}</td>
                  <td className="px-5 py-4 font-semibold text-sm text-gray-900">
                    {formatPrice(Number(order.total))}
                  </td>
                  <td className="px-5 py-4">
                    <AdminOrderStatusUpdater orderId={order.id} currentStatus={order.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/orders/${order.id}`} className="text-xs text-gold-600 hover:underline">
                        View
                      </Link>
                      <AdminDeleteOrderButton orderId={order.id} orderNumber={order.orderNumber} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
