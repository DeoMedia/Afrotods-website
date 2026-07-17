export function ContactUs() {
  const baloo = "'Baloo 2', cursive";

const socialLinks = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/theafrotods",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/theafrotods?igsh=bmVocXFzYWFqM2Zq",
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@afrotods?_t=8pDmrrnnBJO&_r=1",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@afrotods",
  },
];
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-[#34D399] via-[#10B981] to-[#059669] text-white overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[80px] opacity-20 -bottom-[150px] -left-[100px] bg-white animate-[float_6s_ease-in-out_infinite]" />

        <div className="relative max-w-[1140px] mx-auto px-6 text-center">
          <h1
  className="text-5xl md:text-6xl font-black mb-6 text-[#FBBF24]"
  style={{ fontFamily: baloo }}
>
  Get in Touch
</h1>
          <p className="text-xl text-white/90 max-w-[700px] mx-auto leading-relaxed">
            Have questions? We'd love to hear from you. Reach out to our team!
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 bg-white">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-[#FFF8F0] rounded-3xl p-8 border-2 border-[#A855F7]/10">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-2xl font-black text-[#2D0A6B] mb-3" style={{ fontFamily: baloo }}>Email Us</h3>
              <p className="text-gray-700 mb-4">For general inquiries, partnerships, or support.</p>
              <a href="mailto:Supportafro@deomedia.net" className="text-[#5A1F9F] font-bold hover:text-[#7B2FBE] transition-colors">
                Supportafro@deomedia.net
              </a>
            </div>

          <div className="bg-[#FFF8F0] rounded-3xl p-8 border-2 border-[#A855F7]/10">
  <div className="text-4xl mb-4">🌐</div>

  <h3
    className="text-2xl font-black text-[#2D0A6B] mb-3"
    style={{ fontFamily: baloo }}
  >
    Follow Us
  </h3>

  <p className="text-gray-700 mb-4">
    Stay updated with the latest news and content.
  </p>

  <div className="flex gap-3 flex-wrap">
    {socialLinks.map((social) => (
      <a
        key={social.name}
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 bg-[#A855F7]/10 text-[#5A1F9F] text-sm font-bold rounded-full hover:bg-[#A855F7]/20 transition"
      >
        {social.name}
      </a>
    ))}
  </div>
</div>
          </div>

          <div className="bg-gradient-to-br from-[#2D0A6B] to-[#5A1F9F] rounded-3xl p-12 text-white text-center">
            <h2 className="text-3xl font-black mb-4" style={{ fontFamily: baloo }}>Ready to Start the Adventure?</h2>
            <p className="text-lg text-white/80 mb-8 max-w-[600px] mx-auto">
              Download The Afrotods app today and give your child access to stories that celebrate their culture.
            </p>
            <a
              href="https://play.google.com/store/apps/details?id=com.afrotods.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-10 py-4 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-[#2D0A6B] rounded-full font-extrabold text-lg shadow-[0_8px_32px_rgba(249,115,22,0.45)] hover:shadow-[0_12px_44px_rgba(249,115,22,0.65)] hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-[220ms]"
              style={{ fontFamily: baloo }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76a2 2 0 0 0 2.08-.18L19 14.48l-3.82-3.82-12 13.1zM22.37 9.74a1.94 1.94 0 0 0 0-3.48L19.5 4.6l-4.32 4.32 4.32 4.32 2.87-3.5zM1.55.47A1.94 1.94 0 0 0 1 1.73v20.54c0 .5.2.96.55 1.26L2 23l11.5-11.5v-.27L2 0l-.45.47z"/>
              </svg>
              Download on Google Play
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
      `}</style>
    </div>
  );
}
