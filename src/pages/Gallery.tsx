import { Helmet } from 'react-helmet-async';

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
        <title>Gallery - Claire Hamilton</title>
        <meta name="description" content="Claire Hamilton's photo gallery" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Claire Hamilton</h1>
              <p className="text-lg text-gray-600">Photo Gallery</p>
            </div>
          </div>
        </header>

        {/* Gallery Grid */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
                >
                  <img
                    src={photo}
                    alt={`Claire Hamilton ${index + 1}`}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Back to Home */}
        <footer className="bg-white border-t">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center">
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
