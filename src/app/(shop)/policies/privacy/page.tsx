import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPolicyPage() {
  return (
    <div className="section-padding py-16 max-w-3xl mx-auto">
      <h1 className="font-serif text-4xl font-bold text-navy-950 mb-4">Privacy Policy</h1>
      <p className="text-cream-500 mb-10">Last updated: {new Date().toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

      <div className="prose prose-lg max-w-none text-navy-700 space-y-8">
        {[
          { title: '1. Information We Collect', body: 'We collect information you provide directly to us when creating an account, placing an order, or contacting us. This includes your name, email address, postal address, phone number, and payment information. We also automatically collect certain information when you visit our website, including your IP address, browser type, and pages viewed.' },
          { title: '2. How We Use Your Information', body: 'We use your information to process orders and payments, deliver products, send order confirmations and shipping updates, respond to your inquiries, send marketing communications (with your consent), improve our services, and comply with legal obligations.' },
          { title: '3. Data Sharing', body: 'We do not sell your personal data. We share your information with service providers who help us operate our business, including payment processors (Stripe), shipping carriers, and email providers. These providers are contractually obligated to protect your data.' },
          { title: '4. Cookies', body: 'We use cookies and similar tracking technologies to enhance your browsing experience, remember your preferences, and analyse website traffic. You can control cookies through your browser settings. For more information, see our Cookie Policy.' },
          { title: '5. Data Retention', body: 'We retain your personal data for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your account and associated data at any time.' },
          { title: '6. Your Rights (GDPR)', body: 'As an EU resident, you have the right to access, rectify, erase, restrict processing, and port your personal data. You also have the right to object to processing and withdraw consent at any time. To exercise these rights, contact us at privacy@giftora.com.' },
          { title: '7. Security', body: 'We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or destruction. All payments are processed via SSL-encrypted connections.' },
          { title: '8. Contact Us', body: 'If you have any questions about this Privacy Policy, please contact us at privacy@giftora.com or write to: Giftora, Dublin, Ireland.' },
        ].map(section => (
          <div key={section.title}>
            <h2 className="font-serif text-xl font-bold text-navy-950 mb-3">{section.title}</h2>
            <p className="leading-relaxed text-cream-700">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
