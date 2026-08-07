import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Gift, Minus, Plus, ShoppingCart, Tag, Trash2, X } from 'lucide-react';
import {
  imageSrc,
  fetchProducts,
  fetchShippingRates,
  formatMoney,
  payable,
  previewCoupon,
  priceFor,
  type Product,
  type CouponPreview,
  type ShippingRates,
  type Variant,
} from '../shop/api';
import { useCart } from '../shop/CartContext';
import { CurrencyPicker } from '../shop/CurrencyPicker';

const baloo = "'Baloo 2', cursive";

export interface ResolvedLine {
  variantId: number;
  quantity: number;
  product: Product;
  variant: Variant;
}

export function useResolvedCart() {
  const { lines, currency } = useCart();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((e: Error) => setError(e.message));
  }, []);

  const resolved = useMemo<ResolvedLine[] | null>(() => {
    if (products === null) return null;
    const byVariant = new Map<number, { product: Product; variant: Variant }>();
    for (const p of products) for (const v of p.variants) byVariant.set(v.id, { product: p, variant: v });
    return lines.flatMap((l) => {
      const hit = byVariant.get(l.variantId);
      return hit ? [{ variantId: l.variantId, quantity: l.quantity, ...hit }] : [];
    });
  }, [products, lines]);

  const subtotal = useMemo(() => {
    if (!resolved) return null;
    let total = 0;
    for (const line of resolved) {
      const price = priceFor(line.variant, currency);
      if (!price) return null; // some item not priced in this currency
      total += payable(price) * line.quantity;
    }
    return total;
  }, [resolved, currency]);

  const [rates, setRates] = useState<ShippingRates[] | null>(null);
  useEffect(() => {
    // A missing rate only costs the estimate, so a failure here stays quiet.
    fetchShippingRates()
      .then(setRates)
      .catch(() => setRates(null));
  }, []);

  /** Mirrors the server: one charge per order, priced on the largest format. */
  const shipping = useMemo(() => {
    const rate = rates?.find((r) => r.currency === currency);
    if (!rate || !resolved || subtotal === null) return null;
    if (resolved.length === 0) return 0;
    const anyParcel = resolved.some((l) => l.product.shipping_class === 'small_parcel');
    return anyParcel ? rate.small_parcel_minor : rate.large_letter_minor;
  }, [rates, currency, resolved, subtotal]);

  const [coupon, setCoupon] = useState<CouponPreview | null>(null);

  // A coupon priced against an older basket would quote a stale saving, and
  // the server would then charge something different. Re-price on any change.
  useEffect(() => {
    if (!coupon || !resolved) return;
    previewCoupon(
      coupon.code,
      currency,
      resolved.map((l) => ({ variant_id: l.variantId, quantity: l.quantity })),
    )
      .then(setCoupon)
      .catch(() => setCoupon(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, subtotal]);

  const discount = coupon?.discount_minor ?? 0;

  return { resolved, subtotal, shipping, coupon, setCoupon, discount, error };
}

export function ShopCart() {
  const { currency, setQuantity, remove } = useCart();
  const { resolved, subtotal, shipping, coupon, setCoupon, discount, error } = useResolvedCart();

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-[900px] mx-auto px-6">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-[#2D0A6B]" style={{ fontFamily: baloo }}>
            Your Cart
          </h1>
          <div className="bg-[#2D0A6B] rounded-full">
            <CurrencyPicker />
          </div>
        </div>

        {error && <p className="text-red-600 font-bold">Couldn't load the cart: {error}</p>}
        {!error && resolved === null && <div className="h-40 rounded-3xl bg-[#FFF8F0] animate-pulse" />}

        {!error && resolved !== null && resolved.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#FFF8F0] flex items-center justify-center"><ShoppingCart className="w-12 h-12 text-[#F97316]" /></div>
            <p className="text-xl text-gray-700 mb-8">Your cart is empty.</p>
            <Link
              to="/shop"
              className="inline-block px-10 py-4 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-[#2D0A6B] rounded-full font-extrabold text-lg shadow-lg"
              style={{ fontFamily: baloo }}
            >
              Browse the Shop
            </Link>
          </div>
        )}

        {!error && resolved !== null && resolved.length > 0 && (
          <>
            <div className="divide-y divide-gray-100 mb-10">
              {resolved.map((line) => {
                const price = priceFor(line.variant, currency);
                const cover = line.product.images[0];
                return (
                  // On a phone the fixed columns leave nothing for the name, so the
                  // controls wrap onto a second line and the name keeps its width.
                  <div key={line.variantId} className="py-6 flex items-center gap-4 sm:gap-6 flex-wrap sm:flex-nowrap">
                    <Link
                      to={`/shop/${line.product.slug}`}
                      className="w-20 h-20 rounded-2xl bg-white border border-gray-100 overflow-hidden flex items-center justify-center shrink-0"
                    >
                      {cover ? (
                        <img src={imageSrc(cover.url)} alt={line.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Gift className="w-8 h-8 text-[#2D0A6B]/20" />
                      )}
                    </Link>
                    <div className="flex-1 basis-40 min-w-0">
                      <div className="font-black text-[#2D0A6B]" style={{ fontFamily: baloo }}>
                        {line.product.name}
                      </div>
                      <div className="text-sm text-gray-500 font-semibold">{line.variant.name}</div>
                      {!price && <div className="text-sm text-red-600 font-bold">Not available in {currency}</div>}
                    </div>
                    <div className="inline-flex items-center gap-3 border-2 border-gray-200 rounded-full px-3 py-1.5 shrink-0">
                      <button
                        onClick={() => setQuantity(line.variantId, line.quantity - 1)}
                        aria-label="Decrease"
                        className="p-1"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-extrabold w-5 text-center">{line.quantity}</span>
                      <button
                        onClick={() => setQuantity(line.variantId, Math.min(line.variant.stock_qty, line.quantity + 1))}
                        aria-label="Increase"
                        className="p-1"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="font-extrabold w-20 sm:w-24 text-right shrink-0">
                      {price ? formatMoney(payable(price) * line.quantity, currency) : 'N/A'}
                      {price?.sale_amount_minor != null && (
                        <div className="text-xs font-bold text-gray-400 line-through">
                          {formatMoney(price.amount_minor * line.quantity, currency)}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => remove(line.variantId)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 -m-1 shrink-0"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>

            <CouponBox
              items={resolved.map((l) => ({ variant_id: l.variantId, quantity: l.quantity }))}
              currency={currency}
              coupon={coupon}
              onApplied={setCoupon}
            />

            <div className="flex items-center justify-between border-t-2 border-[#2D0A6B]/10 pt-6 mt-6 gap-4 flex-wrap">
              <div className="text-lg font-extrabold text-gray-700">
                <div>
                  Subtotal:{' '}
                  <span className="text-[#2D0A6B]">
                    {subtotal !== null ? formatMoney(subtotal, currency) : 'N/A'}
                  </span>
                </div>
                {discount > 0 && coupon && (
                  <div className="text-green-600 text-base">
                    {coupon.code}: -{formatMoney(discount, currency)}
                  </div>
                )}
                <div className="text-xs text-gray-400 font-semibold">
                  {shipping === null
                    ? 'Shipping calculated at checkout'
                    : `Plus ${formatMoney(shipping, currency)} UK delivery`}
                </div>
                {subtotal !== null && shipping !== null && (
                  <div className="text-[#2D0A6B] mt-1">
                    Total: {formatMoney(subtotal - discount + shipping, currency)}
                  </div>
                )}
              </div>
              <Link
                to="/shop/checkout"
                className={`px-10 py-4 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-[#2D0A6B] rounded-full font-extrabold text-lg shadow-lg transition-all ${
                  subtotal === null ? 'opacity-40 pointer-events-none' : 'hover:-translate-y-0.5'
                }`}
                style={{ fontFamily: baloo }}
              >
                Checkout →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CouponBox({
  items,
  currency,
  coupon,
  onApplied,
}: {
  items: { variant_id: number; quantity: number }[];
  currency: ReturnType<typeof useCart>['currency'];
  coupon: CouponPreview | null;
  onApplied: (c: CouponPreview | null) => void;
}) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const apply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    setError(null);
    try {
      onApplied(await previewCoupon(code.trim(), currency, items));
      setCode('');
    } catch (err) {
      // The server's wording explains exactly why, so show it verbatim.
      setError(err instanceof Error ? err.message : "That code isn't valid");
      onApplied(null);
    } finally {
      setBusy(false);
    }
  };

  if (coupon) {
    return (
      <div className="mt-8 flex items-center gap-3 rounded-2xl bg-green-50 px-5 py-3 text-sm font-bold text-green-700">
        <Tag className="w-4 h-4 shrink-0" />
        <span className="flex-1">
          {coupon.code} applied
          {coupon.description && <span className="font-semibold"> · {coupon.description}</span>}
        </span>
        <button
          onClick={() => onApplied(null)}
          className="text-green-700/60 hover:text-green-700 p-1 -m-1"
          aria-label="Remove discount code"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={apply} className="mt-8">
      <div className="flex gap-2 flex-wrap">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Discount code"
          aria-label="Discount code"
          className="flex-1 min-w-40 px-5 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#F97316] outline-none font-semibold uppercase"
        />
        <button
          type="submit"
          disabled={busy || !code.trim()}
          className="px-7 py-3 rounded-full border-2 border-[#2D0A6B] text-[#2D0A6B] font-extrabold disabled:opacity-40"
          style={{ fontFamily: baloo }}
        >
          {busy ? 'Checking…' : 'Apply'}
        </button>
      </div>
      {error && <p className="text-red-600 font-bold text-sm mt-2">{error}</p>}
    </form>
  );
}
