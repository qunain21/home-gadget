import {
  ArrowRight,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailView } from './components/ProductDetailView';
import { ResilientImage } from './components/ResilientImage';
import {
  CUSTOMER_REVIEWS,
  PRODUCT_CATEGORIES,
  PRODUCTS,
} from './data/products';
import type {
  CartItem,
  CollectionFilter,
  Product,
  ProductCategory,
  SortOption,
} from './types/store';
import { formatCurrency } from './utils/whatsapp';

type ActiveView = 'storefront' | 'product' | 'checkout';

const CART_STORAGE_KEY = 'hearth_counter_cart_v1';

function loadInitialCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(loadInitialCart);
  const [view, setView] = useState<ActiveView>('storefront');
  const [selectedProductId, setSelectedProductId] = useState<string>(
    PRODUCTS[0].id,
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPromoBanner, setShowPromoBanner] = useState(true);

  // Catalog Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>('All');
  const [collectionFilter, setCollectionFilter] =
    useState<CollectionFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('featured');

  // Toast feedback
  const [toastProduct, setToastProduct] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  // Sync URL hash for natural browser Back/Forward support
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash;
      if (hash === '#checkout') {
        setView('checkout');
      } else if (hash.startsWith('#product/')) {
        const id = hash.replace('#product/', '');
        const match = PRODUCTS.find((p) => p.id === id);
        if (match) {
          setSelectedProductId(match.id);
          setView('product');
        }
      } else {
        setView('storefront');
      }
    };

    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const selectedProduct = useMemo(
    () => PRODUCTS.find((p) => p.id === selectedProductId) ?? PRODUCTS[0],
    [selectedProductId],
  );

  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter(
      (p) =>
        p.id !== selectedProduct.id &&
        (p.category === selectedProduct.category || p.isBestSeller),
    ).slice(0, 3);
  }, [selectedProduct]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const list = PRODUCTS.filter((product) => {
      if (
        selectedCategory !== 'All' &&
        product.category !== selectedCategory
      ) {
        return false;
      }

      if (collectionFilter === 'best-sellers' && !product.isBestSeller) {
        return false;
      }
      if (collectionFilter === 'new-arrivals' && !product.isNewArrival) {
        return false;
      }
      if (collectionFilter === 'trending' && !product.isTrending) {
        return false;
      }
      if (
        collectionFilter === 'deals' &&
        !product.isFeaturedDeal &&
        !product.originalPrice
      ) {
        return false;
      }

      if (query) {
        const haystack =
          `${product.name} ${product.category} ${product.shortDescription} ${product.sku}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });

    const sorted = [...list];
    if (sortOption === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating-desc') {
      sorted.sort((a, b) => b.rating - a.rating);
    }

    return sorted;
  }, [searchQuery, selectedCategory, collectionFilter, sortOption]);

  const dealProduct = useMemo(
    () =>
      PRODUCTS.find((p) => p.id === 'hc-kettle-10') ??
      PRODUCTS.find((p) => p.isFeaturedDeal) ??
      PRODUCTS[0],
    [],
  );

  const navigateToStorefront = (sectionId?: string) => {
    setView('storefront');
    if (window.location.hash.startsWith('#product/') || window.location.hash === '#checkout') {
      window.history.pushState(null, '', '#top');
    }
    window.setTimeout(() => {
      if (sectionId && sectionId !== 'top') {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 40);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setView('product');
    window.location.hash = `#product/${product.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setView('checkout');
    window.location.hash = '#checkout';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (
    product: Product,
    variant: string,
    quantity = 1,
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id && item.variant === variant,
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(25, updated[existingIndex].quantity + quantity),
        };
        return updated;
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          category: product.category,
          sku: product.sku,
          variant,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          quantity,
        },
      ];
    });

    setToastProduct(product.name);
    window.setTimeout(() => {
      setToastProduct((curr) => (curr === product.name ? null : curr));
    }, 2800);
  };

  const handleBuyNow = (product: Product, variant: string, quantity: number) => {
    handleAddToCart(product, variant, quantity);
    handleOpenCheckout();
  };

  const handleUpdateQuantity = (
    productId: string,
    variant: string,
    delta: number,
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.variant === variant) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveItem = (productId: string, variant: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.variant === variant),
      ),
    );
  };

  const handleSelectCategoryFromFooter = (category: ProductCategory) => {
    setSelectedCategory(category);
    setCollectionFilter('all');
    navigateToStorefront('catalog');
  };

  const resetCatalogFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setCollectionFilter('all');
    setSortOption('featured');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-zinc-900">
      <Header
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateHome={navigateToStorefront}
        showPromoBanner={showPromoBanner}
        onDismissPromo={() => setShowPromoBanner(false)}
      />

      <main className="flex-1">
        {view === 'checkout' ? (
          <CheckoutView
            items={cart}
            onBackToStore={() => navigateToStorefront('catalog')}
            onOpenCart={() => setIsCartOpen(true)}
            onClearCartAfterOrder={() => setCart([])}
          />
        ) : view === 'product' ? (
          <ProductDetailView
            key={selectedProduct.id}
            product={selectedProduct}
            relatedProducts={relatedProducts}
            onBackToCatalog={() => navigateToStorefront('catalog')}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        ) : (
          <>
            <HeroSection
              onShopCatalog={() => navigateToStorefront('catalog')}
              onViewDeals={() => {
                setCollectionFilter('deals');
                setSelectedCategory('All');
                navigateToStorefront('catalog');
              }}
            />

            {/* Catalog & Category Explorer Section */}
            <section
              id="catalog"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
            >
              {/* Section Header + Search & Sort Controls */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1.5">
                    Curated Storefront
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-zinc-900 text-balance">
                    Home &amp; Kitchen Gadgets
                  </h2>
                </div>

                {/* Search + Sort Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 sm:w-72">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search kettles, vacuums, organizers..."
                      aria-label="Search products"
                      className="w-full min-h-[44px] pl-10 pr-9 py-2 rounded-lg border border-slate-300 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-emerald-800 focus:ring-2 focus:ring-emerald-900/15"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear search"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded text-zinc-400 hover:text-zinc-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="relative shrink-0">
                    <SlidersHorizontal className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={sortOption}
                      onChange={(e) =>
                        setSortOption(e.target.value as SortOption)
                      }
                      aria-label="Sort products"
                      className="w-full sm:w-auto min-h-[44px] pl-9 pr-8 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-zinc-800 focus:outline-none focus:border-emerald-800 focus:ring-2 focus:ring-emerald-900/15"
                    >
                      <option value="featured">Sort: Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating-desc">Highest Rated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Collection Filter Tabs (Best Sellers, New Arrivals, Trending, Special Deals) */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-lg overflow-x-auto no-scrollbar mb-4 w-full sm:w-fit">
                {(
                  [
                    { id: 'all', label: 'All Gadgets' },
                    { id: 'best-sellers', label: 'Best Sellers' },
                    { id: 'new-arrivals', label: 'New Arrivals' },
                    { id: 'trending', label: 'Trending' },
                    { id: 'deals', label: 'Special Deals' },
                  ] as { id: CollectionFilter; label: string }[]
                ).map((tab) => {
                  const isActive = collectionFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCollectionFilter(tab.id)}
                      className={`min-h-[40px] px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-white text-zinc-900 shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Category Filter Bar */}
              <div
                id="categories"
                className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-8"
                role="tablist"
                aria-label="Filter by category"
              >
                {PRODUCT_CATEGORIES.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedCategory(category)}
                      className={`min-h-[40px] px-3.5 py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-white text-zinc-700 border-slate-200 hover:border-zinc-400'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* Result Count */}
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-5">
                <p>
                  Showing{' '}
                  <span className="font-mono tabular-nums font-semibold text-zinc-900">
                    {filteredProducts.length}
                  </span>{' '}
                  {filteredProducts.length === 1 ? 'product' : 'products'}
                  {selectedCategory !== 'All' && (
                    <>
                      {' '}
                      in <strong className="text-zinc-800">{selectedCategory}</strong>
                    </>
                  )}
                </p>
                {(searchQuery ||
                  selectedCategory !== 'All' ||
                  collectionFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={resetCatalogFilters}
                    className="font-medium text-emerald-800 hover:underline"
                  >
                    Reset filters
                  </button>
                )}
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
                  <h3 className="font-display text-lg font-semibold text-zinc-900">
                    No matching gadgets found
                  </h3>
                  <p className="text-sm text-zinc-600 mt-1 mb-5">
                    Try clearing your search query or switching to All Categories.
                  </p>
                  <button
                    type="button"
                    onClick={resetCatalogFilters}
                    className="min-h-[44px] px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium"
                  >
                    Show All Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={handleSelectProduct}
                      onAddToCart={(p, v) => handleAddToCart(p, v, 1)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Featured Deal Spotlight */}
            <section
              id="featured-deal"
              className="bg-white border-y border-slate-200 py-12 sm:py-16"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                  <div className="lg:col-span-6">
                    <div className="h-64 sm:h-80 lg:h-full min-h-[280px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <ResilientImage
                        src={dealProduct.image}
                        alt={dealProduct.name}
                        className="w-full h-full object-cover"
                        containerClassName="w-full h-full"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-6 flex flex-col justify-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
                      Featured Seasonal Bundle · Limited Run
                    </p>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-zinc-900 text-balance mb-3">
                      {dealProduct.name}
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-600 leading-relaxed mb-5">
                      {dealProduct.description}
                    </p>

                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-zinc-900">
                        {formatCurrency(dealProduct.price)}
                      </span>
                      {dealProduct.originalPrice && (
                        <span className="font-mono tabular-nums text-base text-zinc-400 line-through">
                          {formatCurrency(dealProduct.originalPrice)}
                        </span>
                      )}
                      {dealProduct.originalPrice && (
                        <span className="text-xs font-semibold text-emerald-800 font-mono tabular-nums">
                          Save{' '}
                          {formatCurrency(
                            dealProduct.originalPrice - dealProduct.price,
                          )}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleAddToCart(
                            dealProduct,
                            dealProduct.variants[0],
                            1,
                          )
                        }
                        className="min-h-[48px] px-6 py-3 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors"
                      >
                        <span>Add Bundle to Bag</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectProduct(dealProduct)}
                        className="min-h-[48px] px-5 py-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-zinc-900 text-sm font-medium transition-colors"
                      >
                        View Specifications
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Customer Reviews Section */}
            <section
              id="reviews"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
            >
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1.5">
                  Verified Customers
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-zinc-900">
                  Trusted in Daily Kitchens
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CUSTOMER_REVIEWS.map((review) => {
                  const linkedProduct = PRODUCTS.find(
                    (p) => p.id === review.productId,
                  );
                  return (
                    <article
                      key={review.id}
                      className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1 mb-3">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-amber-500 text-amber-500"
                            />
                          ))}
                        </div>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                          &ldquo;{review.comment}&rdquo;
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100">
                        <p className="text-sm font-semibold text-zinc-900">
                          {review.customerName}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {review.location} · {review.verifiedDate}
                        </p>
                        {linkedProduct && (
                          <button
                            type="button"
                            onClick={() => handleSelectProduct(linkedProduct)}
                            className="mt-2 text-xs font-medium text-emerald-800 hover:underline text-left"
                          >
                            Purchased: {review.productName}
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer
        onSelectCategory={handleSelectCategoryFromFooter}
        onNavigateSection={navigateToStorefront}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleOpenCheckout}
      />

      {/* Non-intrusive Add-to-Bag Confirmation Toast */}
      {toastProduct && !isCartOpen && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 max-w-sm bg-zinc-900 text-white px-4 py-3 rounded-xl shadow-lg border border-zinc-800 flex items-center gap-3"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium truncate">
            Added {toastProduct}
          </span>
          <button
            type="button"
            onClick={() => {
              setToastProduct(null);
              setIsCartOpen(true);
            }}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 whitespace-nowrap shrink-0 ml-1"
          >
            View Bag
          </button>
        </div>
      )}
    </div>
  );
}
