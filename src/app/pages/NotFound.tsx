import { Link } from 'react-router';
import { Compass } from 'lucide-react';

const baloo = "'Baloo 2', cursive";

export function NotFound() {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-[600px] mx-auto px-6 text-center">
        <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-[#FFF8F0] flex items-center justify-center">
          <Compass className="w-14 h-14 text-[#F97316]" />
        </div>
        <h1 className="text-5xl font-black text-[#2D0A6B] mb-3" style={{ fontFamily: baloo }}>
          Lost in Afroville!
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          We can't find that page. It may have moved, or the link might have a typo.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            to="/"
            className="px-8 py-3.5 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-[#2D0A6B] rounded-full font-extrabold shadow-lg hover:-translate-y-0.5 transition-all"
            style={{ fontFamily: baloo }}
          >
            Go Home
          </Link>
          <Link
            to="/shop"
            className="px-8 py-3.5 border-2 border-[#2D0A6B] text-[#2D0A6B] rounded-full font-extrabold hover:bg-[#2D0A6B] hover:text-white transition-colors"
            style={{ fontFamily: baloo }}
          >
            Visit the Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
