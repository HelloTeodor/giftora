'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Gift, Tag } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState<{ code: string; discount: number } | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 75 ? 0 : 4.99;
  const couponDiscount = couponApplied ? (subtotal * couponApplied.discount) / 100 : 0;
  const total = subtotal + shipping - couponDiscount;

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    setApplyingCoupon(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon, orderAmount: subtotal }),
      });
      const data = await res.json();
      if (res.ok) {
        setCouponApplied({ code: coupon, discount: data.value });
        toast.success(`Coupon applied! ${data.value}% off`);
      } else {
        toast.error(data.error || 'Invalid coupon');
      }
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="section-padding py-24 text-center">
        <div className="w-24 h-24 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={40} className="text-cream-300" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-navy-950 mb-3">Your cart is empty</h1>
        <p className="text-cream-500 mb-8">Discover our beautiful gift boxes and fill it with joy!</p>
        <Link href="/products" className="btn-gold inline-flex items-center gap-2">
          Shop Gift Boxes <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="section-padding py-8 lg:py-12">
      <h1 className="font-serif text-3xl font-bold text-navy-950 mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const price = item.variant?.price ?? item.product.price;
            return (
              <div key={item.id} className="card-premium p-5 flex gap-4">
                <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-cream-100">
                    {item.product.image ? (
                      <Image src={item.product.image} alt={item.product.name} width={96} height={96} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Gift size={28} className="text-cream-300" />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/products/${item.product.slug}`} className="font-serif font-semibold text-navy-950 hover:text-gold-600 transition-colors">
                        {item.product.name}
                      </Link>
                      {item.variant && <p className="text-sm text-cream-500 mt-0.5">{item.variant.name}</p>}
                      {item.giftNote && <p className="text-xs text-gold-600 italic mt-1">🎁 "{item.giftNote}"</p>}
                    </div>
                    <button
                      onClick={() => { removeItem(item.id); toast('Item removed'); }}
                      className="text-cream-300 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-cream-200 rounded-lg">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-navy-600 hover:bg-cream-50 transition-colors">
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= (item.variant?.stock ?? item.product.stock)}
                        className="w-8 h-8 flex items-center justify-center text-navy-600 hover:bg-cream-50 transition-colors disabled:opacity-30"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <span className="font-bold text-navy-950">{formatPrice(price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="flex justify-end">
            <button onClick={() => { clearCart(); toast('Cart cleared'); }} className="text-sm text-cream-400 hover:text-red-500 transition-colors">
              Clear cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="card-premium p-6">
            <h2 className="font-serif text-xl font-bold text-navy-950 mb-5">Order Summary</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-cream-600">Subtotal</span>
                <span className="font-medium text-navy-950">{formatPrice(subtotal)}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Coupon ({couponApplied.code})</span>
                  <span className="text-green-600 font-medium">-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-cream-600">Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium text-navy-950'}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              {subtotal < 75 && (
                <p className="text-xs text-gold-600 bg-gold-50 px-3 py-2 rounded-lg">
                  Add {formatPrice(75 - subtotal)} more for free shipping!
                </p>
              )}
            </div>
            <div className="border-t border-cream-200 pt-4 flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span className="text-navy-950">{formatPrice(total)}</span>
            </div>

            {/* Coupon */}
            <div className="mb-5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-400" />
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="Promo code"
                    className="input-field pl-8 text-sm py-2.5"
                    disabled={!!couponApplied}
                  />
                </div>
                {couponApplied ? (
                  <button onClick={() => { setCouponApplied(null); setCoupon(''); }} className="px-3 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50">
                    Remove
                  </button>
                ) : (
                  <button onClick={applyCoupon} disabled={applyingCoupon || !coupon} className="px-4 py-2 bg-navy-950 text-white text-sm rounded-lg hover:bg-navy-800 disabled:opacity-50">
                    Apply
                  </button>
                )}
              </div>
            </div>

            <Link href="/checkout" className="btn-gold w-full text-center block py-3.5 font-semibold">
              Proceed to Checkout
            </Link>
            <Link href="/products" className="block text-center text-sm text-cream-500 hover:text-navy-700 mt-3 transition-colors">
              Continue Shopping
            </Link>
          </div>

          <div className="bg-cream-50 rounded-xl p-4 text-xs text-cream-500 text-center space-y-1">
            <p>🔒 Secure checkout · SSL encrypted</p>
            <p>30-day hassle-free returns</p>
          </div>
        </div>
      </div>
    </div>
  );
}
