'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, Grid2X2, List } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { formatPrice } from '@/lib/utils';

interface Category { id: string; name: string; slug: string; }
interface Product {
  id: string; name: string; slug: string; shortDesc?: string | null;
  basePrice: number; salePrice?: number | null; stock: number;
  rating: number; reviewCount: number; featured: boolean;
  images: { url: string; isPrimary: boolean }[];
  category: { name: string; slug: string };
}
interface Props {
  initialData: {
    products: Product[];
    total: number;
    totalPages: number;
    page: number;
    categories: Category[];
  };
}

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export function ProductsClient({ initialData }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const updateParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete('page'); // reset page on filter change
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  const currentCategory = searchParams.get('category');
  const currentSort = searchParams.get('sort') || 'popular';
  const isSale = searchParams.get('sale') === 'true';

  const { products, total, totalPages, page, categories } = initialData;

  return (
    <div className="section-padding py-8">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-cream-200 rounded-lg text-sm font-medium text-navy-700 hover:bg-cream-50 transition-colors"
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
          {/* Active filters */}
          {currentCategory && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-100 text-gold-800 rounded-full text-xs font-medium">
              {categories.find(c => c.slug === currentCategory)?.name || currentCategory}
              <button onClick={() => updateParam('category', null)}><X size={12} /></button>
            </span>
          )}
          {isSale && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
              On Sale <button onClick={() => updateParam('sale', null)}><X size={12} /></button>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <span className="text-sm text-cream-500">{total} products</span>
          <select
            value={currentSort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="border border-cream-200 rounded-lg px-3 py-2 text-sm text-navy-700 bg-white focus:outline-none focus:ring-2 focus:ring-gold-400"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <div className="flex border border-cream-200 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-navy-950 text-white' : 'text-navy-600 hover:bg-cream-50'}`}>
              <Grid2X2 size={16} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-navy-950 text-white' : 'text-navy-600 hover:bg-cream-50'}`}>
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        {filtersOpen && (
          <div className="w-64 flex-shrink-0 space-y-6">
            <div className="card-premium p-5">
              <h3 className="font-semibold text-navy-950 mb-3 text-sm uppercase tracking-wide">Occasions</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      checked={currentCategory === cat.slug}
                      onChange={() => updateParam('category', cat.slug)}
                      className="accent-gold-500"
                    />
                    <span className={`text-sm ${currentCategory === cat.slug ? 'text-gold-600 font-medium' : 'text-navy-700 group-hover:text-gold-600'}`}>
                      {cat.name}
                    </span>
                  </label>
                ))}
                {currentCategory && (
                  <button onClick={() => updateParam('category', null)} className="text-xs text-cream-500 hover:text-red-500 mt-1">
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="card-premium p-5">
              <h3 className="font-semibold text-navy-950 mb-3 text-sm uppercase tracking-wide">Price Range</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Under €50', min: '0', max: '50' },
                  { label: '€50–€75', min: '50', max: '75' },
                  { label: '€75–€100', min: '75', max: '100' },
                  { label: '€100+', min: '100', max: '' },
                ].map(r => (
                  <button
                    key={r.label}
                    onClick={() => {
                      updateParam('minPrice', r.min);
                      updateParam('maxPrice', r.max || null);
                    }}
                    className="text-xs px-2 py-1.5 border border-cream-200 rounded-lg hover:border-gold-400 hover:text-gold-600 transition-all text-navy-700"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-premium p-5">
              <h3 className="font-semibold text-navy-950 mb-3 text-sm uppercase tracking-wide">Special</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isSale} onChange={(e) => updateParam('sale', e.target.checked ? 'true' : null)} className="accent-gold-500" />
                <span className="text-sm text-navy-700">On Sale</span>
              </label>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-xl text-navy-700 mb-2">No products found</p>
              <p className="text-cream-500 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => updateParam('page', String(p))}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    page === p
                      ? 'bg-navy-950 text-white'
                      : 'border border-cream-200 text-navy-700 hover:border-gold-400 hover:text-gold-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
