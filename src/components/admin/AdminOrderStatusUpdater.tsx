'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/lib/utils';

const ORDER_STATUSES = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

export function AdminOrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  const handleChange = async (status: string) => {
    setUpdating(true);
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success(`Order status updated to ${ORDER_STATUS_LABELS[status]}`);
      router.refresh();
    } else {
      toast.error('Failed to update status');
    }
    setUpdating(false);
  };

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleChange(e.target.value)}
      disabled={updating}
      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${ORDER_STATUS_COLORS[currentStatus]} disabled:opacity-60`}
    >
      {ORDER_STATUSES.map(s => (
        <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
      ))}
    </select>
  );
}
