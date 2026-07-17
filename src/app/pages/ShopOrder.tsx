import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { fetchOrder, formatMoney, startPayment, type Order } from '../shop/api';

const baloo = "'Baloo 2', cursive";

const STATUS_DISPLAY: Record<Order['status'], { emoji: string; title: string; body: string }> = {
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

export function ShopOrder() {
  const { reference } = useParams<{ reference: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!reference) return;
    let cancelled = false;
    const load = () =>
      fetchOrder(reference)
        .then((o) => !cancelled && setOrder(o))
        .catch((e: Error) => !cancelled && setError(e.message));
    load();
    // webhook confirmation can lag the redirect — poll briefly while pending
    const interval = setInterval(load, 4000);
    setTimeout(() => clearInterval(interval), 40000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [reference]);

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

  if (error && !order) {
    return (
      <div className="pt-40 pb-24 text-center">
        <div className="text-7xl mb-6">😕</div>
        <h1 className="text-3xl font-black text-[#2D0A6B] mb-4" style={{ fontFamily: baloo }}>
          Order not found
        </h1>
        <Link to="/shop" className="text-[#F97316] font-bold hover:underline">
          ← Back to the shop
        </Link>
      </div>
    );
  }

  if (!order) {
    return <div className="pt-40 pb-24 max-w-[700px] mx-auto px-6 animate-pulse h-[400px]" />;
  }

  const display = STATUS_DISPLAY[order.status];

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-[700px] mx-auto px-6 text-center">
        <div className="text-8xl mb-6">{display.emoji}</div>
        <h1 className="text-4xl font-black text-[#2D0A6B] mb-3" style={{ fontFamily: baloo }}>
          {display.title}
        </h1>
        <p className="text-lg text-gray-700 mb-2">{display.body}</p>
        <p className="text-sm font-bold text-gray-400 mb-10">
          Order <span className="text-[#2D0A6B]">{order.reference}</span> · confirmation sent to {order.customer_email}
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
