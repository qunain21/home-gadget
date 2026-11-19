import {
  ArrowLeft,
  Check,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';
import { useState } from 'react';
import { STORE_CONFIG } from '../config/storeConfig';
import type { Product } from '../types/store';
import { formatCurrency } from '../utils/whatsapp';
import { ProductCard } from './ProductCard';
import { ResilientImage } from './ResilientImage';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
  onBackToCatalog: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, variant: string, quantity: number) => void;
  onBuyNow: (product: Product, variant: string, quantity: number) => void;
}

export function ProductDetailView({
  product,
  relatedProducts,
  onBackToCatalog,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
}: ProductDetailViewProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const savingsAmount =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice - product.price
      : 0;

  const handleAdd = () => {
    onAddToCart(product, selectedVariant, quantity);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1600);
  };

  return (
    <div className="bg-slate-50 pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 mb-6 sm:mb-8">
          <button
            type="button"
            onClick={onBackToCatalog}
            className="min-h-[40px] inline-flex items-center gap-1.5 font-medium text-zinc-800 hover:text-emerald-900 transition-colors focus-visible:outline-none focus-visible:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catalog</span>
          </button>
          <span className="text-zinc-300" aria-hidden="true">
            /
          </span>
          <span className="truncate">{product.category}</span>
          <span className="text-zinc-300 hidden sm:inline" aria-hidden="true">
            /
          </span>
          <span className="hidden sm:inline text-zinc-900 font-medium truncate">
            {product.name}
          </span>
        </div>

        {/* Main 2-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Sticky Product Imagery Left */}
          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-white border border-slate-200">
              <ResilientImage
                src={product.image}
                alt={product.name}
                loading="eager"
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
              />
            </div>
          </div>

          {/* Contiguous Purchase Module Right */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 sm:p-8">
            <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 mb-2">
              <span className="uppercase tracking-wider font-semibold text-emerald-800">
                {product.category}
              </span>
              <span className="font-mono">SKU {product.sku}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-900 text-balance leading-tight">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-sm text-zinc-600">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="font-mono tabular-nums font-semibold text-zinc-900">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-zinc-300" aria-hidden="true">
                ·
              </span>
              <span className="font-mono tabular-nums">
                {product.reviewCount} verified reviews
              </span>
              <span className="text-zinc-300" aria-hidden="true">
                ·
              </span>
              <span className="text-emerald-800 font-medium">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Pricing */}
            <div className="mt-5 pb-5 border-b border-slate-100 flex items-baseline gap-3 flex-wrap">
              <span className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-zinc-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="font-mono tabular-nums text-base text-zinc-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {savingsAmount > 0 && (
                <span className="text-xs font-semibold text-emerald-800 font-mono tabular-nums">
                  You save {formatCurrency(savingsAmount)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-5 text-sm sm:text-base text-zinc-600 leading-relaxed">
              {product.description}
            </p>

            {/* Variant / Finish Selector */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2.5">
                Finish / Option: <span className="text-zinc-900">{selectedVariant}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => {
                  const isActive = variant === selectedVariant;
                  return (
                    <button
                      key={variant}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 ${
                        isActive
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-white text-zinc-700 border-slate-300 hover:border-zinc-500'
                      }`}
                    >
                      {variant}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Action Buttons */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Quantity
                </span>
                <div className="inline-flex items-center border border-slate-300 rounded-lg bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-700 hover:bg-slate-50 rounded-l-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-mono tabular-nums text-sm font-semibold text-zinc-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    aria-label="Increase quantity"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-700 hover:bg-slate-50 rounded-r-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`min-h-[48px] px-5 py-3 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 ${
                    addedFeedback
                      ? 'bg-emerald-800 text-white'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-white active:scale-[0.98]'
                  }`}
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onBuyNow(product, selectedVariant, quantity)}
                  className="min-h-[48px] px-5 py-3 rounded-lg bg-emerald-900 hover:bg-emerald-800 active:scale-[0.98] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Checkout Now</span>
                </button>
              </div>
            </div>

            {/* Delivery & Warranty Notes */}
            <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs sm:text-sm text-zinc-600">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>
                  Free express shipping over {STORE_CONFIG.currencySymbol}
                  {STORE_CONFIG.freeShippingThreshold} · Same-day dispatch
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>2-year hardware warranty &amp; 30-day return guarantee</span>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="mt-7 pt-6 border-t border-slate-200">
              <h2 className="font-display text-base font-semibold text-zinc-900 mb-3">
                Technical Specifications
              </h2>
              <dl className="divide-y divide-slate-100 text-sm">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="py-2.5 flex items-start justify-between gap-4"
                  >
                    <dt className="text-zinc-500 shrink-0">{spec.label}</dt>
                    <dd className="text-zinc-900 font-medium text-right">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-14 pt-10 border-t border-slate-200">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-zinc-900 mb-6">
              Frequently Paired With
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={(p, v) => onAddToCart(p, v, 1)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky Bottom Buy Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-zinc-500 truncate">{product.name}</p>
          <p className="font-mono tabular-nums text-base font-bold text-zinc-900">
            {formatCurrency(product.price * quantity)}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="min-h-[44px] px-5 py-2.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-semibold inline-flex items-center gap-2 shrink-0"
        >
          {addedFeedback ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bag</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
