import { Facebook, Instagram, Music, Youtube } from 'lucide-react';

export function Shop() {
  const baloo = "'Baloo 2', cursive";

  return (
    <div className="pt-24 min-h-screen">
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-[#F97316] via-[#FB923C] to-[#FBBF24] text-white overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-20 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white animate-[pulse_4s_ease-in-out_infinite]" />

        <div className="relative max-w-[1140px] mx-auto px-6 text-center">
          <h1
  className="text-5xl md:text-6xl font-black mb-6 text-[#2D0A6B]"
  style={{ fontFamily: baloo }}
>
  The Afrotods Shop
</h1>
          <p className="text-xl text-white/90 max-w-[700px] mx-auto leading-relaxed">
            Explore merchandise, toys, books, and more from The Afrotods universe!
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 bg-white">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <div className="mb-12">
            <div className="text-8xl mb-6">🛍️</div>
            <h2 className="text-4xl font-black text-[#2D0A6B] mb-4" style={{ fontFamily: baloo }}>
              Coming Soon!
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              We're working hard to bring you amazing Afrotods merchandise. From plush toys to educational books, there's so much in store!
            </p>
            <p className="text-lg text-gray-600">
              Want to be the first to know when we launch? Follow us on social media!
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap mt-12">
            {[
              { name: 'Facebook', url: 'https://www.facebook.com/theafrotods', Icon: Facebook },
              { name: 'Instagram', url: 'https://www.instagram.com/theafrotods?igsh=bmVocXFzYWFqM2Zq', Icon: Instagram },
              { name: 'TikTok', url: 'https://www.tiktok.com/@afrotods?_t=8pDmrrnnBJO&_r=1', Icon: Music },
              { name: 'YouTube', url: 'https://www.youtube.com/@afrotods', Icon: Youtube }
            ].map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-4 bg-[#2D0A6B] text-white rounded-full font-bold text-base hover:bg-[#5A1F9F] transition-colors shadow-lg hover:shadow-xl"
                style={{ fontFamily: baloo }}
              >
                <social.Icon className="w-5 h-5" />
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
