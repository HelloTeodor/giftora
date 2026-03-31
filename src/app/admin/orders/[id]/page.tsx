import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { isAdmin } from '@/lib/utils';
import Link from 'next/link';
import { formatDate, formatPrice } from '@/lib/utils';
import { ChevronLeft, CreditCard, Truck, Package } from 'lucide-react';
import { AdminOrderStatusUpdater } from '@/components/admin/AdminOrderStatusUpdater';
import { AdminDeleteOrderButton } from '@/components/admin/AdminDeleteOrderButton';
import type { Metadata } from 'next';

interface Props { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: 'Order — Giftora Admin' };

export default async function AdminOrderDetailPage({ params }: Props) {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) redirect('/login');

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: true,
      shippingAddress: true,
      billingAddress: true,
    },
  });

  if (!order) notFound();

  const customerName = order.user?.name || 'Guest';
  const customerEmail = order.user?.email || order.guestEmail || '—';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/orders" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Order #{order.orderNumber}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <AdminOrderStatusUpdater orderId={order.id} currentStatus={order.status} />
          <AdminDeleteOrderButton orderId={order.id} orderNumber={order.orderNumber} redirectAfter />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: formatPrice(Number(order.total)) },
          { label: 'Payment Status', value: order.paymentStatus },
          { label: 'Order Status', value: order.status },
          { label: 'Items', value: String(order.items.length) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl shadow-card p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{label}</p>
            <p className="text-lg font-bold text-navy-900 mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Customer */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
            <Package size={16} className="text-gold-500" /> Customer
          </h2>
          <p className="font-medium text-gray-900">{customerName}</p>
          <p className="text-sm text-gray-500">{customerEmail}</p>
          {order.user && (
            <Link href={`/admin/customers/${order.user.id}`} className="text-xs text-gold-600 hover:underline mt-2 inline-block">
              View customer →
            </Link>
          )}
          {!order.user && order.guestEmail && (
            <p className="text-xs text-gray-400 mt-1">Guest checkout</p>
          )}
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
            <CreditCard size={16} className="text-gold-500" /> Payment Details
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Method</span>
              <span className="font-medium text-gray-900">{order.paymentMethod || 'Stripe'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className={`font-semibold ${order.paymentStatus === 'PAID' ? 'text-green-600' : order.paymentStatus === 'FAILED' ? 'text-red-500' : 'text-yellow-600'}`}>
                {order.paymentStatus}
              </span>
            </div>
            {order.paidAt && (
              <div className="flex justify-between">
                <span className="text-gray-500">Paid at</span>
                <span className="text-gray-900">{formatDate(order.paidAt)}</span>
              </div>
            )}
            {order.paymentIntentId && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-0.5">Stripe Payment ID</p>
                <p className="font-mono text-xs text-gray-600 break-all">{order.paymentIntentId}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
              <Truck size={16} className="text-gold-500" /> Delivery Address
            </h2>
            <address className="not-italic text-sm text-gray-600 space-y-0.5">
              <p className="font-medium text-gray-900">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              {order.shippingAddress.company && <p className="text-gray-500">{order.shippingAddress.company}</p>}
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
              {order.shippingAddress.phone && <p className="text-gray-500 mt-1">{order.shippingAddress.phone}</p>}
            </address>
          </div>
        )}

        {/* Shipping Method */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
            <Truck size={16} className="text-gold-500" /> Shipping
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Method</span>
              <span className="font-medium text-gray-900">
                {order.shippingMethod === 'STANDARD' ? 'Standard (3–5 days)' :
                 order.shippingMethod === 'EXPRESS' ? 'Express (1–2 days)' :
                 order.shippingMethod === 'OVERNIGHT' ? 'Next Day' :
                 order.shippingMethod || '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping cost</span>
              <span className="text-gray-900">
                {Number(order.shippingCost) === 0 ? 'Free' : formatPrice(Number(order.shippingCost))}
              </span>
            </div>
            {order.couponCode && (
              <div className="flex justify-between text-green-600">
                <span>Coupon ({order.couponCode})</span>
                <span>-{formatPrice(Number(order.discountAmount))}</span>
              </div>
            )}
            {order.trackingNumber && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-0.5">Tracking Number</p>
                <p className="font-mono text-xs text-gray-600">{order.trackingNumber}</p>
                {order.trackingUrl && (
                  <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gold-600 hover:underline mt-1 inline-block">
                    Track shipment →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-navy-900">Items</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.productName} className="w-10 h-10 rounded-lg object-cover" />
                    )}
                    <div>
                      <p className="font-medium text-sm text-gray-900">{item.productName}</p>
                      {item.variantName && <p className="text-xs text-gray-400">{item.variantName}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{item.sku}</td>
                <td className="px-6 py-4 text-sm text-right text-gray-600">{formatPrice(Number(item.price))}</td>
                <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">{item.quantity}</td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">{formatPrice(Number(item.total))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span><span>{formatPrice(Number(order.subtotal))}</span>
          </div>
          {Number(order.shippingCost) > 0 && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span><span>{formatPrice(Number(order.shippingCost))}</span>
            </div>
          )}
          {Number(order.discountAmount) > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span>
              <span>-{formatPrice(Number(order.discountAmount))}</span>
            </div>
          )}
          {Number(order.taxAmount) > 0 && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax</span><span>{formatPrice(Number(order.taxAmount))}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total</span><span>{formatPrice(Number(order.total))}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {(order.customerNote || order.internalNote || order.giftMessage) && (
        <div className="bg-white rounded-xl shadow-card p-6 space-y-3">
          <h2 className="font-semibold text-navy-900">Notes</h2>
          {order.giftMessage && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Gift Message</p>
              <p className="text-sm text-gray-600">{order.giftMessage}</p>
            </div>
          )}
          {order.customerNote && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Customer Note</p>
              <p className="text-sm text-gray-600">{order.customerNote}</p>
            </div>
          )}
          {order.internalNote && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Internal Note</p>
              <p className="text-sm text-gray-600">{order.internalNote}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
