'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { COUNTRIES } from '@/lib/countries';
import { Plus, MapPin, Trash2, Check, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const schema = z.object({
  label: z.string().optional(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  company: z.string().optional(),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().optional(),
  postalCode: z.string().min(3),
  country: z.string().min(2),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
});
type FormData = z.infer<typeof schema>;

interface Address {
  id: string; label?: string | null; firstName: string; lastName: string;
  company?: string | null; addressLine1: string; addressLine2?: string | null;
  city: string; state?: string | null; postalCode: string; country: string;
  phone?: string | null; isDefault: boolean;
}

export function AddressManager({ addresses }: { addresses: Address[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isDefault: addresses.length === 0 },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    const res = await fetch('/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success('Address saved!');
      setShowForm(false);
      reset();
      router.refresh();
    } else {
      toast.error('Failed to save address');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this address?')) return;
    const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Address deleted'); router.refresh(); }
  };

  const handleSetDefault = async (id: string) => {
    const res = await fetch(`/api/addresses/${id}/default`, { method: 'PATCH' });
    if (res.ok) { toast.success('Default address updated'); router.refresh(); }
  };

  return (
    <div className="space-y-4">
      {addresses.map(addr => (
        <div key={addr.id} className={`card-premium p-5 flex items-start justify-between gap-4 ${addr.isDefault ? 'border border-gold-200 bg-gold-50/30' : ''}`}>
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-gold-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-navy-950 text-sm">{addr.firstName} {addr.lastName}</p>
                {addr.label && <span className="text-xs text-cream-500 bg-cream-100 px-2 py-0.5 rounded-full">{addr.label}</span>}
                {addr.isDefault && <span className="text-xs text-gold-700 bg-gold-100 px-2 py-0.5 rounded-full font-medium">Default</span>}
              </div>
              {addr.company && <p className="text-sm text-cream-600">{addr.company}</p>}
              <address className="not-italic text-sm text-cream-600 leading-relaxed">
                {addr.addressLine1}, {addr.city} {addr.postalCode}, {addr.country}
              </address>
              {addr.phone && <p className="text-sm text-cream-500 mt-0.5">{addr.phone}</p>}
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {!addr.isDefault && (
              <button onClick={() => handleSetDefault(addr.id)} className="p-1.5 text-cream-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-all" title="Set as default">
                <Check size={14} />
              </button>
            )}
            <button onClick={() => handleDelete(addr.id)} className="p-1.5 text-cream-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="w-full py-4 border-2 border-dashed border-cream-200 rounded-2xl text-cream-500 hover:border-gold-300 hover:text-gold-600 transition-all flex items-center justify-center gap-2 text-sm font-medium">
          <Plus size={16} /> Add New Address
        </button>
      )}

      {showForm && (
        <div className="card-premium p-6">
          <h3 className="font-serif text-lg font-semibold text-navy-950 mb-4">Add New Address</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">First Name *</label>
                <input {...register('firstName')} className="input-field" />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Last Name *</label>
                <input {...register('lastName')} className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Address Line 1 *</label>
              <input {...register('addressLine1')} className="input-field" />
              {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">City *</label>
                <input {...register('city')} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Postal Code *</label>
                <input {...register('postalCode')} className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Country *</label>
              <select {...register('country')} className="input-field">
                <option value="">Select country</option>
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isDefault')} className="accent-gold-500" />
              <span className="text-sm text-cream-600">Set as default address</span>
            </label>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-gold text-sm px-6 py-2.5 disabled:opacity-60">
                {saving ? 'Saving…' : 'Save Address'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); reset(); }} className="text-sm text-cream-500 hover:text-navy-700 px-4 py-2.5">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
