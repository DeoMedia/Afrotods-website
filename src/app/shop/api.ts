export const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000';

export type Currency = 'GBP' | 'NGN' | 'ZAR' | 'USD';

export interface Price {
  currency: Currency;
  amount_minor: number;
}

export interface Variant {
  id: number;
  sku: string;
  name: string;
  stock_qty: number;
  active: boolean;
  prices: Price[];
}

export interface ProductImage {
  url: string;
  alt: string;
  sort_order: number;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string;
  vat_rate: number;
  active: boolean;
  rating_average: number | null;
  rating_count: number;
  images: ProductImage[];
  variants: Variant[];
}

export interface MyRating {
  stars: number | null;
  /** true only if this customer has a paid order containing the product */
  can_rate: boolean;
  average: number | null;
  count: number;
}

export const fetchMyRating = (slug: string) =>
  fetch(`${API_URL}/api/products/${encodeURIComponent(slug)}/rating`, {
    headers: { Authorization: `Bearer ${getCustomerToken()}` },
  }).then((r) => json<MyRating>(r));

export const submitRating = (slug: string, stars: number) =>
  fetch(`${API_URL}/api/products/${encodeURIComponent(slug)}/rating`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCustomerToken()}` },
    body: JSON.stringify({ stars }),
  }).then((r) => json<MyRating>(r));

export interface OrderItem {
  sku: string;
  product_name: string;
  variant_name: string;
  unit_amount_minor: number;
  quantity: number;
}

export type OrderStatus = 'pending_payment' | 'paid' | 'fulfilled' | 'delivered' | 'cancelled';

export interface OrderHistoryEntry {
  status: OrderStatus;
  note: string;
  created_at: string;
}

export interface Order {
  reference: string;
  status: OrderStatus;
  currency: Currency;
  subtotal_minor: number;
  shipping_minor: number;
  tax_minor: number;
  total_minor: number;
  customer_name: string;
  customer_email: string;
  ship_country: string;
  carrier: string;
  tracking_number: string;
  tracking_url: string;
  items: OrderItem[];
  history: OrderHistoryEntry[];
  created_at: string;
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? `Request failed (${res.status})`);
  }
  return res.json();
}

export const fetchProducts = () => fetch(`${API_URL}/api/catalog/products`).then((r) => json<Product[]>(r));

export const fetchProduct = (slug: string) =>
  fetch(`${API_URL}/api/catalog/products/${slug}`).then((r) => json<Product>(r));

// Orders are only returned on an exact reference + email match (anti-enumeration)
export const fetchOrder = (reference: string, email: string) =>
  fetch(`${API_URL}/api/orders/${encodeURIComponent(reference)}?email=${encodeURIComponent(email)}`).then((r) =>
    json<Order>(r),
  );

export const ORDER_EMAIL_KEY = 'afrotods_order_email';

export interface CheckoutPayload {
  currency: Currency;
  customer_name: string;
  customer_phone: string;
  shipping_address: {
    line1: string;
    line2: string;
    city: string;
    region: string;
    postal_code: string;
    country: string;
  };
  items: { variant_id: number; quantity: number }[];
}

// --- Customer auth (passwordless email codes) ---------------------------------

export const CUSTOMER_TOKEN_KEY = 'afrotods_customer_token';

export const getCustomerToken = () => localStorage.getItem(CUSTOMER_TOKEN_KEY) ?? '';

export interface CustomerInfo {
  email: string;
  name: string;
}

export const requestLoginCode = (email: string) =>
  fetch(`${API_URL}/api/auth/request-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }).then((r) => json<{ sent: boolean; dev_code?: string }>(r));

export const verifyLoginCode = (email: string, code: string, name = '') =>
  fetch(`${API_URL}/api/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, name }),
  }).then((r) => json<{ token: string; customer: CustomerInfo }>(r));

export const fetchMe = () =>
  fetch(`${API_URL}/api/account/me`, {
    headers: { Authorization: `Bearer ${getCustomerToken()}` },
  }).then((r) => json<CustomerInfo>(r));

export const fetchMyOrders = () =>
  fetch(`${API_URL}/api/account/orders`, {
    headers: { Authorization: `Bearer ${getCustomerToken()}` },
  }).then((r) => json<Order[]>(r));

export const submitCheckout = (payload: CheckoutPayload) =>
  fetch(`${API_URL}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCustomerToken()}` },
    body: JSON.stringify(payload),
  }).then((r) => json<Order>(r));

export const startPayment = (reference: string) =>
  fetch(`${API_URL}/api/orders/${reference}/pay`, { method: 'POST' }).then((r) =>
    json<{ provider: string; url: string }>(r),
  );

/** Uploaded images live on the backend (/api/uploads/…); site assets stay relative. */
export function imageSrc(url: string): string {
  return url.startsWith('/api/uploads/') ? `${API_URL}${url}` : url;
}

export function priceFor(variant: Variant, currency: Currency): Price | undefined {
  return variant.prices.find((p) => p.currency === currency);
}

export function formatMoney(amountMinor: number, currency: Currency): string {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amountMinor / 100);
}
