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

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState(0);
  const [clickLog, setClickLog] = useState<string[]>([]);
  const [_isAgeVerified, setIsAgeVerified] = useState(false);

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
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }
    }, 6248);

    return () => clearInterval(interval);
  }, [isDragging]);

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
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    setDragOffset(deltaX);
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

      <div className="home-page mercury-background mercury-liquid-edge min-h-screen overflow-hidden">
        {/* Full-Screen Hero Section with Photo Carousel */}
        <section className="fixed inset-0 w-full h-full overflow-hidden flex items-center justify-center">
          {/* Carousel Container with Swipe Support */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden z-0 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'pan-y' }}
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
                  className={`absolute inset-0 w-full h-full object-contain transition-transform duration-1000 ease-in-out ${transformClass}`}
                  style={style}
                  draggable={false}
                />
              );
            })}
          </div>

          {/* Dark Overlay - Subtle for photo impact */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/15 to-black/25 z-20" />

          {/* Content Overlay - Conversion-Optimized Layout */}
          <div className="relative z-30 text-center text-white px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center h-full max-w-7xl mx-auto">
            <h1
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light mb-6 sm:mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] leading-none tracking-tight"
              style={{
                textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
                fontFamily: '"Playfair Display", serif',
                animation: 'gentle-pulse 4s ease-in-out infinite',
              }}
            >
              Claire Hamilton
            </h1>
            <p
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] mb-10 sm:mb-14 max-w-5xl mx-auto leading-relaxed font-light"
              style={{
                textShadow: '1px 1px 6px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.5)',
                fontFamily: '"Crimson Text", serif',
              }}
            >
              Exclusive Premium Companion
            </p>

            {/* CTAs - View Gallery (left) and Book Now (right) */}
            <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 justify-center items-center mb-8 sm:mb-12">
              {/* Secondary CTA - View Gallery as Intent Driver */}
              <Link
                to="/gallery"
                className="group inline-flex items-center gap-3 px-8 sm:px-10 md:px-12 py-4 sm:py-5 border-3 border-rose-200/80 text-rose-50 rounded-xl text-lg sm:text-xl md:text-2xl font-semibold tracking-wide hover:bg-rose-100/30 hover:border-rose-100 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-rose-300 focus:ring-offset-2 backdrop-blur-md shadow-lg"
                style={{
                  boxShadow: '0 8px 32px rgba(244, 114, 182, 0.3)',
                }}
                aria-label="View photo gallery"
              >
                <span className="text-2xl sm:text-3xl">📸</span>
                View Gallery
                <span className="inline-block group-hover:translate-x-1 transition-transform text-xl sm:text-2xl">
                  →
                </span>
              </Link>

              {/* Primary CTA - Prominent Book Now */}
              <button
                onClick={() => setIsBookingOpen(true)}
                className="group relative px-12 sm:px-16 md:px-20 lg:px-24 py-5 sm:py-6 md:py-7 bg-gradient-to-r from-rose-600/90 to-red-700/90 text-white rounded-2xl text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide hover:shadow-2xl hover:from-rose-600 hover:to-red-700 transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-rose-500 focus:ring-offset-4 backdrop-blur-md border-2 border-rose-400/50"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  boxShadow:
                    '0 12px 48px rgba(225, 29, 72, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.2)',
                }}
                aria-label="Book an appointment now"
              >
                Book Now
                <span className="ml-3 inline-block group-hover:translate-x-2 transition-transform duration-300 text-2xl sm:text-3xl md:text-4xl">
                  →
                </span>
              </button>
            </div>

            {/* Value Prop Hint */}
            <p
              className="text-sm sm:text-base md:text-lg text-rose-100/80 italic max-w-2xl mx-auto"
              style={{
                textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
                fontFamily: '"Crimson Text", serif',
              }}
            >
              Experience genuine connection with elegance and discretion
            </p>
          </div>
        </section>

        {/* Carousel Indicators - Subtle and refined */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-3 sm:gap-3 justify-center select-none pointer-events-auto">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`rounded-full transition-all duration-300 cursor-pointer focus:outline-none flex-shrink-0 ${
                index === currentImageIndex
                  ? 'bg-white/80 w-2.5 h-2.5'
                  : 'bg-white/40 w-2 h-2 hover:bg-white/60'
              }`}
              style={{
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
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
