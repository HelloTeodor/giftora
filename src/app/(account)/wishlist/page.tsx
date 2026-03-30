import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/shop/ProductCard';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Wishlist' };

export default async function WishlistPage() {
  const session = await auth();
  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { userId: session!.user.id },
    include: {
      product: {
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          category: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const products = wishlistItems.map(i => ({
    ...i.product,
    basePrice: Number(i.product.basePrice),
    salePrice: i.product.salePrice ? Number(i.product.salePrice) : null,
    rating: Number(i.product.rating),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-navy-950">My Wishlist</h1>
        <p className="text-cream-500 text-sm mt-1">{wishlistItems.length} saved items</p>
      </div>

      {products.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <Heart size={40} className="text-cream-300 mx-auto mb-4" />
          <h3 className="font-serif text-xl text-navy-950 mb-2">Your wishlist is empty</h3>
          <p className="text-cream-500 text-sm mb-6">Save products you love and shop them later.</p>
          <Link href="/products" className="btn-gold text-sm px-6 py-2.5 inline-flex items-center gap-2">
            Discover Gift Boxes <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
