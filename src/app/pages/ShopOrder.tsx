import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router';
import { Check, Truck } from 'lucide-react';
import {
  fetchOrder,
  formatMoney,
  ORDER_EMAIL_KEY,
  startPayment,
  type Order,
  type OrderStatus,
} from '../shop/api';

const baloo = "'Baloo 2', cursive";

const STATUS_DISPLAY: Record<OrderStatus, { emoji: string; title: string; body: string }> = {
  pending_payment: {
    emoji: '⏳',
    title: 'Awaiting payment',
    body: "Your order is reserved but hasn't been paid yet.",
  },
  paid: { emoji: '🎉', title: 'Payment received!', body: "Thank you! We're getting your order ready." },
  fulfilled: { emoji: '📦', title: 'On its way!', body: 'Your order has been shipped.' },
  delivered: { emoji: '🏠', title: 'Delivered', body: 'Your order has arrived. We hope you love it!' },
  cancelled: { emoji: '❌', title: 'Cancelled', body: 'This order was cancelled.' },
};

const TIMELINE_STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'pending_payment', label: 'Order placed' },
  { status: 'paid', label: 'Payment received' },
  { status: 'fulfilled', label: 'Shipped' },
  { status: 'delivered', label: 'Delivered' },
];

export function ShopOrder() {
  const { reference } = useParams<{ reference: string }>();
  const [email, setEmail] = useState<string>(() => sessionStorage.getItem(ORDER_EMAIL_KEY) ?? '');
  const [emailInput, setEmailInput] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!reference || !email) return;
    let cancelled = false;
    const load = () =>
      fetchOrder(reference, email)
        .then((o) => {
          if (!cancelled) {
            setOrder(o);
            setError(null);
          }
        })
        .catch((e: Error) => !cancelled && setError(e.message));
    load();
    // webhook confirmation can lag the payment redirect — poll briefly while pending
    const interval = setInterval(load, 4000);
    const stop = setTimeout(() => clearInterval(interval), 40000);
    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(stop);
    };
  }, [reference, email]);

  const submitEmail = (e: FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem(ORDER_EMAIL_KEY, emailInput);
    setEmail(emailInput);
  };

  const payNow = async () => {
    if (!reference) return;
    setPaying(true);
    try {
      const payment = await startPayment(reference);
      window.location.assign(payment.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start payment');
      setPaying(false);
    }
  };

  // Ask for the email on the order when we don't have it (privacy: both are required)
  if (!email || (error && !order)) {
    return (
      <div className="pt-40 pb-24 bg-white min-h-screen">
        <div className="max-w-[480px] mx-auto px-6 text-center">
          <div className="text-7xl mb-6">🔎</div>
          <h1 className="text-3xl font-black text-[#2D0A6B] mb-3" style={{ fontFamily: baloo }}>
            Find your order
          </h1>
          <p className="text-gray-600 mb-8">
            Enter the email address you used for order <strong>{reference}</strong>.
          </p>
          {error && email && <p className="text-red-600 font-bold mb-4">We couldn't find that order and email combination.</p>}
          <form onSubmit={submitEmail} className="flex flex-col gap-4">
            <input
              required
              type="email"
              placeholder="Email address"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-[#F97316] outline-none font-semibold"
            />
            <button
              type="submit"
              className="px-10 py-4 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-[#2D0A6B] rounded-full font-extrabold text-lg shadow-lg"
              style={{ fontFamily: baloo }}
            >
              View my order
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!order) {
    return <div className="pt-40 pb-24 max-w-[700px] mx-auto px-6 animate-pulse h-[400px]" />;
  }

  const display = STATUS_DISPLAY[order.status];
  const reachedStatuses = new Set(order.history.map((h) => h.status));
  const currentStep = TIMELINE_STEPS.findIndex((s) => s.status === order.status);

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-[700px] mx-auto px-6 text-center">
        <div className="text-8xl mb-6">{display.emoji}</div>
        <h1 className="text-4xl font-black text-[#2D0A6B] mb-3" style={{ fontFamily: baloo }}>
          {display.title}
        </h1>
        <p className="text-lg text-gray-700 mb-2">{display.body}</p>
        <p className="text-sm font-bold text-gray-400 mb-10">
          Order <span className="text-[#2D0A6B]">{order.reference}</span> · {order.customer_email}
        </p>

        {order.status === 'pending_payment' && (
          <button
            onClick={payNow}
            disabled={paying}
            className="mb-10 px-10 py-4 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-[#2D0A6B] rounded-full font-extrabold text-lg shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-40"
            style={{ fontFamily: baloo }}
          >
            {paying ? 'Redirecting…' : 'Pay Now →'}
          </button>
        )}

        {/* Timeline */}
        {order.status !== 'cancelled' && (
          <div className="flex items-center justify-between max-w-[480px] mx-auto mb-6">
            {TIMELINE_STEPS.map((step, i) => {
              const done = reachedStatuses.has(step.status) || i < currentStep;
              return (
                <div key={step.status} className="flex-1 flex flex-col items-center relative">
                  {i > 0 && (
                    <div
                      className={`absolute top-4 right-1/2 w-full h-1 -z-0 ${done ? 'bg-[#F97316]' : 'bg-gray-200'}`}
                    />
                  )}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                      done ? 'bg-[#F97316] text-white' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {done ? <Check className="w-4 h-4" /> : <span className="w-2 h-2 rounded-full bg-current" />}
                  </div>
                  <span className={`mt-2 text-xs font-bold ${done ? 'text-[#2D0A6B]' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {(order.carrier || order.tracking_number) && (
          <div className="inline-flex items-center gap-3 bg-[#FFF8F0] rounded-2xl px-6 py-4 mb-10 text-left">
            <Truck className="w-6 h-6 text-[#F97316] shrink-0" />
            <div className="text-sm font-semibold text-gray-700">
              {order.carrier && <div>Carrier: {order.carrier}</div>}
              {order.tracking_number && (
                <div>
                  Tracking:{' '}
                  {order.tracking_url ? (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F97316] hover:underline"
                    >
                      {order.tracking_number}
                    </a>
                  ) : (
                    order.tracking_number
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="rounded-3xl bg-[#FFF8F0] p-8 text-left">
          <ul className="space-y-3 mb-6">
            {order.items.map((item) => (
              <li key={item.sku} className="flex justify-between text-sm font-semibold text-gray-700">
                <span>
                  {item.product_name} — {item.variant_name} <span className="text-gray-400">× {item.quantity}</span>
                </span>
                <span>{formatMoney(item.unit_amount_minor * item.quantity, order.currency)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-[#2D0A6B]/10 pt-4 text-sm font-bold text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatMoney(order.subtotal_minor, order.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatMoney(order.shipping_minor, order.currency)}</span>
            </div>
            {order.tax_minor > 0 && (
              <div className="flex justify-between text-gray-400">
                <span>Includes VAT</span>
                <span>{formatMoney(order.tax_minor, order.currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-base text-[#2D0A6B]">
              <span>Total</span>
              <span>{formatMoney(order.total_minor, order.currency)}</span>
            </div>
          </div>
        </div>

        <Link to="/shop" className="inline-block mt-10 text-[#2D0A6B] font-bold hover:text-[#F97316] transition-colors">
          ← Continue shopping
        </Link>
      </div>
    </div>
  );
}
