import type { Currency } from './api';
import { useCart } from './CartContext';

const OPTIONS: { code: Currency; label: string }[] = [
  { code: 'GBP', label: '🇬🇧 GBP' },
  { code: 'NGN', label: '🇳🇬 NGN' },
  { code: 'ZAR', label: '🇿🇦 ZAR' },
  { code: 'USD', label: '🌍 USD' },
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
