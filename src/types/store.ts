export type ProductCategory =
  | 'All'
  | 'Kitchen Appliances'
  | 'Home Appliances'
  | 'Smart Home Gadgets'
  | 'Kitchen Tools & Accessories'
  | 'Cleaning Gadgets'
  | 'Home Organization'
  | 'Daily-Use Gadgets';

export type CollectionFilter =
  | 'all'
  | 'best-sellers'
  | 'new-arrivals'
  | 'trending'
  | 'deals';

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: Exclude<ProductCategory, 'All'>;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  shortDescription: string;
  description: string;
  variants: string[];
  inStock: boolean;
  statusTag?: 'Best Seller' | 'New Arrival' | 'Trending' | 'Special Deal';
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  isFeaturedDeal?: boolean;
  specs: ProductSpec[];
}

export interface CartItem {
  productId: string;
  name: string;
  category: string;
  sku: string;
  variant: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
}

export interface CustomerCheckoutInfo {
  fullName: string;
  mobileNumber: string;
  whatsappNumber: string;
  sameAsMobile: boolean;
  address: string;
  city: string;
  instructions: string;
}

export interface CheckoutValidationErrors {
  fullName?: string;
  mobileNumber?: string;
  whatsappNumber?: string;
  address?: string;
  city?: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  location: string;
  productName: string;
  productId: string;
  rating: number;
  comment: string;
  verifiedDate: string;
}
