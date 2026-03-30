'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Trash2, Plus, Minus, Gift } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';

export function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeCart]);

  const total = getTotalPrice();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        ref={ref}
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cream-200">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-gold-500" />
            <h2 className="font-serif text-xl font-semibold text-navy-950">
              Your Cart
              {items.length > 0 && (
                <span className="ml-2 text-sm font-sans font-normal text-cream-500">
                  ({items.length} {items.length === 1 ? 'item' : 'items'})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-cream-100 rounded-full transition-colors text-navy-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <div className="w-20 h-20 rounded-full bg-cream-100 flex items-center justify-center">
              <ShoppingBag size={32} className="text-cream-400" />
            </div>
            <div className="text-center">
              <p className="font-serif text-lg text-navy-950 mb-1">Your cart is empty</p>
              <p className="text-sm text-cream-500">Discover our beautiful gift boxes</p>
            </div>
            <Link
              href="/products"
              onClick={closeCart}
              className="btn-gold text-sm px-6 py-2.5"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => {
                const price = item.variant?.price ?? item.product.price;
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-cream-50 rounded-xl p-3 group animate-fade-in"
                  >
                    {/* Image */}
                    <Link
                      href={`/products/${item.product.slug}`}
                      onClick={closeCart}
                      className="flex-shrink-0"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-cream-200">
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Gift size={24} className="text-cream-400" />
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={closeCart}
                          className="font-medium text-sm text-navy-950 hover:text-gold-600 transition-colors line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-cream-400 hover:text-red-500 transition-colors flex-shrink-0 p-0.5"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {item.variant && (
                        <p className="text-xs text-cream-500 mt-0.5">{item.variant.name}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-white rounded-lg border border-cream-200">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-navy-600 hover:text-gold-600 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-navy-600 hover:text-gold-600 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-semibold text-navy-950 text-sm">
                          {formatPrice(price * item.quantity)}
                        </span>
                      </div>
                      {item.giftNote && (
                        <p className="text-xs text-gold-600 mt-1 italic">
                          🎁 "{item.giftNote}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-cream-200 p-4 space-y-4">
              {/* Free shipping progress */}
              {total < 75 && (
                <div className="bg-cream-50 rounded-xl p-3">
                  <div className="flex justify-between text-xs text-navy-700 mb-1.5 font-medium">
                    <span>Add {formatPrice(75 - total)} for free shipping!</span>
                    <span>{Math.round((total / 75) * 100)}%</span>
                  </div>
                  <div className="w-full bg-cream-200 rounded-full h-1.5">
                    <div
                      className="bg-gold-gradient h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((total / 75) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {total >= 75 && (
                <div className="bg-green-50 text-green-700 text-xs font-medium px-3 py-2 rounded-lg text-center">
                  ✓ You qualify for free shipping!
                </div>
              )}

              <div className="flex items-center justify-between font-semibold text-navy-950">
                <span>Subtotal</span>
                <span className="text-lg">{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-cream-500 -mt-2">Shipping & taxes calculated at checkout</p>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="btn-gold w-full text-center block text-sm font-semibold py-3"
              >
                Checkout · {formatPrice(total)}
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="block text-center text-sm text-navy-700 hover:text-gold-600 transition-colors py-1"
              >
                View Full Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
