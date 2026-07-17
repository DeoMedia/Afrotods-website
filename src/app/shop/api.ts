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
  images: ProductImage[];
  variants: Variant[];
}

export interface OrderItem {
  sku: string;
  product_name: string;
  variant_name: string;
  unit_amount_minor: number;
  quantity: number;
}

export interface Order {
  reference: string;
  status: 'pending_payment' | 'paid' | 'fulfilled' | 'delivered' | 'cancelled';
  currency: Currency;
  subtotal_minor: number;
  shipping_minor: number;
  total_minor: number;
  customer_name: string;
  customer_email: string;
  ship_country: string;
  items: OrderItem[];
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

export const fetchOrder = (reference: string) =>
  fetch(`${API_URL}/api/orders/${reference}`).then((r) => json<Order>(r));

export interface CheckoutPayload {
  currency: Currency;
  customer_name: string;
  customer_email: string;
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

export const submitCheckout = (payload: CheckoutPayload) =>
  fetch(`${API_URL}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then((r) => json<Order>(r));

export const startPayment = (reference: string) =>
  fetch(`${API_URL}/api/orders/${reference}/pay`, { method: 'POST' }).then((r) =>
    json<{ provider: string; url: string }>(r),
  );

export function priceFor(variant: Variant, currency: Currency): Price | undefined {
  return variant.prices.find((p) => p.currency === currency);
}

export function formatMoney(amountMinor: number, currency: Currency): string {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amountMinor / 100);
}
