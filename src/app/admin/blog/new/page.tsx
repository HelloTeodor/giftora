import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/utils';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { BlogPostForm } from '@/components/admin/BlogPostForm';

export const metadata = { title: 'New Post — Giftora Admin' };

export default async function NewBlogPostPage() {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) redirect('/login');

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/blog" className="hover:text-navy-700">Blog</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-navy-900 font-medium">New Post</span>
      </div>
      <h1 className="text-2xl font-bold text-navy-900 mb-8">Create Blog Post</h1>
      <BlogPostForm authorName={session.user.name ?? 'Admin'} />
    </div>
  );
}
