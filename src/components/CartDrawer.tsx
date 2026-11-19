import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { STORE_CONFIG } from '../config/storeConfig';
import type { CartItem } from '../types/store';
import { calculateCartTotals, formatCurrency } from '../utils/whatsapp';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, variant: string, delta: number) => void;
  onRemoveItem: (productId: string, variant: string) => void;
  onProceedToCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const totals = calculateCartTotals(items);
  const freeShippingProgress = Math.min(
    100,
    Math.round((totals.subtotal / STORE_CONFIG.freeShippingThreshold) * 100),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <aside className="relative z-10 w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-zinc-900" />
            <h2 className="font-display text-lg font-bold text-zinc-900">
              Your Bag
            </h2>
            <span className="font-mono tabular-nums text-xs text-zinc-500">
              ({totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'})
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping bag"
            className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center rounded-lg text-zinc-600 hover:bg-slate-100 hover:text-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Bar */}
        {items.length > 0 && (
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
            <p className="text-xs font-medium text-zinc-700 mb-2">
              {totals.qualifiesForFreeShipping ? (
                <span className="text-emerald-800 font-semibold">
                  You unlocked free express shipping.
                </span>
              ) : (
                <span>
                  Add{' '}
                  <span className="font-mono tabular-nums font-semibold text-zinc-900">
                    {formatCurrency(totals.amountToFreeShipping)}
                  </span>{' '}
                  more for free express shipping
                </span>
              )}
            </p>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-800 transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-zinc-400" />
              </div>
              <h3 className="font-display text-lg font-semibold text-zinc-900">
                Your bag is empty
              </h3>
              <p className="text-sm text-zinc-600 mt-1.5 max-w-xs">
                Explore precision kitchen tools, smart home hubs, and daily cleaning hardware.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 min-h-[44px] px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.variant}`}
                className="py-4 flex gap-4"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <ResilientImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-zinc-900 leading-snug line-clamp-2">
                        {item.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.productId, item.variant)}
                        aria-label={`Remove ${item.name}`}
                        className="min-h-[36px] min-w-[36px] -mt-1 -mr-1.5 flex items-center justify-center rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">{item.variant}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    {/* Quantity Stepper */}
                    <div className="inline-flex items-center border border-slate-300 rounded-lg bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity(item.productId, item.variant, -1)
                        }
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="min-h-[38px] min-w-[38px] flex items-center justify-center text-zinc-700 hover:bg-slate-50 rounded-l-lg"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-mono tabular-nums text-xs font-semibold text-zinc-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity(item.productId, item.variant, 1)
                        }
                        aria-label={`Increase quantity of ${item.name}`}
                        className="min-h-[38px] min-w-[38px] flex items-center justify-center text-zinc-700 hover:bg-slate-50 rounded-r-lg"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-mono tabular-nums text-sm font-semibold text-zinc-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="font-mono tabular-nums text-[11px] text-zinc-400">
                          {formatCurrency(item.price)} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout Trigger */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums font-medium text-zinc-900">
                  {formatCurrency(totals.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Delivery</span>
                <span className="font-mono tabular-nums font-medium text-zinc-900">
                  {totals.shipping === 0
                    ? 'FREE'
                    : formatCurrency(totals.shipping)}
                </span>
              </div>
              {totals.totalSavings > 0 && (
                <div className="flex justify-between text-emerald-800 text-xs font-medium">
                  <span>Bundle &amp; Sale Savings</span>
                  <span className="font-mono tabular-nums">
                    -{formatCurrency(totals.totalSavings)}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-zinc-900">
                <span>Estimated Total</span>
                <span className="font-mono tabular-nums">
                  {formatCurrency(totals.total)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full min-h-[48px] px-5 py-3 rounded-lg bg-emerald-900 hover:bg-emerald-800 active:scale-[0.99] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
