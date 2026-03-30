import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Settings | Admin' };

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your store settings.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          { title: 'Store Details', desc: 'Update store name, address, and contact info.', status: 'Configure' },
          { title: 'Payment Settings', desc: 'Manage Stripe, PayPal, and other payment methods.', status: 'Configure' },
          { title: 'Shipping Zones', desc: 'Define shipping rates and delivery zones.', status: 'Configure' },
          { title: 'Tax Settings', desc: 'Set up VAT and regional tax rules.', status: 'Configure' },
          { title: 'Email Templates', desc: 'Customise transactional email templates.', status: 'Configure' },
          { title: 'Integrations', desc: 'Connect with CRM, ERP, and marketing tools.', status: 'Configure' },
          { title: 'Security', desc: 'Manage admin access, 2FA, and audit logs.', status: 'Configure' },
          { title: 'Backup & Recovery', desc: 'Schedule database backups and restore points.', status: 'Configure' },
        ].map(setting => (
          <div key={setting.title} className="bg-white rounded-2xl p-5 shadow-card flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{setting.title}</h3>
              <p className="text-gray-500 text-sm mt-0.5">{setting.desc}</p>
            </div>
            <button className="text-sm text-gold-600 hover:underline font-medium ml-4 flex-shrink-0">{setting.status}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
