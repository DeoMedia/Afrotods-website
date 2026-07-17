import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { fetchMyOrders, formatMoney, type Order } from '../shop/api';
import { useAuth } from '../shop/AuthContext';
import { SignInForm } from '../shop/SignInForm';

const baloo = "'Baloo 2', cursive";

const STATUS_LABEL: Record<Order['status'], string> = {
  pending_payment: '⏳ Awaiting payment',
  paid: '🎉 Paid',
  fulfilled: '📦 Shipped',
  delivered: '🏠 Delivered',
  cancelled: '❌ Cancelled',
};

export function Account() {
  const { customer, loading, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!customer) return;
    fetchMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]));
  }, [customer]);

  return (
    <div className="pt-24 min-h-screen">
      <section className="relative py-20 bg-gradient-to-br from-[#F97316] via-[#FB923C] to-[#FBBF24] text-white">
        <div className="relative max-w-[1140px] mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-4 text-[#2D0A6B]" style={{ fontFamily: baloo }}>
            {customer ? `Hi${customer.name ? `, ${customer.name.split(' ')[0]}` : ''}! 👋` : 'Your Account'}
          </h1>
          <p className="text-xl text-white/90 max-w-[600px] mx-auto leading-relaxed">
            {customer ? customer.email : 'Sign in or sign up with just your email.'}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white min-h-[300px]">
        <div className="max-w-[700px] mx-auto px-6">
          {loading && <div className="h-40 rounded-3xl bg-[#FFF8F0] animate-pulse" />}

          {!loading && !customer && (
            <div className="max-w-[440px] mx-auto">
              <SignInForm />
            </div>
          )}

          {customer && (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-[#2D0A6B]" style={{ fontFamily: baloo }}>
                  Your orders
                </h2>
                <button onClick={signOut} className="text-sm font-bold text-gray-400 hover:text-[#F97316]">
                  Sign out
                </button>
              </div>

              {orders === null && <div className="h-32 rounded-3xl bg-[#FFF8F0] animate-pulse" />}
              {orders !== null && orders.length === 0 && (
                <div className="text-center py-10">
                  <div className="text-6xl mb-4">🛍️</div>
                  <p className="text-gray-600 font-semibold mb-6">No orders yet — let's fix that!</p>
                  <Link
                    to="/shop"
                    className="inline-block px-8 py-3.5 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-[#2D0A6B] rounded-full font-extrabold"
                    style={{ fontFamily: baloo }}
                  >
                    Browse the Shop
                  </Link>
                </div>
              )}

              <div className="space-y-4">
                {orders?.map((o) => (
                  <Link
                    key={o.reference}
                    to={`/shop/order/${o.reference}`}
                    className="block rounded-3xl bg-[#FFF8F0] p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <div className="font-black text-[#2D0A6B]" style={{ fontFamily: baloo }}>
                          {o.reference}
                        </div>
                        <div className="text-sm font-semibold text-gray-500">
                          {new Date(o.created_at).toLocaleDateString()} ·{' '}
                          {o.items.map((i) => i.product_name).join(', ')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-gray-800">{formatMoney(o.total_minor, o.currency)}</div>
                        <div className="text-xs font-bold text-gray-500">{STATUS_LABEL[o.status]}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
