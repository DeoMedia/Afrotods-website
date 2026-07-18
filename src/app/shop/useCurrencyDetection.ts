import { useEffect } from 'react';
import type { Currency } from './api';
import { useCart } from './CartContext';

const COUNTRY_TO_CURRENCY: Record<string, Currency> = { GB: 'GBP', NG: 'NGN', ZA: 'ZAR' };

/** Detect the visitor's currency once (same ipapi approach as the Home page); a saved choice wins. */
export function useCurrencyDetection() {
  const { setCurrency } = useCart();

  useEffect(() => {
    if (localStorage.getItem('afrotods_currency')) return;
    (async () => {
      try {
        const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) });
        const data = await res.json();
        setCurrency(COUNTRY_TO_CURRENCY[data.country_code] ?? 'USD');
      } catch {
        /* keep default */
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
