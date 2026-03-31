'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Archive, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  productId: string;
  productStatus: string;
}

export function AdminProductActions({ productId, productStatus }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isArchived = productStatus === 'ARCHIVED';

  const handleAction = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success(isArchived ? 'Product permanently deleted' : 'Product archived');
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || (isArchived ? 'Failed to delete product' : 'Failed to archive product'), { duration: 6000 });
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={deleting}
        title={isArchived ? 'Permanently delete' : 'Archive product'}
        className={`p-1.5 rounded-lg transition-all disabled:opacity-50 ${
          isArchived
            ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
            : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
        }`}
      >
        {isArchived ? <Trash2 size={15} /> : <Archive size={15} />}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isArchived ? 'bg-red-100' : 'bg-amber-100'}`}>
                <AlertTriangle size={20} className={isArchived ? 'text-red-600' : 'text-amber-600'} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  {isArchived ? 'Permanently delete product?' : 'Archive product?'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {isArchived
                    ? 'This will permanently remove the product from the database. This cannot be undone.'
                    : 'The product will be hidden from the store and moved to the Archived tab. You can permanently delete it from there.'}
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
                onClick={handleAction}
                disabled={deleting}
                className={`flex-1 py-2.5 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60 ${
                  isArchived ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                {deleting ? '…' : isArchived ? 'Delete Forever' : 'Archive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
