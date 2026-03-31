import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Clock, User, Tag, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } });
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.metaTitle || `${post.title} | Giftora Blog`,
    description: post.metaDesc || post.excerpt || undefined,
    openGraph: post.image ? { images: [post.image] } : undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  });

  if (!post) notFound();

  // Increment view count (fire and forget)
  prisma.blogPost.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  // Related posts
  const related = await prisma.blogPost.findMany({
    where: { published: true, NOT: { id: post.id } },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  });

  // Estimate read time (avg 200 words/min)
  const wordCount = post.content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <div className="bg-white border-b border-cream-200">
        {post.image && (
          <div className="w-full h-72 md:h-96 overflow-hidden relative">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
          </div>
        )}
        <div className="section-padding py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-cream-500 mb-6">
            <Link href="/" className="hover:text-gold-600 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/blog" className="hover:text-gold-600 transition-colors">Blog</Link>
            <ChevronRight size={14} />
            <span className="text-navy-700 font-medium line-clamp-1">{post.title}</span>
          </nav>

          <div className="max-w-3xl">
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 text-xs font-semibold text-gold-600 uppercase tracking-wide">
                    <Tag size={11} />{tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy-950 mb-4 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-cream-500 text-lg leading-relaxed mb-6">{post.excerpt}</p>
            )}

            <div className="flex flex-wrap items-center gap-5 text-sm text-cream-400">
              <span className="flex items-center gap-1.5">
                <User size={14} />
                {post.authorName}
              </span>
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {formatDate(post.publishedAt)}
                </span>
              )}
              <span className="text-cream-300">·</span>
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="section-padding py-12">
        <div className="max-w-3xl">
          <div
            className="blog-content text-navy-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content.includes('<') ? post.content : markdownToHtml(post.content) }}
          />

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-cream-200">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-navy-700 hover:text-gold-600 font-medium transition-colors"
            >
              <ArrowLeft size={16} /> Back to Blog
            </Link>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {related.length > 0 && (
        <div className="bg-white border-t border-cream-200">
          <div className="section-padding py-12">
            <h2 className="font-serif text-2xl font-bold text-navy-950 mb-8">More from the Blog</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(rel => (
                <Link key={rel.id} href={`/blog/${rel.slug}`} className="group card-premium overflow-hidden">
                  {rel.image && (
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={rel.image}
                        alt={rel.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    {rel.tags[0] && (
                      <span className="text-gold-600 text-xs font-semibold uppercase tracking-wide">{rel.tags[0]}</span>
                    )}
                    <h3 className="font-serif text-base font-semibold text-navy-950 mt-1 group-hover:text-gold-600 transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
                    {rel.excerpt && (
                      <p className="text-cream-500 text-sm line-clamp-2 mt-1">{rel.excerpt}</p>
                    )}
                    <p className="text-xs text-cream-400 mt-3">{rel.publishedAt ? formatDate(rel.publishedAt) : ''}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple markdown-to-html converter for plain text content stored without HTML tags
function markdownToHtml(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hublp])(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '');
}
