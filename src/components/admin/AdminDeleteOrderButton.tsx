'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  orderId: string;
  orderNumber: string;
  redirectAfter?: boolean;
}

export function AdminDeleteOrderButton({ orderId, orderNumber, redirectAfter }: Props) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success(`Order #${orderNumber} deleted`);
        if (redirectAfter) {
          router.push('/admin/orders');
        } else {
          router.refresh();
        }
      } else {
        toast.error('Failed to delete order');
        setDeleting(false);
      }
    } catch {
      toast.error('Something went wrong');
      setDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
        title="Delete order"
      >
        <Trash2 size={15} />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Delete Order #{orderNumber}?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  This will permanently delete the order and all its data. This cannot be undone.
                </p>
              </div>
              <button onClick={() => setShowConfirm(false)} className="ml-auto text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
