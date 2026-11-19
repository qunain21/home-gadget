import { ArrowRight, MessageCircle, ShieldCheck, Truck, Zap } from 'lucide-react';
import { STORE_CONFIG } from '../config/storeConfig';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  onShopCatalog: () => void;
  onViewDeals: () => void;
}

export function HeroSection({ onShopCatalog, onViewDeals }: HeroSectionProps) {
  return (
    <section id="top" className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Editorial Copy Column */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <p className="text-xs font-medium uppercase tracking-wider text-emerald-800 mb-3">
              Home &amp; Kitchen Collection · 2026
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 text-balance leading-[1.12] mb-5">
              Thoughtful hardware for the daily kitchen and calm home.
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed mb-7 max-w-xl">
              Precision temperature kettles, cordless cleaning scrubbers, smart energy monitors, and airtight pantry systems built for lasting daily use.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onShopCatalog}
                className="min-h-[48px] px-6 py-3 rounded-lg bg-emerald-900 hover:bg-emerald-800 active:scale-[0.98] text-white text-sm font-semibold inline-flex items-center gap-2 transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onViewDeals}
                className="min-h-[48px] px-5 py-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-zinc-900 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
              >
                Explore Seasonal Deals
              </button>
            </div>
          </div>

          {/* Feature Media Column */}
          <div className="lg:col-span-7">
            <div className="relative h-64 sm:h-80 lg:h-full min-h-[280px] lg:min-h-[420px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <ResilientImage
                src={STORE_CONFIG.heroImage}
                alt="Modern limestone kitchen counter featuring matte black precision kettle and espresso brewer"
                loading="eager"
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-5 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <p className="text-xs font-medium text-slate-200">
                    Featured Bundle · Save $60
                  </p>
                  <p className="font-display text-lg sm:text-xl font-semibold text-white">
                    Morning Ritual Countertop Coffee Set
                  </p>
                </div>
                <span className="font-mono tabular-nums text-sm font-medium text-white shrink-0">
                  {STORE_CONFIG.currencySymbol}219.00
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Store Assurance Strip */}
        <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Free Express Delivery
              </p>
              <p className="text-xs text-zinc-600 mt-0.5">
                On all orders over {STORE_CONFIG.currencySymbol}
                {STORE_CONFIG.freeShippingThreshold}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Direct WhatsApp Checkout
              </p>
              <p className="text-xs text-zinc-600 mt-0.5">
                Instant human confirmation &amp; delivery updates
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                2-Year Hardware Warranty
              </p>
              <p className="text-xs text-zinc-600 mt-0.5">
                Full replacement coverage on every appliance
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Same-Day Dispatch
              </p>
              <p className="text-xs text-zinc-600 mt-0.5">
                Orders confirmed before 3:00 PM ship same day
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
