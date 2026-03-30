'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Plus, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { slugify } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(3, 'Name required'),
  slug: z.string().min(3, 'Slug required'),
  sku: z.string().min(2, 'SKU required'),
  description: z.string().min(20, 'Description required'),
  shortDesc: z.string().optional(),
  categoryId: z.string().min(1, 'Category required'),
  basePrice: z.coerce.number().min(0.01, 'Price required'),
  salePrice: z.coerce.number().optional().nullable(),
  costPrice: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().int().min(0),
  lowStockAlert: z.coerce.number().int().min(0),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']),
  featured: z.boolean(),
  brand: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Category { id: string; name: string; slug: string }

interface Props {
  categories: Category[];
  product?: FormData & { id: string; images?: { url: string; id: string }[] };
}

export function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<{ url: string; file?: File }[]>(
    product?.images?.map(i => ({ url: i.url })) || []
  );
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: product || {
      status: 'DRAFT',
      featured: false,
      stock: 0,
      lowStockAlert: 5,
    },
  });

  const name = watch('name');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('name', val);
    if (!product) setValue('slug', slugify(val));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const { url } = await res.json();
        setImages(prev => [...prev, { url }]);
      } catch {
        toast.error('Failed to upload image');
      }
    }
    setUploading(false);
  };

  const onSubmit = async (data: FormData) => {
    if (images.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...data, images: images.map((img, i) => ({ url: img.url, isPrimary: i === 0, sortOrder: i })) };
      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const method = product ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success(product ? 'Product updated!' : 'Product created!');
        router.push('/admin/products');
        router.refresh();
      } else {
        const json = await res.json();
        toast.error(json.error || 'Failed to save product');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-6">
      {/* Left: Main Info */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold text-gray-900 mb-4">Product Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
              <input
                {...register('name')}
                onChange={handleNameChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug *</label>
                <input {...register('slug')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 font-mono" />
                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU *</label>
                <input {...register('sku')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 font-mono" />
                {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Description</label>
              <input {...register('shortDesc')} placeholder="Brief summary (shown on product cards)" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Description *</label>
              <textarea {...register('description')} rows={6} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-y" />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold text-gray-900 mb-4">Product Images</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                {i === 0 && <span className="absolute bottom-1 left-1 text-xs bg-gold-500 text-white px-1.5 py-0.5 rounded font-medium">Primary</span>}
                <button
                  type="button"
                  onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-gold-400 flex flex-col items-center justify-center cursor-pointer transition-colors">
              <Upload size={18} className="text-gray-400 mb-1" />
              <span className="text-xs text-gray-400">Upload</span>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
          {uploading && <p className="text-sm text-gold-600">Uploading…</p>}
          <p className="text-xs text-gray-400">First image will be the primary image. Supported: JPG, PNG, WebP</p>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold text-gray-900 mb-4">SEO</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Title</label>
              <input {...register('metaTitle')} placeholder="Defaults to product name" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Description</label>
              <textarea {...register('metaDesc')} rows={3} placeholder="For search engines (160 chars recommended)" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Right: Sidebar */}
      <div className="space-y-5">
        {/* Status */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h2 className="font-semibold text-gray-900 mb-3">Status & Visibility</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select {...register('status')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400">
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" {...register('featured')} className="w-4 h-4 accent-gold-500" />
              <span className="text-sm text-gray-700">Featured on homepage</span>
            </label>
          </div>
        </div>

        {/* Category */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h2 className="font-semibold text-gray-900 mb-3">Category</h2>
          <select {...register('categoryId')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400">
            <option value="">Select category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h2 className="font-semibold text-gray-900 mb-3">Pricing</h2>
          <div className="space-y-3">
            {[
              { name: 'basePrice', label: 'Base Price (€) *' },
              { name: 'salePrice', label: 'Sale Price (€)' },
              { name: 'costPrice', label: 'Cost Price (€)' },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input
                  {...register(name as keyof FormData)}
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
                {errors[name as keyof FormData] && (
                  <p className="text-red-500 text-xs mt-1">{String(errors[name as keyof FormData]?.message)}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h2 className="font-semibold text-gray-900 mb-3">Inventory</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity</label>
              <input {...register('stock')} type="number" min="0" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Low Stock Alert</label>
              <input {...register('lowStockAlert')} type="number" min="0" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand</label>
              <input {...register('brand')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 bg-gold-500 text-white py-3 rounded-xl font-semibold hover:bg-gold-600 transition-colors shadow-gold disabled:opacity-60">
          <Save size={16} />
          {saving ? 'Saving…' : product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
