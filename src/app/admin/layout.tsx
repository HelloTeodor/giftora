import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/utils';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-navy-950 flex">
      <AdminSidebar user={session.user} />
      <main className="flex-1 bg-gray-50 min-h-screen overflow-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
