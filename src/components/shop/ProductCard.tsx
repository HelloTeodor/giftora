'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, Gift, Eye } from 'lucide-react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cart';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    shortDesc?: string | null;
    basePrice: number;
    salePrice?: number | null;
    stock: number;
    rating: number;
    reviewCount: number;
    featured?: boolean;
    images: { url: string; isPrimary: boolean }[];
    category: { name: string; slug: string };
  };
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { addItem } = useCartStore();
  const [wishlisted, setWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const primaryImage = product.images.find((i) => i.isPrimary)?.url || product.images[0]?.url;
  const price = product.salePrice ?? product.basePrice;
  const discount = product.salePrice
    ? calculateDiscount(product.basePrice, product.salePrice)
    : null;
  const inStock = product.stock > 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    setAddingToCart(true);
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price,
      image: primaryImage,
      stock: product.stock,
    });
    toast.success('Added to cart!');
    setTimeout(() => setAddingToCart(false), 600);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      router.push('/login');
      return;
    }
    try {
      const res = await fetch('/api/wishlist', {
        method: wishlisted ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
      if (res.ok) {
        setWishlisted(!wishlisted);
        toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className={cn('group relative card-premium overflow-hidden', className)}>
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden aspect-[4/3]">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-cream-100 flex items-center justify-center">
            <Gift size={40} className="text-cream-300" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
              -{discount}%
            </span>
          )}
          {product.featured && !discount && (
            <span className="badge-gold text-xs">Featured</span>
          )}
          {!inStock && (
            <span className="bg-gray-700 text-white text-xs font-medium px-2 py-0.5 rounded-md">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
          <button
            onClick={handleWishlist}
            className={cn(
              'w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center transition-all hover:scale-110',
              wishlisted ? 'text-red-500' : 'text-navy-600 hover:text-red-500'
            )}
            aria-label="Add to wishlist"
          >
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/products/${product.slug}`); }}
            className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-navy-600 hover:text-gold-600 transition-all hover:scale-110"
            aria-label="Quick view"
          >
            <Eye size={16} />
          </button>
        </div>

        {/* Add to cart overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={!inStock || addingToCart}
            className={cn(
              'w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold transition-all',
              inStock
                ? 'bg-navy-950 text-white hover:bg-gold-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
          >
            <ShoppingBag size={16} />
            {addingToCart ? 'Adding…' : inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-gold-600 font-medium mb-1 uppercase tracking-wide">
          {product.category.name}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-serif text-navy-950 font-semibold leading-tight mb-1 hover:text-gold-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        {product.shortDesc && (
          <p className="text-sm text-cream-600 line-clamp-2 mb-3">{product.shortDesc}</p>
        )}

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < Math.round(product.rating) ? 'text-gold-500 fill-gold-500' : 'text-cream-300'}
                />
              ))}
            </div>
            <span className="text-xs text-cream-500">({product.reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-navy-950">{formatPrice(price)}</span>
          {product.salePrice && (
            <span className="text-sm text-cream-400 line-through">{formatPrice(product.basePrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
