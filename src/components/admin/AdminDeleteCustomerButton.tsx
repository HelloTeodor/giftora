'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminDeleteCustomerButton({ customerId, customerName }: { customerId: string; customerName: string }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || 'Failed to delete account');
        setDeleting(false);
        setShowConfirm(false);
        return;
      }
      toast.success('Customer account deleted');
      router.push('/admin/customers');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
      setDeleting(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
        <AlertTriangle size={15} className="text-red-500 shrink-0" />
        <span className="text-sm text-red-700 font-medium">Delete {customerName}?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 ml-1"
        >
          {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
          {deleting ? 'Deleting…' : 'Confirm'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={deleting}
          className="text-sm text-red-400 hover:text-red-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex items-center gap-2 text-sm font-medium text-red-500 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
    >
      <Trash2 size={15} />
      Delete Account
    </button>
  );
}
