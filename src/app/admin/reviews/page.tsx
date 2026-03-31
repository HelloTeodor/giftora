import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { AdminReviewModerator } from '@/components/admin/AdminReviewModerator';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Reviews | Admin' };

export default async function AdminReviewsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status: statusParam } = await searchParams;
  const status = (statusParam || 'PENDING') as 'PENDING' | 'APPROVED' | 'REJECTED';

  const reviews = await prisma.review.findMany({
    where: { status },
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Reviews</h1>
      </div>

      <div className="flex gap-2">
        {['PENDING', 'APPROVED', 'REJECTED'].map(s => (
          <a key={s} href={`/admin/reviews?status=${s}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${status === s ? 'bg-navy-950 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {s}
          </a>
        ))}
      </div>

      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? 'text-gold-500' : 'text-gray-200'}>★</span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">by {review.user.name || review.user.email}</span>
                  <span className="text-xs text-gray-300">·</span>
                  <a href={`/products/${review.product.slug}`} className="text-xs text-gold-600 hover:underline">{review.product.name}</a>
                </div>
                {review.title && <p className="font-semibold text-gray-900 text-sm">{review.title}</p>}
                <p className="text-gray-600 text-sm mt-1 line-clamp-3">{review.body}</p>
                <p className="text-xs text-gray-400 mt-2">{formatDate(review.createdAt)}</p>
              </div>
              <AdminReviewModerator reviewId={review.id} currentStatus={status} />
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-gray-400 text-center py-12">No {status.toLowerCase()} reviews.</p>}
      </div>
    </div>
  );
}
