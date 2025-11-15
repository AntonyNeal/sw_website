import { useEffect, useState, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Prices from './pages/Prices';
import Gallery from './pages/Gallery';
import AdminDashboard from './pages/AdminDashboard';
import { initializeSession, registerSession, trackConversion } from './utils/utm.service';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const clickCountRef = useRef(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Initialize UTM tracking and session on app load
    const initTracking = async () => {
      try {
        // Initialize local session data (sync)
        const session = initializeSession();
        console.debug('Session initialized:', session.userId);

        // Skip backend tracking in development if domain not accessible
        if (import.meta.env.PROD) {
          // Register session with backend (async, non-blocking)
          const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
          await registerSession(apiBaseUrl);

          // Track page view
          await trackConversion('page_view', { page: 'home' }, apiBaseUrl);
        }
      } catch (error) {
        console.debug('Error initializing tracking:', error);
        // Don't fail the app if tracking fails
      }
    };

    initTracking();
  }, []);

  return (
    <>
      <Helmet>
        <title>BuildHub - Professional Project Management & Business Consulting</title>
        <meta
          name="description"
          content="BuildHub by Claire Hamilton - Expert project management, strategic planning, and business consulting services in Melbourne"
        />
      </Helmet>

      <div className="min-h-screen" style={{ backgroundColor: '#d0d0d0' }}>
        {/* Navigation Header */}
        <header
          className={`sticky top-0 z-50 ${location.pathname === '/' ? 'backdrop-blur-md border-b-0' : 'backdrop-blur-sm shadow-sm border-b border-gray-300'}`}
          style={{
            background:
              'linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 25%, #d0d0d0 50%, #f5f5f5 75%, #e8e8e8 100%)',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)',
            borderBottom: '1px solid rgba(255,255,255,0.5)',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 xl:py-6 relative z-10">
            <nav className="max-w-7xl mx-auto">
              {/* Mobile Layout */}
              <div className="lg:hidden flex justify-between items-center">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Claire Hamilton logo clicked! Current path:', location.pathname);

                    // If on admin page, go home on any click
                    if (location.pathname === '/admin') {
                      console.log('Navigating from admin to home');
                      navigate('/');
                      return;
                    }

                    // If NOT on home, navigate to home
                    if (location.pathname !== '/') {
                      console.log('Navigating to home from:', location.pathname);
                      navigate('/');
                      return;
                    }

                    // If already on home, use triple-click for admin
                    clickCountRef.current += 1;
                    const newCount = clickCountRef.current;
                    console.log('Click count:', newCount);

                    if (newCount === 3) {
                      clickCountRef.current = 0;
                      if (resetTimerRef.current) {
                        clearTimeout(resetTimerRef.current);
                        resetTimerRef.current = null;
                      }
                      console.log('Triple-click detected! Navigating to admin');
                      navigate('/admin');
                    } else {
                      // Clear existing timer
                      if (resetTimerRef.current) {
                        clearTimeout(resetTimerRef.current);
                      }

                      // Set new timer to reset counter after 500ms
                      resetTimerRef.current = setTimeout(() => {
                        clickCountRef.current = 0;
                        resetTimerRef.current = null;
                      }, 500);
                    }
                  }}
                  className="text-xl sm:text-2xl font-light tracking-tight hover:text-rose-600 transition-colors whitespace-nowrap cursor-pointer select-none"
                  style={{
                    color: '#2d3748',
                    textShadow: '0 1px 0 rgba(255,255,255,0.8), 0 -1px 0 rgba(0,0,0,0.2)',
                  }}
                  title={
                    location.pathname === '/admin'
                      ? 'Click to return home'
                      : 'Triple-click for surprise!'
                  }
                >
                  Claire Hamilton
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      if (location.pathname !== '/') {
                        navigate('/');
                      }
                      window.dispatchEvent(new CustomEvent('openBookingModal'));
                    }}
                    className="px-3 py-2 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-lg font-semibold hover:from-rose-700 hover:to-rose-800 transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 text-sm cursor-pointer"
                    aria-label="Book an appointment now"
                  >
                    Book Now
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMobileMenuOpen(!isMobileMenuOpen);
                    }}
                    className="p-2 text-gray-800 hover:text-rose-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 rounded-lg"
                    aria-label="Toggle mobile menu"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isMobileMenuOpen ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:flex justify-between items-center">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(
                      'Claire Hamilton logo clicked (Desktop)! Current path:',
                      location.pathname
                    );

                    // If on admin page, go home on any click
                    if (location.pathname === '/admin') {
                      console.log('Navigating from admin to home');
                      navigate('/');
                      return;
                    }

                    // If NOT on home, navigate to home
                    if (location.pathname !== '/') {
                      console.log('Navigating to home from:', location.pathname);
                      navigate('/');
                      return;
                    }

                    // If already on home, use triple-click for admin
                    clickCountRef.current += 1;
                    const newCount = clickCountRef.current;
                    console.log('Click count:', newCount);

                    if (newCount === 3) {
                      clickCountRef.current = 0;
                      if (resetTimerRef.current) {
                        clearTimeout(resetTimerRef.current);
                        resetTimerRef.current = null;
                      }
                      console.log('Triple-click detected! Navigating to admin');
                      navigate('/admin');
                    } else {
                      // Clear existing timer
                      if (resetTimerRef.current) {
                        clearTimeout(resetTimerRef.current);
                      }

                      // Set new timer to reset counter after 500ms
                      resetTimerRef.current = setTimeout(() => {
                        clickCountRef.current = 0;
                        resetTimerRef.current = null;
                      }, 500);
                    }
                  }}
                  className="text-3xl xl:text-4xl font-light tracking-tight hover:text-rose-600 transition-colors whitespace-nowrap cursor-pointer select-none"
                  style={{
                    color: '#2d3748',
                    textShadow: '0 1px 0 rgba(255,255,255,0.8), 0 -1px 0 rgba(0,0,0,0.2)',
                  }}
                  title={
                    location.pathname === '/admin'
                      ? 'Click to return home'
                      : 'Triple-click for surprise!'
                  }
                >
                  Claire Hamilton
                </div>

                {/* Desktop Navigation */}
                <div className="flex space-x-6 xl:space-x-8 items-center">
                  <Link
                    to="/about"
                    className={`font-medium transition-colors duration-300 focus:outline-none focus:text-rose-600 ${
                      location.pathname === '/about'
                        ? 'text-rose-600'
                        : 'text-gray-800 hover:text-rose-600'
                    }`}
                    style={{
                      textShadow: '0 1px 0 rgba(255,255,255,0.5)',
                    }}
                    aria-label="About page"
                  >
                    About
                  </Link>
                  <Link
                    to="/prices"
                    className={`font-medium transition-colors duration-300 focus:outline-none focus:text-rose-600 ${
                      location.pathname === '/prices'
                        ? 'text-rose-600'
                        : 'text-gray-800 hover:text-rose-600'
                    }`}
                    style={{
                      textShadow: '0 1px 0 rgba(255,255,255,0.5)',
                    }}
                    aria-label="Prices page"
                  >
                    Prices
                  </Link>
                  <Link
                    to="/services"
                    className={`font-medium transition-colors duration-300 focus:outline-none focus:text-rose-600 ${
                      location.pathname === '/services'
                        ? 'text-rose-600'
                        : 'text-gray-800 hover:text-rose-600'
                    }`}
                    style={{
                      textShadow: '0 1px 0 rgba(255,255,255,0.5)',
                    }}
                    aria-label="Services page"
                  >
                    Services
                  </Link>
                  <button
                    onClick={() => {
                      if (location.pathname !== '/') {
                        navigate('/');
                      }
                      window.dispatchEvent(new CustomEvent('openBookingModal'));
                    }}
                    className="px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-lg font-semibold hover:from-rose-700 hover:to-rose-800 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 whitespace-nowrap text-xs sm:text-sm lg:text-base cursor-pointer"
                    aria-label="Book an appointment now"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden absolute top-full left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg z-50">
                <div className="px-4 py-6 space-y-4">
                  <Link
                    to="/about"
                    className={`block font-medium transition-colors duration-300 focus:outline-none focus:text-rose-600 ${
                      location.pathname === '/about'
                        ? 'text-rose-600'
                        : 'text-gray-900 hover:text-rose-600'
                    }`}
                    aria-label="About page"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/prices"
                    className={`block font-medium transition-colors duration-300 focus:outline-none focus:text-rose-600 ${
                      location.pathname === '/prices'
                        ? 'text-rose-600'
                        : 'text-gray-900 hover:text-rose-600'
                    }`}
                    aria-label="Prices page"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Prices
                  </Link>
                  <Link
                    to="/services"
                    className={`block font-medium transition-colors duration-300 focus:outline-none focus:text-rose-600 ${
                      location.pathname === '/services'
                        ? 'text-rose-600'
                        : 'text-gray-900 hover:text-rose-600'
                    }`}
                    aria-label="Services page"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Services
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>

        {/* Footer - Hidden on home page and admin page */}
        {location.pathname !== '/' && location.pathname !== '/admin' && (
          <footer
            className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-400/30 relative"
            style={{
              background:
                'linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 25%, #d0d0d0 50%, #f5f5f5 75%, #e8e8e8 100%)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.1), 0 -4px 6px rgba(0,0,0,0.1)',
            }}
          >
            {/* Chrome shine overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.05) 100%)',
              }}
            />
            <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16 lg:gap-20 mb-12 sm:mb-16 lg:mb-20">
                  <div>
                    <h3
                      className="text-2xl sm:text-3xl lg:text-4xl font-light mb-6 tracking-tight"
                      style={{
                        fontFamily: '"Playfair Display", serif',
                        color: '#2d3748',
                        textShadow: '0 1px 0 rgba(255,255,255,0.8), 0 -1px 0 rgba(0,0,0,0.2)',
                      }}
                    >
                      Claire Hamilton
                    </h3>
                    <p
                      className="mb-4 text-base sm:text-lg italic font-light"
                      style={{
                        color: '#4a5568',
                        textShadow: '0 1px 0 rgba(255,255,255,0.5)',
                      }}
                    >
                      Exclusive Premium Companion
                    </p>
                    <p
                      className="text-sm sm:text-base font-light"
                      style={{
                        color: '#718096',
                        textShadow: '0 1px 0 rgba(255,255,255,0.5)',
                      }}
                    >
                      Canberra, Australia
                    </p>
                  </div>
                  <div>
                    <h3
                      className="text-xl sm:text-2xl lg:text-3xl font-light mb-6 tracking-tight"
                      style={{
                        fontFamily: '"Playfair Display", serif',
                        color: '#2d3748',
                        textShadow: '0 1px 0 rgba(255,255,255,0.8), 0 -1px 0 rgba(0,0,0,0.2)',
                      }}
                    >
                      Contact
                    </h3>
                    <div className="space-y-3 text-sm sm:text-base font-light">
                      <p
                        className="flex items-center gap-2"
                        style={{
                          color: '#4a5568',
                          textShadow: '0 1px 0 rgba(255,255,255,0.5)',
                        }}
                      >
                        <span className="text-rose-600">📱</span>
                        <span>SMS: 0403 977 680</span>
                      </p>
                      <p
                        className="flex items-center gap-2"
                        style={{
                          color: '#4a5568',
                          textShadow: '0 1px 0 rgba(255,255,255,0.5)',
                        }}
                      >
                        <span className="text-rose-600">✉️</span>
                        <span>contact.clairehamilton@proton.me</span>
                      </p>
                      <p
                        className="flex items-center gap-2"
                        style={{
                          color: '#4a5568',
                          textShadow: '0 1px 0 rgba(255,255,255,0.5)',
                        }}
                      >
                        <span className="text-rose-600">💬</span>
                        <span>WhatsApp: +61 403 977 680</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3
                      className="text-xl sm:text-2xl lg:text-3xl font-light mb-6 tracking-tight"
                      style={{
                        fontFamily: '"Playfair Display", serif',
                        color: '#2d3748',
                        textShadow: '0 1px 0 rgba(255,255,255,0.8), 0 -1px 0 rgba(0,0,0,0.2)',
                      }}
                    >
                      Connect
                    </h3>
                    <div className="space-y-3">
                      <a
                        href="#"
                        className="group flex items-center gap-2 hover:text-rose-600 transition-all duration-300 text-sm sm:text-base font-light"
                        style={{
                          color: '#4a5568',
                          textShadow: '0 1px 0 rgba(255,255,255,0.5)',
                        }}
                      >
                        <span className="transform group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                        <span>Twitter</span>
                      </a>
                      <a
                        href="#"
                        className="group flex items-center gap-2 hover:text-rose-600 transition-all duration-300 text-sm sm:text-base font-light"
                        style={{
                          color: '#4a5568',
                          textShadow: '0 1px 0 rgba(255,255,255,0.5)',
                        }}
                      >
                        <span className="transform group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                        <span>OnlyFans</span>
                      </a>
                      <a
                        href="#"
                        className="group flex items-center gap-2 hover:text-rose-600 transition-all duration-300 text-sm sm:text-base font-light"
                        style={{
                          color: '#4a5568',
                          textShadow: '0 1px 0 rgba(255,255,255,0.5)',
                        }}
                      >
                        <span className="transform group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                        <span>Bluesky</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-500/30 pt-8 sm:pt-12 text-center">
                  <p
                    className="text-xs sm:text-sm font-light tracking-wide"
                    style={{
                      color: '#718096',
                      textShadow: '0 1px 0 rgba(255,255,255,0.5)',
                    }}
                  >
                    © 2025 Claire Hamilton. All rights reserved.
                  </p>
                  <p
                    className="text-xs mt-2 font-light italic"
                    style={{
                      color: '#a0aec0',
                      textShadow: '0 1px 0 rgba(255,255,255,0.5)',
                    }}
                  >
                    Privacy & Discretion Guaranteed
                  </p>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </>
  );
}

export default App;
