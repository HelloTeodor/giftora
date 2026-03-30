'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, ThumbsUp, Camera } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { formatDate, getInitials } from '@/lib/utils';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(10, 'Review must be at least 10 characters'),
});
type ReviewForm = z.infer<typeof reviewSchema>;

interface Review {
  id: string; rating: number; title?: string | null; body: string;
  images: string[]; isVerifiedPurchase: boolean; helpfulCount: number;
  createdAt: Date; user: { name?: string | null; avatar?: string | null };
}

interface Props {
  productId: string;
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export function ReviewsSection({ productId, reviews, rating, reviewCount }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 },
  });
  const selectedRating = watch('rating');

  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: reviews.filter(rv => rv.rating === r).length,
  }));

  const onSubmit = async (data: ReviewForm) => {
    if (!session) { router.push('/login'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, productId }),
      });
      if (res.ok) {
        toast.success('Review submitted for moderation!');
        setShowForm(false);
        router.refresh();
      } else {
        const json = await res.json();
        toast.error(json.error || 'Could not submit review');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      {/* Summary */}
      {reviewCount > 0 && (
        <div className="flex flex-col sm:flex-row gap-8 mb-10 p-6 bg-cream-50 rounded-2xl">
          <div className="text-center">
            <p className="font-serif text-5xl font-bold text-navy-950">{rating.toFixed(1)}</p>
            <div className="flex justify-center my-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className={i < Math.round(rating) ? 'text-gold-500 fill-gold-500' : 'text-cream-200'} />
              ))}
            </div>
            <p className="text-cream-500 text-sm">{reviewCount} reviews</p>
          </div>
          <div className="flex-1 space-y-2">
            {ratingCounts.map(({ rating: r, count }) => (
              <div key={r} className="flex items-center gap-3 text-sm">
                <span className="w-3 text-navy-700">{r}</span>
                <Star size={12} className="text-gold-400 fill-gold-400" />
                <div className="flex-1 bg-cream-200 rounded-full h-2">
                  <div
                    className="bg-gold-400 h-2 rounded-full"
                    style={{ width: `${reviewCount ? (count / reviewCount) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-6 text-cream-500 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write review button */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl font-semibold text-navy-950">
          {reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}
        </h3>
        {!showForm && (
          <button
            onClick={() => session ? setShowForm(true) : router.push('/login')}
            className="btn-navy text-sm px-4 py-2"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-cream-50 rounded-2xl p-6 mb-8 space-y-4">
          <h4 className="font-serif text-lg font-semibold text-navy-950">Share your experience</h4>
          <div>
            <p className="text-sm font-medium text-navy-700 mb-2">Rating *</p>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onMouseEnter={() => setHoverRating(i + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setValue('rating', i + 1)}
                  className="transition-transform hover:scale-110"
                >
                  <Star size={28} className={i < (hoverRating || selectedRating) ? 'text-gold-500 fill-gold-500' : 'text-cream-300'} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Review Title</label>
            <input {...register('title')} placeholder="Summarise your experience" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Your Review *</label>
            <textarea {...register('body')} rows={4} placeholder="Tell others what you thought about this product..." className="input-field resize-none" />
            {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body.message}</p>}
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="btn-gold text-sm px-6 py-2.5 disabled:opacity-60">
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 text-sm text-cream-500 hover:text-navy-700">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p className="text-cream-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.id} className="border-b border-cream-100 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-navy-950 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {review.user.avatar
                    ? <Image src={review.user.avatar} alt="" width={36} height={36} className="rounded-full" />
                    : getInitials(review.user.name)
                  }
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-navy-950 text-sm">{review.user.name || 'Anonymous'}</p>
                    {review.isVerifiedPurchase && (
                      <span className="text-xs text-green-600 font-medium">✓ Verified Purchase</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < review.rating ? 'text-gold-500 fill-gold-500' : 'text-cream-200'} />
                      ))}
                    </div>
                    <span className="text-xs text-cream-400">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              </div>
              {review.title && <h5 className="font-serif font-semibold text-navy-950 mb-1">{review.title}</h5>}
              <p className="text-cream-600 text-sm leading-relaxed mb-3">{review.body}</p>
              {review.images.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {review.images.map((img, i) => (
                    <div key={i} className="w-16 h-16 rounded-lg overflow-hidden bg-cream-100">
                      <Image src={img} alt="" width={64} height={64} className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
              <button className="flex items-center gap-1.5 text-xs text-cream-400 hover:text-navy-700 transition-colors">
                <ThumbsUp size={12} /> Helpful ({review.helpfulCount})
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
