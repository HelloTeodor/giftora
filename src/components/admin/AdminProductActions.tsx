'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminProductActions({ productId }: { productId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Product deleted');
      router.refresh();
    } else {
      toast.error('Failed to delete product');
    }
    setDeleting(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
    >
      <Trash2 size={15} />
    </button>
  );
}
