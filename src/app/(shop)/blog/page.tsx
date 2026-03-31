import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog — Gifting Ideas & Inspiration',
  description: 'Gifting guides, ideas, and inspiration from the Giftora team.',
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: 12,
  });

  return (
    <div>
      {/* Header */}
      <div className="bg-cream-50 border-b border-cream-200 py-16 text-center">
        <p className="text-gold-600 text-sm font-semibold uppercase tracking-widest mb-3">Our Blog</p>
        <h1 className="font-serif text-4xl font-bold text-navy-950 mb-3">Gifting Inspiration</h1>
        <p className="text-cream-500 max-w-lg mx-auto">Ideas, guides, and stories to help you gift beautifully.</p>
      </div>

      <div className="section-padding py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={40} className="text-cream-300 mx-auto mb-4" />
            <h2 className="font-serif text-xl text-navy-950 mb-2">Coming soon!</h2>
            <p className="text-cream-500">We're working on some amazing gifting guides. Stay tuned!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group card-premium overflow-hidden">
                {post.image && (
                  <div className="aspect-video overflow-hidden">
                    <Image src={post.image} alt={post.title} width={400} height={225} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-5">
                  {post.tags[0] && <span className="text-gold-600 text-xs font-semibold uppercase tracking-wide">{post.tags[0]}</span>}
                  <h2 className="font-serif text-lg font-semibold text-navy-950 mt-1 mb-2 group-hover:text-gold-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && <p className="text-cream-500 text-sm line-clamp-2 mb-3">{post.excerpt}</p>}
                  <div className="flex items-center justify-between text-xs text-cream-400">
                    <span>{post.authorName}</span>
                    <span>{post.publishedAt ? formatDate(post.publishedAt) : ''}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
