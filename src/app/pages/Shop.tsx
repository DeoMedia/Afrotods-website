import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Facebook, Gift, Instagram, Music, ShoppingBag, Youtube } from 'lucide-react';
import { imageSrc, fetchProducts, formatMoney, priceFor, type Product } from '../shop/api';
import { useCart } from '../shop/CartContext';
import { useCurrencyDetection } from '../shop/useCurrencyDetection';
import { CurrencyPicker } from '../shop/CurrencyPicker';
import { RatingSummary } from '../shop/Rating';

const baloo = "'Baloo 2', cursive";

function productPriceLabel(product: Product, currency: ReturnType<typeof useCart>['currency']): string | null {
  const priced = product.variants
    .filter((v) => v.active)
    .map((v) => priceFor(v, currency))
    .filter((p): p is NonNullable<typeof p> => p != null)
    .map((p) => p.amount_minor);
  if (priced.length === 0) return null;
  const min = Math.min(...priced);
  return priced.length > 1 && Math.max(...priced) !== min
    ? `From ${formatMoney(min, currency)}`
    : formatMoney(min, currency);
}

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  toy: 'Toys',
  plush: 'Plush Toys',
  book: 'Books',
  apparel: 'Clothing',
  music: 'Music',
  other: 'More',
};

export function Shop() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('all');
  const { currency } = useCart();
  useCurrencyDetection();

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <div className="pt-24 min-h-screen">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-[#F97316] via-[#FB923C] to-[#FBBF24] text-white overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-20 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white" />
        <div className="relative max-w-[1140px] mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-4 text-[#2D0A6B]" style={{ fontFamily: baloo }}>
            The Afrotods Shop
          </h1>
          <p className="text-xl text-white/90 max-w-[700px] mx-auto leading-relaxed mb-6">
            Merchandise, toys, books, and more from The Afrotods universe!
          </p>
          <CurrencyPicker />
        </div>
      </section>

      {/* Products */}
      <section className="py-16 bg-white min-h-[400px]">
        <div className="max-w-[1140px] mx-auto px-6">
          {error && (
            <FallbackMessage
              title="Coming Soon!"
              body="We're working hard to bring you amazing Afrotods merchandise. Follow us on social media to be first to know!"
              showSocials
            />
          )}
          {!error && products === null && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-3xl bg-white border border-gray-100 animate-pulse h-[360px]" />
              ))}
            </div>
          )}
          {!error && products !== null && products.length === 0 && (
            <FallbackMessage
              title="Coming Soon!"
              body="We're stocking the shelves — check back very soon for plush toys, books, and more."
              showSocials
            />
          )}
          {!error && products !== null && products.length > 0 && (
            <>
            <div className="flex gap-2 flex-wrap justify-center mb-10">
              {['all', ...new Set(products.map((p) => p.category))].map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-5 py-2 rounded-full font-bold text-sm border-2 transition-colors ${
                    category === c
                      ? 'bg-[#2D0A6B] text-white border-[#2D0A6B]'
                      : 'border-gray-200 text-gray-600 hover:border-[#2D0A6B]'
                  }`}
                  style={{ fontFamily: baloo }}
                >
                  {CATEGORY_LABELS[c] ?? c}
                </button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.filter((p) => category === 'all' || p.category === category).map((product) => {
                const price = productPriceLabel(product, currency);
                const cover = product.images[0];
                const soldOut = product.variants.filter((v) => v.active).every((v) => v.stock_qty === 0);
                return (
                  <Link
                    key={product.id}
                    to={`/shop/${product.slug}`}
                    className="group rounded-3xl bg-white border border-gray-100 overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative aspect-square bg-white flex items-center justify-center overflow-hidden">
                      {cover ? (
                        <img
                          src={imageSrc(cover.url)}
                          alt={cover.alt || product.name}
                          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                            soldOut ? 'opacity-60' : ''
                          }`}
                        />
                      ) : (
                        <Gift className="w-16 h-16 text-[#2D0A6B]/20" />
                      )}
                      {soldOut && (
                        <span className="absolute top-3 left-3 bg-[#2D0A6B] text-white text-xs font-extrabold px-3 py-1.5 rounded-full">
                          Out of stock
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="text-xs font-extrabold uppercase tracking-wide text-[#F97316] mb-1">
                        {product.category}
                      </div>
                      <h3 className="text-xl font-black text-[#2D0A6B] mb-2" style={{ fontFamily: baloo }}>
                        {product.name}
                      </h3>
                      <div className="mb-2">
                        <RatingSummary average={product.rating_average} count={product.rating_count} />
                      </div>
                      <div className="font-extrabold text-gray-800">
                        {price ?? <span className="text-gray-400 text-sm">Not available in {currency}</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function FallbackMessage({
  title,
  body,
  showSocials,
}: {
  title: string;
  body: string;
  showSocials?: boolean;
}) {
  return (
    <div className="max-w-[700px] mx-auto text-center py-12">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#FFF8F0] flex items-center justify-center"><ShoppingBag className="w-12 h-12 text-[#F97316]" /></div>
      <h2 className="text-4xl font-black text-[#2D0A6B] mb-4" style={{ fontFamily: baloo }}>
        {title}
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-8">{body}</p>
      {showSocials && (
        <div className="flex gap-4 justify-center flex-wrap">
          {[
            { name: 'Facebook', url: 'https://www.facebook.com/theafrotods', Icon: Facebook },
            { name: 'Instagram', url: 'https://www.instagram.com/theafrotods?igsh=bmVocXFzYWFqM2Zq', Icon: Instagram },
            { name: 'TikTok', url: 'https://www.tiktok.com/@afrotods?_t=8pDmrrnnBJO&_r=1', Icon: Music },
            { name: 'YouTube', url: 'https://www.youtube.com/@afrotods', Icon: Youtube },
          ].map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-[#2D0A6B] text-white rounded-full font-bold text-base hover:bg-[#5A1F9F] transition-colors shadow-lg"
              style={{ fontFamily: baloo }}
            >
              <social.Icon className="w-5 h-5" />
              {social.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
