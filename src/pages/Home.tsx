import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BookingModal from '../components/BookingModal';

const heroImages = [
  '/Gvj2Q4maoAAmamx.jpg',
  '/GsLpMhZasAAJkRN.jpg',
  '/G4zluC1aMAA0edL.jpg',
  '/G4T1Ipca8AAT0KB.jpg',
  '/G4FU93TXoAAIPP3.jpg',
  '/G4ENuTqWwAAN1V3.jpg',
  '/G44Zk_saQAAVIEa.jpg',
  '/G3cYfh_XkAA_NgH.jpg',
  '/G2zqVgpaUAAHoJ0.jpg',
  '/G1Md9isbwAEeLS0.jpg',
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>EllaX - Hot Beach Vibes & Good Times</title>
        <meta
          name="description"
          content="EllaX - Your beachy blonde companion for unforgettable adventures & fun times"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-amber-50">
        {/* Full-Screen Hero Section with Photo Carousel */}
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
          {/* Carousel Container */}
          <div className="absolute inset-0 w-full h-full">
            {heroImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt="EllaX"
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-2000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>

          {/* Lighter Overlay for Beachy Feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-white/5" />

          {/* Content Overlay */}
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-7xl md:text-8xl font-black mb-2 drop-shadow-xl tracking-tight">EllaX</h1>
            <p className="text-2xl md:text-4xl font-bold drop-shadow-lg mb-4 tracking-wide">
              ☀️ Your Hot Blonde Escape ☀️
            </p>
            <p className="text-lg md:text-2xl drop-shadow-lg mb-12 font-light">
              Beach vibes, island girl energy, & unforgettable adventures
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-10 py-4 rounded-full font-black text-lg transition-all transform hover:scale-110 drop-shadow-lg hover:drop-shadow-2xl"
              >
                Book Me 🔥
              </button>
              <Link
                to="/gallery"
                className="bg-white/80 hover:bg-white text-slate-900 px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-110 drop-shadow-lg"
              >
                See More 📸
              </Link>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-8 z-20 flex gap-2 justify-center w-full">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`transition-all duration-300 ${
                  index === currentImageIndex
                    ? 'bg-yellow-400 w-8 h-3'
                    : 'bg-white/60 hover:bg-white/80 w-3 h-3'
                } rounded-full`}
              />
            ))}
          </div>
        </section>

        {/* About Section - Fun & Young */}
        <section id="about" className="py-32 bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-black text-center mb-4 text-slate-900 tracking-tight">
                Hi, I&apos;m EllaX 💛
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 via-blue-300 to-pink-300 mx-auto mb-16 rounded-full" />
              <p className="text-xl text-slate-700 leading-relaxed text-center font-semibold mb-8">
                Blonde, fun, and always up for a good time! I&apos;m all about sun-kissed skin, beach
                energy, and creating memories that actually matter. Think island girl meets girl-next-door
                with a sprinkle of spontaneous adventure.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed text-center italic font-medium">
                Life&apos;s too short for boring. Let&apos;s make it fun. 🌊✨
              </p>

              {/* Fun Stats */}
              <div className="grid grid-cols-3 gap-6 mt-16">
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-8 rounded-2xl border-2 border-yellow-300 text-center">
                  <p className="text-4xl font-black text-yellow-600">100%</p>
                  <p className="text-sm font-bold text-slate-700 mt-2">Authentic & Real</p>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-8 rounded-2xl border-2 border-blue-300 text-center">
                  <p className="text-4xl font-black text-blue-600">∞</p>
                  <p className="text-sm font-bold text-slate-700 mt-2">Adventure Ready</p>
                </div>
                <div className="bg-gradient-to-br from-pink-100 to-pink-50 p-8 rounded-2xl border-2 border-pink-300 text-center">
                  <p className="text-4xl font-black text-pink-600">💯</p>
                  <p className="text-sm font-bold text-slate-700 mt-2">Good Energy Only</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experiences Section - Casual & Fun */}
        <section id="services" className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
                  Let&apos;s Do This Together
                </h2>
                <p className="text-xl text-slate-600 font-semibold">
                  Pick your vibe & let&apos;s make some memories 🌟
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Beach Day */}
                <div className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 p-10 rounded-3xl border-3 border-blue-300 hover:border-blue-400 hover:shadow-2xl transition-all duration-500 hover:scale-105 transform">
                  <div className="text-6xl mb-4">🏖️</div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4">Beach Days</h3>
                  <p className="text-slate-700 leading-relaxed font-semibold">
                    Surfing, swimming, sunbathing & sunset cocktails. Zero plans, maximum fun. We&apos;ll
                    chase waves and make TikToks nobody asked for (and it&apos;ll be hilarious).
                  </p>
                  <div className="mt-6 flex items-center text-blue-600 text-sm font-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>✨ Let&apos;s go!</span>
                    <span className="ml-2">→</span>
                  </div>
                </div>

                {/* Party Nights */}
                <div className="group relative bg-gradient-to-br from-pink-50 to-fuchsia-50 p-10 rounded-3xl border-3 border-pink-300 hover:border-pink-400 hover:shadow-2xl transition-all duration-500 hover:scale-105 transform">
                  <div className="text-6xl mb-4">🍾</div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4">Night Out</h3>
                  <p className="text-slate-700 leading-relaxed font-semibold">
                    Clubs, bars, rooftop parties, festivals. I&apos;m the girl everyone wants at their event.
                    Drinks, dancing, endless laughs & good vibes all night long.
                  </p>
                  <div className="mt-6 flex items-center text-pink-600 text-sm font-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>🎉 Let&apos;s party!</span>
                    <span className="ml-2">→</span>
                  </div>
                </div>

                {/* Adventure Dates */}
                <div className="group relative bg-gradient-to-br from-yellow-50 to-amber-50 p-10 rounded-3xl border-3 border-yellow-300 hover:border-yellow-400 hover:shadow-2xl transition-all duration-500 hover:scale-105 transform">
                  <div className="text-6xl mb-4">🎢</div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4">Adventure Mode</h3>
                  <p className="text-slate-700 leading-relaxed font-semibold">
                    Road trips, hiking, spontaneous travel plans. I&apos;m always down for something new &
                    unexpected. Bring the energy and I&apos;ll bring the enthusiasm.
                  </p>
                  <div className="mt-6 flex items-center text-yellow-600 text-sm font-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>🚀 Let&apos;s explore!</span>
                    <span className="ml-2">→</span>
                  </div>
                </div>

                {/* One-on-One Time */}
                <div className="group relative bg-gradient-to-br from-purple-50 to-rose-50 p-10 rounded-3xl border-3 border-purple-300 hover:border-purple-400 hover:shadow-2xl transition-all duration-500 hover:scale-105 transform">
                  <div className="text-6xl mb-4">💕</div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4">Just Us</h3>
                  <p className="text-slate-700 leading-relaxed font-semibold">
                    Cozy nights in, conversation that actually matters, or just vibing. No pressure,
                    just genuine connection & amazing chemistry.
                  </p>
                  <div className="mt-6 flex items-center text-purple-600 text-sm font-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>❤️ Let&apos;s connect!</span>
                    <span className="ml-2">→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-32 bg-gradient-to-b from-white via-yellow-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
                  Ready to Have Fun? 🔥
                </h2>
                <p className="text-xl text-slate-600 font-semibold">
                  Hit me up! I&apos;m a real person with real vibes & actual availability.
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-pink-100 p-12 rounded-3xl border-3 border-yellow-300 mb-8">
                <p className="text-center text-slate-800 text-lg font-bold mb-8">
                  No weird games, no drama, just good times with a girl who genuinely wants to spend time with
                  you. Let&apos;s make something happen. 💛
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="group px-12 py-5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 rounded-full font-black text-lg transition-all transform hover:scale-110 hover:shadow-2xl active:scale-95"
                  >
                    Book a Date 💬
                  </button>
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="group px-12 py-5 bg-white border-3 border-slate-900 text-slate-900 rounded-full font-black text-lg transition-all transform hover:scale-110 hover:shadow-2xl active:scale-95"
                  >
                    Send a Message 📱
                  </button>
                </div>
              </div>
              <div className="bg-white p-10 rounded-3xl border-2 border-slate-200 text-center">
                <p className="text-slate-700 font-bold mb-4">
                  💁‍♀️ Quick Details 💁‍♀️
                </p>
                <p className="text-slate-600 font-semibold">
                  24/7 responses • Serious inquiries only • Discreet & safe • Australian based • Let&apos;s chat
                  first & see if we vibe ✨
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}
