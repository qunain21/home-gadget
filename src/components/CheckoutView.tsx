import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { useState } from 'react';
import { STORE_CONFIG } from '../config/storeConfig';
import type {
  CartItem,
  CheckoutValidationErrors,
  CustomerCheckoutInfo,
} from '../types/store';
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  calculateCartTotals,
  formatCurrency,
  generateOrderReference,
  validateCheckoutForm,
} from '../utils/whatsapp';
import { ResilientImage } from './ResilientImage';

interface CheckoutViewProps {
  items: CartItem[];
  onBackToStore: () => void;
  onOpenCart: () => void;
  onClearCartAfterOrder: () => void;
}

const INITIAL_CUSTOMER: CustomerCheckoutInfo = {
  fullName: '',
  mobileNumber: '',
  whatsappNumber: '',
  sameAsMobile: true,
  address: '',
  city: '',
  instructions: '',
};

export function CheckoutView({
  items,
  onBackToStore,
  onOpenCart,
  onClearCartAfterOrder,
}: CheckoutViewProps) {
  const [customer, setCustomer] =
    useState<CustomerCheckoutInfo>(INITIAL_CUSTOMER);
  const [errors, setErrors] = useState<CheckoutValidationErrors>({});
  const [submittedOrder, setSubmittedOrder] = useState<{
    orderRef: string;
    message: string;
    whatsappUrl: string;
    total: number;
    customerName: string;
    itemCount: number;
  } | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const totals = calculateCartTotals(items);

  const handleFieldChange = (
    field: keyof CustomerCheckoutInfo,
    value: string | boolean,
  ) => {
    setCustomer((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'sameAsMobile' && value === true) {
        updated.whatsappNumber = prev.mobileNumber;
      }
      if (field === 'mobileNumber' && prev.sameAsMobile) {
        updated.whatsappNumber = String(value);
      }
      return updated;
    });

    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (field === 'sameAsMobile' && value === true) {
      setErrors((prev) => ({ ...prev, whatsappNumber: undefined }));
    }
  };

  const handlePlaceWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) return;

    const validationErrors = validateCheckoutForm(customer);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(`checkout-${firstErrorField}`);
      element?.focus();
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const orderRef = generateOrderReference();
    const message = buildWhatsAppOrderMessage({
      orderRef,
      customer,
      items,
    });
    const whatsappUrl = buildWhatsAppUrl(message);

    setSubmittedOrder({
      orderRef,
      message,
      whatsappUrl,
      total: totals.total,
      customerName: customer.fullName.trim(),
      itemCount: totals.itemCount,
    });

    // Trigger anchor navigation directly inside user submit gesture (avoids window.open)
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onClearCartAfterOrder();
  };

  const handleCopyOrder = async () => {
    if (!submittedOrder) return;
    try {
      await navigator.clipboard.writeText(submittedOrder.message);
      setCopiedMessage(true);
      window.setTimeout(() => setCopiedMessage(false), 2000);
    } catch {
      // Fallback if clipboard permissions are restricted
      setCopiedMessage(false);
    }
  };

  // Verified Order Confirmation Screen after WhatsApp Redirect
  if (submittedOrder) {
    return (
      <div className="bg-slate-50 py-10 sm:py-16 min-h-[75vh]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  Order {submittedOrder.orderRef} Ready
                </p>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-zinc-900">
                  Send Your Order on WhatsApp
                </h1>
              </div>
            </div>

            <p className="text-sm text-zinc-600 leading-relaxed mb-6">
              Thank you, <strong className="text-zinc-900">{submittedOrder.customerName}</strong>.
              Your formatted order for{' '}
              <span className="font-mono tabular-nums font-semibold text-zinc-900">
                {submittedOrder.itemCount} item{submittedOrder.itemCount === 1 ? '' : 's'}
              </span>{' '}
              ({formatCurrency(submittedOrder.total)}) has been prepared for{' '}
              <span className="font-mono">{STORE_CONFIG.whatsappDisplayNumber}</span>.
              If WhatsApp did not open automatically, tap the button below.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <a
                href={submittedOrder.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-h-[48px] px-5 py-3 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Open WhatsApp to Send Order</span>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </a>
              <button
                type="button"
                onClick={handleCopyOrder}
                className="min-h-[48px] px-4 py-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-zinc-800 text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors"
              >
                {copiedMessage ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-800" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Message</span>
                  </>
                )}
              </button>
            </div>

            {/* Formatted Message Preview */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Generated WhatsApp Order Message
              </p>
              <pre className="text-xs font-mono text-zinc-800 whitespace-pre-wrap break-words leading-relaxed">
                {submittedOrder.message}
              </pre>
            </div>

            <button
              type="button"
              onClick={onBackToStore}
              className="min-h-[44px] inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart Guard on Checkout
  if (items.length === 0) {
    return (
      <div className="bg-slate-50 py-16 min-h-[70vh]">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="bg-white border border-slate-200 rounded-xl p-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-5 h-5 text-zinc-500" />
            </div>
            <h1 className="font-display text-2xl font-bold text-zinc-900">
              Your bag is empty
            </h1>
            <p className="text-sm text-zinc-600 mt-2 mb-6">
              Add home or kitchen gadgets to your shopping bag before completing WhatsApp checkout.
            </p>
            <button
              type="button"
              onClick={onBackToStore}
              className="min-h-[48px] px-6 py-3 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-semibold transition-colors"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-6 sm:py-10 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Back Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
          <button
            type="button"
            onClick={onBackToStore}
            className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shopping</span>
          </button>
          <button
            type="button"
            onClick={onOpenCart}
            className="min-h-[44px] px-3 text-sm font-medium text-emerald-900 hover:underline"
          >
            Edit Bag ({totals.itemCount})
          </button>
        </div>

        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            Express Order Checkout
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-900">
            Delivery Details &amp; WhatsApp Confirmation
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Customer Checkout Form */}
          <form
            onSubmit={handlePlaceWhatsAppOrder}
            noValidate
            className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-8 space-y-5"
          >
            <div className="pb-4 border-b border-slate-100">
              <h2 className="font-display text-lg font-semibold text-zinc-900">
                Customer Information
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                All required fields must be filled in before sending your order to WhatsApp.
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="checkout-fullName"
                className="block text-sm font-medium text-zinc-800 mb-1.5"
              >
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                id="checkout-fullName"
                type="text"
                autoComplete="name"
                value={customer.fullName}
                onChange={(e) => handleFieldChange('fullName', e.target.value)}
                placeholder="e.g. Jordan Mercer"
                aria-invalid={Boolean(errors.fullName)}
                className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-lg border text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 transition-colors ${
                  errors.fullName
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-slate-300 focus:border-emerald-800 focus:ring-emerald-900/15'
                }`}
              />
              {errors.fullName && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            {/* Mobile & WhatsApp Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="checkout-mobileNumber"
                  className="block text-sm font-medium text-zinc-800 mb-1.5"
                >
                  Mobile Number <span className="text-red-600">*</span>
                </label>
                <input
                  id="checkout-mobileNumber"
                  type="tel"
                  autoComplete="tel"
                  value={customer.mobileNumber}
                  onChange={(e) =>
                    handleFieldChange('mobileNumber', e.target.value)
                  }
                  placeholder="e.g. +1 555 234 5678"
                  aria-invalid={Boolean(errors.mobileNumber)}
                  className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-lg border text-sm font-mono text-zinc-900 bg-white focus:outline-none focus:ring-2 transition-colors ${
                    errors.mobileNumber
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-slate-300 focus:border-emerald-800 focus:ring-emerald-900/15'
                  }`}
                />
                {errors.mobileNumber && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.mobileNumber}</span>
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <label
                    htmlFor="checkout-whatsappNumber"
                    className="block text-sm font-medium text-zinc-800"
                  >
                    WhatsApp Number <span className="text-red-600">*</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-zinc-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={customer.sameAsMobile}
                      onChange={(e) =>
                        handleFieldChange('sameAsMobile', e.target.checked)
                      }
                      className="rounded border-slate-300 text-emerald-800 focus:ring-emerald-800"
                    />
                    <span>Same as mobile</span>
                  </label>
                </div>
                <input
                  id="checkout-whatsappNumber"
                  type="tel"
                  disabled={customer.sameAsMobile}
                  value={
                    customer.sameAsMobile
                      ? customer.mobileNumber
                      : customer.whatsappNumber
                  }
                  onChange={(e) =>
                    handleFieldChange('whatsappNumber', e.target.value)
                  }
                  placeholder="e.g. +1 555 234 5678"
                  aria-invalid={Boolean(errors.whatsappNumber)}
                  className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-lg border text-sm font-mono focus:outline-none focus:ring-2 transition-colors ${
                    customer.sameAsMobile
                      ? 'bg-slate-50 text-zinc-500 border-slate-200 cursor-not-allowed'
                      : errors.whatsappNumber
                        ? 'bg-white text-zinc-900 border-red-500 focus:ring-red-200'
                        : 'bg-white text-zinc-900 border-slate-300 focus:border-emerald-800 focus:ring-emerald-900/15'
                  }`}
                />
                {errors.whatsappNumber && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.whatsappNumber}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Complete Delivery Address */}
            <div>
              <label
                htmlFor="checkout-address"
                className="block text-sm font-medium text-zinc-800 mb-1.5"
              >
                Complete Delivery Address <span className="text-red-600">*</span>
              </label>
              <textarea
                id="checkout-address"
                rows={3}
                autoComplete="street-address"
                value={customer.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder="Street address, building / house number, apartment, and nearby landmark"
                aria-invalid={Boolean(errors.address)}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 transition-colors ${
                  errors.address
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-slate-300 focus:border-emerald-800 focus:ring-emerald-900/15'
                }`}
              />
              {errors.address && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.address}</span>
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="checkout-city"
                className="block text-sm font-medium text-zinc-800 mb-1.5"
              >
                City <span className="text-red-600">*</span>
              </label>
              <input
                id="checkout-city"
                type="text"
                autoComplete="address-level2"
                value={customer.city}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                placeholder="e.g. Seattle"
                aria-invalid={Boolean(errors.city)}
                className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-lg border text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 transition-colors ${
                  errors.city
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-slate-300 focus:border-emerald-800 focus:ring-emerald-900/15'
                }`}
              />
              {errors.city && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.city}</span>
                </p>
              )}
            </div>

            {/* Optional Order Instructions */}
            <div>
              <label
                htmlFor="checkout-instructions"
                className="block text-sm font-medium text-zinc-800 mb-1.5"
              >
                Additional Order Instructions{' '}
                <span className="text-zinc-400 font-normal">(Optional)</span>
              </label>
              <input
                id="checkout-instructions"
                type="text"
                value={customer.instructions}
                onChange={(e) =>
                  handleFieldChange('instructions', e.target.value)
                }
                placeholder="Preferred delivery window, gate code, or gift note"
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-zinc-900 bg-white focus:outline-none focus:border-emerald-800 focus:ring-2 focus:ring-emerald-900/15 transition-colors"
              />
            </div>

            {/* WhatsApp Checkout Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full min-h-[52px] px-6 py-3.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 active:scale-[0.99] text-white text-sm sm:text-base font-semibold inline-flex items-center justify-center gap-2.5 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>Place Order on WhatsApp</span>
              </button>
              <p className="mt-3 text-xs text-zinc-500 flex items-center justify-center gap-1.5 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>
                  Generates your complete itemized order and opens WhatsApp ({STORE_CONFIG.whatsappDisplayNumber})
                </span>
              </p>
            </div>
          </form>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-semibold text-zinc-900 pb-4 border-b border-slate-100">
              Order Summary ({totals.itemCount}{' '}
              {totals.itemCount === 1 ? 'item' : 'items'})
            </h2>

            <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variant}`}
                  className="py-3.5 flex items-center gap-3.5"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <ResilientImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      containerClassName="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {item.variant} · Qty{' '}
                      <span className="font-mono tabular-nums font-medium text-zinc-700">
                        {item.quantity}
                      </span>
                    </p>
                    <p className="font-mono tabular-nums text-xs text-zinc-500 mt-0.5">
                      {formatCurrency(item.price)} each
                    </p>
                  </div>
                  <p className="font-mono tabular-nums text-sm font-semibold text-zinc-900 shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums font-medium text-zinc-900">
                  {formatCurrency(totals.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Express Delivery</span>
                <span className="font-mono tabular-nums font-medium text-zinc-900">
                  {totals.shipping === 0
                    ? 'FREE'
                    : formatCurrency(totals.shipping)}
                </span>
              </div>
              {totals.totalSavings > 0 && (
                <div className="flex justify-between text-emerald-800 text-xs font-medium">
                  <span>Discount Applied</span>
                  <span className="font-mono tabular-nums">
                    -{formatCurrency(totals.totalSavings)}
                  </span>
                </div>
              )}
              <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-bold text-zinc-900">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums">
                  {formatCurrency(totals.total)}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
