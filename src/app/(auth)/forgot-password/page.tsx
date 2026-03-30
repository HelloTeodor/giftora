'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={28} className="text-green-600" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-navy-950 mb-3">Check your inbox</h1>
        <p className="text-cream-500 mb-8">
          If an account exists for <strong>{email}</strong>, you'll receive a password reset link within a few minutes.
        </p>
        <Link href="/login" className="btn-navy inline-flex items-center gap-2 text-sm">
          <ArrowLeft size={16} /> Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/login" className="inline-flex items-center gap-2 text-cream-500 hover:text-navy-700 text-sm mb-8 transition-colors">
        <ArrowLeft size={15} /> Back to Sign In
      </Link>
      <h1 className="font-serif text-3xl font-bold text-navy-950 mb-2">Forgot password?</h1>
      <p className="text-cream-500 mb-8">
        No worries! Enter your email and we'll send you a reset link.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1.5">Email address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="input-field pl-10"
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-gold w-full py-3 disabled:opacity-60">
          {loading ? 'Sending…' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
}
