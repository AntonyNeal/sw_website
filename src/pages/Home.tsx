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
        <title>Ash xoxo - Premium Companion Experience</title>
        <meta
          name="description"
          content="Ash xoxo - Sophisticated, fun, and unforgettably sexy. Your premium companion."
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
            <h1 className="text-7xl md:text-8xl font-black mb-2 drop-shadow-xl tracking-tight">
              Ash xoxo
            </h1>
            <p className="text-xl md:text-3xl font-light drop-shadow-lg mb-2 tracking-wide italic">
              Sophisticated. Sexy. Unforgettable.
            </p>
            <p className="text-lg md:text-xl drop-shadow-lg mb-12 font-light">
              Premium companionship for those who appreciate quality
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="bg-rose-500 hover:bg-rose-600 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 drop-shadow-lg hover:drop-shadow-2xl"
              >
                Reserve Now
              </button>
              <Link
                to="/gallery"
                className="bg-white/90 hover:bg-white text-slate-900 px-10 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 drop-shadow-lg"
              >
                View Gallery
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
                    ? 'bg-rose-400 w-8 h-2'
                    : 'bg-white/50 hover:bg-white/70 w-2 h-2'
                } rounded-full`}
              />
            ))}
          </div>
        </section>

        {/* About Section - Sophisticated & Sexy */}
        <section id="about" className="py-32 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 text-slate-900 tracking-tight">
                About Ash
              </h2>
              <div className="h-1 w-24 bg-rose-400 mx-auto mb-12 rounded-full" />
              <p className="text-xl text-slate-700 leading-relaxed text-center font-medium mb-8">
                I&apos;m intelligent, sophisticated, and absolutely magnetic. With sun-kissed blonde
                hair and an effortless confidence that commands attention, I bring sophistication,
                wit, and undeniable chemistry to every moment we share.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed text-center italic font-medium">
                Quality over everything. Let&apos;s make it count.
              </p>

              {/* Signature Qualities */}
              <div className="grid grid-cols-3 gap-6 mt-16">
                <div className="bg-slate-100 p-8 rounded-lg border border-slate-300 text-center hover:shadow-lg transition-shadow">
                  <p className="text-3xl font-bold text-slate-900">100%</p>
                  <p className="text-sm font-semibold text-slate-600 mt-2">Genuine Connection</p>
                </div>
                <div className="bg-slate-100 p-8 rounded-lg border border-slate-300 text-center hover:shadow-lg transition-shadow">
                  <p className="text-3xl font-bold text-slate-900">∞</p>
                  <p className="text-sm font-semibold text-slate-600 mt-2">Spontaneous & Fun</p>
                </div>
                <div className="bg-slate-100 p-8 rounded-lg border border-slate-300 text-center hover:shadow-lg transition-shadow">
                  <p className="text-3xl font-bold text-slate-900">♡</p>
                  <p className="text-sm font-semibold text-slate-600 mt-2">
                    Discreet & Professional
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experiences Section - Sophisticated Moments */}
        <section id="services" className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
                  Unforgettable Experiences
                </h2>
                <p className="text-lg text-slate-600 font-medium">
                  Designed for discerning tastes and genuine connection
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Dinner & Conversation */}
                <div className="group relative bg-white p-10 rounded-lg border border-slate-200 hover:border-rose-400 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Intimate Dinners</h3>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    Wine, stimulating conversation, and undeniable chemistry. Whether it&apos;s a
                    sophisticated dinner at your favorite spot or candlelight at home, I bring
                    elegance and genuine presence to every moment.
                  </p>
                </div>

                {/* Social Events */}
                <div className="group relative bg-white p-10 rounded-lg border border-slate-200 hover:border-rose-400 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Social Companion</h3>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    Functions, galas, gallery openings, or exclusive events. I&apos;m the perfect
                    plus-one who not only looks stunning but engages intelligently and makes you
                    look incredibly good.
                  </p>
                </div>

                {/* Getaways */}
                <div className="group relative bg-white p-10 rounded-lg border border-slate-200 hover:border-rose-400 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Weekend Getaways</h3>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    Beach trips, city escapes, or spontaneous adventures. I bring spontaneity and
                    genuine excitement to every experience. Let&apos;s create memories worth
                    savoring.
                  </p>
                </div>

                {/* Private Time */}
                <div className="group relative bg-white p-10 rounded-lg border border-slate-200 hover:border-rose-400 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Private Connection</h3>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    Sometimes the best moments are just us. Intimate, genuine, and full of
                    chemistry. A space where we can both be completely ourselves and connect on a
                    deeper level.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-32 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
                  Let&apos;s Connect
                </h2>
                <p className="text-lg text-slate-600 font-medium">
                  Serious inquiries from discerning individuals only
                </p>
              </div>
              <div className="bg-slate-900 text-white p-12 rounded-lg mb-8">
                <p className="text-center text-lg font-medium mb-8">
                  I value quality time with people who respect boundaries, appreciate
                  sophistication, and are genuinely interested in creating meaningful connections.
                  Let&apos;s have a conversation first.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="px-12 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-bold text-lg transition-all transform hover:scale-105 hover:shadow-xl"
                  >
                    Reserve an Experience
                  </button>
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="px-12 py-4 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold text-lg border border-white/40 transition-all transform hover:scale-105"
                  >
                    Send a Message
                  </button>
                </div>
              </div>
              <div className="bg-white p-10 rounded-lg border border-slate-200 text-center">
                <p className="text-slate-700 font-semibold mb-3">What You Should Know</p>
                <p className="text-slate-600 font-medium text-sm leading-relaxed">
                  Verified bookings • Premium discretion • Australian based • Respectful
                  communication • 24-48 hour booking notice • Let&apos;s chat and make sure
                  we&apos;re a good match
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
