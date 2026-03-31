'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

interface Props {
  postId: string;
}

export function AdminBlogActions({ postId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm('Delete this blog post? This cannot be undone.')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blog/${postId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Post deleted');
      router.refresh();
    } catch {
      toast.error('Failed to delete post');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
      title="Delete post"
    >
      <Trash2 size={15} />
    </button>
  );
}
