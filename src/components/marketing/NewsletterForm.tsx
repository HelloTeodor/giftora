'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setDone(true);
        toast.success('Welcome to the Giftora family!');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className={cn('text-center py-3', dark ? 'text-cream-300' : 'text-navy-700')}>
        <span className="text-2xl">🎉</span>
        <p className="mt-1 font-medium">You're subscribed! Check your inbox for a welcome gift.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Mail size={16} className={cn('absolute left-3 top-1/2 -translate-y-1/2', dark ? 'text-cream-500' : 'text-cream-400')} />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className={cn(
            'w-full pl-9 pr-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all',
            dark
              ? 'bg-navy-800 text-white placeholder:text-cream-500 border border-navy-700'
              : 'bg-white text-navy-950 placeholder:text-cream-400 border border-cream-200'
          )}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-gold text-sm px-5 py-3 whitespace-nowrap disabled:opacity-60"
      >
        {loading ? '…' : 'Subscribe'}
      </button>
    </form>
  );
}
