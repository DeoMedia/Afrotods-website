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
import { CustomersTab } from './CustomersTab';
import { CouponsTab } from './CouponsTab';
import { formatMoney, type Currency } from '../shop/api';
import afrotodLogo from '../../imports/afro-logo-1_(2).png';

const baloo = "'Baloo 2', cursive";

type Tab = 'dashboard' | 'products' | 'orders' | 'customers' | 'discounts' | 'staff';

export default function AdminApp() {
  const [authed, setAuthed] = useState(() => Boolean(getAdminKey() || getAdminToken()));
  const [tab, setTab] = useState<Tab>('dashboard');

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  // Staff see customers too; only the destructive controls inside are withheld.
  const tabs: Tab[] = isSuperAdmin()
    ? ['dashboard', 'products', 'orders', 'customers', 'discounts', 'staff']
    : ['dashboard', 'products', 'orders', 'customers', 'discounts'];

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <header className="bg-[#2D0A6B] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={afrotodLogo} alt="The Afrotods" className="h-10 w-auto" />
          <span className="text-sm font-extrabold text-white/60 uppercase tracking-wider" style={{ fontFamily: baloo }}>
            Admin
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 sm:px-4 py-2 rounded-full text-sm font-bold capitalize transition-colors ${
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
        {tab === 'customers' && <CustomersTab onUnauthorized={() => setAuthed(false)} />}
        {tab === 'discounts' && <CouponsTab onUnauthorized={() => setAuthed(false)} />}
        {tab === 'staff' && <StaffTab onUnauthorized={() => setAuthed(false)} />}
      </main>
    </div>
  );
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<'account' | 'key' | 'forgot'>('account');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [key, setKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const inputCls =
    'w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-[#F97316] outline-none font-semibold mb-4';

  const switchTo = (next: 'account' | 'key' | 'forgot') => {
    setMode(next);
    setError(null);
    setSent(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === 'forgot') {
        await adminApi.forgotPassword(email.trim());
        setSent(true);
        return;
      }
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

  if (mode === 'forgot') {
    return (
      <div className="min-h-screen bg-[#2D0A6B] flex items-center justify-center px-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 sm:p-10 w-full max-w-[400px] text-center">
          <img src={afrotodLogo} alt="The Afrotods" className="h-14 w-auto mx-auto mb-2" />
          <h1 className="text-lg font-black text-[#2D0A6B] mb-2" style={{ fontFamily: baloo }}>
            Forgotten password
          </h1>
          {sent ? (
            <>
              {/* Deliberately does not confirm whether the address is an admin. */}
              <p className="text-sm font-semibold text-gray-500 mb-6">
                If that address belongs to an admin, a reset link is on its way. It works once and expires in
                an hour.
              </p>
              <button
                type="button"
                onClick={() => switchTo('account')}
                className="w-full px-8 py-3.5 bg-gray-100 text-[#2D0A6B] rounded-full font-extrabold"
                style={{ fontFamily: baloo }}
              >
                Back to sign in
              </button>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-gray-500 mb-6">
                Enter your admin email and we will send you a link to choose a new password.
              </p>
              <input
                required
                autoFocus
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
              <button
                type="submit"
                disabled={busy}
                className="w-full px-8 py-3.5 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-[#2D0A6B] rounded-full font-extrabold disabled:opacity-40"
                style={{ fontFamily: baloo }}
              >
                {busy ? 'Sending…' : 'Send reset link'}
              </button>
              <button
                type="button"
                onClick={() => switchTo('account')}
                className="mt-4 text-xs font-bold text-gray-400 hover:text-[#F97316]"
              >
                Back to sign in
              </button>
            </>
          )}
        </form>
      </div>
    );
  }

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
        <div className="mt-4 flex flex-col gap-2">
          {mode === 'account' && (
            <button
              type="button"
              onClick={() => switchTo('forgot')}
              className="text-xs font-bold text-gray-400 hover:text-[#F97316]"
            >
              Forgotten your password?
            </button>
          )}
          <button
            type="button"
            onClick={() => switchTo(mode === 'account' ? 'key' : 'account')}
            className="text-xs font-bold text-gray-400 hover:text-[#F97316]"
          >
            {mode === 'account' ? 'Use the bootstrap admin key instead' : 'Use email & password instead'}
          </button>
        </div>
      </form>
    </div>
  );
}

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'paid', label: 'Paid' },
  { value: 'fulfilled', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'pending_payment', label: 'Awaiting payment' },
  { value: 'cancelled', label: 'Cancelled' },
];

function ExportPanel() {
  const [filters, setFilters] = useState({ status: '', date_from: '', date_to: '' });
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputCls =
    'px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#F97316] outline-none font-semibold text-sm';

  const run = async (format: 'csv' | 'xlsx' | 'pdf') => {
    setBusy(format);
    setError(null);
    try {
      await adminApi.downloadExport(format, filters);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed');
    } finally {
      setBusy(null);
    }
  };

  const set = (key: keyof typeof filters) => (e: { target: { value: string } }) =>
    setFilters((f) => ({ ...f, [key]: e.target.value }));

  const quickRange = (months: number) => {
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - months);
    setFilters((f) => ({
      ...f,
      date_from: from.toISOString().slice(0, 10),
      date_to: to.toISOString().slice(0, 10),
    }));
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm mb-8">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <h2 className="font-black text-[#2D0A6B]" style={{ fontFamily: baloo }}>
          Export sales
        </h2>
        <div className="flex gap-2">
          {(['csv', 'xlsx', 'pdf'] as const).map((f) => (
            <button
              key={f}
              onClick={() => run(f)}
              disabled={busy !== null}
              className="px-5 py-2.5 rounded-full text-xs font-extrabold border-2 border-[#2D0A6B] text-[#2D0A6B] hover:bg-[#2D0A6B] hover:text-white transition-colors disabled:opacity-40"
            >
              {busy === f ? 'Preparing…' : f === 'xlsx' ? 'Excel' : f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <select value={filters.status} onChange={set('status')} className={inputCls}>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <label className="text-xs font-bold text-gray-400">
          From
          <input type="date" value={filters.date_from} onChange={set('date_from')} className={`${inputCls} ml-2`} />
        </label>
        <label className="text-xs font-bold text-gray-400">
          To
          <input type="date" value={filters.date_to} onChange={set('date_to')} className={`${inputCls} ml-2`} />
        </label>
        <div className="flex gap-2">
          {[
            { label: 'This quarter', months: 3 },
            { label: 'Last 12 months', months: 12 },
          ].map((r) => (
            <button
              key={r.label}
              onClick={() => quickRange(r.months)}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-gray-500 border border-gray-200 hover:border-[#2D0A6B] hover:text-[#2D0A6B]"
            >
              {r.label}
            </button>
          ))}
          {(filters.date_from || filters.date_to || filters.status) && (
            <button
              onClick={() => setFilters({ status: '', date_from: '', date_to: '' })}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-gray-400 hover:text-red-500"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-red-600 font-bold text-sm mt-3">{error}</p>}
      <p className="text-xs font-semibold text-gray-400 mt-3">
        Every format carries the same rows, with VAT per order and a paid-revenue summary by currency, the numbers
        your accountant needs for a VAT return.
      </p>
    </div>
  );
}

function RoyalMailStatus() {
  const [result, setResult] = useState<Awaited<ReturnType<typeof adminApi.checkRoyalMail>> | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);

  const [test, setTest] = useState<Awaited<ReturnType<typeof adminApi.sendRoyalMailTestOrder>> | null>(null);

  const check = async () => {
    setBusy(true);
    setFailed(null);
    setResult(null);
    setTest(null);
    try {
      setResult(await adminApi.checkRoyalMail());
    } catch (e) {
      setFailed(e instanceof Error ? e.message : 'Could not run the check');
    } finally {
      setBusy(false);
    }
  };

  const sendTestOrder = async () => {
    const warning =
      'Send a test order to Royal Mail?\n\n' +
      'It creates one real order in your Click & Drop account, addressed to Deo Media and marked ' +
      'as a test, which is why it is not going to a customer. Delete it there afterwards. Nothing is ' +
      'recorded on the website and no stock moves.';
    if (!window.confirm(warning)) return;
    setBusy(true);
    setFailed(null);
    setResult(null);
    setTest(null);
    try {
      setTest(await adminApi.sendRoyalMailTestOrder());
    } catch (e) {
      setFailed(e instanceof Error ? e.message : 'Could not send the test order');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm mb-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-black text-[#2D0A6B]" style={{ fontFamily: baloo }}>
            Royal Mail Click &amp; Drop
          </div>
          <p className="text-xs font-semibold text-gray-400 mt-1 max-w-md">
            Check connection reads one order and creates nothing. Send a test order writes a real one,
            addressed to Deo Media rather than a customer, so an accidental label comes back to you.
            Real orders always go to the address the customer entered at checkout.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={check}
            disabled={busy}
            className="px-6 py-2.5 rounded-full font-extrabold text-sm border-2 border-[#2D0A6B] text-[#2D0A6B] hover:bg-[#2D0A6B] hover:text-white disabled:opacity-40"
            style={{ fontFamily: baloo }}
          >
            {busy ? 'Working…' : 'Check connection'}
          </button>
          {isSuperAdmin() && (
            <button
              onClick={sendTestOrder}
              disabled={busy}
              className="px-6 py-2.5 rounded-full font-extrabold text-sm border-2 border-gray-200 text-gray-500 hover:border-[#F97316] hover:text-[#F97316] disabled:opacity-40"
              style={{ fontFamily: baloo }}
            >
              Send a test order
            </button>
          )}
        </div>
      </div>

      {failed && <p className="text-red-600 font-bold text-sm mt-4">{failed}</p>}

      {test && (
        <div
          className={`mt-4 rounded-2xl px-5 py-3 text-sm font-bold ${
            test.created ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${test.created ? 'bg-green-500' : 'bg-orange-500'}`} />
            {test.created ? `Test order ${test.reference} created` : 'Royal Mail would not take the order'}
          </div>
          {(test.detail || test.reason) && <p className="font-semibold mt-1">{test.detail ?? test.reason}</p>}
          {test.errors && <p className="font-semibold opacity-80 mt-1">{test.errors}</p>}
          {test.hint && <p className="font-semibold opacity-80 mt-1">{test.hint}</p>}
        </div>
      )}

      {result && (
        <div
          className={`mt-4 rounded-2xl px-5 py-3 text-sm font-bold ${
            result.connected ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${result.connected ? 'bg-green-500' : 'bg-orange-500'}`} />
            {result.connected ? 'Connected' : 'Not connected'}
            {result.service && <span className="font-semibold">· service {result.service}</span>}
          </div>
          {(result.detail || result.reason) && (
            <p className="font-semibold mt-1">{result.detail ?? result.reason}</p>
          )}
          {result.hint && <p className="font-semibold opacity-80 mt-1">{result.hint}</p>}
        </div>
      )}
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
    { label: 'Paid, to fulfil', value: stats.orders_paid },
    { label: 'Shipped', value: stats.orders_fulfilled },
  ];

  return (
    <div>
      <RoyalMailStatus />
      <ExportPanel />

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
