'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="section-padding py-16">
      <div className="text-center mb-12">
        <p className="text-gold-600 text-sm font-semibold uppercase tracking-widest mb-3">Get in Touch</p>
        <h1 className="font-serif text-4xl font-bold text-navy-950 mb-3">Contact Us</h1>
        <p className="text-cream-500 max-w-lg mx-auto">We're here to help! Send us a message and we'll respond within 24 hours.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
        {/* Info */}
        <div className="lg:col-span-2 space-y-6">
          {[
            { icon: Mail, label: 'Email', value: 'hello@giftora.com', href: 'mailto:hello@giftora.com' },
            { icon: Phone, label: 'Phone', value: '+353 1 234 5678', href: 'tel:+353123456789' },
            { icon: MapPin, label: 'Address', value: 'Dublin, Ireland', href: null },
            { icon: Clock, label: 'Hours', value: 'Mon–Fri: 9am–6pm IST', href: null },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gold-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-gold-600" />
              </div>
              <div>
                <p className="font-medium text-navy-950 text-sm">{label}</p>
                {href ? (
                  <a href={href} className="text-cream-600 text-sm hover:text-gold-600 transition-colors">{value}</a>
                ) : (
                  <p className="text-cream-600 text-sm">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-3 card-premium p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Your Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Jane Doe" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Email *</label>
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" required placeholder="you@example.com" className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Subject *</label>
              <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required className="input-field">
                <option value="">Select a subject</option>
                <option>Order enquiry</option>
                <option>Returns & refunds</option>
                <option>Corporate & bulk orders</option>
                <option>Product question</option>
                <option>Partnership enquiry</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Message *</label>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={5} placeholder="How can we help you?" className="input-field resize-none" />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full py-3 disabled:opacity-60">
              {loading ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
