import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { ShoppingBag, User } from 'lucide-react';
import afrotodLogo from '../../imports/afro-logo-1_(2).png';
import { useCart } from '../shop/CartContext';
import { useAuth } from '../shop/AuthContext';

export function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { count } = useCart();
  const { customer } = useAuth();
  const baloo = "'Baloo 2', cursive";
  const nunito = "'Nunito', sans-serif";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-[#FFF8F0] overflow-x-hidden" style={{ fontFamily: nunito }}>
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] py-3.5 transition-all duration-300 ${
          scrolled ? 'bg-[#2D0A6B]/95 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,0.25)]' : 'bg-[#2D0A6B]/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-[1140px] mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={afrotodLogo} alt="The Afrotods™" className="h-10 md:h-[60px] w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-white font-bold text-sm hover:text-[#FBBF24] transition-colors">Home</Link>
            <Link to="/about" className="text-white font-bold text-sm hover:text-[#FBBF24] transition-colors">About</Link>
            <Link to="/shop" className="text-white font-bold text-sm hover:text-[#FBBF24] transition-colors">Shop</Link>
            <Link to="/contact" className="text-white font-bold text-sm hover:text-[#FBBF24] transition-colors">Contact Us</Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 items-center">
            <Link
              to="/account"
              className="relative text-white p-2 hover:text-[#FBBF24] transition-colors"
              aria-label="Account"
              title={customer ? customer.email : 'Sign in'}
            >
              <User className="w-6 h-6" />
              {customer && (
                <span className="absolute -top-0.5 -right-0.5 bg-green-400 rounded-full w-2.5 h-2.5" />
              )}
            </Link>
            <Link
              to="/shop/cart"
              className="relative text-white p-2 hover:text-[#FBBF24] transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#F97316] text-white text-[10px] font-extrabold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {count}
                </span>
              )}
            </Link>
            <a
              href="https://play.google.com/store/apps/details?id=com.afrotods.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-[#2D0A6B] rounded-full font-extrabold text-sm shadow-[0_8px_32px_rgba(249,115,22,0.45)] hover:shadow-[0_12px_44px_rgba(249,115,22,0.65)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              style={{ fontFamily: baloo }}
            >
              Download Free
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2"
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#2D0A6B]/98 backdrop-blur-md border-t border-white/10 mt-3">
            <div className="max-w-[1140px] mx-auto px-6 py-4 flex flex-col gap-3">
              <Link to="/" className="text-white font-bold text-sm py-2 hover:text-[#FBBF24] transition-colors">Home</Link>
              <Link to="/about" className="text-white font-bold text-sm py-2 hover:text-[#FBBF24] transition-colors">About</Link>
              <Link to="/shop" className="text-white font-bold text-sm py-2 hover:text-[#FBBF24] transition-colors">Shop</Link>
              <Link to="/contact" className="text-white font-bold text-sm py-2 hover:text-[#FBBF24] transition-colors">Contact Us</Link>
              <Link to="/privacy" className="text-white/70 font-semibold text-xs py-2 hover:text-[#FBBF24] transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-white/70 font-semibold text-xs py-2 hover:text-[#FBBF24] transition-colors">Terms & Conditions</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <Outlet />

      {/* Footer */}
      <footer className="bg-[#2D0A6B] text-white py-14 pb-8">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-12 mb-12">
            <div>
              <img src={afrotodLogo} alt="The Afrotods™" className="h-[60px] w-auto mb-2.5" />
              <p className="text-sm text-white/55 leading-relaxed max-w-[300px] mb-6">
                Joyful Stories. Cultural Roots. Smart Learning. A product of <a href="https://deomedia.net" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">Deo Media Limited UK</a> — bringing Afro-modern storytelling to children everywhere.
              </p>
              <div className="flex gap-2.5 flex-wrap">
                {[
                  { name: 'Facebook', url: 'https://www.facebook.com/theafrotods' },
                  { name: 'Instagram', url: 'https://www.instagram.com/theafrotods?igsh=bmVocXFzYWFqM2Zq' },
                  { name: 'TikTok', url: 'https://www.tiktok.com/@afrotods?_t=8pDmrrnnBJO&_r=1' },
                  { name: 'YouTube', url: 'https://www.youtube.com/@afrotods' }
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/[0.07] border border-white/[0.12] text-white/80 px-3.5 py-1.5 rounded-full text-xs font-extrabold hover:bg-white/15 hover:text-white transition-all duration-200"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[#FBBF24] text-base font-extrabold mb-4" style={{ fontFamily: baloo }}>Navigate</h4>
              <Link to="/" className="block text-sm text-white/60 mb-2.5 font-semibold hover:text-white transition-colors">Home</Link>
              <Link to="/about" className="block text-sm text-white/60 mb-2.5 font-semibold hover:text-white transition-colors">About</Link>
              <Link to="/shop" className="block text-sm text-white/60 mb-2.5 font-semibold hover:text-white transition-colors">Shop</Link>
              <Link to="/track" className="block text-sm text-white/60 mb-2.5 font-semibold hover:text-white transition-colors">Track Order</Link>
              <Link to="/contact" className="block text-sm text-white/60 mb-2.5 font-semibold hover:text-white transition-colors">Contact Us</Link>
            </div>
            <div>
              <h4 className="text-[#FBBF24] text-base font-extrabold mb-4" style={{ fontFamily: baloo }}>Legal</h4>
              <a href="https://play.google.com/store/apps/details?id=com.afrotods.app" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/60 mb-2.5 font-semibold hover:text-white transition-colors">
                Google Play ↗
              </a>
              <Link to="/privacy" className="block text-sm text-white/60 mb-2.5 font-semibold hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="block text-sm text-white/60 mb-2.5 font-semibold hover:text-white transition-colors">Terms & Conditions</Link>
              <Link to="/returns" className="block text-sm text-white/60 mb-2.5 font-semibold hover:text-white transition-colors">Returns & Refunds</Link>
              <Link to="/shipping" className="block text-sm text-white/60 mb-2.5 font-semibold hover:text-white transition-colors">Shipping & Delivery</Link>
            </div>
          </div>
          <div className="border-t border-white/[0.08] pt-7 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/40">
            <span>©️ {new Date().getFullYear()} The Afrotods. Deo Media Limited UK Property. All rights reserved.</span>
            <div className="flex gap-5">
              <Link to="/privacy" className="text-white/50 hover:text-white/90 transition-colors">Privacy</Link>
              <Link to="/terms" className="text-white/50 hover:text-white/90 transition-colors">Terms</Link>
              <Link to="/contact" className="text-white/50 hover:text-white/90 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
