import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { isAdmin } from '@/lib/utils';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { BlogPostForm } from '@/components/admin/BlogPostForm';

export const metadata = { title: 'Edit Post — Giftora Admin' };

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) redirect('/login');

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/blog" className="hover:text-navy-700">Blog</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-navy-900 font-medium">Edit</span>
      </div>
      <h1 className="text-2xl font-bold text-navy-900 mb-8">Edit: {post.title}</h1>
      <BlogPostForm post={post} authorName={session.user.name ?? 'Admin'} />
    </div>
  );
}
