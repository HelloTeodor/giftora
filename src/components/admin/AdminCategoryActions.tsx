'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

interface Props {
  categoryId: string;
  productCount: number;
}

export function AdminCategoryActions({ categoryId, productCount }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (productCount > 0) {
      toast.error(`Cannot delete — ${productCount} product(s) use this category`);
      return;
    }
    if (!confirm('Delete this category? This cannot be undone.')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Category deleted');
      router.refresh();
    } catch {
      toast.error('Failed to delete category');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
      title="Delete category"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
