import type { Currency } from './api';
import { useCart } from './CartContext';

// GBP is the base price; the rest let international visitors see what they'd pay.
// Shipping is still UK-only until those markets open.
const OPTIONS: { code: Currency; label: string }[] = [
  { code: 'GBP', label: '🇬🇧 GBP' },
  { code: 'USD', label: '🇺🇸 USD' },
  { code: 'ZAR', label: '🇿🇦 ZAR' },
  { code: 'NGN', label: '🇳🇬 NGN' },
];

export function CurrencyPicker() {
  const { currency, setCurrency } = useCart();
  return (
    <div className="inline-flex gap-1 bg-white/15 rounded-full p-1">
      {OPTIONS.map((o) => (
        <button
          key={o.code}
          onClick={() => setCurrency(o.code)}
          className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-colors ${
            currency === o.code ? 'bg-white text-[#2D0A6B]' : 'text-white/80 hover:text-white'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
