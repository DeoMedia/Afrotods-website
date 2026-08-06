import { useEffect, useState, type FormEvent } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { adminApi, isSuperAdmin, type AdminCustomer } from './api';
import { formatMoney, type Currency } from '../shop/api';

const baloo = "'Baloo 2', cursive";

export function CustomersTab({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [customers, setCustomers] = useState<AdminCustomer[] | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const canDelete = isSuperAdmin();

  const load = (q = '') =>
    adminApi
      .listCustomers(q)
      .then(setCustomers)
      .catch((e: Error) => (e.message === 'unauthorized' ? onUnauthorized() : setError(e.message)));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = (e: FormEvent) => {
    e.preventDefault();
    setCustomers(null);
    load(query);
  };

  const remove = async (customer: AdminCustomer) => {
    const warning =
      `Permanently delete ${customer.email}?\n\n` +
      'This erases their sign-in and their product ratings. Their orders are kept, ' +
      'because sales records have to be retained for tax purposes.';
    if (!window.confirm(warning)) return;
    setBusy(customer.id);
    setError(null);
    try {
      await adminApi.deleteCustomer(customer.id);
      load(query);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete that customer');
    } finally {
      setBusy(null);
    }
  };

  const spendLabel = (spend: Record<string, number>) => {
    const parts = Object.entries(spend);
    if (parts.length === 0) return '—';
    return parts.map(([currency, minor]) => formatMoney(minor, currency as Currency)).join(' + ');
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-black text-[#2D0A6B]" style={{ fontFamily: baloo }}>
          Customers
        </h2>
        <form onSubmit={search} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or email"
              className="pl-9 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#F97316] outline-none font-semibold text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#2D0A6B] text-white rounded-full font-extrabold text-sm"
            style={{ fontFamily: baloo }}
          >
            Search
          </button>
        </form>
      </div>

      {error && <p className="text-red-600 font-bold mb-4">{error}</p>}
      {customers === null && <div className="h-32 rounded-3xl bg-white animate-pulse" />}

      {customers !== null && customers.length === 0 && (
        <div className="bg-white rounded-3xl p-10 text-center font-bold text-gray-400">
          {query ? `No customers match "${query}".` : 'No customer accounts yet.'}
        </div>
      )}

      {customers !== null && customers.length > 0 && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-gray-400 font-bold">
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Orders</th>
                <th className="py-2 pr-4">Spent</th>
                <th className="py-2 pr-4">Last order</th>
                <th className="py-2 pr-4">Joined</th>
                {canDelete && <th className="py-2" />}
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t border-gray-100 font-semibold text-gray-700">
                  <td className="py-3 pr-4">
                    <div className="font-extrabold text-[#2D0A6B]">{c.name || 'No name given'}</div>
                    <div className="text-gray-400 text-xs">{c.email}</div>
                  </td>
                  <td className="py-3 pr-4">{c.order_count}</td>
                  <td className="py-3 pr-4">{spendLabel(c.spend_minor_by_currency)}</td>
                  <td className="py-3 pr-4 text-gray-400">
                    {c.last_order_at ? new Date(c.last_order_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3 pr-4 text-gray-400">{new Date(c.created_at).toLocaleDateString()}</td>
                  {canDelete && (
                    <td className="py-3 text-right">
                      <button
                        onClick={() => remove(c)}
                        disabled={busy === c.id}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold border-2 border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 disabled:opacity-40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {busy === c.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs font-semibold text-gray-400 mt-4">
        {canDelete
          ? 'Deleting a customer erases their sign-in and ratings. Their orders are kept, because sales records have to be retained for tax purposes.'
          : 'Only a super admin can delete a customer.'}
      </p>
    </div>
  );
}
