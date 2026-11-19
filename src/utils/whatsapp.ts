import { STORE_CONFIG } from '../config/storeConfig';
import type {
  CartItem,
  CheckoutValidationErrors,
  CustomerCheckoutInfo,
} from '../types/store';

export function formatCurrency(amount: number): string {
  return `${STORE_CONFIG.currencySymbol}${amount.toFixed(2)}`;
}

export function calculateCartTotals(items: CartItem[]) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalSavings = items.reduce((sum, item) => {
    const orig = item.originalPrice ?? item.price;
    return sum + Math.max(0, orig - item.price) * item.quantity;
  }, 0);
  const qualifiesForFreeShipping =
    subtotal >= STORE_CONFIG.freeShippingThreshold || subtotal === 0;
  const shipping = qualifiesForFreeShipping
    ? 0
    : STORE_CONFIG.standardShippingFee;
  const total = subtotal + shipping;
  const amountToFreeShipping = Math.max(
    0,
    STORE_CONFIG.freeShippingThreshold - subtotal,
  );

  return {
    itemCount,
    subtotal,
    totalSavings,
    shipping,
    total,
    qualifiesForFreeShipping,
    amountToFreeShipping,
  };
}

function countDigits(value: string): number {
  return value.replace(/\D/g, '').length;
}

export function validateCheckoutForm(
  info: CustomerCheckoutInfo,
): CheckoutValidationErrors {
  const errors: CheckoutValidationErrors = {};

  if (!info.fullName.trim() || info.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  }

  const mobileDigits = countDigits(info.mobileNumber);
  if (mobileDigits < 7 || mobileDigits > 15) {
    errors.mobileNumber =
      'Please enter a valid mobile number (7 to 15 digits).';
  }

  const effectiveWhatsapp = info.sameAsMobile
    ? info.mobileNumber
    : info.whatsappNumber;
  const waDigits = countDigits(effectiveWhatsapp);
  if (waDigits < 7 || waDigits > 15) {
    errors.whatsappNumber =
      'Please enter a valid WhatsApp number (7 to 15 digits).';
  }

  if (!info.address.trim() || info.address.trim().length < 8) {
    errors.address =
      'Please enter your complete street address, apartment, or house number.';
  }

  if (!info.city.trim() || info.city.trim().length < 2) {
    errors.city = 'Please enter your delivery city.';
  }

  return errors;
}

export function generateOrderReference(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `HC-${randomSuffix}`;
}

export function buildWhatsAppOrderMessage(params: {
  orderRef: string;
  customer: CustomerCheckoutInfo;
  items: CartItem[];
}): string {
  const { orderRef, customer, items } = params;
  const totals = calculateCartTotals(items);
  const whatsappContact = customer.sameAsMobile
    ? customer.mobileNumber.trim()
    : customer.whatsappNumber.trim();

  const itemLines = items
    .map((item, idx) => {
      const lineTotal = item.price * item.quantity;
      return `${idx + 1}. ${item.name} (${item.variant})\n   Qty: ${item.quantity} × ${formatCurrency(item.price)} = ${formatCurrency(lineTotal)}`;
    })
    .join('\n');

  const lines = [
    `*NEW ORDER — ${STORE_CONFIG.storeName.toUpperCase()}*`,
    `Order Reference: ${orderRef}`,
    `Date: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
    ``,
    `*CUSTOMER DETAILS*`,
    `Name: ${customer.fullName.trim()}`,
    `Mobile: ${customer.mobileNumber.trim()}`,
    `WhatsApp: ${whatsappContact}`,
    ``,
    `*DELIVERY ADDRESS*`,
    `Address: ${customer.address.trim()}`,
    `City: ${customer.city.trim()}`,
  ];

  if (customer.instructions.trim()) {
    lines.push(`Instructions: ${customer.instructions.trim()}`);
  }

  lines.push(
    ``,
    `*ORDERED ITEMS*`,
    itemLines,
    ``,
    `*ORDER SUMMARY*`,
    `Subtotal: ${formatCurrency(totals.subtotal)}`,
    `Delivery: ${totals.shipping === 0 ? 'FREE' : formatCurrency(totals.shipping)}`,
    `*Total Amount: ${formatCurrency(totals.total)}*`,
  );

  if (totals.totalSavings > 0) {
    lines.push(`Total Savings: ${formatCurrency(totals.totalSavings)}`);
  }

  lines.push(``, `Please confirm availability and estimated dispatch time.`);

  return lines.join('\n');
}

export function buildWhatsAppUrl(message: string): string {
  const cleanNumber = STORE_CONFIG.whatsappBusinessNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
