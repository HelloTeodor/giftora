'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Loader2, RefreshCw } from 'lucide-react';

const schema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').max(32).toUpperCase(),
  description: z.string().optional(),
  type: z.enum(['PERCENTAGE', 'FIXED', 'FREE_SHIPPING', 'BUY_X_GET_Y']),
  value: z.coerce.number().min(0, 'Value must be positive'),
  minOrderAmount: z.coerce.number().min(0).optional().nullable(),
  maxDiscount: z.coerce.number().min(0).optional().nullable(),
  usageLimit: z.coerce.number().int().min(1).optional().nullable(),
  perUserLimit: z.coerce.number().int().min(1).default(1),
  isActive: z.boolean().default(true),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
  buyQuantity: z.coerce.number().int().min(1).optional().nullable(),
  getQuantity: z.coerce.number().int().min(1).optional().nullable(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  coupon?: {
    id: string;
    code: string;
    description: string | null;
    type: string;
    value: number;
    minOrderAmount: number | null;
    maxDiscount: number | null;
    usageLimit: number | null;
    perUserLimit: number;
    isActive: boolean;
    startsAt: Date | null;
    expiresAt: Date | null;
    buyQuantity: number | null;
    getQuantity: number | null;
  };
}

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function CouponForm({ coupon }: Props) {
  const router = useRouter();
  const isEditing = !!coupon;

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: coupon?.code ?? '',
      description: coupon?.description ?? '',
      type: (coupon?.type as FormData['type']) ?? 'PERCENTAGE',
      value: coupon?.value ?? 0,
      minOrderAmount: coupon?.minOrderAmount ?? null,
      maxDiscount: coupon?.maxDiscount ?? null,
      usageLimit: coupon?.usageLimit ?? null,
      perUserLimit: coupon?.perUserLimit ?? 1,
      isActive: coupon?.isActive ?? true,
      startsAt: coupon?.startsAt ? new Date(coupon.startsAt).toISOString().slice(0, 16) : '',
      expiresAt: coupon?.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 16) : '',
      buyQuantity: coupon?.buyQuantity ?? null,
      getQuantity: coupon?.getQuantity ?? null,
    },
  });

  const type = watch('type');

  async function onSubmit(data: FormData) {
    try {
      const body = {
        ...data,
        startsAt: data.startsAt ? new Date(data.startsAt).toISOString() : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
        minOrderAmount: data.minOrderAmount || null,
        maxDiscount: data.maxDiscount || null,
        usageLimit: data.usageLimit || null,
        buyQuantity: data.buyQuantity || null,
        getQuantity: data.getQuantity || null,
      };
      const url = isEditing ? `/api/admin/coupons/${coupon.id}` : '/api/admin/coupons';
      const method = isEditing ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed');
      }
      toast.success(isEditing ? 'Coupon updated' : 'Coupon created');
      router.push('/admin/coupons');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? 'Something went wrong');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Basic */}
      <div className="bg-white rounded-xl shadow-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-navy-900">Coupon Details</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
          <div className="flex gap-2">
            <input
              {...register('code')}
              className="input-field flex-1 font-mono uppercase"
              placeholder="SUMMER20"
            />
            <button
              type="button"
              onClick={() => setValue('code', generateCode())}
              className="btn-outline flex items-center gap-1 px-3"
            >
              <RefreshCw className="w-4 h-4" /> Generate
            </button>
          </div>
          {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input {...register('description')} className="input-field" placeholder="Internal note about this coupon" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
            <select {...register('type')} className="input-field">
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (€)</option>
              <option value="FREE_SHIPPING">Free Shipping</option>
              <option value="BUY_X_GET_Y">Buy X Get Y</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === 'PERCENTAGE' ? 'Percentage (%)' : type === 'FIXED' ? 'Amount (€)' : 'Value'}
            </label>
            <input
              {...register('value')}
              type="number"
              step="0.01"
              min="0"
              className="input-field"
              disabled={type === 'FREE_SHIPPING'}
              placeholder={type === 'PERCENTAGE' ? '10' : '5.00'}
            />
            {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value.message}</p>}
          </div>
        </div>

        {type === 'BUY_X_GET_Y' && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-gold-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buy Quantity (X)</label>
              <input {...register('buyQuantity')} type="number" min="1" className="input-field" placeholder="2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Get Quantity (Y)</label>
              <input {...register('getQuantity')} type="number" min="1" className="input-field" placeholder="1" />
            </div>
          </div>
        )}
      </div>

      {/* Limits */}
      <div className="bg-white rounded-xl shadow-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-navy-900">Limits & Restrictions</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount (€)</label>
            <input {...register('minOrderAmount')} type="number" step="0.01" min="0" className="input-field" placeholder="No minimum" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount (€)</label>
            <input {...register('maxDiscount')} type="number" step="0.01" min="0" className="input-field" placeholder="No cap" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Usage Limit</label>
            <input {...register('usageLimit')} type="number" min="1" className="input-field" placeholder="Unlimited" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Per-User Limit</label>
            <input {...register('perUserLimit')} type="number" min="1" className="input-field" />
          </div>
        </div>
      </div>

      {/* Validity */}
      <div className="bg-white rounded-xl shadow-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-navy-900">Validity Period</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Starts At</label>
            <input {...register('startsAt')} type="datetime-local" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
            <input {...register('expiresAt')} type="datetime-local" className="input-field" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input {...register('isActive')} type="checkbox" id="isActive" className="w-4 h-4 accent-gold-500" />
          <label htmlFor="isActive" className="text-sm text-gray-700">Active (can be used right now)</label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={isSubmitting} className="btn-gold flex items-center gap-2">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEditing ? 'Save Changes' : 'Create Coupon'}
        </button>
        <button type="button" onClick={() => router.push('/admin/coupons')} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}
