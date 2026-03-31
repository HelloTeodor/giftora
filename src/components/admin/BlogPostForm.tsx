'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Loader2, X } from 'lucide-react';
import { ImageUpload } from './ImageUpload';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  authorName: z.string().min(1, 'Author name is required'),
  published: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  tagInput: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    image: string | null;
    authorName: string;
    published: boolean;
    metaTitle: string | null;
    metaDesc: string | null;
    tags: string[];
  };
  authorName: string;
}

export function BlogPostForm({ post, authorName }: Props) {
  const router = useRouter();
  const isEditing = !!post;
  const [image, setImage] = useState<string>(post?.image ?? '');
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [tagInput, setTagInput] = useState('');

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: post?.title ?? '',
      slug: post?.slug ?? '',
      excerpt: post?.excerpt ?? '',
      content: post?.content ?? '',
      authorName: post?.authorName ?? authorName,
      published: post?.published ?? false,
      metaTitle: post?.metaTitle ?? '',
      metaDesc: post?.metaDesc ?? '',
    },
  });

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setValue('title', title);
    if (!isEditing) {
      setValue('slug', title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function onSubmit(data: FormData) {
    try {
      const body = { ...data, image, tags };
      delete (body as any).tagInput;
      const url = isEditing ? `/api/admin/blog/${post.id}` : '/api/admin/blog';
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
      toast.success(isEditing ? 'Post updated' : 'Post created');
      router.push('/admin/blog');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? 'Something went wrong');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input {...register('title')} onChange={handleTitleChange} className="input-field text-lg font-semibold" placeholder="How to Choose the Perfect Gift Box…" />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input {...register('slug')} className="input-field font-mono text-sm" placeholder="how-to-choose-the-perfect-gift-box" />
              {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea {...register('excerpt')} rows={2} className="input-field resize-none" placeholder="Short summary shown in blog listings…" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <textarea {...register('content')} rows={20} className="input-field resize-y font-mono text-sm" placeholder="Write your blog post content here… (Markdown supported)" />
              {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl shadow-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-navy-900">SEO</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
              <input {...register('metaTitle')} className="input-field" placeholder="Overrides title in search results" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea {...register('metaDesc')} rows={2} className="input-field resize-none" placeholder="Short description (≤160 chars)" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish */}
          <div className="bg-white rounded-xl shadow-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-navy-900">Publishing</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
              <input {...register('authorName')} className="input-field" />
              {errors.authorName && <p className="text-red-500 text-xs mt-1">{errors.authorName.message}</p>}
            </div>
            <div className="flex items-center gap-3">
              <input {...register('published')} type="checkbox" id="published" className="w-4 h-4 accent-gold-500" />
              <label htmlFor="published" className="text-sm text-gray-700">Publish immediately</label>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button type="submit" disabled={isSubmitting} className="btn-gold w-full flex items-center justify-center gap-2">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Create Post'}
              </button>
              <button type="button" onClick={() => router.push('/admin/blog')} className="btn-outline w-full">
                Cancel
              </button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-lg font-semibold text-navy-900 mb-4">Featured Image</h2>
            <ImageUpload
              value={image}
              onChange={setImage}
              folder="giftora/blog"
              label="Cover Image"
            />
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-lg font-semibold text-navy-900 mb-4">Tags</h2>
            <div className="flex gap-2 mb-3">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                className="input-field flex-1 text-sm"
                placeholder="Add tag…"
              />
              <button type="button" onClick={addTag} className="btn-outline px-3 text-sm">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-navy-50 text-navy-700 rounded-full text-xs font-medium">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="text-navy-400 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
