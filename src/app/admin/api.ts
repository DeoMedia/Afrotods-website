import { API_URL, type Currency, type Order, type Product } from '../shop/api';

export const ADMIN_KEY_STORAGE = 'afrotods_admin_key';
export const ADMIN_TOKEN_STORAGE = 'afrotods_admin_token';
export const ADMIN_ROLE_STORAGE = 'afrotods_admin_role';

export const getAdminKey = () => sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? '';
export const setAdminKey = (key: string) => sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
export const getAdminToken = () => sessionStorage.getItem(ADMIN_TOKEN_STORAGE) ?? '';
export const setAdminToken = (token: string, role: string) => {
  sessionStorage.setItem(ADMIN_TOKEN_STORAGE, token);
  sessionStorage.setItem(ADMIN_ROLE_STORAGE, role);
};
export const getAdminRole = () => sessionStorage.getItem(ADMIN_ROLE_STORAGE) ?? '';
export const clearAdminKey = () => {
  sessionStorage.removeItem(ADMIN_KEY_STORAGE);
  sessionStorage.removeItem(ADMIN_TOKEN_STORAGE);
  sessionStorage.removeItem(ADMIN_ROLE_STORAGE);
};

/** The bootstrap X-Admin-Key counts as a super admin on the backend. */
export const isSuperAdmin = () => Boolean(getAdminKey()) || getAdminRole() === 'super';

function authHeaders(): Record<string, string> {
  const token = getAdminToken();
  if (token) return { Authorization: `Bearer ${token}` };
  return { 'X-Admin-Key': getAdminKey() };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
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

export interface StaffMember {
  id: number;
  email: string;
  role: 'super' | 'staff';
  active: boolean;
  created_at: string;
}

export interface ExportFilters {
  status?: string;
  date_from?: string;
  date_to?: string;
}

export const adminApi = {
  /** Downloads a sales export. Uses fetch (not a plain link) because the
   *  endpoint needs the admin auth header. */
  downloadExport: async (format: 'csv' | 'xlsx' | 'pdf', filters: ExportFilters = {}) => {
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v) as [string, string][],
    );
    const res = await fetch(
      `${API_URL}/api/admin/orders/export.${format}${params.toString() ? `?${params}` : ''}`,
      { headers: authHeaders() },
    );
    if (res.status === 401) {
      clearAdminKey();
      throw new Error('unauthorized');
    }
    if (!res.ok) throw new Error(`Export failed (${res.status})`);

    const blob = await res.blob();
    const name =
      res.headers.get('content-disposition')?.match(/filename="([^"]+)"/)?.[1] ??
      `afrotods-sales.${format}`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
  /** Multipart upload — browser sets the Content-Type boundary itself. */
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const body = new FormData();
    body.append('file', file);
    const res = await fetch(`${API_URL}/api/admin/catalog/uploads`, {
      method: 'POST',
      headers: authHeaders(),
      body,
    });
    if (res.status === 401) {
      clearAdminKey();
      throw new Error('unauthorized');
    }
    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      throw new Error(errBody?.detail ?? `Upload failed (${res.status})`);
    }
    return res.json();
  },
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.detail ?? 'Login failed');
    }
    return res.json() as Promise<{ token: string; email: string; role: 'super' | 'staff' }>;
  },
  listStaff: () => request<StaffMember[]>('/api/admin/auth/staff'),
  createStaff: (email: string, password: string, role: 'super' | 'staff' = 'staff') =>
    request<StaffMember>('/api/admin/auth/staff', { method: 'POST', body: JSON.stringify({ email, password, role }) }),
  setStaffActive: (id: number, active: boolean) =>
    request<StaffMember>(`/api/admin/auth/staff/${id}/active?active=${active}`, { method: 'PATCH' }),
  stats: () => request<Stats>('/api/admin/orders/stats'),
  listProducts: () => request<Product[]>('/api/admin/catalog/products'),
  createProduct: (p: ProductCreate) =>
    request<Product>('/api/admin/catalog/products', { method: 'POST', body: JSON.stringify(p) }),
  updateProduct: (id: number, patch: Partial<Pick<ProductCreate, 'name' | 'description' | 'category' | 'vat_rate' | 'active'>>) =>
    request<Product>(`/api/admin/catalog/products/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  deleteProduct: (id: number) => request<void>(`/api/admin/catalog/products/${id}`, { method: 'DELETE' }),
  addImages: (productId: number, images: { url: string; alt: string }[]) =>
    request<Product>(`/api/admin/catalog/products/${productId}/images`, {
      method: 'POST',
      body: JSON.stringify(images),
    }),
  deleteImage: (imageId: number) =>
    request<void>(`/api/admin/catalog/images/${imageId}`, { method: 'DELETE' }),
  addVariant: (productId: number, v: VariantIn) =>
    request<Product>(`/api/admin/catalog/products/${productId}/variants`, { method: 'POST', body: JSON.stringify(v) }),
  setPrices: (variantId: number, prices: PriceIn[]) =>
    request<Product>(`/api/admin/catalog/variants/${variantId}/prices`, {
      method: 'PUT',
      body: JSON.stringify(prices),
    }),
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
