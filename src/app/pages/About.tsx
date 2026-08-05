import { BookOpen, Globe2, Music, Palette } from 'lucide-react';

export function About() {
  const baloo = "'Baloo 2', cursive";

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-[#2D0A6B] via-[#5A1F9F] to-[#9333EA] text-white overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[80px] opacity-20 -top-[150px] -right-[100px] bg-gradient-to-br from-[#F97316] to-[#FBBF24] animate-[blobFloat_8s_ease-in-out_infinite_alternate]" />

        <div className="relative max-w-[1140px] mx-auto px-6 text-center">
          <h1
  className="text-5xl md:text-6xl font-black mb-6 text-[#FBBF24]"
  style={{ fontFamily: baloo }}
>
  About The Afrotods
</h1>
          <p className="text-xl text-white/80 max-w-[700px] mx-auto leading-relaxed">
          We’re on a mission to bring bold, Afrocentric storytelling to children everywhere through vibrant, educational, and culturally rich content that reflects who they are and inspires who they can become.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 bg-white">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-black text-[#2D0A6B] mb-4" style={{ fontFamily: baloo }}>Our Story</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
               THE AFROTODS was born from a simple but powerful insight: children deserve to see themselves reflected in the stories they love. We set out to build a world where African culture, music, and values aren’t just included they lead every adventure, shaping stories that are as meaningful as they are entertaining.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-black text-[#2D0A6B] mb-4" style={{ fontFamily: baloo }}>What We Believe</h2>
              <ul className="space-y-4 text-lg text-gray-700">
                <li className="flex items-start gap-3">
                  <Palette className="w-6 h-6 mt-0.5 shrink-0 text-[#F97316]" />
                  <span><strong className="text-[#5A1F9F]">Representation Matters:</strong> Every child deserves to see characters that look like them.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Globe2 className="w-6 h-6 mt-0.5 shrink-0 text-[#F97316]" />
                  <span><strong className="text-[#5A1F9F]">Culture is Fun:</strong> Learning about heritage should be joyful and engaging.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Music className="w-6 h-6 mt-0.5 shrink-0 text-[#F97316]" />
                  <span><strong className="text-[#5A1F9F]">Music Teaches:</strong> Rhythm and melody make lessons stick.</span>
                </li>
                <li className="flex items-start gap-3">
                  <BookOpen className="w-6 h-6 mt-0.5 shrink-0 text-[#F97316]" />
                  <span><strong className="text-[#5A1F9F]">Safe Content:</strong> Parents can trust what their kids are watching.</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-black text-[#2D0A6B] mb-4" style={{ fontFamily: baloo }}>Meet Deo Media Limited UK</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                The Afrotods is proudly produced by <a href="https://deomedia.net" target="_blank" rel="noopener noreferrer" className="text-[#5A1F9F] font-bold hover:text-[#7B2FBE] transition-colors">Deo Media Limited UK</a>,a forward-thinking content studio creating culturally rich, high-quality entertainment that celebrates African heritage while shaping globally relevant stories for the next generation.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="https://play.google.com/store/apps/details?id=com.afrotods.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-10 py-4 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-[#2D0A6B] rounded-full font-extrabold text-lg shadow-[0_8px_32px_rgba(249,115,22,0.45)] hover:shadow-[0_12px_44px_rgba(249,115,22,0.65)] hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-[220ms]"
              style={{ fontFamily: baloo }}
            >
              Download The App
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes blobFloat {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(30px, -20px) scale(1.08); }
        }
      `}</style>
    </div>
  );
}
