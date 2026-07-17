import { API_URL, type Currency, type Order, type Product } from '../shop/api';

export const ADMIN_KEY_STORAGE = 'afrotods_admin_key';

export const getAdminKey = () => sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? '';
export const setAdminKey = (key: string) => sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
export const clearAdminKey = () => sessionStorage.removeItem(ADMIN_KEY_STORAGE);

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': getAdminKey(),
      ...init?.headers,
    },
  });
  if (res.status === 401) {
    clearAdminKey();
    throw new Error('unauthorized');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? `Request failed (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface Stats {
  products_active: number;
  orders_pending: number;
  orders_paid: number;
  orders_fulfilled: number;
  revenue_minor_by_currency: Record<string, number>;
  recent_orders: (Order & { source: string })[];
}

export interface PriceIn {
  currency: Currency;
  amount_minor: number;
}

export interface VariantIn {
  sku: string;
  name: string;
  stock_qty: number;
  active?: boolean;
  prices: PriceIn[];
}

export interface ProductCreate {
  slug: string;
  name: string;
  description: string;
  category: string;
  vat_rate: number;
  active: boolean;
  images: { url: string; alt: string; sort_order?: number }[];
  variants: VariantIn[];
}

export type AdminOrder = Order & { source: string };

export const adminApi = {
  stats: () => request<Stats>('/api/admin/orders/stats'),
  listProducts: () => request<Product[]>('/api/admin/catalog/products'),
  createProduct: (p: ProductCreate) =>
    request<Product>('/api/admin/catalog/products', { method: 'POST', body: JSON.stringify(p) }),
  updateProduct: (id: number, patch: Partial<Pick<ProductCreate, 'name' | 'description' | 'category' | 'vat_rate' | 'active'>>) =>
    request<Product>(`/api/admin/catalog/products/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  deleteProduct: (id: number) => request<void>(`/api/admin/catalog/products/${id}`, { method: 'DELETE' }),
  addVariant: (productId: number, v: VariantIn) =>
    request<Product>(`/api/admin/catalog/products/${productId}/variants`, { method: 'POST', body: JSON.stringify(v) }),
  setStock: (variantId: number, stockQty: number) =>
    request<Product>(`/api/admin/catalog/variants/${variantId}/stock?stock_qty=${stockQty}`, { method: 'PATCH' }),
  listOrders: (status?: string) =>
    request<AdminOrder[]>(`/api/admin/orders${status ? `?status=${status}` : ''}`),
  updateStatus: (reference: string, status: string, note = '') =>
    request<AdminOrder>(`/api/admin/orders/${reference}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    }),
  updateShipping: (reference: string, s: { carrier: string; tracking_number: string; tracking_url: string }) =>
    request<AdminOrder>(`/api/admin/orders/${reference}/shipping`, { method: 'PATCH', body: JSON.stringify(s) }),
  manualOrder: (payload: unknown) =>
    request<AdminOrder>('/api/admin/orders/manual', { method: 'POST', body: JSON.stringify(payload) }),
};
