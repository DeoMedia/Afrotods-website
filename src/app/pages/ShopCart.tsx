import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Gift, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { imageSrc, fetchProducts, formatMoney, priceFor, type Product, type Variant } from '../shop/api';
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
      total += price.amount_minor * line.quantity;
    }
    return total;
  }, [resolved, currency]);

  return { resolved, subtotal, error };
}

export function ShopCart() {
  const { currency, setQuantity, remove } = useCart();
  const { resolved, subtotal, error } = useResolvedCart();

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
                  <div key={line.variantId} className="py-6 flex items-center gap-6">
                    <Link
                      to={`/shop/${line.product.slug}`}
                      className="w-20 h-20 rounded-2xl bg-[#FFF8F0] overflow-hidden flex items-center justify-center shrink-0"
                    >
                      {cover ? (
                        <img src={imageSrc(cover.url)} alt={line.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Gift className="w-8 h-8 text-[#2D0A6B]/20" />
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-[#2D0A6B]" style={{ fontFamily: baloo }}>
                        {line.product.name}
                      </div>
                      <div className="text-sm text-gray-500 font-semibold">{line.variant.name}</div>
                      {!price && <div className="text-sm text-red-600 font-bold">Not available in {currency}</div>}
                    </div>
                    <div className="inline-flex items-center gap-3 border-2 border-gray-200 rounded-full px-3 py-1.5">
                      <button onClick={() => setQuantity(line.variantId, line.quantity - 1)} aria-label="Decrease">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-extrabold w-5 text-center">{line.quantity}</span>
                      <button
                        onClick={() => setQuantity(line.variantId, Math.min(line.variant.stock_qty, line.quantity + 1))}
                        aria-label="Increase"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="font-extrabold w-24 text-right">
                      {price ? formatMoney(price.amount_minor * line.quantity, currency) : '—'}
                    </div>
                    <button
                      onClick={() => remove(line.variantId)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t-2 border-[#2D0A6B]/10 pt-6">
              <div className="text-lg font-extrabold text-gray-700">
                Subtotal:{' '}
                <span className="text-[#2D0A6B]">{subtotal !== null ? formatMoney(subtotal, currency) : '—'}</span>
                <div className="text-xs text-gray-400 font-semibold">Shipping calculated at checkout</div>
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
