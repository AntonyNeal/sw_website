import { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import { initializeSession, registerSession, trackConversion } from './utils/utm.service';

function App() {
  useEffect(() => {
    // Initialize UTM tracking and session on app load
    const initTracking = async () => {
      try {
        // Initialize local session data (sync)
        const session = initializeSession();
        console.debug('Session initialized:', session.userId);

        // Register session with backend (async, non-blocking)
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
        await registerSession(apiBaseUrl);

        // Track page view
        await trackConversion('page_view', { page: 'home' }, apiBaseUrl);
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
        <title>Claire Hamilton</title>
        <meta name="description" content="Claire Hamilton - Melbourne Companion" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Navigation Header */}
        <header className="bg-gradient-to-b from-rose-50 to-white border-b border-rose-100">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex justify-between items-center">
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">Claire Hamilton</h1>
              <div className="space-x-8 flex items-center">
                <a
                  href="#about"
                  className="text-gray-700 font-light tracking-wide hover:text-rose-500 transition-colors duration-300"
                >
                  About
                </a>
                <Link
                  to="/gallery"
                  className="text-gray-700 font-light tracking-wide hover:text-rose-500 transition-colors duration-300"
                >
                  Gallery
                </Link>
                <a
                  href="#services"
                  className="text-gray-700 font-light tracking-wide hover:text-rose-500 transition-colors duration-300"
                >
                  Services
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 font-light tracking-wide hover:text-rose-500 transition-colors duration-300"
                >
                  Contact
                </a>
              </div>
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
