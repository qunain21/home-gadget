import { Menu, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { STORE_CONFIG } from '../config/storeConfig';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigateHome: (sectionId?: string) => void;
  showPromoBanner: boolean;
  onDismissPromo: () => void;
}

export function Header({
  cartCount,
  onOpenCart,
  onNavigateHome,
  showPromoBanner,
  onDismissPromo,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (sectionId?: string) => {
    setMobileMenuOpen(false);
    onNavigateHome(sectionId);
  };

  return (
    <div className="sticky top-0 z-40">
      {showPromoBanner && (
        <div className="bg-zinc-900 text-slate-100 h-8 px-4 flex items-center justify-between text-xs border-b border-zinc-800">
          <div className="w-6 shrink-0" aria-hidden="true" />
          <p className="truncate text-center font-medium tracking-tight">
            Free express shipping on orders over{' '}
            <span className="font-mono tabular-nums">
              {STORE_CONFIG.currencySymbol}
              {STORE_CONFIG.freeShippingThreshold}
            </span>
            <span className="mx-2 text-zinc-500" aria-hidden="true">
              ·
            </span>
            Direct WhatsApp order confirmation
          </p>
          <button
            type="button"
            onClick={onDismissPromo}
            aria-label="Dismiss announcement"
            className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white transition-colors shrink-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center rounded-lg text-zinc-700 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('top');
              }}
              className="font-display text-lg sm:text-xl font-bold tracking-tight text-zinc-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 rounded"
            >
              {STORE_CONFIG.storeName}
            </a>
          </div>

          {/* Zone 2: Concise Navigation Links (Desktop) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600"
          >
            <button
              type="button"
              onClick={() => handleLinkClick('catalog')}
              className="hover:text-zinc-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 rounded px-1 py-1"
            >
              Catalog
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('categories')}
              className="hover:text-zinc-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 rounded px-1 py-1"
            >
              Categories
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('featured-deal')}
              className="hover:text-zinc-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 rounded px-1 py-1"
            >
              Deals
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('reviews')}
              className="hover:text-zinc-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 rounded px-1 py-1"
            >
              Reviews
            </button>
          </nav>

          {/* Zone 3: Single Primary Action (Shopping Bag) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Open shopping bag, ${cartCount} items`}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 active:scale-[0.98] text-white text-sm font-medium inline-flex items-center gap-2 transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Bag</span>
              <span className="font-mono tabular-nums text-xs bg-emerald-950/60 px-1.5 py-0.5 rounded">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg"
          >
            <button
              type="button"
              onClick={() => handleLinkClick('catalog')}
              className="w-full min-h-[44px] px-3 flex items-center justify-between text-left text-sm font-medium text-zinc-800 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <span>Shop All Gadgets</span>
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('categories')}
              className="w-full min-h-[44px] px-3 flex items-center justify-between text-left text-sm font-medium text-zinc-800 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <span>Browse Categories</span>
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('featured-deal')}
              className="w-full min-h-[44px] px-3 flex items-center justify-between text-left text-sm font-medium text-zinc-800 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <span>Seasonal Deals</span>
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('reviews')}
              className="w-full min-h-[44px] px-3 flex items-center justify-between text-left text-sm font-medium text-zinc-800 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <span>Customer Reviews</span>
            </button>
          </nav>
        )}
      </header>
    </div>
  );
}
