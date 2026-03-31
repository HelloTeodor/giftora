import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Edit } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { AdminBlogActions } from '@/components/admin/AdminBlogActions';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Blog | Admin' };

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} posts</p>
        </div>
        <Link href="/admin/blog/new" className="flex items-center gap-2 bg-gold-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gold-600 transition-colors">
          <Plus size={16} /> New Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100">
              <th className="text-left px-5 py-3">Title</th>
              <th className="text-left px-5 py-3">Author</th>
              <th className="text-left px-5 py-3">Published</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.map(post => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900 text-sm">{post.title}</p>
                  <p className="text-xs text-gray-400">/{post.slug}</p>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{post.authorName}</td>
                <td className="px-5 py-4 text-sm text-gray-600">
                  {post.publishedAt ? formatDate(post.publishedAt) : '—'}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/blog/${post.id}/edit`} className="p-1.5 text-gray-400 hover:text-gold-600 inline-flex">
                      <Edit size={15} />
                    </Link>
                    <AdminBlogActions postId={post.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
