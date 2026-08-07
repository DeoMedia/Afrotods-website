import { useEffect, useState, type FormEvent } from 'react';
import { Tag, Trash2 } from 'lucide-react';
import { adminApi, isSuperAdmin, type Coupon } from './api';
import { formatMoney, type Currency } from '../shop/api';

const baloo = "'Baloo 2', cursive";
const inputCls =
  'w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#F97316] outline-none font-semibold text-sm';

const CURRENCIES: Currency[] = ['GBP', 'NGN', 'ZAR', 'USD'];

export function CouponsTab({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [coupons, setCoupons] = useState<Coupon[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const canIssue = isSuperAdmin();

  const [form, setForm] = useState({
    code: '',
    discount_type: 'percent' as 'percent' | 'fixed',
    percent_off: '10',
    amount: '',
    currency: 'GBP' as Currency,
    min_spend: '',
    max_uses: '',
    expires_at: '',
    description: '',
  });

  const load = () =>
    adminApi
      .listCoupons()
      .then(setCoupons)
      .catch((e: Error) => (e.message === 'unauthorized' ? onUnauthorized() : setError(e.message)));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const percent = form.discount_type === 'percent';
      await adminApi.createCoupon({
        code: form.code.trim().toUpperCase(),
        discount_type: form.discount_type,
        percent_off: percent ? parseInt(form.percent_off, 10) || 0 : 0,
        amount_minor: percent ? 0 : Math.round(parseFloat(form.amount || '0') * 100),
        currency: percent ? null : form.currency,
        min_spend_minor: Math.round(parseFloat(form.min_spend || '0') * 100),
        max_uses: form.max_uses ? parseInt(form.max_uses, 10) : null,
        starts_at: null,
        // A date alone means midnight, which would expire the code at the start
        // of that day. End of day is what anyone typing a date means.
        expires_at: form.expires_at ? `${form.expires_at}T23:59:59` : null,
        description: form.description.trim(),
      });
      setNotice(`${form.code.trim().toUpperCase()} is live.`);
      setForm({ ...form, code: '', description: '', max_uses: '', expires_at: '' });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create that code');
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (c: Coupon) => {
    setError(null);
    setNotice(null);
    try {
      await adminApi.updateCoupon(c.id, { active: !c.active });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update that code');
    }
  };

  const remove = async (c: Coupon) => {
    if (!window.confirm(`Delete ${c.code}? Switching it off keeps the record and can be undone.`)) return;
    setError(null);
    setNotice(null);
    try {
      await adminApi.deleteCoupon(c.id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete that code');
    }
  };

  const valueLabel = (c: Coupon) =>
    c.discount_type === 'percent'
      ? `${c.percent_off}% off`
      : `${formatMoney(c.amount_minor, (c.currency ?? 'GBP') as Currency)} off`;

  const usageLabel = (c: Coupon) => (c.max_uses === null ? `${c.times_used}` : `${c.times_used} / ${c.max_uses}`);

  const expired = (c: Coupon) => c.expires_at !== null && new Date(c.expires_at) < new Date();

  return (
    <div>
      <h2 className="text-2xl font-black text-[#2D0A6B] mb-6" style={{ fontFamily: baloo }}>
        Discount codes
      </h2>

      {canIssue && (
        <form onSubmit={create} className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          <div className="text-sm font-black text-[#2D0A6B] mb-3">Create a code</div>
          <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <input
              required
              minLength={3}
              placeholder="Code, e.g. WELCOME10"
              value={form.code}
              onChange={set('code')}
              className={`${inputCls} uppercase`}
            />
            <select value={form.discount_type} onChange={set('discount_type')} className={inputCls}>
              <option value="percent">Percentage off</option>
              <option value="fixed">Fixed amount off</option>
            </select>

            {form.discount_type === 'percent' ? (
              <div className="relative">
                <input
                  required
                  type="number"
                  min="1"
                  max="100"
                  value={form.percent_off}
                  onChange={set('percent_off')}
                  className={inputCls}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                  % off
                </span>
              </div>
            ) : (
              <>
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Amount off"
                  value={form.amount}
                  onChange={set('amount')}
                  className={inputCls}
                />
                <select
                  value={form.currency}
                  onChange={set('currency')}
                  className={inputCls}
                  title="A fixed amount only applies to orders in this currency"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </>
            )}

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Minimum spend (optional)"
              value={form.min_spend}
              onChange={set('min_spend')}
              className={inputCls}
            />
            <input
              type="number"
              min="1"
              placeholder="Max uses (optional)"
              value={form.max_uses}
              onChange={set('max_uses')}
              className={inputCls}
            />
            <input
              type="date"
              value={form.expires_at}
              onChange={set('expires_at')}
              className={inputCls}
              title="Last day the code works. Leave blank for no end date."
            />
            <input
              placeholder="Description shown in the cart"
              value={form.description}
              onChange={set('description')}
              className={inputCls}
            />
            <button
              type="submit"
              disabled={busy}
              className="px-6 py-2.5 bg-[#2D0A6B] text-white rounded-full font-extrabold text-sm disabled:opacity-40"
              style={{ fontFamily: baloo }}
            >
              {busy ? 'Creating…' : 'Create code'}
            </button>
          </div>
          <p className="text-xs font-semibold text-gray-400 mt-3">
            A code comes off the goods only, never the postage, and never takes more off than the basket is worth.
            Uses are counted when an order is paid for, so abandoned baskets do not use up a limited run.
          </p>
        </form>
      )}

      {notice && <p className="text-green-600 font-bold mb-4">{notice}</p>}
      {error && <p className="text-red-600 font-bold mb-4">{error}</p>}
      {coupons === null && <div className="h-32 rounded-3xl bg-white animate-pulse" />}

      {coupons !== null && coupons.length === 0 && (
        <div className="bg-white rounded-3xl p-10 text-center font-bold text-gray-400">
          No discount codes yet.
        </div>
      )}

      {coupons !== null && coupons.length > 0 && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[46rem]">
            <thead>
              <tr className="text-left text-gray-400 font-bold">
                <th className="py-2 pr-4">Code</th>
                <th className="py-2 pr-4">Discount</th>
                <th className="py-2 pr-4">Minimum</th>
                <th className="py-2 pr-4">Used</th>
                <th className="py-2 pr-4">Ends</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-t border-gray-100 font-semibold text-gray-700">
                  <td className="py-3 pr-4">
                    <span className="inline-flex items-center gap-1.5 font-extrabold text-[#2D0A6B]">
                      <Tag className="w-3.5 h-3.5" />
                      {c.code}
                    </span>
                    {c.description && <div className="text-xs text-gray-400 font-semibold">{c.description}</div>}
                  </td>
                  <td className="py-3 pr-4">{valueLabel(c)}</td>
                  <td className="py-3 pr-4">
                    {c.min_spend_minor > 0
                      ? formatMoney(c.min_spend_minor, (c.currency ?? 'GBP') as Currency)
                      : '—'}
                  </td>
                  <td className="py-3 pr-4 tabular-nums">{usageLabel(c)}</td>
                  <td className="py-3 pr-4 text-gray-400">
                    {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          !c.active ? 'bg-gray-300' : expired(c) ? 'bg-orange-400' : 'bg-green-500'
                        }`}
                      />
                      {!c.active ? 'Off' : expired(c) ? 'Expired' : 'Live'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                      <button
                        onClick={() => toggle(c)}
                        className={`px-4 py-1.5 rounded-full text-xs font-extrabold border-2 ${
                          c.active
                            ? 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500'
                            : 'border-green-300 text-green-600'
                        }`}
                      >
                        {c.active ? 'Switch off' : 'Switch on'}
                      </button>
                      {canIssue && (
                        <button
                          onClick={() => remove(c)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold border-2 border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!canIssue && (
        <p className="text-xs font-semibold text-gray-400 mt-4">
          Only a super admin can create or delete a code. Anyone can switch one off, so a leaked code can be
          stopped straight away.
        </p>
      )}
    </div>
  );
}
