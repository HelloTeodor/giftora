'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  newsletter: z.boolean().optional(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || 'Registration failed');
        return;
      }
      // Auto sign in
      await signIn('credentials', {
        email: data.email.toLowerCase(),
        password: data.password,
        redirect: false,
      });
      toast.success('Account created! Welcome to Giftora 🎉');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-navy-950 mb-2">Create your account</h1>
      <p className="text-cream-500 mb-8">Join Giftora and start gifting beautifully</p>

      {/* OAuth */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-cream-200 rounded-lg hover:bg-cream-50 transition-colors text-sm font-medium text-navy-700"
        >
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
          Continue with Google
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-cream-200" />
        <span className="text-cream-400 text-xs">or register with email</span>
        <div className="flex-1 h-px bg-cream-200" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">First Name</label>
            <input {...register('firstName')} placeholder="Jane" className="input-field" />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Last Name</label>
            <input {...register('lastName')} placeholder="Doe" className="input-field" />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1.5">Email address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-400" />
            <input {...register('email')} type="email" placeholder="you@example.com" className="input-field pl-10" />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1.5">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-400" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 chars, 1 uppercase, 1 number"
              className="input-field pl-10 pr-10"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream-400">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1.5">Confirm Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-400" />
            <input {...register('confirmPassword')} type="password" placeholder="••••••••" className="input-field pl-10" />
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input {...register('newsletter')} type="checkbox" className="mt-0.5 accent-gold-500" />
          <span className="text-sm text-cream-500">
            I'd like to receive exclusive offers and gifting inspiration via email.
          </span>
        </label>

        <p className="text-xs text-cream-400">
          By creating an account you agree to our{' '}
          <Link href="/policies/terms" className="text-gold-600 hover:underline">Terms</Link> and{' '}
          <Link href="/policies/privacy" className="text-gold-600 hover:underline">Privacy Policy</Link>.
        </p>

        <button type="submit" disabled={loading} className="btn-gold w-full py-3 disabled:opacity-60">
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-cream-500 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-gold-600 font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
