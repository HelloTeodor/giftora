'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

interface Props {
  couponId: string;
}

export function AdminCouponActions({ couponId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm('Delete this coupon? This cannot be undone.')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/coupons/${couponId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Coupon deleted');
      router.refresh();
    } catch {
      toast.error('Failed to delete coupon');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/admin/coupons/${couponId}/edit`}
        className="p-1.5 text-gray-400 hover:text-gold-600 transition-colors"
        title="Edit coupon"
      >
        <Edit size={15} />
      </Link>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="p-1.5 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
        title="Delete coupon"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
