export const dynamic = 'force-dynamic';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Package, ArrowRight, ChevronRight } from 'lucide-react';
import { formatDate, formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Orders' };

export default async function OrdersPage() {
  const session = await auth();
  const orders = await prisma.order.findMany({
    where: { userId: session!.user.id },
    include: {
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-navy-950">My Orders</h1>
        <p className="text-cream-500 text-sm mt-1">Track and manage your orders.</p>
      </div>

      {orders.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <Package size={40} className="text-cream-300 mx-auto mb-4" />
          <h3 className="font-serif text-xl text-navy-950 mb-2">No orders yet</h3>
          <p className="text-cream-500 text-sm mb-6">Start gifting and your orders will appear here.</p>
          <Link href="/products" className="btn-gold text-sm px-6 py-2.5 inline-flex items-center gap-2">
            Shop Now <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="card-premium p-5 block hover:shadow-premium transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-navy-950 text-sm">#{order.orderNumber}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <p className="text-cream-500 text-xs">{formatDate(order.createdAt)}</p>
                  <p className="text-sm text-cream-600 mt-1">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-navy-950">{formatPrice(Number(order.total))}</span>
                  <ChevronRight size={16} className="text-cream-300 group-hover:text-gold-500 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
