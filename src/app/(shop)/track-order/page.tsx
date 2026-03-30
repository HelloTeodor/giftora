'use client';

import { useState } from 'react';
import { Package, Search } from 'lucide-react';
import { formatDate, formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    orderNumber: string; status: string; createdAt: string; total: number; trackingNumber?: string; trackingUrl?: string;
  } | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`/api/orders/track?orderNumber=${orderNumber}&email=${email}`);
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error || 'Order not found');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding py-16 max-w-lg mx-auto">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-navy-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package size={28} className="text-navy-700" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-navy-950 mb-2">Track Your Order</h1>
        <p className="text-cream-500">Enter your order number and email to check your order status.</p>
      </div>

      <div className="card-premium p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Order Number</label>
            <input value={orderNumber} onChange={e => setOrderNumber(e.target.value)} placeholder="GFT-XXXXX-XXX" required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Email Address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="Email used when ordering" className="input-field" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-gold w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
            <Search size={16} />
            {loading ? 'Searching…' : 'Track Order'}
          </button>
        </form>

        {result && (
          <div className="mt-6 pt-6 border-t border-cream-200 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-navy-700">Order #{result.orderNumber}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${ORDER_STATUS_COLORS[result.status]}`}>
                {ORDER_STATUS_LABELS[result.status]}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-cream-500">Order Date</span>
              <span>{formatDate(result.createdAt)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-cream-500">Total</span>
              <span>{formatPrice(result.total)}</span>
            </div>
            {result.trackingNumber && (
              <div className="bg-cream-50 rounded-xl p-4 mt-2">
                <p className="text-xs text-gold-700 font-semibold mb-1">Tracking Number</p>
                <p className="font-mono font-bold text-navy-950">{result.trackingNumber}</p>
                {result.trackingUrl && (
                  <a href={result.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gold-600 hover:underline mt-1 block">
                    Track with carrier →
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
