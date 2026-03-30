'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  newsletterOptIn: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  user: {
    id: string; name?: string | null; firstName?: string | null; lastName?: string | null;
    email: string; phone?: string | null; avatar?: string | null;
    newsletterOptIn: boolean; createdAt: Date; loyaltyPoints: number;
  };
}

export function ProfileForm({ user }: Props) {
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user.firstName || user.name?.split(' ')[0] || '',
      lastName: user.lastName || user.name?.split(' ')[1] || '',
      email: user.email,
      phone: user.phone || '',
      newsletterOptIn: user.newsletterOptIn,
    },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success('Profile updated!');
      } else {
        toast.error('Failed to update profile');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="card-premium p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Star size={16} className="text-gold-500 fill-gold-500" />
            <span className="font-bold text-2xl text-navy-950">{user.loyaltyPoints}</span>
          </div>
          <p className="text-xs text-cream-500">Loyalty Points</p>
        </div>
        <div className="card-premium p-4 text-center">
          <p className="font-bold text-2xl text-navy-950 mb-1">Member</p>
          <p className="text-xs text-cream-500">Since {formatDate(user.createdAt, { year: 'numeric', month: 'short' })}</p>
        </div>
      </div>

      {/* Form */}
      <div className="card-premium p-6">
        <h2 className="font-serif text-xl font-semibold text-navy-950 mb-5">Personal Information</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">First Name</label>
              <input {...register('firstName')} className="input-field" />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Last Name</label>
              <input {...register('lastName')} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-400" />
              <input {...register('email')} type="email" className="input-field pl-10" />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-400" />
              <input {...register('phone')} type="tel" className="input-field pl-10" />
            </div>
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input {...register('newsletterOptIn')} type="checkbox" className="mt-0.5 accent-gold-500" />
            <span className="text-sm text-cream-600">Receive exclusive offers and updates via email</span>
          </label>
          <button type="submit" disabled={!isDirty || saving} className="btn-gold px-8 py-2.5 text-sm disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="card-premium p-6 border border-red-100">
        <h2 className="font-serif text-xl font-semibold text-navy-950 mb-3">Danger Zone</h2>
        <p className="text-sm text-cream-500 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
        <button className="text-sm text-red-500 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
