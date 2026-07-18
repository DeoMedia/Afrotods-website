import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { formatMoney, ORDER_EMAIL_KEY, startPayment, submitCheckout } from '../shop/api';
import { useCart } from '../shop/CartContext';
import { useAuth } from '../shop/AuthContext';
import { SignInForm } from '../shop/SignInForm';
import { useResolvedCart } from './ShopCart';

const baloo = "'Baloo 2', cursive";

// Launch scope: UK only via Royal Mail — must match the backend's SHIP_COUNTRIES.
const COUNTRIES = [{ code: 'GB', name: 'United Kingdom' }];

const inputCls =
  'w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-[#F97316] outline-none font-semibold text-gray-800 bg-white transition-colors';

export function ShopCheckout() {
  const navigate = useNavigate();
  const { currency, lines, clear } = useCart();
  const { customer, loading: authLoading } = useAuth();
  const { resolved, subtotal, error: cartError } = useResolvedCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    region: '',
    postal_code: '',
    country: 'GB',
  });

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  useEffect(() => {
    if (customer?.name) setForm((f) => (f.name ? f : { ...f, name: customer.name }));
  }, [customer]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const order = await submitCheckout({
        currency,
        customer_name: form.name,
        customer_phone: form.phone,
        shipping_address: {
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          region: form.region,
          postal_code: form.postal_code,
          country: form.country,
        },
        items: lines.map((l) => ({ variant_id: l.variantId, quantity: l.quantity })),
      });
      clear();
      if (customer) sessionStorage.setItem(ORDER_EMAIL_KEY, customer.email);
      try {
        const payment = await startPayment(order.reference);
        window.location.assign(payment.url);
      } catch {
        // payment init failed (e.g. provider not configured) — show the order page instead
        navigate(`/shop/order/${order.reference}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setSubmitting(false);
    }
  };

  if (!authLoading && !customer) {
    return (
      <div className="pt-32 pb-24 bg-white min-h-screen">
        <div className="max-w-[440px] mx-auto px-6">
          <h1 className="text-4xl font-black text-[#2D0A6B] mb-3 text-center" style={{ fontFamily: baloo }}>
            Almost there!
          </h1>
          <p className="text-gray-600 font-semibold text-center mb-8">
            Sign in with your email to complete your order — it takes 30 seconds.
          </p>
          <SignInForm />
        </div>
      </div>
    );
  }

  if (!cartError && resolved !== null && resolved.length === 0) {
    return (
      <div className="pt-40 pb-24 text-center">
        <p className="text-xl text-gray-700 mb-6">Your cart is empty.</p>
        <Link to="/shop" className="text-[#F97316] font-bold hover:underline">
          ← Back to the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-[1000px] mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-black text-[#2D0A6B] mb-10" style={{ fontFamily: baloo }}>
          Checkout
        </h1>

        <div className="grid md:grid-cols-[1fr_360px] gap-12 items-start">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-black text-[#2D0A6B]" style={{ fontFamily: baloo }}>
              Your details
            </h2>
            <div className="text-sm font-semibold text-gray-500 bg-[#FFF8F0] rounded-xl px-4 py-3">
              Signed in as <strong className="text-[#2D0A6B]">{customer?.email}</strong> — your order confirmation
              goes there.
            </div>
            <input required placeholder="Full name" value={form.name} onChange={set('name')} className={inputCls} />
            <input placeholder="Phone (optional)" value={form.phone} onChange={set('phone')} className={inputCls} />

            <h2 className="text-xl font-black text-[#2D0A6B] pt-4" style={{ fontFamily: baloo }}>
              Shipping address
            </h2>
            <input required placeholder="Address line 1" value={form.line1} onChange={set('line1')} className={inputCls} />
            <input placeholder="Address line 2 (optional)" value={form.line2} onChange={set('line2')} className={inputCls} />
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="City" value={form.city} onChange={set('city')} className={inputCls} />
              <input placeholder="Region / State" value={form.region} onChange={set('region')} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Postal code"
                value={form.postal_code}
                onChange={set('postal_code')}
                className={inputCls}
              />
              <select required value={form.country} onChange={set('country')} className={inputCls}>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-400 font-semibold">
              🇬🇧 We currently ship within the UK via Royal Mail — Europe and international delivery coming soon!
            </p>

            {error && <p className="text-red-600 font-bold">{error}</p>}

            <button
              type="submit"
              disabled={submitting || subtotal === null}
              className="w-full mt-4 px-10 py-4 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-[#2D0A6B] rounded-full font-extrabold text-lg shadow-[0_8px_32px_rgba(249,115,22,0.45)] hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none"
              style={{ fontFamily: baloo }}
            >
              {submitting ? 'Placing order…' : 'Continue to Payment →'}
            </button>
            <p className="text-xs text-gray-400 text-center font-semibold">
              You'll be taken to a secure {currency === 'NGN' || currency === 'ZAR' ? 'Paystack' : 'Stripe'} payment page.
            </p>
          </form>

          <aside className="rounded-3xl bg-[#FFF8F0] p-8">
            <h2 className="text-xl font-black text-[#2D0A6B] mb-6" style={{ fontFamily: baloo }}>
              Order summary
            </h2>
            {resolved === null && <div className="h-24 animate-pulse bg-white rounded-2xl" />}
            {resolved !== null && (
              <>
                <ul className="space-y-3 mb-6">
                  {resolved.map((line) => (
                    <li key={line.variantId} className="flex justify-between gap-4 text-sm font-semibold text-gray-700">
                      <span>
                        {line.product.name} <span className="text-gray-400">× {line.quantity}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-[#2D0A6B]/10 pt-4 text-sm font-bold text-gray-700 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{subtotal !== null ? formatMoney(subtotal, currency) : '—'}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span>Added at payment</span>
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
