import { useEffect, useState, type FormEvent } from 'react';
import {
  adminApi,
  getAdminKey,
  getAdminToken,
  setAdminKey,
  setAdminToken,
  clearAdminKey,
  isSuperAdmin,
  type Stats,
} from './api';
import { ProductsTab } from './ProductsTab';
import { OrdersTab } from './OrdersTab';
import { StaffTab } from './StaffTab';
import { formatMoney, type Currency } from '../shop/api';
import afrotodLogo from '../../imports/afro-logo-1_(2).png';

const baloo = "'Baloo 2', cursive";

type Tab = 'dashboard' | 'products' | 'orders' | 'staff';

export default function AdminApp() {
  const [authed, setAuthed] = useState(() => Boolean(getAdminKey() || getAdminToken()));
  const [tab, setTab] = useState<Tab>('dashboard');

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  const tabs: Tab[] = isSuperAdmin()
    ? ['dashboard', 'products', 'orders', 'staff']
    : ['dashboard', 'products', 'orders'];

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <header className="bg-[#2D0A6B] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={afrotodLogo} alt="The Afrotods" className="h-10 w-auto" />
          <span className="text-sm font-extrabold text-white/60 uppercase tracking-wider" style={{ fontFamily: baloo }}>
            Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-colors ${
                tab === t ? 'bg-white text-[#2D0A6B]' : 'text-white/70 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
          <button
            onClick={() => {
              clearAdminKey();
              setAuthed(false);
            }}
            className="ml-4 text-white/60 hover:text-white text-sm font-bold"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 py-10">
        {tab === 'dashboard' && <DashboardTab onUnauthorized={() => setAuthed(false)} />}
        {tab === 'products' && <ProductsTab onUnauthorized={() => setAuthed(false)} />}
        {tab === 'orders' && <OrdersTab onUnauthorized={() => setAuthed(false)} />}
        {tab === 'staff' && <StaffTab onUnauthorized={() => setAuthed(false)} />}
      </main>
    </div>
  );
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<'account' | 'key'>('account');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [key, setKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const inputCls =
    'w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-[#F97316] outline-none font-semibold mb-4';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === 'account') {
        const result = await adminApi.login(email.trim(), password);
        setAdminToken(result.token, result.role);
      } else {
        setAdminKey(key);
        await adminApi.stats(); // verifies the key
      }
      onSuccess();
    } catch (err) {
      clearAdminKey();
      setError(
        mode === 'account'
          ? err instanceof Error && err.message !== 'unauthorized'
            ? err.message
            : 'Invalid email or password.'
          : 'That admin key was not accepted.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2D0A6B] flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-10 w-full max-w-[400px] text-center">
        <img src={afrotodLogo} alt="The Afrotods" className="h-14 w-auto mx-auto mb-2" />
        <h1 className="text-lg font-black text-[#2D0A6B] mb-6" style={{ fontFamily: baloo }}>
          Admin
        </h1>
        {mode === 'account' ? (
          <>
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
            <input
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
          </>
        ) : (
          <input
            required
            type="password"
            placeholder="Bootstrap admin key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className={inputCls}
          />
        )}
        {error && <p className="text-red-600 font-bold text-sm mb-4">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full px-8 py-3.5 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-[#2D0A6B] rounded-full font-extrabold disabled:opacity-40"
          style={{ fontFamily: baloo }}
        >
          {busy ? 'Checking…' : 'Sign in'}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'account' ? 'key' : 'account');
            setError(null);
          }}
          className="mt-4 text-xs font-bold text-gray-400 hover:text-[#F97316]"
        >
          {mode === 'account' ? 'Use the bootstrap admin key instead' : 'Use email & password instead'}
        </button>
      </form>
    </div>
  );
}

function DashboardTab({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .stats()
      .then(setStats)
      .catch((e: Error) => (e.message === 'unauthorized' ? onUnauthorized() : setError(e.message)));
  }, [onUnauthorized]);

  if (error) return <p className="text-red-600 font-bold">{error}</p>;
  if (!stats) return <div className="h-40 rounded-3xl bg-white animate-pulse" />;

  const cards = [
    { label: 'Active products', value: stats.products_active },
    { label: 'Awaiting payment', value: stats.orders_pending },
    { label: 'Paid — to fulfil', value: stats.orders_paid },
    { label: 'Shipped', value: stats.orders_fulfilled },
  ];

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="text-3xl font-black text-[#2D0A6B]" style={{ fontFamily: baloo }}>
              {c.value}
            </div>
            <div className="text-sm font-bold text-gray-500">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm mb-8">
        <h2 className="font-black text-[#2D0A6B] mb-3" style={{ fontFamily: baloo }}>
          Revenue (paid orders)
        </h2>
        {Object.keys(stats.revenue_minor_by_currency).length === 0 && (
          <p className="text-gray-400 font-semibold text-sm">No paid orders yet.</p>
        )}
        <div className="flex gap-6 flex-wrap">
          {Object.entries(stats.revenue_minor_by_currency).map(([currency, minor]) => (
            <div key={currency} className="text-xl font-black text-gray-800">
              {formatMoney(minor, currency as Currency)}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm overflow-x-auto">
        <h2 className="font-black text-[#2D0A6B] mb-3" style={{ fontFamily: baloo }}>
          Recent orders
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 font-bold">
              <th className="py-2 pr-4">Ref</th>
              <th className="py-2 pr-4">Customer</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Source</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent_orders.map((o) => (
              <tr key={o.reference} className="border-t border-gray-100 font-semibold text-gray-700">
                <td className="py-2 pr-4">{o.reference}</td>
                <td className="py-2 pr-4">{o.customer_name}</td>
                <td className="py-2 pr-4">{o.status}</td>
                <td className="py-2 pr-4">{o.source}</td>
                <td className="py-2 text-right">{formatMoney(o.total_minor, o.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
