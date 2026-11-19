/**
 * Central Store Configuration
 *
 * Update WHATSAPP_BUSINESS_NUMBER below or set VITE_WHATSAPP_BUSINESS_NUMBER
 * in your environment variables to route customer checkout orders to your store's WhatsApp.
 * Format: country code + phone number with no '+' sign, spaces, or dashes (e.g. "15550192834").
 */
export const STORE_CONFIG = {
  storeName: 'Hearth & Counter',
  tagline: 'Precision Home & Kitchen Hardware',
  whatsappBusinessNumber:
    import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER || '15550192834',
  whatsappDisplayNumber: '+1 (555) 019-2834',
  supportEmail: 'hello@hearthandcounter.com',
  storeAddress: '418 Mercer Street, Suite 200, Seattle, WA 98109',
  businessHours: 'Mon–Sat · 9:00 AM – 7:00 PM',
  currencySymbol: '$',
  freeShippingThreshold: 75,
  standardShippingFee: 8.5,
  heroImage: '/src/assets/images/hero_kitchen_counter_1795087673731.jpg',
} as const;
