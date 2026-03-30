'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Upload, Loader2 } from 'lucide-react';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase, numbers and hyphens only'),
  description: z.string().optional(),
  icon: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    icon: string | null;
    sortOrder: number;
    isActive: boolean;
    metaTitle: string | null;
    metaDesc: string | null;
  };
}

export function CategoryForm({ category }: Props) {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(category?.image ?? null);
  const [uploading, setUploading] = useState(false);
  const isEditing = !!category;

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category?.name ?? '',
      slug: category?.slug ?? '',
      description: category?.description ?? '',
      icon: category?.icon ?? '',
      sortOrder: category?.sortOrder ?? 0,
      isActive: category?.isActive ?? true,
      metaTitle: category?.metaTitle ?? '',
      metaDesc: category?.metaDesc ?? '',
    },
  });

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    setValue('name', name);
    if (!isEditing) {
      setValue('slug', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImage(data.url);
      toast.success('Image uploaded');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(data: FormData) {
    try {
      const body = { ...data, image };
      const url = isEditing ? `/api/admin/categories/${category.id}` : '/api/admin/categories';
      const method = isEditing ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed');
      }
      toast.success(isEditing ? 'Category updated' : 'Category created');
      router.push('/admin/categories');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? 'Something went wrong');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
      {/* Image */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Category Image</h2>
        <label className="block">
          <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${image ? 'border-gold-300 bg-gold-50' : 'border-gray-300 hover:border-gold-400'}`}>
            {image ? (
              <img src={image} alt="Category" className="mx-auto h-32 object-cover rounded-lg" />
            ) : (
              <div className="space-y-2">
                {uploading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                )}
                <p className="text-sm text-gray-500">{uploading ? 'Uploading…' : 'Click to upload image'}</p>
              </div>
            )}
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
        </label>
        {image && (
          <button type="button" onClick={() => setImage(null)} className="mt-2 text-xs text-red-500 hover:underline">
            Remove image
          </button>
        )}
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-xl shadow-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-navy-900">Basic Information</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              {...register('name')}
              onChange={handleNameChange}
              className="input-field"
              placeholder="e.g. Birthday Gifts"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input {...register('slug')} className="input-field font-mono text-sm" placeholder="birthday-gifts" />
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
            <input {...register('icon')} className="input-field" placeholder="🎂" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <input {...register('sortOrder')} type="number" min={0} className="input-field" />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea {...register('description')} rows={3} className="input-field resize-none" placeholder="Brief category description…" />
          </div>

          <div className="col-span-2 flex items-center gap-3">
            <input {...register('isActive')} type="checkbox" id="isActive" className="w-4 h-4 accent-gold-500" />
            <label htmlFor="isActive" className="text-sm text-gray-700">Active (visible on storefront)</label>
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-xl shadow-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-navy-900">SEO</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
          <input {...register('metaTitle')} className="input-field" placeholder="Overrides page title in search results" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
          <textarea {...register('metaDesc')} rows={2} className="input-field resize-none" placeholder="Short description for search engines (≤160 chars)" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={isSubmitting} className="btn-gold flex items-center gap-2">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEditing ? 'Save Changes' : 'Create Category'}
        </button>
        <button type="button" onClick={() => router.push('/admin/categories')} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}
