import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Shield } from 'lucide-react';
import { ChangePasswordForm } from '@/components/account/ChangePasswordForm';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Security — Giftora' };

export default async function SecurityPage() {
  const session = await auth();
  if (!session) redirect('/login?callbackUrl=/account/security');

  const [user, loginActivity] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { emailVerified: true, accounts: { select: { provider: true } } },
    }),
    prisma.loginActivity.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  const hasPassword = !user?.accounts?.some((a) => a.provider !== 'credentials');
  const oauthProviders = user?.accounts?.filter((a) => a.provider !== 'credentials').map((a) => a.provider) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Security</h1>
        <p className="text-gray-500 mt-1">Manage your password and account security</p>
      </div>

      {/* Email verification */}
      <div className="card-premium p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-navy-950">Email Verification</h2>
            {user?.emailVerified ? (
              <p className="text-sm text-green-600 mt-1">
                Your email is verified — verified on {formatDate(user.emailVerified)}
              </p>
            ) : (
              <p className="text-sm text-amber-600 mt-1">
                Your email is not yet verified. Check your inbox for a verification link.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Connected accounts */}
      {oauthProviders.length > 0 && (
        <div className="card-premium p-6">
          <h2 className="font-semibold text-navy-950 mb-4">Connected Accounts</h2>
          <div className="space-y-3">
            {oauthProviders.map((provider) => (
              <div key={provider} className="flex items-center gap-3 p-3 bg-cream-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center text-sm font-bold text-navy-700 capitalize">
                  {provider[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-navy-900 capitalize">{provider}</p>
                  <p className="text-xs text-gray-400">Connected</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Change password */}
      <div className="card-premium p-6">
        <h2 className="font-semibold text-navy-950 mb-1">Change Password</h2>
        <p className="text-sm text-gray-500 mb-6">
          {oauthProviders.length > 0
            ? 'You signed in with a social account. You can set a password to also enable email/password login.'
            : "Choose a strong password and don't reuse it for other accounts."}
        </p>
        <ChangePasswordForm />
      </div>

      {/* Login activity */}
      {loginActivity.length > 0 && (
        <div className="card-premium p-6">
          <h2 className="font-semibold text-navy-950 mb-4">Recent Login Activity</h2>
          <div className="space-y-3">
            {loginActivity.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between py-2 border-b border-cream-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-navy-900">{activity.userAgent ? activity.userAgent.substring(0, 60) : 'Unknown device'}</p>
                  <p className="text-xs text-gray-400">{activity.ipAddress ?? 'Unknown IP'} · {[activity.city, activity.country].filter(Boolean).join(', ') || 'Unknown location'}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{formatDate(activity.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
