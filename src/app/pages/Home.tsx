import { Ban, BookOpen, Clapperboard, Gamepad2, Globe2, Lock, Music, PartyPopper } from 'lucide-react';
import { useState, useEffect } from 'react';
import heroPhoneHand from '../../imports/ChatGPT_Image_Apr_17,_2026,_11_27_52_AM_(1).png';
import kelaniImg from '../../imports/kelani-1.png';
import folaImg from '../../imports/Fola.png';
import sisiImg from '../../imports/Sisi.png';
import mobioImg from '../../imports/Mobio.png';
import papaImg from '../../imports/Papa.png';
import mamaImg from '../../imports/Mama.png';
import grandmaImg from '../../imports/Grandma.png';
import grandpaImg from '../../imports/Grandpa.png';
import coverPhoto from '../../imports/landing-page-cover-photo-b-scaled.png';
import { VideoModal } from '../components/VideoModal';

const PART_1_VIDEO = '/video/festival-time-part-1.mp4';

const CHARACTERS = [
  { name: 'Kelani', image: kelaniImg, role: 'The Music Kid', gradient: 'from-orange-500 to-yellow-400' },
  { name: 'Fola', image: folaImg, role: 'The Explorer', gradient: 'from-pink-500 to-yellow-400' },
  { name: 'Sisi', image: sisiImg, role: 'The Sweet One', gradient: 'from-pink-400 to-rose-400' },
  { name: 'Mobio', image: mobioImg, role: 'The Cool One', gradient: 'from-yellow-400 to-orange-500' },
  { name: 'Papa', image: papaImg, role: 'The Storyteller', gradient: 'from-green-400 to-blue-400' },
  { name: 'Mama', image: mamaImg, role: 'The Wise Heart', gradient: 'from-green-500 to-green-400' },
  { name: 'Grandma', image: grandmaImg, role: 'Keeper of Roots', gradient: 'from-yellow-400 to-orange-500' },
  { name: 'Grandpa', image: grandpaImg, role: 'Elder & Guide', gradient: 'from-green-500 to-yellow-400' }
];

const FEATURES = [
  { icon: Clapperboard, title: 'Animated Story Videos', description: 'Vibrant, music-filled episodes featuring the Afrotods family on exciting cultural adventures.', color: 'rgba(236,72,153,0.15)' },
  { icon: BookOpen, title: 'Interactive Books', description: 'Story books that come alive with sound, animation, and gentle questions that spark curiosity.', color: 'rgba(249,115,22,0.15)' },
  { icon: Gamepad2, title: 'Games for Kids', description: 'Age-appropriate games that build problem-solving, creativity, and cultural knowledge through play.', color: 'rgba(52,211,153,0.15)' },
  { icon: Music, title: 'Music + Learning', description: 'Original songs and soundscapes woven into every experience, because kids learn best through rhythm.', color: 'rgba(96,165,250,0.15)' }
];

const CURRENCIES = [
  { code: 'GBP', symbol: '£', flag: '🇬🇧', intro: '9.90', regular: '14.99', label: '🇬🇧 Showing GBP for the United Kingdom' },
  { code: 'NGN', symbol: '₦', flag: '🇳🇬', intro: '7,999', regular: '11,999', label: '🇳🇬 Showing NGN for Nigeria' },
  { code: 'ZAR', symbol: 'R', flag: '🇿🇦', intro: '249', regular: '369', label: '🇿🇦 Showing ZAR for South Africa' },
  { code: 'USD', symbol: '$', flag: '🌍', intro: '12.99', regular: '18.99', label: '🌍 Showing USD for international visitors' }
];

export function Home() {
  const [watching, setWatching] = useState(false);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [detecting, setDetecting] = useState(true);
  const baloo = "'Baloo 2', cursive";
  const nunito = "'Nunito', sans-serif";

  useEffect(() => {
    const detectCurrency = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) });
        const data = await response.json();
        const countryMap: Record<string, string> = { GB: 'GBP', NG: 'NGN', ZA: 'ZAR' };
        const code = countryMap[data.country_code] || 'USD';
        const detected = CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
        setCurrency(detected);
      } catch {
        setCurrency(CURRENCIES[0]);
      } finally {
        setDetecting(false);
      }
    };
    detectCurrency();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-9');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <VideoModal
        open={watching}
        onClose={() => setWatching(false)}
        src={PART_1_VIDEO}
        title="The Afrotods Festival Time, Part 1"
        footnote="Part 1 is free to watch. The rest of the series is in the app."
      />
    <br></br><br></br><br></br>
      {/* ── COVER PHOTO ── */}
      <section className="relative overflow-hidden">
        <div className="scroll-reveal opacity-0 translate-y-9 transition-all duration-[650ms]">
          <img
            src={coverPhoto}
            alt="The Afrotods Family"
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* ── HERO ── white background, two-column */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-[1140px] mx-auto px-6 py-16 md:py-20 w-full grid md:grid-cols-2 gap-10 items-center">

          {/* Left: Copy */}
          <div>
            {/* Eyebrow */}
            <div className="scroll-reveal opacity-0 translate-y-9 transition-all duration-[650ms] flex items-center gap-2 mb-5">
              <div className="w-2 h-2 bg-[#34D399] rounded-full" />
              <span className="text-[#1E0A3C] font-extrabold text-xs tracking-[2px] uppercase" style={{ fontFamily: nunito }}>
                Afrocentric · Educational · Safe for Kids
              </span>
            </div>

            {/* Headline — orange with dark outline matching image */}
            <h1
              className="scroll-reveal opacity-0 translate-y-9 transition-all duration-[650ms] [transition-delay:100ms] text-5xl md:text-6xl font-black mb-5 leading-[1.05]"
              style={{
                fontFamily: baloo,
                color: '#f16c07',
                textShadow:
                  '3px 3px 0px #3223a0, -1px -1px 0px #3223a0, 1px -1px 0px #3223a0, -1px 1px 0px #3223a0, 1px 1px 0px #3223a0',
              }}
            >
              Fun Animated Stories Kids Love
            </h1>

            {/* Sub */}
            <p
              className="scroll-reveal opacity-0 translate-y-9 transition-all duration-[650ms] [transition-delay:200ms] text-base text-[#4B5563] leading-relaxed mb-8 max-w-[440px]"
              style={{ fontFamily: nunito }}
            >
              Watch colourful stories with music, playful characters, and gentle learning built in designed to educate, entertain, and inspire children aged 4–8.
            </p>

            {/* Buttons */}
            <div className="scroll-reveal opacity-0 translate-y-9 transition-all duration-[650ms] [transition-delay:300ms] flex flex-wrap gap-3 mb-8">
              <button
                type="button"
                onClick={() => setWatching(true)}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#F97316] text-white rounded-full font-extrabold text-base shadow-[0_6px_24px_rgba(249,115,22,0.4)] hover:shadow-[0_10px_36px_rgba(249,115,22,0.6)] hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-200"
                style={{ fontFamily: baloo }}
              >
                ▶&nbsp; Watch Part 1 for Free
              </button>
              <a
                href="https://play.google.com/store/apps/details?id=com.afrotods.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border-2 border-[#E5E7EB] text-[#374151] rounded-full font-extrabold text-base hover:border-[#D1D5DB] hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-200"
                style={{ fontFamily: baloo }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#34D399">
                  <path d="M3.18 23.76a2 2 0 0 0 2.08-.18L19 14.48l-3.82-3.82-12 13.1zM22.37 9.74a1.94 1.94 0 0 0 0-3.48L19.5 4.6l-4.32 4.32 4.32 4.32 2.87-3.5zM1.55.47A1.94 1.94 0 0 0 1 1.73v20.54c0 .5.2.96.55 1.26L2 23l11.5-11.5v-.27L2 0l-.45.47z"/>
                </svg>
                Google Play
              </a>
            </div>

            {/* Right under the buttons, because this is where someone decides
                whether to press one. Burying it in the pricing section lower
                down would be a surprise, not an offer. */}
            <p
              className="scroll-reveal opacity-0 translate-y-9 transition-all duration-[650ms] [transition-delay:350ms] text-sm text-[#6B46A0] font-bold mb-8 max-w-[440px]"
              style={{ fontFamily: nunito }}
            >
              Part 1 is free to watch, right here, with no app and no account. The full series lives in
              the app, which is free to download and needs a paid plan to unlock.
            </p>

            {/* Trust bar */}
            <div
              className="scroll-reveal opacity-0 translate-y-9 transition-all duration-[650ms] [transition-delay:400ms] flex flex-wrap items-center gap-4 text-[#374151] text-sm font-bold"
              style={{ fontFamily: nunito }}
            >
              <div className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> Ages 3–8</div>
              <div className="text-[#D1D5DB]">•</div>
              <div className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> Safe for Kids</div>
              <div className="text-[#D1D5DB]">•</div>
              <div className="flex items-center gap-1.5"><Ban className="w-4 h-4" /> No Ads</div>
            </div>
          </div>

          {/* Right: Phone hand image */}
          <div className="scroll-reveal opacity-0 translate-y-9 transition-all duration-[650ms] [transition-delay:200ms] flex justify-center items-center">
            <img
              src={heroPhoneHand}
              alt="The Afrotods App on phone"
              className="max-w-full h-auto max-h-[520px] object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF — dark purple rounded card, shadow, on white bg ── */}
      <section className="bg-white py-6 px-6">
        <div className="max-w-[1140px] mx-auto">
          <div
            className="scroll-reveal opacity-0 translate-y-9 transition-all duration-[650ms] bg-[#3D1080] rounded-2xl shadow-[0_8px_40px_rgba(61,16,128,0.35)] px-8 py-5 flex items-center justify-between gap-6 flex-wrap"
          >
            {/* Positioning line — no rating or review counts until we have real ones
                (UK DMCC Act 2024 prohibits fake reviews/ratings) */}
            <div className="text-center">
              <p className="text-sm font-extrabold text-white max-w-[260px] leading-snug" style={{ fontFamily: nunito }}>
                Joyful stories. Cultural roots. Smart learning.
              </p>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-10 bg-white/15 flex-shrink-0" />

            {/* Badges */}
            <div className="flex gap-2 flex-wrap justify-center">
              {[
                { icon: BookOpen, label: 'Educational' },
                { icon: Globe2, label: 'Cultural Learning' },
                { icon: Lock, label: 'Safe for Kids' },
                { icon: Ban, label: 'No Ads' }
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full"
                  style={{ fontFamily: nunito }}
                >
                  <badge.icon className="w-3.5 h-3.5" />
                  {badge.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES — white/cream, 4 cards, no lifestyle phone ── */}
      <section className="relative py-20 bg-gradient-to-b from-white to-[#FFF8F0] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(168,85,247,0.06)_1px,transparent_0)] bg-[length:32px_32px] pointer-events-none" />

        <div className="relative max-w-[1140px] mx-auto px-6">
          {/* Header */}
          <div className="scroll-reveal opacity-0 translate-y-9 transition-all duration-[650ms] text-center mb-14">
            <div
              className="inline-block bg-[#A855F7]/[0.12] border-[1.5px] border-[#A855F7]/25 text-[#7B2FBE] font-extrabold text-[10px] tracking-[2.5px] uppercase px-4 py-1.5 rounded-full mb-3.5"
              style={{ fontFamily: nunito }}
            >
              Product Experience
            </div>
            <h2 className="text-3xl md:text-4xl text-[#1E0A3C] mb-3" style={{ fontFamily: baloo }}>
              Everything Your Child Needs to{' '}
              <span className="text-[#7B2FBE]">Thrive</span>
            </h2>
            <p className="text-base text-[#6B46A0] max-w-[440px] mx-auto leading-relaxed" style={{ fontFamily: nunito }}>
              Educate, entertain, and build early cultural pride all in one beautifully designed app.
            </p>
          </div>

          {/* 4-column cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="scroll-reveal opacity-0 translate-y-9 transition-all duration-[650ms] relative bg-white rounded-3xl p-7 shadow-[0_4px_24px_rgba(91,33,182,0.10)] border border-[#A855F7]/10 hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(91,33,182,0.16)] group overflow-hidden"
                style={{ transitionDelay: `${i * 100 + 100}ms` }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, ${feature.color}, transparent)` }}
                />
                <div
                  className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: `linear-gradient(135deg, ${feature.color}, ${feature.color.replace('0.15', '0.05')})` }}
                >
                  <feature.icon className="w-6 h-6 text-[#2D0A6B]" />
                </div>
                <h3 className="relative text-base font-bold mb-1.5 text-[#1E0A3C]" style={{ fontFamily: baloo }}>
                  {feature.title}
                </h3>
                <p className="relative text-sm text-[#6B46A0] leading-relaxed" style={{ fontFamily: nunito }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHARACTERS — warm peach/cream gradient, white cards, dark text ── */}
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(160deg, #FFF7ED 0%, #FEF3C7 40%, #FDE68A 70%, #FCD34D 100%)' }}>
        {/* Decorative side elements matching the screenshot */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-32 bg-gradient-to-r from-[#F97316]/20 to-transparent rounded-r-full" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-32 bg-gradient-to-l from-[#F97316]/20 to-transparent rounded-l-full" />

        <div className="relative max-w-[1140px] mx-auto px-6">
          {/* Header */}
          <div className="scroll-reveal opacity-0 translate-y-9 transition-all duration-[650ms] text-center mb-12">
            <div
              className="inline-block bg-[#A855F7]/[0.12] border-[1.5px] border-[#A855F7]/25 text-[#7B2FBE] font-extrabold text-[10px] tracking-[2.5px] uppercase px-4 py-1.5 rounded-full mb-3.5"
              style={{ fontFamily: nunito }}
            >
              Meet the Family
            </div>
        <h2
  className="text-3xl md:text-5xl text-[#1E0A3C] mb-3"
  style={{ fontFamily: baloo }}
>
  Meet The Afrotods Family
</h2>
            <p className="text-base text-[#6B46A0] max-w-[480px] mx-auto leading-relaxed" style={{ fontFamily: nunito }}>
              A vibrant world where music, culture, and storytelling come to life one character at a time.
            </p>
          </div>

          {/* 4×2 grid — white cards, dark text */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-[900px] mx-auto">
            {CHARACTERS.map((char, i) => (
              <div
                key={char.name}
                className="scroll-reveal opacity-0 translate-y-9 transition-all duration-[650ms] bg-white rounded-3xl p-5 pb-4 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-white/80 hover:-translate-y-2 hover:shadow-[0_12px_32px_rgba(0,0,0,0.14)] cursor-pointer transition-all group"
                style={{ transitionDelay: `${i * 80 + 100}ms` }}
              >
                <div className="relative mb-3">
                  <img
                    src={char.image}
                    alt={char.name}
                    className="w-full h-auto max-w-[110px] mx-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div
                  className="text-base font-extrabold text-[#1E0A3C] mb-0.5"
                  style={{ fontFamily: baloo }}
                >
                  {char.name}
                </div>
                <div
                  className="text-xs text-[#6B46A0] font-bold"
                  style={{ fontFamily: nunito }}
                >
                  {char.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING — light lavender/white bg, single centered card ── */}
      <section id="pricing" className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, #F5F0FF 0%, #EDE9FE 50%, #F0FAFE 100%)' }}>
        {/* Subtle blobs */}
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-[0.15] bg-[#7B2FBE] -top-24 -left-24 pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-[0.12] bg-[#F97316] -bottom-20 -right-20 pointer-events-none" />

        <div className="relative max-w-[1140px] mx-auto px-6">
          {/* Header */}
          <div className="scroll-reveal opacity-0 translate-y-9 transition-all duration-[650ms] text-center mb-4">
            <div
              className="inline-block bg-[#A855F7]/[0.12] border-[1.5px] border-[#A855F7]/25 text-[#7B2FBE] font-extrabold text-[10px] tracking-[2.5px] uppercase px-4 py-1.5 rounded-full mb-3.5"
              style={{ fontFamily: nunito }}
            >
              Simple, Fair Pricing
            </div>
            <h2 className="text-3xl md:text-4xl text-[#1E0A3C] mb-2.5" style={{ fontFamily: baloo }}>
              One Subscription.{' '}
              <span className="text-[#7B2FBE]">Unlimited Stories.</span>
            </h2>
            <p className="text-sm text-[#6B46A0]" style={{ fontFamily: nunito }}>
              Start at an introductory rate. Cancel anytime. No hidden fees.
            </p>
          </div>

          {/* Currency detector + selector */}
          <div className="scroll-reveal opacity-0 translate-y-9 transition-all duration-[650ms] [transition-delay:100ms] flex items-center justify-center gap-3 mb-12 flex-wrap">
            <div
              className="inline-flex items-center gap-2 bg-[#34D399]/10 border-[1.5px] border-[#34D399]/30 text-[#059669] text-xs font-extrabold px-4 py-1.5 rounded-full"
              style={{ fontFamily: nunito }}
            >
              <div className="w-1.5 h-1.5 bg-[#34D399] rounded-full animate-[pulse_1.8s_ease-in-out_infinite]" />
              {detecting ? 'Auto-detecting your location…' : currency.label}
            </div>
            <div className="relative inline-block">
              <select
                value={currency.code}
                onChange={(e) => setCurrency(CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[0])}
                className="appearance-none bg-[#A855F7]/[0.08] border-[1.5px] border-[#A855F7]/25 text-[#5A1F9F] font-extrabold text-xs px-4 pr-8 py-1.5 rounded-full cursor-pointer outline-none hover:border-[#7B2FBE] transition-colors"
                style={{ fontFamily: nunito }}
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.flag} {curr.code} ({curr.symbol})
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#7B2FBE] text-xs">▾</div>
            </div>
          </div>

          {/* Single centered pricing card */}
          <div className="scroll-reveal opacity-0 translate-y-9 transition-all duration-[650ms] [transition-delay:200ms] max-w-[460px] mx-auto mb-8">
            <div className="relative rounded-[28px] p-10 bg-gradient-to-br from-[#3D1080] via-[#7C3AED] to-[#9333EA] text-white shadow-[0_20px_60px_rgba(91,33,182,0.4)] hover:-translate-y-2 hover:shadow-[0_28px_72px_rgba(91,33,182,0.55)] transition-all duration-[280ms] text-center">
              {/* Top badge */}
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FBBF24] to-[#F97316] text-[#2D0A6B] font-black text-xs px-5 py-1.5 rounded-full shadow-[0_4px_20px_rgba(249,115,22,0.5)] whitespace-nowrap"
                style={{ fontFamily: baloo, letterSpacing: '0.5px' }}
              >
                <span className="inline-flex items-center gap-1.5"><PartyPopper className="w-3.5 h-3.5" />LIMITED INTRO OFFER</span>
              </div>

              <div className="text-sm font-bold text-white/75 mb-5 mt-2" style={{ fontFamily: baloo }}>
                First 45 Days After Download
              </div>

              {/* Price */}
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-[#FBBF24] text-3xl font-black" style={{ fontFamily: baloo }}>
                  {currency.symbol}
                </span>
                <span className="text-[#FBBF24] text-8xl font-black leading-none" style={{ fontFamily: baloo }}>
                  {currency.intro}
                </span>
              </div>

              <div className="text-base font-bold text-white/65 mb-8" style={{ fontFamily: baloo }}>
                Then {currency.symbol}{currency.regular}
              </div>

              {/* CTA */}
              <a
                href="https://play.google.com/store/apps/details?id=com.afrotods.app"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-4 bg-gradient-to-r from-[#FBBF24] to-[#F97316] text-[#2D0A6B] rounded-full font-black text-xl shadow-[0_6px_24px_rgba(249,115,22,0.4)] hover:scale-105 hover:shadow-[0_10px_36px_rgba(249,115,22,0.65)] transition-all duration-[220ms]"
                style={{ fontFamily: baloo }}
              >
                Claim Intro Offer
              </a>
            </div>
          </div>

          {/* Pricing disclaimer */}
          <div
            className="scroll-reveal opacity-0 translate-y-9 transition-all duration-[650ms] [transition-delay:300ms] text-center max-w-[600px] mx-auto text-xs text-[#9CA3AF] leading-relaxed p-4 bg-white/60 rounded-2xl border border-[#A855F7]/10"
            style={{ fontFamily: nunito }}
          >
            <strong className="text-[#6B46A0]">Pricing note:</strong> Prices are displayed based on your detected region and are approximate. Final pricing is confirmed at checkout via Google Play. Subscriptions renew automatically; you can cancel at any time through your Google Play account settings. All transactions are processed securely by Google.
          </div>
        </div>
      </section>

  

      {/* ── GLOBAL KEYFRAMES ── */}
      <style>{`
        @keyframes blobFloat {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(30px, -20px) scale(1.08); }
        }
        @keyframes twinkle {
          from { opacity: 0.3; transform: scale(1); }
          to { opacity: 1; transform: scale(1.4); }
        }
        @keyframes phoneFloat {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-18px) rotate(2deg); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0.7); }
          50% { box-shadow: 0 0 0 6px rgba(52,211,153,0); }
        }
      `}</style>
    </>
  );
}