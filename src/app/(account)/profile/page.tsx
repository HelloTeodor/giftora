import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProfileForm } from '@/components/account/ProfileForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Profile' };

export default async function ProfilePage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { id: true, name: true, firstName: true, lastName: true, email: true, phone: true, avatar: true, newsletterOptIn: true, createdAt: true, loyaltyPoints: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-navy-950">My Profile</h1>
        <p className="text-cream-500 text-sm mt-1">Manage your personal information and preferences.</p>
      </div>
      <ProfileForm user={user!} />
    </div>
  );
}
