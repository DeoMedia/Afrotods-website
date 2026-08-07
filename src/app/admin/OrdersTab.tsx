import { useEffect, useState, type FormEvent } from 'react';
import { Check, Pencil, RefreshCw, Truck } from 'lucide-react';
import { adminApi, type AdminOrder } from './api';
import { formatMoney, type Currency } from '../shop/api';

const baloo = "'Baloo 2', cursive";
const inputCls =
  'w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#F97316] outline-none font-semibold text-sm';

const NEXT_STATUSES: Record<string, string[]> = {
  pending_payment: ['paid', 'cancelled'],
  paid: ['fulfilled', 'cancelled'],
  fulfilled: ['delivered'],
  delivered: [],
  cancelled: [],
};

const STATUS_FILTERS = ['all', 'pending_payment', 'paid', 'fulfilled', 'delivered', 'cancelled'];

export function OrdersTab({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = (f = filter) =>
    adminApi
      .listOrders(f === 'all' ? undefined : f)
      .then(setOrders)
      .catch((e: Error) => (e.message === 'unauthorized' ? onUnauthorized() : setError(e.message)));

  useEffect(() => {
    load(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const syncRoyalMail = async () => {
    setSyncing(true);
    setError(null);
    setNotice(null);
    try {
      const r = await adminApi.syncRoyalMail();
      setNotice(
        r.tracking_found === 0
          ? `Checked ${r.checked} order${r.checked === 1 ? '' : 's'}. No new labels bought yet.`
          : `Picked up ${r.tracking_found} tracking number${r.tracking_found === 1 ? '' : 's'}, ` +
            `${r.marked_shipped} marked shipped and the customers emailed.`,
      );
      load(filter);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not reach Royal Mail');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <h2 className="text-2xl font-black text-[#2D0A6B]" style={{ fontFamily: baloo }}>
          Orders
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={syncRoyalMail}
            disabled={syncing}
            title="Fetch tracking numbers for any order whose label has been bought in Click & Drop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-extrabold text-sm border-2 border-[#2D0A6B] text-[#2D0A6B] hover:bg-[#2D0A6B] hover:text-white disabled:opacity-40"
            style={{ fontFamily: baloo }}
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Checking…' : 'Sync Royal Mail'}
          </button>
          <button
            onClick={() => setShowManual(!showManual)}
            className="px-6 py-2.5 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-[#2D0A6B] rounded-full font-extrabold text-sm"
            style={{ fontFamily: baloo }}
          >
            {showManual ? 'Close' : '+ New manual order'}
          </button>
        </div>
      </div>

      {showManual && (
        <ManualOrderForm
          onCreated={() => {
            setShowManual(false);
            load();
          }}
        />
      )}

      <div className="flex gap-2 flex-wrap mb-6">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold border-2 ${
              filter === f ? 'bg-[#2D0A6B] text-white border-[#2D0A6B]' : 'border-gray-200 text-gray-500'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {notice && <p className="text-green-600 font-bold mb-4">{notice}</p>}
      {error && <p className="text-red-600 font-bold mb-4">{error}</p>}
      {orders === null && <div className="h-40 rounded-3xl bg-white animate-pulse" />}
      {orders?.length === 0 && <p className="text-gray-400 font-semibold">No orders here yet.</p>}

      <div className="space-y-3">
        {orders?.map((o) => (
          <div key={o.reference} className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === o.reference ? null : o.reference)}
              className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left"
            >
              <div>
                <span className="font-black text-[#2D0A6B]">{o.reference}</span>
                <span className="ml-3 text-sm font-semibold text-gray-500">
                  {o.customer_name} · {o.customer_email}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {o.source === 'manual' && (
                  <span className="text-xs font-extrabold text-purple-500 bg-purple-50 px-2 py-1 rounded-full">manual</span>
                )}
                {o.clickdrop_order_id !== null && (
                  <span
                    title={`In Royal Mail Click & Drop as order ${o.clickdrop_order_id}`}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-[#2D0A6B] bg-[#FFF8F0] px-2 py-1 rounded-full"
                  >
                    <Truck className="w-3 h-3" />
                    Royal Mail
                  </span>
                )}
                <span className="text-xs font-extrabold uppercase text-gray-400">{o.status.replace('_', ' ')}</span>
                <span className="font-black text-gray-800">{formatMoney(o.total_minor, o.currency)}</span>
              </div>
            </button>

            {expanded === o.reference && (
              <OrderDetail order={o} onChanged={load} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderDetail({ order, onChanged }: { order: AdminOrder; onChanged: () => void }) {
  const [shipping, setShipping] = useState({
    carrier: order.carrier,
    tracking_number: order.tracking_number,
    tracking_url: order.tracking_url,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Saved details show as a summary; the form only appears when there is
  // nothing yet, or when Edit is pressed. Before this the inputs were always
  // on screen, so a saved order looked exactly like an unsaved one.
  const isSaved = Boolean(order.carrier || order.tracking_number);
  const [editing, setEditing] = useState(!isSaved);

  const doStatus = async (status: string) => {
    if (status === 'cancelled' && !window.confirm(`Cancel order ${order.reference}? Stock will be restored.`)) return;
    setBusy(true);
    setError(null);
    try {
      await adminApi.updateStatus(order.reference, status);
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setBusy(false);
    }
  };

  const sendToRoyalMail = async () => {
    setBusy(true);
    setError(null);
    try {
      await adminApi.sendToRoyalMail(order.reference);
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Royal Mail would not accept the order');
    } finally {
      setBusy(false);
    }
  };

  const saveShipping = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // Fill in Royal Mail's own tracking page when a number is given without
      // a link, so the customer's email points somewhere that actually tracks.
      const payload = { ...shipping };
      if (!payload.tracking_url.trim() && payload.tracking_number.trim() && /royal\s*mail/i.test(payload.carrier)) {
        payload.tracking_url = `https://www.royalmail.com/track-your-item#/tracking-results/${encodeURIComponent(
          payload.tracking_number.trim(),
        )}`;
      }
      await adminApi.updateShipping(order.reference, payload);
      setShipping(payload);
      setEditing(false);
      onChanged();
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : 'Failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="px-6 pb-6 border-t border-gray-100 pt-4 grid md:grid-cols-2 gap-6 text-sm">
      <div>
        <ul className="space-y-1 mb-4 font-semibold text-gray-700">
          {order.items.map((item) => (
            <li key={item.sku}>
              {item.product_name}, {item.variant_name} × {item.quantity} (
              {formatMoney(item.unit_amount_minor, order.currency)})
            </li>
          ))}
        </ul>
        <div className="text-gray-500 font-semibold">
          Subtotal {formatMoney(order.subtotal_minor, order.currency)} · Shipping{' '}
          {formatMoney(order.shipping_minor, order.currency)} · VAT incl. {formatMoney(order.tax_minor, order.currency)}
        </div>
        <div className="mt-4">
          <div className="text-xs font-extrabold text-gray-400 mb-1">HISTORY</div>
          <ul className="space-y-1 text-gray-600 font-semibold">
            {order.history.map((h, i) => (
              <li key={i}>
                {new Date(h.created_at).toLocaleString()}: {h.status.replace('_', ' ')}
                {h.note && <span className="text-gray-400"> · {h.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <div className="flex gap-2 flex-wrap mb-4">
          {NEXT_STATUSES[order.status].map((s) => (
            <button
              key={s}
              disabled={busy}
              onClick={() => doStatus(s)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold border-2 disabled:opacity-40 ${
                s === 'cancelled'
                  ? 'border-red-200 text-red-500 hover:bg-red-50'
                  : 'border-[#2D0A6B] text-[#2D0A6B] hover:bg-[#2D0A6B] hover:text-white'
              }`}
            >
              Mark {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {order.clickdrop_order_id === null && order.status !== 'cancelled' && (
          <button
            onClick={sendToRoyalMail}
            disabled={busy}
            className="mb-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold border-2 border-gray-200 text-gray-500 hover:border-[#2D0A6B] hover:text-[#2D0A6B] disabled:opacity-40"
          >
            <Truck className="w-3.5 h-3.5" />
            Send to Royal Mail
          </button>
        )}

        {!editing ? (
          <div className="rounded-2xl border-2 border-gray-100 p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-green-600">
                <Check className="w-3.5 h-3.5" />
                Shipping info saved
              </span>
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold border-2 border-gray-200 text-gray-500 hover:border-[#2D0A6B] hover:text-[#2D0A6B]"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
            </div>
            <dl className="text-sm font-semibold text-gray-700 space-y-1">
              <div className="flex gap-2">
                <dt className="text-gray-400 w-24 shrink-0">Carrier</dt>
                <dd>{order.carrier || '—'}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-gray-400 w-24 shrink-0">Tracking</dt>
                <dd className="break-all">{order.tracking_number || '—'}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-gray-400 w-24 shrink-0">Link</dt>
                <dd className="break-all">
                  {order.tracking_url ? (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#F97316] hover:underline"
                    >
                      {order.tracking_url}
                    </a>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <form onSubmit={saveShipping} className="space-y-2">
            <input
              placeholder="Carrier (e.g. Royal Mail)"
              value={shipping.carrier}
              onChange={(e) => setShipping((s) => ({ ...s, carrier: e.target.value }))}
              className={inputCls}
            />
            <input
              placeholder="Tracking number"
              value={shipping.tracking_number}
              onChange={(e) => setShipping((s) => ({ ...s, tracking_number: e.target.value }))}
              className={inputCls}
            />
            <input
              placeholder="Tracking URL (left blank, Royal Mail's own link is used)"
              value={shipping.tracking_url}
              onChange={(e) => setShipping((s) => ({ ...s, tracking_url: e.target.value }))}
              className={inputCls}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={busy}
                className="px-6 py-2 bg-[#2D0A6B] text-white rounded-full text-xs font-extrabold disabled:opacity-40"
              >
                {busy ? 'Saving…' : 'Save shipping info'}
              </button>
              {isSaved && (
                <button
                  type="button"
                  onClick={() => {
                    setShipping({
                      carrier: order.carrier,
                      tracking_number: order.tracking_number,
                      tracking_url: order.tracking_url,
                    });
                    setEditing(false);
                  }}
                  className="px-5 py-2 rounded-full text-xs font-extrabold border-2 border-gray-200 text-gray-500"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
        {error && <p className="text-red-600 font-bold mt-2">{error}</p>}
      </div>
    </div>
  );
}

function ManualOrderForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({
    currency: 'GBP' as Currency,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    line1: '',
    city: '',
    country: 'GB',
    variant_id: '',
    quantity: '1',
    note: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await adminApi.manualOrder({
        currency: form.currency,
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        customer_phone: form.customer_phone,
        shipping_address: { line1: form.line1, city: form.city, country: form.country },
        items: [{ variant_id: parseInt(form.variant_id, 10), quantity: parseInt(form.quantity, 10) || 1 }],
        note: form.note || 'Manual order',
      });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-sm mb-6 space-y-3">
      <div className="text-sm font-black text-[#2D0A6B]">
        Manual order (phone/social sale), recorded as already paid. Stock is reserved
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <input required placeholder="Customer name" value={form.customer_name} onChange={set('customer_name')} className={inputCls} />
        <input required type="email" placeholder="Customer email" value={form.customer_email} onChange={set('customer_email')} className={inputCls} />
        <input placeholder="Phone" value={form.customer_phone} onChange={set('customer_phone')} className={inputCls} />
        <input required placeholder="Address line 1" value={form.line1} onChange={set('line1')} className={inputCls} />
        <input required placeholder="City" value={form.city} onChange={set('city')} className={inputCls} />
        <input required placeholder="Country code (GB/NG/ZA…)" maxLength={2} value={form.country} onChange={set('country')} className={inputCls} />
        <input required type="number" placeholder="Variant ID (see Products tab)" value={form.variant_id} onChange={set('variant_id')} className={inputCls} />
        <input required type="number" min="1" placeholder="Qty" value={form.quantity} onChange={set('quantity')} className={inputCls} />
        <select value={form.currency} onChange={set('currency')} className={inputCls}>
          {(['GBP', 'NGN', 'ZAR', 'USD'] as Currency[]).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <input placeholder="Note (e.g. Instagram DM sale)" value={form.note} onChange={set('note')} className={inputCls} />
      {error && <p className="text-red-600 font-bold text-sm">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="px-6 py-2.5 bg-[#2D0A6B] text-white rounded-full font-extrabold text-sm disabled:opacity-40"
        style={{ fontFamily: baloo }}
      >
        {busy ? 'Saving…' : 'Record order'}
      </button>
    </form>
  );
}
