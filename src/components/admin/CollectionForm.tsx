'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
}

interface InitialData {
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
  sortOrder: number;
  productIds: string[];
}

interface Props {
  products: Product[];
  initialData?: InitialData;
  collectionId?: string;
}

export function CollectionForm({ products, initialData, collectionId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [image, setImage] = useState(initialData?.image || '');
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder ?? 0);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialData?.productIds || []);

  function autoSlug(val: string) {
    return val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'giftora/collections');
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImage(data.url);
      toast.success('Image uploaded');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function handleNameChange(val: string) {
    setName(val);
    if (!collectionId) setSlug(autoSlug(val));
  }

  function toggleProduct(id: string) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !slug) return toast.error('Name and slug are required');
    setLoading(true);
    try {
      const url = collectionId ? `/api/admin/collections/${collectionId}` : '/api/admin/collections';
      const method = collectionId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description, image, isActive, sortOrder, productIds: selectedIds }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed');
      }
      toast.success(collectionId ? 'Collection updated' : 'Collection created');
      router.push('/admin/collections');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-xl shadow-card p-6 space-y-4">
        <h2 className="font-semibold text-navy-900">Collection Details</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            placeholder="e.g. Bestsellers"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold-400"
            placeholder="e.g. bestsellers"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            placeholder="Short description shown on the collection page"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              image ? 'border-gold-300 bg-gold-50' : 'border-gray-300 hover:border-gold-400'
            } ${uploading ? 'cursor-wait' : ''}`}
          >
            {image ? (
              <img src={image} alt="Collection" className="mx-auto h-32 object-cover rounded-lg" />
            ) : (
              <div className="space-y-2">
                {uploading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                )}
                <p className="text-sm text-gray-500">
                  {uploading ? 'Uploading…' : 'Click to upload (JPEG, PNG, WebP)'}
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploading}
          />
          {image && (
            <button
              type="button"
              onClick={() => setImage('')}
              className="mt-2 text-xs text-red-500 hover:underline flex items-center gap-1"
            >
              <X size={12} /> Remove image
            </button>
          )}
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              min={0}
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 accent-gold-500"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-navy-900">Products</h2>
          <span className="text-sm text-gray-400">{selectedIds.length} selected</span>
        </div>
        <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 border border-gray-200 rounded-lg">
          {products.map((p) => (
            <label key={p.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.includes(p.id)}
                onChange={() => toggleProduct(p.id)}
                className="w-4 h-4 accent-gold-500"
              />
              <div>
                <p className="text-sm font-medium text-navy-900">{p.name}</p>
                <p className="text-xs text-gray-400 font-mono">{p.slug}</p>
              </div>
            </label>
          ))}
          {products.length === 0 && (
            <p className="px-4 py-6 text-sm text-gray-400 text-center">No active products found</p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="btn-gold px-6 py-2.5 text-sm disabled:opacity-50"
        >
          {loading ? 'Saving…' : collectionId ? 'Save Changes' : 'Create Collection'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/collections')}
          className="px-6 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
