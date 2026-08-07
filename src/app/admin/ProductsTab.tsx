import { ImagePlus } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { adminApi, isSuperAdmin, type ProductCreate } from './api';
import { formatMoney, imageSrc, type Currency, type Product } from '../shop/api';

const baloo = "'Baloo 2', cursive";
const CURRENCIES: Currency[] = ['GBP', 'NGN', 'ZAR', 'USD'];
const CATEGORIES = ['toy', 'plush', 'book', 'apparel', 'music', 'other'];

const inputCls =
  'w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#F97316] outline-none font-semibold text-sm';

interface VariantDraft {
  sku: string;
  name: string;
  stock_qty: string;
  prices: Record<Currency, string>; // major units as typed, e.g. "19.99"
}

const emptyVariant = (): VariantDraft => ({
  sku: '',
  name: '',
  stock_qty: '0',
  prices: { GBP: '', NGN: '', ZAR: '', USD: '' },
});

export function ProductsTab({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPrices, setEditingPrices] = useState<number | null>(null);
  // Staff edit the catalogue; only super admins create and destroy. The
  // backend enforces this, so hiding the controls just avoids dead buttons.
  const canCreate = isSuperAdmin();

  const load = () =>
    adminApi
      .listProducts()
      .then(setProducts)
      .catch((e: Error) => (e.message === 'unauthorized' ? onUnauthorized() : setError(e.message)));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleActive = async (p: Product) => {
    await adminApi.updateProduct(p.id, { active: !p.active });
    load();
  };

  const setStock = async (variantId: number, current: number) => {
    const answer = window.prompt('New stock quantity:', String(current));
    if (answer === null) return;
    const qty = parseInt(answer, 10);
    if (Number.isNaN(qty) || qty < 0) return;
    await adminApi.setStock(variantId, qty);
    load();
  };

  const markVariantOutOfStock = async (variantId: number) => {
    await adminApi.setStock(variantId, 0);
    load();
  };

  const markProductOutOfStock = async (p: Product) => {
    if (!window.confirm(`Mark every variant of "${p.name}" out of stock?`)) return;
    for (const v of p.variants) {
      if (v.stock_qty > 0) await adminApi.setStock(v.id, 0);
    }
    load();
  };

  const addImagesTo = async (p: Product, files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    try {
      const uploaded = [];
      for (const file of Array.from(files)) {
        const { url } = await adminApi.uploadImage(file);
        uploaded.push({ url, alt: p.name });
      }
      await adminApi.addImages(p.id, uploaded);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add images');
    }
  };

  const removeImage = async (imageId: number) => {
    if (!window.confirm('Remove this image?')) return;
    setError(null);
    try {
      await adminApi.deleteImage(imageId);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not remove the image');
    }
  };

  const setShippingClass = async (p: Product, shipping_class: Product['shipping_class']) => {
    setError(null);
    try {
      await adminApi.updateProduct(p.id, { shipping_class });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not change the shipping class');
    }
  };

  const setWeight = async (p: Product, weight_grams: number) => {
    setError(null);
    try {
      await adminApi.updateProduct(p.id, { weight_grams });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not change the weight');
    }
  };

  const deleteProduct = async (p: Product) => {
    if (!window.confirm(`Permanently delete "${p.name}"? This cannot be undone.`)) return;
    setError(null);
    try {
      await adminApi.deleteProduct(p.id);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete the product');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-[#2D0A6B]" style={{ fontFamily: baloo }}>
          Products
        </h2>
        {canCreate && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2.5 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-[#2D0A6B] rounded-full font-extrabold text-sm"
            style={{ fontFamily: baloo }}
          >
            {showForm ? 'Close' : '+ New product'}
          </button>
        )}
      </div>

      {error && <p className="text-red-600 font-bold mb-4">{error}</p>}
      {canCreate && showForm && (
        <NewProductForm
          onCreated={() => {
            setShowForm(false);
            load();
          }}
        />
      )}

      {products === null && <div className="h-40 rounded-3xl bg-white animate-pulse" />}
      <div className="space-y-4">
        {products?.map((p) => {
          const { active, vat_rate: vat } = p;
          return (
            <div key={p.id} className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  {p.images[0] && (
                    <img src={imageSrc(p.images[0].url)} alt="" className="w-14 h-14 rounded-xl object-cover bg-gray-50" />
                  )}
                  <div>
                    <div className="font-black text-[#2D0A6B]" style={{ fontFamily: baloo }}>
                      {p.name}{' '}
                      {!active && <span className="text-xs text-red-500 font-bold align-middle">(hidden)</span>}
                    </div>
                    <div className="text-xs font-bold text-gray-400">
                      /{p.slug} · {p.category} · VAT {(vat * 100).toFixed(0)}%
                    </div>
                    {/* Postage is priced off this, so it needs to be changeable
                        without rebuilding the product. */}
                    <label className="text-xs font-bold text-gray-400 inline-flex items-center gap-1.5 mt-1">
                      Posts as
                      <select
                        value={p.shipping_class}
                        onChange={(e) => setShippingClass(p, e.target.value as Product['shipping_class'])}
                        className="rounded-lg border-2 border-gray-200 px-2 py-0.5 font-bold text-gray-600 focus:border-[#F97316] outline-none"
                      >
                        <option value="large_letter">Large Letter</option>
                        <option value="small_parcel">Small Parcel</option>
                      </select>
                      <input
                        type="number"
                        min="1"
                        max="30000"
                        defaultValue={p.weight_grams}
                        onBlur={(e) => {
                          const grams = parseInt(e.target.value, 10);
                          if (grams > 0 && grams !== p.weight_grams) setWeight(p, grams);
                        }}
                        className="w-20 rounded-lg border-2 border-gray-200 px-2 py-0.5 font-bold text-gray-600 focus:border-[#F97316] outline-none"
                        title="Packed weight in grams, sent to Royal Mail"
                      />
                      g
                    </label>
                  </div>
                </div>
                <div className="flex gap-2">
                  {p.variants.some((v) => v.stock_qty > 0) && (
                    <button
                      onClick={() => markProductOutOfStock(p)}
                      className="px-4 py-1.5 rounded-full text-xs font-extrabold border-2 border-orange-200 text-orange-500 hover:bg-orange-50"
                    >
                      Mark out of stock
                    </button>
                  )}
                  <button
                    onClick={() => toggleActive(p)}
                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold border-2 ${
                      active
                        ? 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500'
                        : 'border-green-300 text-green-600'
                    }`}
                  >
                    {active ? 'Hide from shop' : 'Show in shop'}
                  </button>
                  {canCreate && (
                    <button
                      onClick={() => deleteProduct(p)}
                      className="px-4 py-1.5 rounded-full text-xs font-extrabold border-2 border-red-200 text-red-500 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              {/* Gallery — first image is the shop cover */}
              <div className="flex items-center gap-2 flex-wrap mt-4">
                {p.images.map((img, i) => (
                  <div key={img.id ?? img.url} className="relative">
                    <img
                      src={imageSrc(img.url)}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover bg-gray-50"
                    />
                    {i === 0 && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#2D0A6B] text-white text-[7px] font-extrabold px-1 rounded-full">
                        COVER
                      </span>
                    )}
                    {canCreate && img.id != null && p.images.length > 1 && (
                      <button
                        onClick={() => removeImage(img.id!)}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {canCreate && (
                <label className="px-3 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-xs font-extrabold cursor-pointer hover:border-[#2D0A6B] hover:text-[#2D0A6B]">
                  + Add images
                  <input
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      addImagesTo(p, e.target.files);
                      e.target.value = '';
                    }}
                  />
                </label>
                )}
              </div>

              {/* SKU + option + stock + four currencies is wider than a phone */}
              <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-sm mt-4 min-w-[30rem]">
                <thead>
                  <tr className="text-left text-gray-400 font-bold text-xs">
                    <th className="py-1 pr-4">SKU</th>
                    <th className="py-1 pr-4">Option</th>
                    <th className="py-1 pr-4">Stock</th>
                    <th className="py-1">Prices</th>
                  </tr>
                </thead>
                <tbody>
                  {p.variants.map((v) => (
                    <tr key={v.id} className="border-t border-gray-100 font-semibold text-gray-700">
                      <td className="py-2 pr-4">{v.sku}</td>
                      <td className="py-2 pr-4">{v.name}</td>
                      <td className="py-2 pr-4">
                        <button
                          onClick={() => setStock(v.id, v.stock_qty)}
                          className={`underline decoration-dotted ${v.stock_qty === 0 ? 'text-red-500' : ''}`}
                          title="Click to change stock"
                        >
                          {v.stock_qty === 0 ? 'Out of stock' : v.stock_qty}
                        </button>
                        {v.stock_qty > 0 && (
                          <button
                            onClick={() => markVariantOutOfStock(v.id)}
                            className="ml-3 text-xs font-bold text-orange-400 hover:text-orange-600"
                            title="Set stock to 0"
                          >
                            zero
                          </button>
                        )}
                      </td>
                      <td className="py-2 text-xs">
                        {editingPrices === v.id ? (
                          <PriceEditor
                            variant={v}
                            onCancel={() => setEditingPrices(null)}
                            onSaved={() => {
                              setEditingPrices(null);
                              load();
                            }}
                          />
                        ) : (
                          <button
                            onClick={() => setEditingPrices(v.id)}
                            className="text-left underline decoration-dotted hover:text-[#F97316]"
                            title="Click to edit prices"
                          >
                            {v.prices.length
                              ? v.prices.map((pr) => formatMoney(pr.amount_minor, pr.currency)).join(' · ')
                              : 'Set prices'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Inline editor for one variant's prices across every currency. */
function PriceEditor({
  variant,
  onSaved,
  onCancel,
}: {
  variant: Product['variants'][number];
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<Record<Currency, string>>(() => {
    const start = { GBP: '', NGN: '', ZAR: '', USD: '' } as Record<Currency, string>;
    for (const p of variant.prices) start[p.currency] = (p.amount_minor / 100).toFixed(2);
    return start;
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const prices = CURRENCIES.flatMap((c) => {
        const raw = values[c].trim();
        if (!raw) return [];
        return [{ currency: c, amount_minor: Math.round(parseFloat(raw) * 100) }];
      });
      await adminApi.setPrices(variant.id, prices);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save prices');
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {CURRENCIES.map((c) => (
        <input
          key={c}
          value={values[c]}
          onChange={(e) => setValues((v) => ({ ...v, [c]: e.target.value }))}
          placeholder={c}
          inputMode="decimal"
          className="w-20 px-2 py-1 rounded-lg border-2 border-gray-200 focus:border-[#F97316] outline-none text-xs font-semibold"
          title={`${c} price in major units (blank removes this currency)`}
        />
      ))}
      <button
        onClick={save}
        disabled={busy}
        className="px-3 py-1 rounded-full bg-[#2D0A6B] text-white text-xs font-extrabold disabled:opacity-40"
      >
        {busy ? '…' : 'Save'}
      </button>
      <button onClick={onCancel} className="px-2 py-1 text-xs font-bold text-gray-400 hover:text-gray-600">
        Cancel
      </button>
      {error && <span className="text-red-600 font-bold text-xs">{error}</span>}
    </div>
  );
}

function NewProductForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({
    slug: '',
    name: '',
    description: '',
    category: 'plush',
    vat_rate: '20',
    shipping_class: 'small_parcel' as 'large_letter' | 'small_parcel',
    weight_grams: '250',
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [variants, setVariants] = useState<VariantDraft[]>([emptyVariant()]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // First image is the shop cover; the rest show in the product-page gallery.
  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const { url } = await adminApi.uploadImage(file);
        setImageUrls((urls) => [...urls, url]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const setVariant = (i: number, patch: Partial<VariantDraft>) =>
    setVariants((vs) => vs.map((v, j) => (j === i ? { ...v, ...patch } : v)));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const payload: ProductCreate = {
        slug: form.slug.trim().toLowerCase(),
        name: form.name.trim(),
        description: form.description,
        category: form.category,
        vat_rate: parseFloat(form.vat_rate) / 100,
        shipping_class: form.shipping_class,
        weight_grams: parseInt(form.weight_grams, 10) || 250,
        active: true,
        images: imageUrls.map((url, i) => ({ url, alt: form.name, sort_order: i })),
        variants: variants
          .filter((v) => v.sku.trim())
          .map((v) => ({
            sku: v.sku.trim().toUpperCase(),
            name: v.name.trim() || 'Default',
            stock_qty: parseInt(v.stock_qty, 10) || 0,
            prices: CURRENCIES.flatMap((c) => {
              const raw = v.prices[c].trim();
              if (!raw) return [];
              return [{ currency: c, amount_minor: Math.round(parseFloat(raw) * 100) }];
            }),
          })),
      };
      if (payload.variants.length === 0) throw new Error('Add at least one variant with an SKU');
      await adminApi.createProduct(payload);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-sm mb-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input required placeholder="Name" value={form.name} onChange={set('name')} className={inputCls} />
        <input
          required
          placeholder="slug-like-this"
          value={form.slug}
          onChange={set('slug')}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          className={inputCls}
        />
      </div>
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={set('description')}
        className={`${inputCls} min-h-[80px]`}
      />
      <div className="grid sm:grid-cols-3 gap-4">
        <select value={form.category} onChange={set('category')} className={inputCls}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="relative">
          <input
            required
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={form.vat_rate}
            onChange={set('vat_rate')}
            className={inputCls}
            title="VAT % included in prices. 20 for toys/merch, 0 for children's clothing and books"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">VAT %</span>
        </div>
        <select
          value={form.shipping_class}
          onChange={set('shipping_class')}
          className={inputCls}
          title="Royal Mail format. Anything thicker than 2.5cm is a Small Parcel and costs more to post."
        >
          <option value="large_letter">Large Letter (under 2.5cm thick)</option>
          <option value="small_parcel">Small Parcel</option>
        </select>
        <div className="relative">
          <input
            required
            type="number"
            min="1"
            max="30000"
            value={form.weight_grams}
            onChange={set('weight_grams')}
            className={inputCls}
            title="Packed weight. Royal Mail will not accept a shipment without one, so weigh it."
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">grams</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            ref={fileInput}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="shrink-0 px-4 py-2.5 rounded-xl border-2 border-[#2D0A6B] text-[#2D0A6B] text-sm font-extrabold hover:bg-[#2D0A6B] hover:text-white transition-colors disabled:opacity-40"
          >
            {uploading ? 'Uploading…' : (<span className="inline-flex items-center gap-1.5"><ImagePlus className="w-4 h-4" />Upload images</span>)}
          </button>
          {imageUrls.length === 0 && (
            <span className="text-xs font-semibold text-gray-400">
              PNG/JPEG/WebP, max 5 MB each. First image = shop cover; the rest appear in the product gallery.
            </span>
          )}
          {imageUrls.map((url, i) => (
            <div key={url} className="relative">
              <img src={imageSrc(url)} alt={`image ${i + 1}`} className="w-11 h-11 rounded-lg object-cover bg-gray-50" />
              {i === 0 && (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#2D0A6B] text-white text-[8px] font-extrabold px-1.5 rounded-full">
                  COVER
                </span>
              )}
              <button
                type="button"
                onClick={() => setImageUrls((urls) => urls.filter((u) => u !== url))}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-black text-[#2D0A6B]">Variants, prices are VAT-inclusive, in major units (e.g. 19.99)</div>
        {variants.map((v, i) => (
          <div key={i} className="grid grid-cols-2 sm:grid-cols-7 gap-2">
            <input placeholder="SKU" value={v.sku} onChange={(e) => setVariant(i, { sku: e.target.value })} className={inputCls} />
            <input placeholder="Option name" value={v.name} onChange={(e) => setVariant(i, { name: e.target.value })} className={inputCls} />
            <input
              placeholder="Stock"
              type="number"
              min="0"
              value={v.stock_qty}
              onChange={(e) => setVariant(i, { stock_qty: e.target.value })}
              className={inputCls}
            />
            {CURRENCIES.map((c) => (
              <input
                key={c}
                placeholder={c}
                inputMode="decimal"
                value={v.prices[c]}
                onChange={(e) => setVariant(i, { prices: { ...v.prices, [c]: e.target.value } })}
                className={inputCls}
              />
            ))}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setVariants((vs) => [...vs, emptyVariant()])}
          className="text-sm font-bold text-[#F97316]"
        >
          + Add another variant
        </button>
      </div>

      {error && <p className="text-red-600 font-bold text-sm">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="px-8 py-3 bg-[#2D0A6B] text-white rounded-full font-extrabold disabled:opacity-40"
        style={{ fontFamily: baloo }}
      >
        {busy ? 'Creating…' : 'Create product'}
      </button>
    </form>
  );
}
