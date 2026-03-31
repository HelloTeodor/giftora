import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { isAdmin } from '@/lib/utils';
import { CouponForm } from '@/components/admin/CouponForm';
import type { Metadata } from 'next';

interface Props { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: 'Edit Coupon — Giftora Admin' };

export default async function EditCouponPage({ params }: Props) {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) redirect('/login');

  const { id } = await params;

  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) notFound();

  const couponData = {
    ...coupon,
    value: Number(coupon.value),
    minOrderAmount: coupon.minOrderAmount ? Number(coupon.minOrderAmount) : null,
    maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Edit Coupon</h1>
        <p className="text-gray-500 mt-1 font-mono">{coupon.code}</p>
      </div>
      <CouponForm coupon={couponData} />
    </div>
  );
}
