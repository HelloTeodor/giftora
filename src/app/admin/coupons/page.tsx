import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Tag } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Coupons | Admin' };

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-500 text-sm mt-1">{coupons.length} coupon codes</p>
        </div>
        <Link href="/admin/coupons/new" className="flex items-center gap-2 bg-gold-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gold-600 transition-colors">
          <Plus size={16} /> New Coupon
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100">
              <th className="text-left px-5 py-3">Code</th>
              <th className="text-left px-5 py-3">Type</th>
              <th className="text-left px-5 py-3">Value</th>
              <th className="text-left px-5 py-3">Uses</th>
              <th className="text-left px-5 py-3">Expires</th>
              <th className="text-left px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {coupons.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-gold-500" />
                    <span className="font-mono font-bold text-sm text-gray-900">{c.code}</span>
                  </div>
                  {c.description && <p className="text-xs text-gray-400 mt-0.5">{c.description}</p>}
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{c.type}</td>
                <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                  {c.type === 'PERCENTAGE' ? `${c.value}%` : `€${c.value}`}
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">
                  {c.usageCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">
                  {c.expiresAt ? formatDate(c.expiresAt) : 'No expiry'}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
