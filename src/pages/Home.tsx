import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState, useEffect, type MouseEvent, type TouchEvent } from 'react';
import BookingModal from '../components/BookingModal';
import AgeVerification from '../components/AgeVerification';

const heroImages = [
  '/IMG_1069-3.jpeg',
  '/IMG_1070-4.jpeg',
  '/IMG_1079-6.jpeg',
  '/IMG_1109-14.jpeg',
  '/IMG_1111-15.jpeg',
  '/IMG_1114-16.jpeg',
  '/IMG_1144-21.jpeg',
  '/IMG_1117-17.jpeg',
  '/IMG_1148-23.jpeg',
  '/IMG_1147-22.jpeg',
];

// Carousel speed presets (in milliseconds)
const CAROUSEL_SPEEDS = {
  slow: 10000,
  medium: 6248,
  fast: 3000,
  pause: null,
};

type CarouselSpeed = keyof typeof CAROUSEL_SPEEDS;

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState(0);
  const [clickLog, setClickLog] = useState<string[]>([]);
  const [_isAgeVerified, setIsAgeVerified] = useState(false);
  const [carouselSpeed, setCarouselSpeed] = useState<CarouselSpeed>('fast');

  // Add diagnostic info to window for debugging
  useEffect(() => {
    const diag = {
      showClickLogs: () => {
        console.log('[DIAG] Click logs:', clickLog);
      },
      clearClickLogs: () => {
        setClickLog([]);
      },
    };
    Object.assign(window, diag);
  }, [clickLog]);

  useEffect(() => {
    const speed = CAROUSEL_SPEEDS[carouselSpeed];

    // If paused, don't set interval
    if (speed === null) return;

    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isDragging, carouselSpeed]);

  // Listen for booking modal open event from header buttons
  useEffect(() => {
    const handleOpenBooking = () => {
      setIsBookingOpen(true);
    };

    window.addEventListener('openBookingModal', handleOpenBooking);

    return () => {
      window.removeEventListener('openBookingModal', handleOpenBooking);
    };
  }, []);

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  // Mouse drag handlers
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragOffset(0);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    setDragOffset(deltaX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const threshold = 50; // Minimum pixels to trigger swipe
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        prevImage(); // Swiped right
      } else {
        nextImage(); // Swiped left
      }
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setDragOffset(0);
    // Pause autoplay when user starts swiping
    setCarouselSpeed('pause');
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = Math.abs(touch.clientY - dragStart.y);

    // Only handle horizontal swipes, let vertical pass through for page scroll
    if (Math.abs(deltaX) > deltaY) {
      e.preventDefault();
      setDragOffset(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const threshold = 50;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        prevImage();
      } else {
        nextImage();
      }
    }

    setIsDragging(false);
    setDragOffset(0);
    // Resume autoplay after swipe
    setTimeout(() => setCarouselSpeed('fast'), 500);
  };

  return (
    <>
      <Helmet>
        <title>Claire Hamilton - Exclusive Premium Companion in Canberra</title>
        <meta
          name="description"
          content="Claire Hamilton - Exclusive premium companion offering sophisticated companionship in Canberra, Australia. Elegance, discretion, and genuine connection."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        <style>
          {`
            @keyframes gentle-pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.95; transform: scale(1.02); }
            }

            @keyframes mercury-flow {
              0% { 
                background-position: 0% 50%;
              }
              50% { 
                background-position: 100% 50%;
              }
              100% { 
                background-position: 0% 50%;
              }
            }

            @keyframes mercury-shimmer {
              0% { 
                transform: translateX(-100%) translateY(-100%) rotate(0deg);
                opacity: 0;
              }
              50% { 
                opacity: 0.15;
              }
              100% { 
                transform: translateX(100%) translateY(100%) rotate(45deg);
                opacity: 0;
              }
            }

            .mercury-background {
              background: #d0d0d0;
              position: relative;
              overflow: hidden;
            }

            .mercury-background::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: linear-gradient(
                45deg,
                transparent 45%,
                rgba(255, 255, 255, 0.1) 50%,
                transparent 55%
              );
              animation: mercury-shimmer 15s linear infinite;
              pointer-events: none;
            }

            .mercury-liquid-edge {
              box-shadow: 
                inset 0 1px 1px rgba(255,255,255,0.3),
                inset 0 -1px 1px rgba(100,100,100,0.15);
            }

            /* Hide scroll bar globally when on home page */
            html, body {
              overflow: hidden;
              margin: 0;
              padding: 0;
            }

            /* Ensure images cover the full area properly */
            .home-page img {
              object-position: center;
            }

            /* Additional scroll bar hiding */
            html::-webkit-scrollbar,
            body::-webkit-scrollbar {
              display: none;
            }
            html {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}
        </style>
      </Helmet>

      <div
        className="home-page min-h-screen overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 25%, #d0d0d0 50%, #f5f5f5 75%, #e8e8e8 100%)',
        }}
      >
        {/* Full-Screen Hero Section with Photo Carousel */}
        <section className="fixed inset-0 w-full h-full overflow-hidden flex items-center justify-center">
          {/* Carousel Container with Swipe Support */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden z-0 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'pan-y', WebkitUserSelect: 'none' }}
          >
            {heroImages.map((image, index) => {
              let transformClass = '';
              let zIndex = 0;

              if (index === currentImageIndex) {
                transformClass = isDragging ? `translate-x-[${dragOffset}px]` : 'translate-x-0';
                zIndex = 10;
              } else if (index < currentImageIndex) {
                transformClass = '-translate-x-full';
                zIndex = 5;
              } else {
                transformClass = 'translate-x-full';
                zIndex = 5;
              }

              const style: {
                zIndex: number;
                backgroundColor: string;
                transform?: string;
                transition?: string;
              } = {
                zIndex,
                backgroundColor: '#d0d0d0',
                ...(isDragging && index === currentImageIndex
                  ? { transform: `translateX(${dragOffset}px)`, transition: 'none' }
                  : {}),
              };

              return (
                <img
                  key={index}
                  src={image}
                  alt="Claire Hamilton"
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-in-out ${transformClass}`}
                  style={style}
                  draggable={false}
                />
              );
            })}
          </div>

          {/* Dark Overlay - Minimal for photo impact */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/15 z-20" />

          {/* Content Overlay - Conversion-Optimized Layout */}
          <div className="relative z-30 text-center text-white px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center h-full max-w-7xl mx-auto">
            {/* CTAs - View Gallery (left) and Book Now (right) */}
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center mb-6">
              {/* Compact Gallery Icon */}
              <Link
                to="/gallery"
                className="group p-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/40 shadow-md flex items-center justify-center"
                aria-label="View photo gallery"
              >
                <span className="text-2xl">📸</span>
              </Link>

              {/* Primary CTA - Elegant Book Now */}
              <button
                onClick={() => setIsBookingOpen(true)}
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-rose-600/80 to-red-700/80 text-white rounded-xl text-base sm:text-lg md:text-xl font-semibold tracking-wide hover:shadow-xl hover:from-rose-600 hover:to-red-700 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-500/50 backdrop-blur-sm border border-rose-400/40"
                style={{
                  boxShadow: '0 8px 24px rgba(225, 29, 72, 0.3)',
                }}
                aria-label="Book an appointment now"
              >
                Book Now
                <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300 text-lg sm:text-xl">
                  →
                </span>
              </button>
            </div>

            {/* Value Prop Hint */}
            <p
              className="text-xs sm:text-sm text-rose-100/70 italic max-w-xl mx-auto"
              style={{
                textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
                fontFamily: '"Crimson Text", serif',
              }}
            >
              Experience genuine connection with elegance and discretion
            </p>
          </div>
        </section>

        {/* Carousel Speed Controls */}
        <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50 flex gap-1.5 justify-center select-none pointer-events-auto">
          <button
            onClick={() => setCarouselSpeed('pause')}
            className={`px-2 py-1 rounded-md text-xs transition-all duration-300 ${
              carouselSpeed === 'pause'
                ? 'bg-white/80 text-gray-800 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/40'
            }`}
            style={{
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(4px)',
            }}
            aria-label="Pause carousel"
          >
            ⏸️
          </button>
          <button
            onClick={() => setCarouselSpeed('slow')}
            className={`px-2 py-1 rounded-md text-xs transition-all duration-300 ${
              carouselSpeed === 'slow'
                ? 'bg-white/80 text-gray-800 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/40'
            }`}
            style={{
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(4px)',
            }}
            aria-label="Slow carousel speed"
          >
            �
          </button>
          <button
            onClick={() => setCarouselSpeed('medium')}
            className={`px-2 py-1 rounded-md text-xs transition-all duration-300 ${
              carouselSpeed === 'medium'
                ? 'bg-white/80 text-gray-800 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/40'
            }`}
            style={{
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(4px)',
            }}
            aria-label="Medium carousel speed"
          >
            🚶
          </button>
          <button
            onClick={() => setCarouselSpeed('fast')}
            className={`px-2 py-1 rounded-md text-xs transition-all duration-300 ${
              carouselSpeed === 'fast'
                ? 'bg-white/80 text-gray-800 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/40'
            }`}
            style={{
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(4px)',
            }}
            aria-label="Fast carousel speed"
          >
            🏃
          </button>
        </div>

        {/* Carousel Indicators - Minimal and discreet */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex gap-2 justify-center select-none pointer-events-auto">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`rounded-full transition-all duration-300 cursor-pointer focus:outline-none flex-shrink-0 ${
                index === currentImageIndex
                  ? 'bg-white/70 w-2 h-2'
                  : 'bg-white/30 w-1.5 h-1.5 hover:bg-white/50'
              }`}
              style={{
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <AgeVerification onVerified={() => setIsAgeVerified(true)} />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}
