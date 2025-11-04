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

      <div className="min-h-screen bg-gray-50">
        {/* Navigation Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Claire Hamilton</h1>
              <div className="space-x-6">
                <a href="#about" className="text-gray-600 hover:text-gray-900">
                  About
                </a>
                <Link to="/gallery" className="text-gray-600 hover:text-gray-900">
                  Gallery
                </Link>
                <a href="#services" className="text-gray-600 hover:text-gray-900">
                  Services
                </a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900">
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
