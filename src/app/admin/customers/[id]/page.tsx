import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { isAdmin } from '@/lib/utils';
import Link from 'next/link';
import { formatDate, formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils';
import { ChevronLeft, Mail, Phone, MapPin, Heart, Star, ShoppingBag, Shield, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { AdminDeleteCustomerButton } from '@/components/admin/AdminDeleteCustomerButton';
import type { Metadata } from 'next';

interface Props { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: 'Customer Detail — Giftora Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminCustomerDetailPage({ params }: Props) {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) redirect('/login');

  const { id } = await params;

  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: { select: { productName: true, quantity: true, total: true, image: true }, take: 2 } },
      },
      reviews: {
        orderBy: { createdAt: 'desc' },
        include: { product: { select: { name: true, slug: true } } },
        take: 10,
      },
      addresses: {
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      },
      accounts: { select: { provider: true } },
      wishlistItems: {
        include: {
          product: {
            include: {
              images: { orderBy: { sortOrder: 'asc' }, take: 1 },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: { select: { orders: true, reviews: true, wishlistItems: true } },
    },
  });

  if (!customer) notFound();

  const paidOrders = customer.orders.filter(o => o.paymentStatus === 'PAID');
  const totalSpent = paidOrders.reduce((s, o) => s + Number(o.total), 0);
  const avgOrderValue = paidOrders.length > 0 ? totalSpent / paidOrders.length : 0;
  const oauthProviders = customer.accounts.map(a => a.provider).filter(p => p !== 'credentials');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/admin/customers" className="text-gray-400 hover:text-gray-600 transition-colors mt-1">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-navy-900">{customer.name || customer.email}</h1>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${customer.deletedAt ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
              {customer.deletedAt ? 'Deleted' : 'Active'}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-navy-100 text-navy-700">{customer.role}</span>
          </div>
          <p className="text-gray-400 text-sm mt-1">Member since {formatDate(customer.createdAt)}</p>
        </div>
        {!customer.deletedAt && (
          <AdminDeleteCustomerButton
            customerId={customer.id}
            customerName={customer.name || customer.email}
          />
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: customer._count.orders, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
          { label: 'Total Spent', value: formatPrice(totalSpent), icon: null, color: 'text-gold-700 bg-gold-50' },
          { label: 'Avg. Order', value: formatPrice(avgOrderValue), icon: null, color: 'text-purple-600 bg-purple-50' },
          { label: 'Wishlist', value: customer._count.wishlistItems, icon: Heart, color: 'text-pink-600 bg-pink-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-card p-5">
            <div className="flex items-center gap-2 mb-2">
              {Icon && <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}><Icon size={14} /></div>}
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{label}</p>
            </div>
            <p className="text-2xl font-bold text-navy-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Account Details */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 className="font-semibold text-navy-900 mb-5 flex items-center gap-2">
            <Shield size={16} className="text-gold-500" /> Account Details
          </h2>
          <dl className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail size={15} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <dt className="text-xs text-gray-400 font-medium">Email</dt>
                <dd className="font-medium text-gray-900 mt-0.5">{customer.email}</dd>
                <dd className="text-xs mt-0.5">
                  {customer.emailVerified
                    ? <span className="text-green-600 flex items-center gap-1"><CheckCircle size={10} /> Verified {formatDate(customer.emailVerified)}</span>
                    : <span className="text-amber-600 flex items-center gap-1"><XCircle size={10} /> Not verified</span>}
                </dd>
              </div>
            </div>

            {customer.phone && (
              <div className="flex items-start gap-3">
                <Phone size={15} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <dt className="text-xs text-gray-400 font-medium">Phone</dt>
                  <dd className="font-medium text-gray-900 mt-0.5">{customer.phone}</dd>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar size={15} className="text-gray-400 mt-0.5 shrink-0" />
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex-1">
                <div>
                  <dt className="text-xs text-gray-400 font-medium">First Name</dt>
                  <dd className="font-medium text-gray-900 mt-0.5">{customer.firstName || '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 font-medium">Last Name</dt>
                  <dd className="font-medium text-gray-900 mt-0.5">{customer.lastName || '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 font-medium">Loyalty Points</dt>
                  <dd className="font-medium text-gray-900 mt-0.5 flex items-center gap-1">
                    <Star size={11} className="text-gold-500 fill-gold-500" /> {customer.loyaltyPoints}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 font-medium">Newsletter</dt>
                  <dd className="mt-0.5">{customer.newsletterOptIn
                    ? <span className="text-green-600 text-xs font-medium">Subscribed</span>
                    : <span className="text-gray-400 text-xs">Not subscribed</span>}</dd>
                </div>
              </div>
            </div>

            {oauthProviders.length > 0 && (
              <div className="flex items-start gap-3">
                <Shield size={15} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <dt className="text-xs text-gray-400 font-medium">Connected via</dt>
                  <dd className="mt-0.5 flex gap-2">
                    {oauthProviders.map(p => (
                      <span key={p} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full capitalize font-medium">{p}</span>
                    ))}
                  </dd>
                </div>
              </div>
            )}
          </dl>
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 className="font-semibold text-navy-900 mb-5 flex items-center gap-2">
            <MapPin size={16} className="text-gold-500" /> Addresses ({customer.addresses.length})
          </h2>
          {customer.addresses.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">No saved addresses</p>
          ) : (
            <div className="space-y-4">
              {customer.addresses.map(addr => (
                <div key={addr.id} className={`p-4 rounded-xl border text-sm ${addr.isDefault ? 'border-gold-200 bg-gold-50/40' : 'border-gray-100 bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-gray-900">{addr.firstName} {addr.lastName}</p>
                    {addr.isDefault && <span className="text-xs bg-gold-100 text-gold-700 px-2 py-0.5 rounded-full font-medium">Default</span>}
                    {addr.label && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{addr.label}</span>}
                  </div>
                  {addr.company && <p className="text-gray-600">{addr.company}</p>}
                  <address className="not-italic text-gray-600 leading-relaxed">
                    {addr.addressLine1}
                    {addr.addressLine2 && `, ${addr.addressLine2}`}<br />
                    {addr.city}, {addr.postalCode}<br />
                    {addr.state && `${addr.state}, `}{addr.country}
                  </address>
                  {addr.phone && <p className="text-gray-500 mt-1">{addr.phone}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-navy-900">Orders ({customer._count.orders})</h2>
          {paidOrders.length > 0 && (
            <span className="text-sm text-gray-400">{formatPrice(totalSpent)} total spent</span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Items</th>
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
                  <td className="px-6 py-3 text-sm text-gray-500 hidden sm:table-cell">
                    {order.items.map(i => i.productName).join(', ').substring(0, 40) || '—'}
                    {order.items.length > 1 && ` +${order.items.length - 1}`}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-400">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-3 text-sm font-bold text-gray-900">{formatPrice(Number(order.total))}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {ORDER_STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/admin/orders/${order.id}`} className="text-xs text-gold-600 hover:underline font-medium">View</Link>
                  </td>
                </tr>
              ))}
              {customer.orders.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wishlist — always shown */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Heart size={16} className="text-pink-500 fill-pink-500" />
          <h2 className="font-semibold text-navy-900">Wishlist ({customer._count.wishlistItems} {customer._count.wishlistItems === 1 ? 'item' : 'items'})</h2>
        </div>
        {customer.wishlistItems.length === 0 ? (
          <p className="px-6 py-8 text-center text-gray-400 text-sm">No wishlist items found</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {customer.wishlistItems.map(({ product, createdAt }) => {
              const price = Number(product.salePrice || product.basePrice);
              const wasPrice = product.salePrice ? Number(product.basePrice) : null;
              const img = product.images[0]?.url;
              return (
                <div key={product.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0 overflow-hidden border border-gray-100">
                    {img
                      ? <img src={img} alt={product.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center">
                          <Heart size={18} className="text-gray-300" />
                        </div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${product.slug}`}
                      target="_blank"
                      className="font-semibold text-gray-900 hover:text-gold-600 transition-colors"
                    >
                      {product.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-bold text-gold-700">{formatPrice(price)}</span>
                      {wasPrice && (
                        <span className="text-xs text-gray-400 line-through">{formatPrice(wasPrice)}</span>
                      )}
                      {product.salePrice && (
                        <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">Sale</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400">Added</p>
                    <p className="text-xs font-medium text-gray-600">{formatDate(createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reviews */}
      {customer.reviews.length > 0 && (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Star size={16} className="text-gold-500 fill-gold-500" />
            <h2 className="font-semibold text-navy-900">Reviews ({customer._count.reviews})</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {customer.reviews.map(review => (
              <div key={review.id} className="px-6 py-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < review.rating ? 'text-gold-500' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                  <Link href={`/products/${review.product.slug}`} className="text-xs text-gold-600 hover:underline font-medium">
                    {review.product.name}
                  </Link>
                  <span className="text-xs text-gray-400 ml-auto">{formatDate(review.createdAt)}</span>
                </div>
                {review.title && <p className="font-semibold text-sm text-gray-900">{review.title}</p>}
                <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">{review.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
