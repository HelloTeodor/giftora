import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CheckCircle } from 'lucide-react';
import { formatDate, formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Order Details' };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, userId: session!.user.id },
    include: {
      items: true,
      shippingAddress: true,
      statusHistory: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!order) notFound();

  const statusSteps = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/account/orders" className="text-cream-500 hover:text-navy-700 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy-950">Order #{order.orderNumber}</h1>
          <p className="text-cream-500 text-sm">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* Progress */}
      {!['CANCELLED', 'REFUNDED'].includes(order.status) && (
        <div className="card-premium p-6">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, i) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    i <= currentStep ? 'bg-gold-500 text-white' : 'bg-cream-100 text-cream-400'
                  }`}>
                    {i < currentStep ? <CheckCircle size={16} /> : <span className="text-xs font-bold">{i + 1}</span>}
                  </div>
                  <span className="text-xs text-cream-500 mt-1 hidden sm:block whitespace-nowrap">
                    {ORDER_STATUS_LABELS[step]}
                  </span>
                </div>
                {i < statusSteps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full ${i < currentStep ? 'bg-gold-400' : 'bg-cream-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tracking */}
      {order.trackingNumber && (
        <div className="card-premium p-5 flex items-center gap-3">
          <Truck size={20} className="text-gold-500" />
          <div>
            <p className="font-medium text-navy-950 text-sm">Tracking Number: <span className="text-gold-600">{order.trackingNumber}</span></p>
            {order.trackingUrl && (
              <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gold-600 hover:underline">
                Track Package →
              </a>
            )}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Items */}
        <div className="card-premium p-6">
          <h2 className="font-serif text-lg font-semibold text-navy-950 mb-4">Items Ordered</h2>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <div className="w-12 h-12 rounded-lg bg-cream-100 flex-shrink-0 flex items-center justify-center">
                  {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover rounded-lg" /> : <Package size={18} className="text-cream-300" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-navy-950 truncate">{item.productName}</p>
                  {item.variantName && <p className="text-xs text-cream-500">{item.variantName}</p>}
                  <p className="text-xs text-cream-500">×{item.quantity}</p>
                </div>
                <span className="font-medium">{formatPrice(Number(item.total))}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-cream-100 mt-4 pt-4 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-cream-500">Subtotal</span>
              <span>{formatPrice(Number(order.subtotal))}</span>
            </div>
            {Number(order.discountAmount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Discount</span>
                <span className="text-green-600">-{formatPrice(Number(order.discountAmount))}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-cream-500">Shipping</span>
              <span>{Number(order.shippingCost) === 0 ? 'FREE' : formatPrice(Number(order.shippingCost))}</span>
            </div>
            <div className="flex justify-between font-bold pt-1 border-t border-cream-100">
              <span>Total</span>
              <span>{formatPrice(Number(order.total))}</span>
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="space-y-4">
          {order.shippingAddress && (
            <div className="card-premium p-5">
              <h3 className="font-serif font-semibold text-navy-950 mb-3">Shipping Address</h3>
              <address className="not-italic text-sm text-cream-600 leading-relaxed">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                {order.shippingAddress.addressLine1}<br />
                {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </address>
            </div>
          )}
          {order.giftMessage && (
            <div className="card-premium p-5 bg-gold-50 border border-gold-200">
              <p className="text-xs font-semibold text-gold-700 uppercase tracking-wide mb-2">🎁 Gift Message</p>
              <p className="text-sm text-navy-700 italic">"{order.giftMessage}"</p>
            </div>
          )}
          <div className="card-premium p-5">
            <h3 className="font-serif font-semibold text-navy-950 mb-2">Need Help?</h3>
            <p className="text-sm text-cream-500 mb-3">Having issues with your order?</p>
            <Link href="/contact" className="text-gold-600 text-sm hover:underline">Contact Support →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
