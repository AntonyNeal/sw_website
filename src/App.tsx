import { Routes, Route, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Home from './pages/Home';
import Gallery from './pages/Gallery';

function App() {
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
