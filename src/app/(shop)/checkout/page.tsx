'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Truck, Lock, Tag, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { COUNTRIES } from '@/lib/countries';

const getStripe = () => import('@stripe/stripe-js').then(m => m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!));

const schema = z.object({
  email: z.string().email('Valid email required'),
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  phone: z.string().min(7, 'Phone required'),
  addressLine1: z.string().min(5, 'Address required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City required'),
  state: z.string().optional(),
  postalCode: z.string().min(3, 'Postal code required'),
  country: z.string().min(2, 'Country required'),
  shippingMethod: z.enum(['STANDARD', 'EXPRESS', 'OVERNIGHT']),
  giftMessage: z.string().max(300).optional(),
  sameAsBilling: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

const SHIPPING_OPTIONS = [
  { id: 'STANDARD', label: 'Standard Delivery', desc: '3–5 business days', price: 0, note: 'Free on orders €75+' },
  { id: 'EXPRESS', label: 'Express Delivery', desc: '1–2 business days', price: 9.99, note: '' },
  { id: 'OVERNIGHT', label: 'Next Day Delivery', desc: 'Order by 2pm', price: 14.99, note: '' },
] as const;

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: string; value: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: session?.user.email || '',
      firstName: session?.user.name?.split(' ')[0] || '',
      lastName: session?.user.name?.split(' ')[1] || '',
      shippingMethod: 'STANDARD',
      sameAsBilling: true,
    },
  });

  const shippingMethod = watch('shippingMethod');
  const selectedShipping = SHIPPING_OPTIONS.find(o => o.id === shippingMethod)!;
  const subtotal = getTotalPrice();
  const shippingCost = shippingMethod === 'STANDARD' && subtotal >= 75 ? 0 : selectedShipping.price;

  const discountAmount = appliedCoupon
    ? appliedCoupon.type === 'PERCENTAGE'
      ? Math.round((subtotal * appliedCoupon.value / 100) * 100) / 100
      : appliedCoupon.type === 'FIXED'
      ? Math.min(appliedCoupon.value, subtotal)
      : appliedCoupon.type === 'FREE_SHIPPING'
      ? shippingCost
      : 0
    : 0;

  const total = subtotal + shippingCost - discountAmount;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), orderAmount: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Invalid coupon'); return; }
      setAppliedCoupon(data);
      toast.success(`Coupon "${data.code}" applied!`);
    } catch {
      toast.error('Failed to validate coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  useEffect(() => {
    if (items.length === 0) router.push('/cart');
  }, [items.length, router]);

  if (items.length === 0) return null;

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          couponCode: appliedCoupon?.code || null,
          discountAmount: discountAmount || 0,
          items: items.map(i => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            price: i.variant?.price ?? i.product.price,
          })),
        }),
      });
      const { sessionId, error } = await res.json();
      if (error) { toast.error(error); return; }

      const stripe = await getStripe();
      const result = await stripe?.redirectToCheckout({ sessionId });
      if (result?.error) toast.error(result.error.message || 'Checkout failed');
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="section-padding py-8 lg:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-serif text-2xl font-bold tracking-widest text-navy-950">GIFT<span className="text-gold-500">ORA</span></span>
            <ChevronSeparator />
            <span className="text-navy-600 font-medium">Secure Checkout</span>
            <Lock size={14} className="text-gold-500" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Left: Form */}
              <div className="lg:col-span-3 space-y-6">
                {/* Contact */}
                <div className="bg-white rounded-2xl p-6">
                  <h2 className="font-serif text-xl font-bold text-navy-950 mb-5">Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">Email *</label>
                      <input {...register('email')} type="email" className="input-field" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-1.5">First Name *</label>
                        <input {...register('firstName')} className="input-field" />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-1.5">Last Name *</label>
                        <input {...register('lastName')} className="input-field" />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">Phone *</label>
                      <input {...register('phone')} type="tel" className="input-field" />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-2xl p-6">
                  <h2 className="font-serif text-xl font-bold text-navy-950 mb-5">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">Address Line 1 *</label>
                      <input {...register('addressLine1')} placeholder="Street address" className="input-field" />
                      {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">Address Line 2</label>
                      <input {...register('addressLine2')} placeholder="Apartment, suite, etc. (optional)" className="input-field" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-1.5">City *</label>
                        <input {...register('city')} className="input-field" />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-1.5">Postal Code *</label>
                        <input {...register('postalCode')} className="input-field" />
                        {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">Country *</label>
                      <select {...register('country')} className="input-field">
                        <option value="">Select country</option>
                        {COUNTRIES.map(c => (
                          <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                      </select>
                      {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="bg-white rounded-2xl p-6">
                  <h2 className="font-serif text-xl font-bold text-navy-950 mb-5">Shipping Method</h2>
                  <div className="space-y-3">
                    {SHIPPING_OPTIONS.map(option => (
                      <label
                        key={option.id}
                        className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                          shippingMethod === option.id ? 'border-gold-400 bg-gold-50' : 'border-cream-200 hover:border-cream-300'
                        }`}
                      >
                        <input {...register('shippingMethod')} type="radio" value={option.id} className="accent-gold-500" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Truck size={16} className="text-gold-500" />
                            <span className="font-medium text-navy-950 text-sm">{option.label}</span>
                          </div>
                          <p className="text-xs text-cream-500 mt-0.5">{option.desc}</p>
                          {option.note && <p className="text-xs text-green-600 mt-0.5">{option.note}</p>}
                        </div>
                        <span className="font-bold text-navy-950 text-sm">
                          {option.id === 'STANDARD' && subtotal >= 75 ? 'FREE' : formatPrice(option.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Gift Message */}
                <div className="bg-white rounded-2xl p-6">
                  <h2 className="font-serif text-xl font-bold text-navy-950 mb-3">Gift Message</h2>
                  <p className="text-sm text-cream-500 mb-4">Add a personal message to be included with your order (optional).</p>
                  <textarea {...register('giftMessage')} rows={3} maxLength={300} placeholder="Write your heartfelt message here..." className="input-field resize-none" />
                </div>
              </div>

              {/* Right: Summary */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-6 sticky top-24">
                  <h2 className="font-serif text-xl font-bold text-navy-950 mb-5">Order Summary</h2>
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    {items.map(item => {
                      const price = item.variant?.price ?? item.product.price;
                      return (
                        <div key={item.id} className="flex items-center gap-3 text-sm">
                          <div className="w-12 h-12 rounded-lg bg-cream-100 flex-shrink-0 overflow-hidden">
                            {item.product.image && (
                              <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-navy-950 truncate">{item.product.name}</p>
                            <p className="text-cream-500 text-xs">×{item.quantity}</p>
                          </div>
                          <span className="font-medium">{formatPrice(price * item.quantity)}</span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Coupon code */}
                  <div className="border-t border-cream-100 pt-4">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2 mb-3">
                        <div className="flex items-center gap-2 text-green-700 text-sm">
                          <Tag size={14} />
                          <span className="font-mono font-bold">{appliedCoupon.code}</span>
                          <span className="text-green-600">
                            {appliedCoupon.type === 'PERCENTAGE' ? `${appliedCoupon.value}% off` :
                             appliedCoupon.type === 'FREE_SHIPPING' ? 'Free shipping' :
                             `€${appliedCoupon.value} off`}
                          </span>
                        </div>
                        <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className="text-green-500 hover:text-green-700">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={e => setCouponCode(e.target.value.toUpperCase())}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                          placeholder="Coupon code"
                          className="flex-1 border border-cream-200 rounded-xl px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-gold-400"
                        />
                        <button
                          type="button"
                          onClick={applyCoupon}
                          disabled={couponLoading || !couponCode.trim()}
                          className="px-4 py-2 bg-navy-950 text-white text-sm font-semibold rounded-xl hover:bg-navy-800 transition-colors disabled:opacity-50"
                        >
                          {couponLoading ? '…' : 'Apply'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-cream-600">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-cream-600">Shipping</span>
                      <span className={shippingCost === 0 || (appliedCoupon?.type === 'FREE_SHIPPING') ? 'text-green-600' : ''}>
                        {shippingCost === 0 || appliedCoupon?.type === 'FREE_SHIPPING' ? 'FREE' : formatPrice(shippingCost)}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({appliedCoupon?.code})</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-cream-100">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gold w-full py-4 text-base font-bold mt-6 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    <Shield size={16} />
                    {loading ? 'Redirecting…' : `Pay ${formatPrice(total)}`}
                  </button>

                  <p className="text-xs text-cream-400 text-center mt-3 flex items-center justify-center gap-1">
                    <Lock size={10} /> Secured by Stripe · SSL encrypted
                  </p>

                  <div className="flex justify-center gap-3 mt-4">
                    {['Visa', 'Mastercard', 'Amex', 'PayPal'].map(p => (
                      <span key={p} className="text-xs text-cream-400 bg-cream-50 px-2 py-1 rounded border border-cream-200">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ChevronSeparator() {
  return <span className="text-cream-300 text-lg">/</span>;
}
