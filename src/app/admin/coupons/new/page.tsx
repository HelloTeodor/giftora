import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/utils';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { CouponForm } from '@/components/admin/CouponForm';

export const metadata = { title: 'New Coupon — Giftora Admin' };

export default async function NewCouponPage() {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) redirect('/login');

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/coupons" className="hover:text-navy-700">Coupons</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-navy-900 font-medium">New Coupon</span>
      </div>
      <h1 className="text-2xl font-bold text-navy-900 mb-8">Create Coupon</h1>
      <CouponForm />
    </div>
  );
}
