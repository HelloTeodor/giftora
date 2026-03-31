export const dynamic = 'force-dynamic';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AddressManager } from '@/components/account/AddressManager';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Addresses' };

export default async function AddressesPage() {
  const session = await auth();
  const addresses = await prisma.address.findMany({
    where: { userId: session!.user.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-navy-950">Address Book</h1>
        <p className="text-cream-500 text-sm mt-1">Manage your saved shipping and billing addresses.</p>
      </div>
      <AddressManager addresses={addresses} />
    </div>
  );
}
