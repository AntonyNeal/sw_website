import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Claire Hamilton - Melbourne Companion</title>
        <meta
          name="description"
          content="Claire Hamilton - A sophisticated companion in Melbourne"
        />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Full-Screen Hero Section with Photo */}
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
          {/* Background Image */}
          <img
            src="https://pbs.twimg.com/media/G3hgK2hX0AAB8RL.jpg:large"
            alt="Claire Hamilton"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/20" />

          {/* Content Overlay */}
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-7xl md:text-8xl font-bold mb-4 drop-shadow-lg">Claire Hamilton</h1>
            <p className="text-xl md:text-3xl italic drop-shadow-lg mb-12">
              A sophisticated companion, a free-spirited sweetheart
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors drop-shadow-lg">
                Book Now
              </button>
              <Link
                to="/gallery"
                className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-semibold transition-colors border border-white backdrop-blur-sm"
              >
                View Gallery
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">About Claire</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Claire Hamilton is a sophisticated and elegant companion based in Melbourne. With
                her warm personality and free-spirited nature, she provides an unforgettable
                experience for those seeking genuine connection and companionship.
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">Dinner Dates</h3>
                  <p className="text-gray-600">
                    Enjoy elegant dining and conversation in Melbourne&apos;s finest restaurants.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">Social Events</h3>
                  <p className="text-gray-600">
                    Perfect companion for parties, galas, and special occasions.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">Travel Companion</h3>
                  <p className="text-gray-600">
                    Join you for weekend getaways and travel adventures.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">Private Engagements</h3>
                  <p className="text-gray-600">
                    Discreet and personalized companionship experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Contact</h2>
              <p className="text-lg text-gray-600 mb-8">
                For bookings and inquiries, please contact Claire directly.
              </p>
              <div className="flex gap-4 justify-center">
                <button className="btn-primary">Send Message</button>
                <button className="btn-secondary">Call Now</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
