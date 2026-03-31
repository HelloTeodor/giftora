'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminReviewModerator({
  reviewId,
  currentStatus,
}: {
  reviewId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const updateStatus = async (status: 'APPROVED' | 'REJECTED') => {
    setLoading(status);
    const res = await fetch(`/api/admin/reviews/${reviewId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success(`Review ${status.toLowerCase()}`);
      router.refresh();
    } else {
      toast.error('Failed to update review');
    }
    setLoading(null);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this review? This cannot be undone.')) return;
    setLoading('DELETE');
    const res = await fetch(`/api/admin/reviews/${reviewId}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Review deleted');
      router.refresh();
    } else {
      toast.error('Failed to delete review');
    }
    setLoading(null);
  };

  return (
    <div className="flex gap-2 flex-shrink-0">
      {currentStatus === 'PENDING' && (
        <>
          <button
            onClick={() => updateStatus('APPROVED')}
            disabled={!!loading}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
          >
            <Check size={13} /> Approve
          </button>
          <button
            onClick={() => updateStatus('REJECTED')}
            disabled={!!loading}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
          >
            <X size={13} /> Reject
          </button>
        </>
      )}
      <button
        onClick={handleDelete}
        disabled={!!loading}
        className="p-1.5 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
        title="Delete review"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
