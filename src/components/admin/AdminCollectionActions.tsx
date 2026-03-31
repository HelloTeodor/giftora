'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

interface Props {
  collectionId: string;
}

export function AdminCollectionActions({ collectionId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm('Delete this collection? Products will not be deleted.')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/collections/${collectionId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Collection deleted');
      router.refresh();
    } catch {
      toast.error('Failed to delete collection');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
      title="Delete collection"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
