import { Helmet } from 'react-helmet-async';

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

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">Claire Hamilton</h1>
                <p className="text-2xl text-gray-600 mb-8">
                  A sophisticated companion, a free-spirited sweetheart
                </p>
                <div className="flex gap-4 justify-center">
                  <button className="btn-primary">Book Now</button>
                  <button className="btn-secondary">Learn More</button>
                </div>
              </div>

              {/* Photo Gallery Placeholder */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Photo 1</span>
                </div>
                <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Photo 2</span>
                </div>
                <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Photo 3</span>
                </div>
              </div>
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
