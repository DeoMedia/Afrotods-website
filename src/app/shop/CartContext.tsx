import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchProducts, type Currency } from './api';

export interface CartLine {
  variantId: number;
  productSlug: string;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  currency: Currency;
  setCurrency: (c: Currency) => void;
  add: (line: Omit<CartLine, 'quantity'>, qty?: number) => void;
  setQuantity: (variantId: number, qty: number) => void;
  remove: (variantId: number) => void;
  clear: () => void;
  count: number;
}

const CartContext = createContext<CartState | null>(null);

const LINES_KEY = 'afrotods_cart';
const CURRENCY_KEY = 'afrotods_currency';

function loadLines(): CartLine[] {
  try {
    const raw = localStorage.getItem(LINES_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(loadLines);
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem(CURRENCY_KEY);
    // GBP is the base currency and the default for anyone without a saved choice
    return saved === 'GBP' || saved === 'USD' || saved === 'ZAR' || saved === 'NGN' ? saved : 'GBP';
  });

  useEffect(() => {
    localStorage.setItem(LINES_KEY, JSON.stringify(lines));
  }, [lines]);

  // Drop saved lines whose variant has left the catalog (product hidden, deleted,
  // or variant removed) — otherwise the nav badge counts items the cart page can't
  // show. Only prunes on a successful fetch, so a backend outage never wipes a cart.
  useEffect(() => {
    if (lines.length === 0) return;
    let cancelled = false;
    fetchProducts()
      .then((products) => {
        if (cancelled) return;
        const live = new Set(products.flatMap((p) => p.variants.map((v) => v.id)));
        setLines((prev) => {
          const kept = prev.filter((l) => live.has(l.variantId));
          return kept.length === prev.length ? prev : kept;
        });
      })
      .catch(() => {
        /* offline or API down — keep the cart as-is */
      });
    return () => {
      cancelled = true;
    };
    // once per mount: a stale line can only arrive from a previous session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCurrency = (c: Currency) => {
    localStorage.setItem(CURRENCY_KEY, c);
    setCurrencyState(c);
  };

  const value = useMemo<CartState>(
    () => ({
      lines,
      currency,
      setCurrency,
      add: (line, qty = 1) =>
        setLines((prev) => {
          const existing = prev.find((l) => l.variantId === line.variantId);
          if (existing) {
            return prev.map((l) => (l.variantId === line.variantId ? { ...l, quantity: l.quantity + qty } : l));
          }
          return [...prev, { ...line, quantity: qty }];
        }),
      setQuantity: (variantId, qty) =>
        setLines((prev) =>
          qty <= 0
            ? prev.filter((l) => l.variantId !== variantId)
            : prev.map((l) => (l.variantId === variantId ? { ...l, quantity: qty } : l)),
        ),
      remove: (variantId) => setLines((prev) => prev.filter((l) => l.variantId !== variantId)),
      clear: () => setLines([]),
      count: lines.reduce((n, l) => n + l.quantity, 0),
    }),
    [lines, currency],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
