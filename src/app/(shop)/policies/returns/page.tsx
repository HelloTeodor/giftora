import Link from 'next/link';
import { RotateCcw, CheckCircle, Package, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Returns & Refunds Policy' };

export default function ReturnsPage() {
  return (
    <div className="section-padding py-16 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <RotateCcw size={28} className="text-gold-600" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-navy-950 mb-3">Returns & Refunds</h1>
        <p className="text-cream-500">We want you to be completely happy with your purchase. If you're not, we'll make it right.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {[
          { icon: Clock, label: '30-Day Window', desc: 'Return within 30 days' },
          { icon: CheckCircle, label: 'Hassle-Free', desc: 'Simple returns process' },
          { icon: Package, label: 'Full Refund', desc: 'Money-back guarantee' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="card-premium p-4 text-center">
            <Icon size={22} className="text-gold-500 mx-auto mb-2" />
            <p className="font-semibold text-navy-950 text-sm">{label}</p>
            <p className="text-cream-500 text-xs">{desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-8 text-navy-700">
        <div>
          <h2 className="font-serif text-xl font-bold text-navy-950 mb-3">Our Return Policy</h2>
          <p className="leading-relaxed text-cream-700">We offer a full 30-day return policy on all eligible items. Items must be in their original, unopened condition with all packaging intact. Once we receive your return, we'll process your refund within 5–10 business days.</p>
        </div>

        <div>
          <h2 className="font-serif text-xl font-bold text-navy-950 mb-3">What Can Be Returned?</h2>
          <ul className="space-y-2 text-cream-700">
            <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> Unopened gift boxes in original condition</li>
            <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> Items received damaged or defective</li>
            <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> Incorrect items received</li>
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-xl font-bold text-navy-950 mb-3">Non-Returnable Items</h2>
          <ul className="space-y-2 text-cream-700">
            <li>• Personalised or custom-engraved items</li>
            <li>• Opened food, beverage, or perishable items</li>
            <li>• Digital products or gift cards</li>
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-xl font-bold text-navy-950 mb-3">How to Return</h2>
          <ol className="space-y-3 text-cream-700">
            <li className="flex gap-3"><span className="w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center text-gold-700 text-xs font-bold flex-shrink-0">1</span> Log in and go to your order history</li>
            <li className="flex gap-3"><span className="w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center text-gold-700 text-xs font-bold flex-shrink-0">2</span> Select the order and click "Request Return"</li>
            <li className="flex gap-3"><span className="w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center text-gold-700 text-xs font-bold flex-shrink-0">3</span> Print your prepaid return label</li>
            <li className="flex gap-3"><span className="w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center text-gold-700 text-xs font-bold flex-shrink-0">4</span> Drop off at any post office</li>
          </ol>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="text-cream-500 mb-4">Still have questions?</p>
        <Link href="/contact" className="btn-gold text-sm px-6 py-2.5 inline-block">Contact Support</Link>
      </div>
    </div>
  );
}
