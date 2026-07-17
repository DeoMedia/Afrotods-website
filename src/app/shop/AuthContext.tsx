import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  CUSTOMER_TOKEN_KEY,
  fetchMe,
  getCustomerToken,
  ORDER_EMAIL_KEY,
  requestLoginCode,
  verifyLoginCode,
  type CustomerInfo,
} from './api';

interface AuthState {
  customer: CustomerInfo | null;
  loading: boolean;
  requestCode: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string, name?: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [loading, setLoading] = useState(() => Boolean(getCustomerToken()));

  useEffect(() => {
    if (!getCustomerToken()) return;
    fetchMe()
      .then(setCustomer)
      .catch(() => localStorage.removeItem(CUSTOMER_TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      customer,
      loading,
      requestCode: async (email) => {
        await requestLoginCode(email);
      },
      verifyCode: async (email, code, name = '') => {
        const result = await verifyLoginCode(email, code, name);
        localStorage.setItem(CUSTOMER_TOKEN_KEY, result.token);
        sessionStorage.setItem(ORDER_EMAIL_KEY, result.customer.email);
        setCustomer(result.customer);
      },
      signOut: () => {
        localStorage.removeItem(CUSTOMER_TOKEN_KEY);
        setCustomer(null);
      },
    }),
    [customer, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
