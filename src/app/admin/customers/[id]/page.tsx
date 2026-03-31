import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { isAdmin } from '@/lib/utils';
import Link from 'next/link';
import { formatDate, formatPrice } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import type { Metadata } from 'next';

interface Props { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: 'Customer — Giftora Admin' };

export default async function AdminCustomerDetailPage({ params }: Props) {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) redirect('/login');

  const { id } = await params;

  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: { take: 1 } },
      },
      reviews: {
        orderBy: { createdAt: 'desc' },
        include: { product: { select: { name: true, slug: true } } },
        take: 10,
      },
      _count: { select: { orders: true, reviews: true } },
    },
  });

  if (!customer) notFound();

  const totalSpent = customer.orders
    .filter(o => o.paymentStatus === 'PAID')
    .reduce((s, o) => s + Number(o.total), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/customers" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">{customer.name || customer.email}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{customer.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Orders', value: customer._count.orders },
          { label: 'Total Spent', value: formatPrice(totalSpent) },
          { label: 'Reviews', value: customer._count.reviews },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl shadow-card p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{label}</p>
            <p className="text-2xl font-bold text-navy-900 mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="font-semibold text-navy-900 mb-4">Account Details</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="text-gray-400">Name</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{customer.name || '—'}</dd>
          </div>
          <div>
            <dt className="text-gray-400">Email</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{customer.email}</dd>
          </div>
          <div>
            <dt className="text-gray-400">Joined</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{formatDate(customer.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-gray-400">Email Verified</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{customer.emailVerified ? formatDate(customer.emailVerified) : 'No'}</dd>
          </div>
        </dl>
      </div>

      {/* Orders */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-navy-900">Orders ({customer._count.orders})</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customer.orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 font-semibold text-sm text-gray-900">#{order.orderNumber}</td>
                <td className="px-6 py-3 text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                <td className="px-6 py-3 text-sm font-semibold text-gray-900">{formatPrice(Number(order.total))}</td>
                <td className="px-6 py-3">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">{order.status}</span>
                </td>
                <td className="px-6 py-3 text-right">
                  <Link href={`/admin/orders/${order.id}`} className="text-xs text-gold-600 hover:underline">View</Link>
                </td>
              </tr>
            ))}
            {customer.orders.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400 text-sm">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reviews */}
      {customer.reviews.length > 0 && (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-navy-900">Recent Reviews</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {customer.reviews.map(review => (
              <div key={review.id} className="px-6 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? 'text-gold-500' : 'text-gray-200'}>★</span>
                    ))}
                  </div>
                  <Link href={`/products/${review.product.slug}`} className="text-xs text-gold-600 hover:underline">
                    {review.product.name}
                  </Link>
                </div>
                {review.title && <p className="font-medium text-sm text-gray-900">{review.title}</p>}
                <p className="text-sm text-gray-600 line-clamp-2">{review.body}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(review.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
