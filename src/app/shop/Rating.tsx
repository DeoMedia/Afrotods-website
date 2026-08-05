import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Star } from 'lucide-react';
import { fetchMyRating, submitRating, type MyRating } from './api';
import { useAuth } from './AuthContext';

/** Read-only star row — used on shop cards and as the product-page summary. */
export function Stars({ value, size = 'sm' }: { value: number; size?: 'sm' | 'lg' }) {
  const px = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${px} ${i <= Math.round(value) ? 'text-[#FBBF24] fill-[#FBBF24]' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

/** Compact average for product cards; renders nothing until a product has ratings. */
export function RatingSummary({ average, count }: { average: number | null; count: number }) {
  if (average === null || count === 0) return null;
  return (
    <div className="flex items-center gap-1.5">
      <Stars value={average} />
      <span className="text-xs font-bold text-gray-500">
        {average.toFixed(1)} ({count})
      </span>
    </div>
  );
}

/**
 * Product-page ratings block: shows the average, and lets a signed-in customer
 * who has bought the product set or change their own star rating.
 * Ratings are stars only — no written reviews.
 */
export function ProductRating({
  slug,
  average,
  count,
  onChanged,
}: {
  slug: string;
  average: number | null;
  count: number;
  onChanged?: (r: MyRating) => void;
}) {
  const { customer } = useAuth();
  const [mine, setMine] = useState<MyRating | null>(null);
  const [hover, setHover] = useState(0);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!customer) {
      setMine(null);
      return;
    }
    fetchMyRating(slug)
      .then(setMine)
      .catch(() => setMine(null));
  }, [customer, slug]);

  const shownAverage = mine?.average ?? average;
  const shownCount = mine?.count ?? count;

  const rate = async (stars: number) => {
    setBusy(true);
    try {
      const result = await submitRating(slug, stars);
      setMine(result);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onChanged?.(result);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border-t border-gray-100 pt-6 mt-8">
      {shownAverage !== null && shownCount > 0 ? (
        <div className="flex items-center gap-3 mb-4">
          <Stars value={shownAverage} size="lg" />
          <span className="font-extrabold text-[#2D0A6B]">{shownAverage.toFixed(1)}</span>
          <span className="text-sm font-semibold text-gray-500">
            {shownCount} {shownCount === 1 ? 'rating' : 'ratings'}
          </span>
        </div>
      ) : (
        <p className="text-sm font-semibold text-gray-400 mb-4">
          No ratings yet, be the first once you've received your order.
        </p>
      )}

      {mine?.can_rate && (
        <div>
          <div className="text-sm font-extrabold text-[#2D0A6B] mb-2">
            {mine.stars ? 'Your rating' : 'Rate this product'}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  disabled={busy}
                  onMouseEnter={() => setHover(i)}
                  onClick={() => rate(i)}
                  aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
                  className="disabled:opacity-50"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      i <= (hover || mine.stars || 0)
                        ? 'text-[#F97316] fill-[#F97316]'
                        : 'text-gray-300 hover:text-[#FBBF24]'
                    }`}
                  />
                </button>
              ))}
            </div>
            {saved && <span className="text-sm font-bold text-green-600">Thanks!</span>}
          </div>
          <p className="text-xs font-semibold text-gray-400 mt-2">
            Verified purchase · you can change this any time
          </p>
        </div>
      )}

      {customer && mine && !mine.can_rate && (
        <p className="text-xs font-semibold text-gray-400">
          Ratings come from verified purchases only, buy this product to leave yours.
        </p>
      )}

      {!customer && (
        <p className="text-sm font-semibold text-gray-500">
          <Link to="/account" className="text-[#F97316] hover:underline">
            Sign in
          </Link>{' '}
          to rate a product you've bought.
        </p>
      )}
    </div>
  );
}
