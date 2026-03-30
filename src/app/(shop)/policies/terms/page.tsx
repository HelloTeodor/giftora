import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <div className="section-padding py-16 max-w-3xl mx-auto">
      <h1 className="font-serif text-4xl font-bold text-navy-950 mb-4">Terms of Service</h1>
      <p className="text-cream-500 mb-10">Last updated: {new Date().toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

      <div className="space-y-8 text-navy-700">
        {[
          { title: '1. Acceptance of Terms', body: 'By accessing and using Giftora, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our service.' },
          { title: '2. Products & Orders', body: 'All product descriptions, images, and prices are accurate to the best of our knowledge. We reserve the right to modify prices without notice. Orders are subject to acceptance and availability. We reserve the right to refuse service.' },
          { title: '3. Payment', body: 'Payment is required at the time of order. We accept all major credit and debit cards via Stripe, as well as PayPal. All transactions are secured with SSL encryption.' },
          { title: '4. Shipping & Delivery', body: 'Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers, customs, or circumstances beyond our control. Free shipping applies to orders over €75 within Ireland.' },
          { title: '5. Returns & Refunds', body: 'We offer a 30-day return policy for items in original, unopened condition. Personalised or custom items cannot be returned unless defective. Refunds are processed within 5–10 business days.' },
          { title: '6. Intellectual Property', body: 'All content on this website, including text, images, logos, and designs, is owned by Giftora and protected by intellectual property laws. You may not use our content without written permission.' },
          { title: '7. Limitation of Liability', body: 'To the maximum extent permitted by law, Giftora shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.' },
          { title: '8. Governing Law', body: 'These Terms are governed by the laws of Ireland. Any disputes will be resolved in the courts of Dublin, Ireland.' },
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
