import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const photos = [
  'https://pbs.twimg.com/media/G2zQudFaAAAsyX7.jpg:large',
  'https://pbs.twimg.com/media/G3Gh-hdbUAAQTDo.jpg:large',
  'https://pbs.twimg.com/media/G3hgK2hX0AAB8RL.jpg:large',
  'https://pbs.twimg.com/media/G3qlG5VWwAAkv0w.jpg:large',
  'https://pbs.twimg.com/media/G3yV5lZXgAACZVc.png:large',
  'https://pbs.twimg.com/media/G4OoP7-WoAA4YbX.jpg:large',
  'https://pbs.twimg.com/media/G4qJY0iaQAAaUHG.jpg:large',
  'https://pbs.twimg.com/media/G4QVg0nXMAAaiqD.jpg:large',
  'https://pbs.twimg.com/media/G22dAifaYAA9f5R.jpg:large',
  'https://pbs.twimg.com/media/G22stVEaYAAuqaG.jpg:large',
  'https://pbs.twimg.com/media/G46gwJfWgAAXSPO.png:large',
  'https://pbs.twimg.com/media/G362TdFXgAAMQMD.jpg:large',
];

export default function Gallery() {
  return (
    <>
      <Helmet>
        <title>Gallery - Ash xoxo</title>
        <meta name="description" content="Ash xoxo's curated photo gallery" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-4 tracking-tight">
                Gallery
              </h1>
              <p className="text-lg text-slate-600 font-medium">
                A glimpse into my world
              </p>
            </div>
          </div>
        </header>

        {/* Gallery Grid */}
        <main className="container mx-auto px-4 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-slate-300 cursor-pointer"
                >
                  <img
                    src={photo}
                    alt={`Ash xoxo ${index + 1}`}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* CTA Section */}
        <section className="bg-slate-900 text-white py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-bold text-white mb-6">Like What You See?</h2>
            <p className="text-lg text-slate-300 font-medium mb-8 max-w-2xl mx-auto">
              These are just a preview. Let&apos;s connect and create something unforgettable together.
            </p>
            <Link
              to="/"
              className="inline-block px-12 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-bold text-lg transition-all transform hover:scale-105 hover:shadow-xl"
            >
              Reserve an Experience
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
