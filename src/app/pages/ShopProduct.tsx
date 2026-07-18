import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react';
import { imageSrc, fetchProduct, fetchProducts, formatMoney, priceFor, type Product, type Variant } from '../shop/api';
import { useCart } from '../shop/CartContext';

const baloo = "'Baloo 2', cursive";

export function ShopProduct() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [variant, setVariant] = useState<Variant | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { currency, add } = useCart();

  useEffect(() => {
    if (!slug) return;
    setProduct(null);
    setRelated([]);
    setError(null);
    setQty(1);
    fetchProduct(slug)
      .then((p) => {
        setProduct(p);
        setVariant(p.variants.find((v) => v.active) ?? null);
        // Related: same category first, then anything else, excluding this product
        fetchProducts()
          .then((all) => {
            const others = all.filter((o) => o.slug !== p.slug);
            const sameCategory = others.filter((o) => o.category === p.category);
            const rest = others.filter((o) => o.category !== p.category);
            setRelated([...sameCategory, ...rest].slice(0, 3));
          })
          .catch(() => setRelated([]));
      })
      .catch((e: Error) => setError(e.message));
  }, [slug]);

  if (error) {
    return (
      <div className="pt-40 pb-24 text-center">
        <div className="text-7xl mb-6">😕</div>
        <h1 className="text-3xl font-black text-[#2D0A6B] mb-4" style={{ fontFamily: baloo }}>
          Product not found
        </h1>
        <Link to="/shop" className="text-[#F97316] font-bold hover:underline">
          ← Back to the shop
        </Link>
      </div>
    );
  }

  if (!product) {
    return <div className="pt-40 pb-24 max-w-[1140px] mx-auto px-6 animate-pulse h-[500px]" />;
  }

  const price = variant ? priceFor(variant, currency) : undefined;
  const inStock = variant != null && variant.stock_qty > 0;
  const cover = product.images[0];

  const handleAdd = () => {
    if (!variant) return;
    add({ variantId: variant.id, productSlug: product.slug }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-[1140px] mx-auto px-6">
        <button
          onClick={() => navigate('/shop')}
          className="inline-flex items-center gap-2 text-[#2D0A6B] font-bold mb-8 hover:text-[#F97316] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </button>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="rounded-3xl bg-[#FFF8F0] overflow-hidden aspect-square flex items-center justify-center">
            {cover ? (
              <img src={imageSrc(cover.url)} alt={cover.alt || product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-9xl">🧸</span>
            )}
          </div>

          <div>
            <div className="text-sm font-extrabold uppercase tracking-wide text-[#F97316] mb-2">{product.category}</div>
            <h1 className="text-4xl md:text-5xl font-black text-[#2D0A6B] mb-4" style={{ fontFamily: baloo }}>
              {product.name}
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">{product.description}</p>

            {product.variants.filter((v) => v.active).length > 1 && (
              <div className="mb-6">
                <div className="font-extrabold text-[#2D0A6B] mb-2">Options</div>
                <div className="flex gap-2 flex-wrap">
                  {product.variants
                    .filter((v) => v.active)
                    .map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setVariant(v)}
                        className={`px-5 py-2.5 rounded-full font-bold text-sm border-2 transition-colors ${
                          variant?.id === v.id
                            ? 'bg-[#2D0A6B] text-white border-[#2D0A6B]'
                            : 'border-gray-200 text-gray-700 hover:border-[#2D0A6B]'
                        }`}
                      >
                        {v.name}
                      </button>
                    ))}
                </div>
              </div>
            )}

            <div className="text-3xl font-black text-gray-900 mb-6" style={{ fontFamily: baloo }}>
              {price ? formatMoney(price.amount_minor * qty, currency) : `Not available in ${currency}`}
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="inline-flex items-center gap-3 border-2 border-gray-200 rounded-full px-4 py-2">
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-extrabold w-6 text-center">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(variant?.stock_qty ?? 1, qty + 1))}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {variant && variant.stock_qty <= 5 && inStock && (
                <span className="text-sm font-bold text-[#F97316]">Only {variant.stock_qty} left!</span>
              )}
            </div>

            <button
              onClick={handleAdd}
              disabled={!inStock || !price}
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-[#2D0A6B] rounded-full font-extrabold text-lg shadow-[0_8px_32px_rgba(249,115,22,0.45)] hover:shadow-[0_12px_44px_rgba(249,115,22,0.65)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none"
              style={{ fontFamily: baloo }}
            >
              <ShoppingBag className="w-5 h-5" />
              {added ? 'Added! 🎉' : inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <div className="mt-6">
              <Link to="/shop/cart" className="text-[#2D0A6B] font-bold hover:text-[#F97316] transition-colors">
                View cart →
              </Link>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-black text-[#2D0A6B] mb-8" style={{ fontFamily: baloo }}>
              You might also love…
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((rel) => {
                const prices = rel.variants
                  .filter((v) => v.active)
                  .map((v) => priceFor(v, currency))
                  .filter((pr): pr is NonNullable<typeof pr> => pr != null)
                  .map((pr) => pr.amount_minor);
                const min = prices.length ? Math.min(...prices) : null;
                const cover = rel.images[0];
                return (
                  <Link
                    key={rel.id}
                    to={`/shop/${rel.slug}`}
                    className="group rounded-3xl bg-[#FFF8F0] overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
                      {cover ? (
                        <img
                          src={imageSrc(cover.url)}
                          alt={cover.alt || rel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <span className="text-7xl">🧸</span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="text-xs font-extrabold uppercase tracking-wide text-[#F97316] mb-1">
                        {rel.category}
                      </div>
                      <h3 className="text-lg font-black text-[#2D0A6B] mb-1" style={{ fontFamily: baloo }}>
                        {rel.name}
                      </h3>
                      <div className="font-extrabold text-gray-800 text-sm">
                        {min !== null ? formatMoney(min, currency) : ''}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
