'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2, X, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, folder = 'giftora/uploads', label = 'Image', className = '' }: Props) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlDraft, setUrlDraft] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', folder);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
      toast.success('Image uploaded');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleUrlSubmit() {
    if (!urlDraft.trim()) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('url', urlDraft.trim());
      form.append('folder', folder);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
      setUrlDraft('');
      toast.success('Image imported from URL');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to import URL');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              mode === 'upload' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Upload size={11} /> Upload file
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              mode === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <LinkIcon size={11} /> Paste URL
          </button>
        </div>
      </div>

      {/* Preview */}
      {value && (
        <div className="relative mb-3 inline-block">
          <img src={value} alt="Preview" className="h-32 rounded-xl object-cover border border-gray-200" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {mode === 'upload' ? (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            uploading ? 'border-gold-300 bg-gold-50 cursor-wait' : 'border-gray-300 hover:border-gold-400 cursor-pointer'
          }`}
        >
          {uploading ? (
            <div className="space-y-1">
              <Loader2 className="w-7 h-7 animate-spin text-gold-500 mx-auto" />
              <p className="text-sm text-gray-500">Uploading…</p>
            </div>
          ) : (
            <div className="space-y-1">
              <ImageIcon className="w-7 h-7 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-600 font-medium">Click to upload</p>
              <p className="text-xs text-gray-400">JPEG, PNG or WebP</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlDraft}
            onChange={e => setUrlDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleUrlSubmit())}
            placeholder="https://example.com/image.jpg"
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            disabled={uploading || !urlDraft.trim()}
            className="px-4 py-2 bg-navy-950 text-white text-sm font-semibold rounded-xl hover:bg-navy-800 transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            Import
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
        disabled={uploading}
      />
    </div>
  );
}
