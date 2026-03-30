'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag, Heart, Star, Truck, Shield, RotateCcw,
  Share2, Minus, Plus, ChevronRight, Package, Gift
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cart';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { ReviewsSection } from './ReviewsSection';

interface Props {
  product: {
    id: string; name: string; slug: string; description: string;
    shortDesc?: string | null; sku: string; brand?: string | null;
    basePrice: number; salePrice?: number | null; stock: number;
    rating: number; reviewCount: number; soldCount: number;
    images: { id: string; url: string; altText?: string | null; isPrimary: boolean }[];
    category: { name: string; slug: string };
    tags: { id: string; name: string; slug: string }[];
    variants: {
      id: string; name: string; sku: string; price?: number | null;
      salePrice?: number | null; stock: number; image?: string | null;
      options: Record<string, string>;
    }[];
    reviews: {
      id: string; rating: number; title?: string | null; body: string;
      images: string[]; isVerifiedPurchase: boolean; helpfulCount: number;
      createdAt: Date; user: { name?: string | null; avatar?: string | null };
    }[];
  };
}

export function ProductDetail({ product }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const { addItem } = useCartStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [giftNote, setGiftNote] = useState('');
  const [showGiftNote, setShowGiftNote] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');

  const variant = product.variants.find(v => v.id === selectedVariant);
  const price = variant?.price ?? variant?.salePrice ?? product.salePrice ?? product.basePrice;
  const originalPrice = product.basePrice;
  const discount = product.salePrice ? calculateDiscount(product.basePrice, product.salePrice) : null;
  const inStock = (variant?.stock ?? product.stock) > 0;
  const maxQty = variant?.stock ?? product.stock;

  const handleAddToCart = () => {
    if (!inStock) return;
    setAddingToCart(true);
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price,
        image: product.images[selectedImage]?.url,
        stock: maxQty,
      },
      variant
        ? {
            id: variant.id,
            name: variant.name,
            price: variant.price,
            stock: variant.stock,
          }
        : undefined,
      quantity
    );
    toast.success('Added to cart!');
    setTimeout(() => setAddingToCart(false), 600);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const handleWishlist = async () => {
    if (!session) { router.push('/login'); return; }
    const res = await fetch('/api/wishlist', {
      method: wishlisted ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id }),
    });
    if (res.ok) {
      setWishlisted(!wishlisted);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist!');
    }
  };

  // Get unique variant option keys
  const variantOptionKeys = product.variants.length > 0
    ? Object.keys(product.variants[0].options)
    : [];

  return (
    <div className="section-padding py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-cream-500 mb-8">
        <Link href="/" className="hover:text-gold-600 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-gold-600 transition-colors">Gift Boxes</Link>
        <ChevronRight size={14} />
        <Link href={`/categories/${product.category.slug}`} className="hover:text-gold-600 transition-colors">
          {product.category.name}
        </Link>
        <ChevronRight size={14} />
        <span className="text-navy-700 font-medium truncate max-w-48">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-100 group">
            {product.images[selectedImage] ? (
              <Image
                src={product.images[selectedImage].url}
                alt={product.images[selectedImage].altText || product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Gift size={64} className="text-cream-300" />
              </div>
            )}
            {discount && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                -{discount}%
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === i ? 'border-gold-500' : 'border-transparent hover:border-cream-300'
                  }`}
                >
                  <Image src={img.url} alt={`View ${i + 1}`} width={80} height={80} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <Link href={`/categories/${product.category.slug}`} className="text-gold-600 text-sm font-semibold uppercase tracking-wide hover:underline">
                {product.category.name}
              </Link>
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-navy-950 mt-1 leading-tight">
                {product.name}
              </h1>
            </div>
            <button
              onClick={handleWishlist}
              className={`p-2.5 rounded-xl border transition-all flex-shrink-0 ${
                wishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-cream-200 text-navy-600 hover:border-red-200 hover:text-red-500'
              }`}
            >
              <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < Math.round(product.rating) ? 'text-gold-500 fill-gold-500' : 'text-cream-200'} />
                ))}
              </div>
              <span className="text-navy-700 text-sm font-medium">{product.rating.toFixed(1)}</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-cream-500 text-sm hover:text-gold-600 transition-colors"
              >
                ({product.reviewCount} reviews)
              </button>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-bold text-3xl text-navy-950">{formatPrice(price)}</span>
            {product.salePrice && (
              <>
                <span className="text-cream-400 text-xl line-through">{formatPrice(originalPrice)}</span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded">Save {discount}%</span>
              </>
            )}
          </div>

          {product.shortDesc && (
            <p className="text-cream-600 leading-relaxed mb-6">{product.shortDesc}</p>
          )}

          {/* Variants */}
          {variantOptionKeys.length > 0 && (
            <div className="mb-6 space-y-4">
              {variantOptionKeys.map(key => {
                const options = [...new Set(product.variants.map(v => v.options[key]))];
                return (
                  <div key={key}>
                    <p className="text-sm font-semibold text-navy-700 mb-2 capitalize">{key}</p>
                    <div className="flex flex-wrap gap-2">
                      {options.map(opt => {
                        const v = product.variants.find(v => v.options[key] === opt);
                        const selected = v && selectedVariant === v.id;
                        return (
                          <button
                            key={opt}
                            onClick={() => setSelectedVariant(v?.id || null)}
                            disabled={v?.stock === 0}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                              selected
                                ? 'bg-navy-950 text-white border-navy-950'
                                : v?.stock === 0
                                ? 'border-cream-200 text-cream-300 cursor-not-allowed line-through'
                                : 'border-cream-200 text-navy-700 hover:border-gold-400 hover:text-gold-600'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-sm font-semibold text-navy-700">Quantity</p>
            <div className="flex items-center border border-cream-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-navy-600 hover:bg-cream-50 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center font-semibold text-navy-950">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                disabled={quantity >= maxQty}
                className="w-10 h-10 flex items-center justify-center text-navy-600 hover:bg-cream-50 transition-colors disabled:opacity-40"
              >
                <Plus size={14} />
              </button>
            </div>
            <span className="text-sm text-cream-500">
              {inStock ? `${maxQty} available` : 'Out of stock'}
            </span>
          </div>

          {/* Gift Note */}
          <button
            onClick={() => setShowGiftNote(!showGiftNote)}
            className="flex items-center gap-2 text-sm text-gold-600 hover:underline mb-4"
          >
            <Gift size={15} />
            {showGiftNote ? 'Remove gift note' : 'Add a personal gift note'}
          </button>
          {showGiftNote && (
            <textarea
              value={giftNote}
              onChange={(e) => setGiftNote(e.target.value)}
              placeholder="Write your personal message here... (up to 200 characters)"
              maxLength={200}
              rows={3}
              className="input-field text-sm mb-4 resize-none"
            />
          )}

          {/* CTAs */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={!inStock || addingToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-navy-950 text-white font-semibold rounded-xl hover:bg-navy-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={18} />
              {addingToCart ? 'Adding…' : inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="flex-1 btn-gold py-3.5 disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-cream-100">
            {[
              { icon: Truck, label: 'Free shipping', sub: 'Orders over €75' },
              { icon: RotateCcw, label: '30-day returns', sub: 'Hassle-free' },
              { icon: Shield, label: 'Secure checkout', sub: 'SSL encrypted' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1">
                <Icon size={18} className="text-gold-500" />
                <span className="text-xs font-medium text-navy-700">{label}</span>
                <span className="text-xs text-cream-400">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Description, Details, Reviews */}
      <div className="border-t border-cream-200">
        <div className="flex border-b border-cream-200">
          {(['description', 'details', 'reviews'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-gold-500 text-gold-600'
                  : 'text-cream-500 hover:text-navy-700'
              }`}
            >
              {tab === 'reviews' ? `Reviews (${product.reviewCount})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-2xl text-navy-700 leading-relaxed">
              {product.description.split('\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>
          )}
          {activeTab === 'details' && (
            <div className="max-w-md space-y-3">
              {[
                { label: 'SKU', value: product.sku },
                { label: 'Brand', value: product.brand || 'Giftora' },
                { label: 'Category', value: product.category.name },
                { label: 'Tags', value: product.tags.map(t => t.name).join(', ') || '—' },
              ].map(({ label, value }) => value && (
                <div key={label} className="flex justify-between py-2 border-b border-cream-100 text-sm">
                  <span className="font-medium text-navy-700">{label}</span>
                  <span className="text-cream-600">{value}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'reviews' && (
            <ReviewsSection productId={product.id} reviews={product.reviews} rating={product.rating} reviewCount={product.reviewCount} />
          )}
        </div>
      </div>
    </div>
  );
}
