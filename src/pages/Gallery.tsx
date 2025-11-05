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
        <title>Gallery - EllaX 📸</title>
        <meta name="description" content="EllaX's hot photos & beachy vibes" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-yellow-50">
        {/* Header */}
        <header className="bg-gradient-to-br from-yellow-100 to-pink-100 border-b-4 border-yellow-400">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-4 tracking-tight">
                Check Me Out 📸
              </h1>
              <div className="h-1 w-48 bg-gradient-to-r from-yellow-400 via-pink-300 to-blue-300 mx-auto rounded-full" />
              <p className="text-xl text-slate-700 font-bold mt-6">
                All the angles, all the vibes, all the hotness ✨
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
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-3 border-yellow-200 hover:border-pink-400 transform hover:scale-105 hover:-rotate-1 cursor-pointer"
                >
                  <img
                    src={photo}
                    alt={`EllaX ${index + 1}`}
                    className="w-full h-64 object-cover group-hover:scale-125 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <p className="text-white font-black text-lg">😍</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-yellow-300 to-pink-300 py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-black text-slate-900 mb-6">Like What You See? 🔥</h2>
            <p className="text-xl text-slate-800 font-bold mb-8">
              There&apos;s more where that came from! Let&apos;s hang out & create some unforgettable moments.
            </p>
            <Link
              to="/"
              className="inline-block px-12 py-5 bg-white text-slate-900 rounded-full font-black text-lg hover:shadow-2xl transition-all transform hover:scale-110 border-3 border-slate-900"
            >
              ← Back & Let's Book! 💛
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

export default function Gallery() {
  return (
    <>
      <Helmet>
        <title>Gallery - EllaX</title>
        <meta name="description" content="EllaX's photo gallery" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-gradient-to-b from-rose-50 to-white">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-5xl font-light text-gray-900 mb-2 tracking-tight">EllaX</h1>
              <div className="h-1 w-16 bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300 mx-auto mb-6" />
              <p className="text-lg text-gray-700 font-light tracking-wide">
                A Collection of Moments
              </p>
            </div>
          </div>
        </header>

        {/* Gallery Grid */}
        <main className="container mx-auto px-4 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-sm shadow-md hover:shadow-2xl transition-all duration-500 border border-rose-100 hover:border-rose-300"
                >
                  <img
                    src={photo}
                    alt={`EllaX ${index + 1}`}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Back to Home */}
        <footer className="bg-gradient-to-b from-white to-rose-50 border-t border-rose-200">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <a
                href="/"
                className="group inline-flex items-center px-10 py-4 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-sm font-light tracking-wide hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <span>← Back to Home</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
