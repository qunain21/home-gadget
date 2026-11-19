import { Check, Plus, Star } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../types/store';
import { formatCurrency } from '../utils/whatsapp';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, variant: string) => void;
}

export function ProductCard({
  product,
  onSelectProduct,
  onAddToCart,
}: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, product.variants[0]);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Uniform 4:3 Studio Product Image */}
      <button
        type="button"
        onClick={() => onSelectProduct(product)}
        className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-800"
      >
        <ResilientImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          containerClassName="w-full h-full"
        />
      </button>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Clean Unboxed Metadata Line */}
        <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 mb-1.5">
          <span className="uppercase tracking-wider font-medium truncate">
            {product.category}
          </span>
          {product.statusTag && (
            <span className="font-medium text-emerald-800 whitespace-nowrap shrink-0">
              {product.statusTag}
            </span>
          )}
        </div>

        {/* Title */}
        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          className="text-left focus-visible:outline-none focus-visible:underline"
        >
          <h3 className="font-display text-base sm:text-lg font-semibold text-zinc-900 leading-snug line-clamp-2 group-hover:text-emerald-900 transition-colors">
            {product.name}
          </h3>
        </button>

        {/* Short Description */}
        <p className="text-sm text-zinc-600 mt-1.5 line-clamp-2 flex-1">
          {product.shortDescription}
        </p>

        {/* Rating Line */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-600">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
          <span className="font-mono tabular-nums font-medium text-zinc-900">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-zinc-400" aria-hidden="true">
            ·
          </span>
          <span className="font-mono tabular-nums">
            {product.reviewCount} reviews
          </span>
        </div>

        {/* Price + Action Row (Aligned Baselines) */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-mono tabular-nums text-base sm:text-lg font-semibold text-zinc-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="font-mono tabular-nums text-xs text-zinc-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <p className="text-xs font-medium text-emerald-800 font-mono tabular-nums">
                Save {discountPercent}%
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            aria-label={`Add ${product.name} to bag`}
            className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 ${
              justAdded
                ? 'bg-emerald-800 text-white'
                : 'bg-zinc-900 hover:bg-emerald-900 text-white active:scale-[0.97]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 shrink-0" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 shrink-0" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
