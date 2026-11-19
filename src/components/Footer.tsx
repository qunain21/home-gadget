import { Check, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import { STORE_CONFIG } from '../config/storeConfig';
import type { ProductCategory } from '../types/store';

interface FooterProps {
  onSelectCategory: (category: ProductCategory) => void;
  onNavigateSection: (sectionId: string) => void;
}

export function Footer({ onSelectCategory, onNavigateSection }: FooterProps) {
  const [email, setEmail] = useState('');
  const [newsletterError, setNewsletterError] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    setNewsletterError('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-zinc-900 text-slate-300 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-10 border-b border-zinc-800">
          {/* Store Overview */}
          <div className="lg:col-span-4 space-y-4">
            <p className="font-display text-xl font-bold text-white tracking-tight">
              {STORE_CONFIG.storeName}
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Architectural kitchen appliances, smart home gadgets, cordless cleaning tools, and modular pantry systems designed for everyday reliability.
            </p>
            <div className="space-y-2 text-xs text-zinc-400 pt-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{STORE_CONFIG.storeAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono">{STORE_CONFIG.whatsappDisplayNumber}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{STORE_CONFIG.supportEmail}</span>
              </p>
            </div>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Shop Categories
            </h3>
            <ul className="space-y-2 text-sm">
              {(
                [
                  'Kitchen Appliances',
                  'Home Appliances',
                  'Smart Home Gadgets',
                  'Kitchen Tools & Accessories',
                  'Cleaning Gadgets',
                  'Home Organization',
                  'Daily-Use Gadgets',
                ] as ProductCategory[]
              ).map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(cat)}
                    className="text-zinc-400 hover:text-white transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Links */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Storefront
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection('catalog')}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection('featured-deal')}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Seasonal Deals
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection('reviews')}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Customer Reviews
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/${STORE_CONFIG.whatsappBusinessNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Support</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              New Drops &amp; Deals
            </h3>
            <p className="text-sm text-zinc-400">
              Receive seasonal bundle offers and new smart home product alerts.
            </p>
            {subscribed ? (
              <div className="p-3.5 rounded-lg bg-emerald-950/60 border border-emerald-800/70 text-emerald-200 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Subscribed. Watch your inbox for seasonal offers.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} noValidate className="space-y-2">
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setNewsletterError('');
                    }}
                    placeholder="you@domain.com"
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="min-h-[44px] px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
                  >
                    Subscribe
                  </button>
                </div>
                {newsletterError && (
                  <p className="text-xs text-red-400">{newsletterError}</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom Copyright & Social Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} {STORE_CONFIG.storeName}. All rights reserved.{' '}
            <span className="hidden sm:inline">· {STORE_CONFIG.businessHours}</span>
          </p>
          <div className="flex items-center gap-5 text-zinc-400">
            <a
              href={`https://wa.me/${STORE_CONFIG.whatsappBusinessNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={`mailto:${STORE_CONFIG.supportEmail}`}
              className="hover:text-white transition-colors"
            >
              Email
            </a>
            <button
              type="button"
              onClick={() => onNavigateSection('top')}
              className="hover:text-white transition-colors"
            >
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
