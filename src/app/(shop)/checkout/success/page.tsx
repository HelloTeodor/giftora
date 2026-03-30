import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, Mail } from 'lucide-react';

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string; order?: string };
}) {
  const orderNumber = searchParams.order || searchParams.session_id?.slice(-8).toUpperCase();

  return (
    <div className="section-padding py-24 text-center">
      <div className="max-w-lg mx-auto">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-navy-950 mb-3">Order Confirmed!</h1>
        {orderNumber && (
          <p className="text-gold-600 font-semibold text-lg mb-4">Order #{orderNumber}</p>
        )}
        <p className="text-cream-600 leading-relaxed mb-8">
          Thank you for your order! We've received your purchase and will begin preparing your gift box right away. A confirmation email has been sent to your inbox.
        </p>

        <div className="bg-cream-50 rounded-2xl p-6 mb-8 text-left space-y-4">
          <h3 className="font-serif font-semibold text-navy-950">What happens next?</h3>
          {[
            { icon: Mail, step: '1', label: 'Check your email', desc: "We've sent an order confirmation to your email address." },
            { icon: Package, step: '2', label: 'We pack your gift', desc: 'Your gift box will be carefully packed within 1–2 business days.' },
            { icon: ArrowRight, step: '3', label: "It's on its way!", desc: "You'll receive a shipping notification with a tracking number." },
          ].map(({ icon: Icon, step, label, desc }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={14} className="text-gold-600" />
              </div>
              <div>
                <p className="font-medium text-navy-950 text-sm">{label}</p>
                <p className="text-cream-500 text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account/orders" className="btn-navy inline-flex items-center gap-2 px-6 py-3">
            <Package size={16} /> Track Your Order
          </Link>
          <Link href="/products" className="btn-outline inline-flex items-center gap-2 px-6 py-3">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
