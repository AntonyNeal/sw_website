import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import FloatingCTA from '../components/FloatingCTA';
import BookingModal from '../components/BookingModal';

const galleryImages = [
  {
    id: 1,
    src: '/IMG_1069-3.jpeg',
    alt: 'Claire Hamilton - Photo 1',
  },
  {
    id: 2,
    src: '/IMG_1070-4.jpeg',
    alt: 'Claire Hamilton - Photo 2',
  },
  {
    id: 3,
    src: '/IMG_1079-6.jpeg',
    alt: 'Claire Hamilton - Photo 3',
  },
  {
    id: 4,
    src: '/IMG_1109-14.jpeg',
    alt: 'Claire Hamilton - Photo 4',
  },
  {
    id: 5,
    src: '/IMG_1111-15.jpeg',
    alt: 'Claire Hamilton - Photo 5',
  },
  {
    id: 6,
    src: '/IMG_1114-16.jpeg',
    alt: 'Claire Hamilton - Photo 6',
  },
  {
    id: 7,
    src: '/IMG_1117-17.jpeg',
    alt: 'Claire Hamilton - Photo 7',
  },
  {
    id: 8,
    src: '/IMG_1144-21.jpeg',
    alt: 'Claire Hamilton - Photo 8',
  },
  {
    id: 9,
    src: '/IMG_1147-22.jpeg',
    alt: 'Claire Hamilton - Photo 9',
  },
  {
    id: 10,
    src: '/IMG_1148-23.jpeg',
    alt: 'Claire Hamilton - Photo 10',
  },
  {
    id: 11,
    src: '/IMG_1182-25.jpeg',
    alt: 'Claire Hamilton - Photo 11',
  },
  {
    id: 12,
    src: '/IMG_1188-26.jpeg',
    alt: 'Claire Hamilton - Photo 12',
  },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const handleOpenBooking = () => setIsBookingOpen(true);
    window.addEventListener('openBookingModal', handleOpenBooking);
    return () => {
      window.removeEventListener('openBookingModal', handleOpenBooking);
    };
  }, []);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  return (
    <>
      <Helmet>
        <title>Gallery - Claire Hamilton</title>
        <meta
          name="description"
          content="View the gallery of Claire Hamilton, exclusive premium companion in Canberra. All photos are recent and genuine."
        />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-rose-50/30 to-white py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6">
                Gallery
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                An intimate glimpse into elegance and sophistication. All photos are recent,
                genuine, and capture the essence of luxury companionship.
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {galleryImages.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white font-medium text-lg">View Full Size</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lightbox Modal */}
        {selectedImage !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white hover:text-rose-400 transition-colors z-50"
              aria-label="Close lightbox"
            >
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Previous button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 sm:left-8 text-white hover:text-rose-400 transition-colors z-50"
              aria-label="Previous image"
            >
              <svg
                className="w-8 h-8 sm:w-12 sm:h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Image */}
            <div
              className="relative max-w-6xl max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            </div>

            {/* Next button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 sm:right-8 text-white hover:text-rose-400 transition-colors z-50"
              aria-label="Next image"
            >
              <svg
                className="w-8 h-8 sm:w-12 sm:h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm sm:text-base">
              {selectedImage + 1} / {galleryImages.length}
            </div>
          </div>
        )}
      </div>

      <FloatingCTA
        onBookNow={() => {
          window.dispatchEvent(new CustomEvent('openBookingModal'));
        }}
      />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}
