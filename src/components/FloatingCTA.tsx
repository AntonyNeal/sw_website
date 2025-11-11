import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface FloatingCTAProps {
  onBookNow: () => void;
}

export default function FloatingCTA({ onBookNow }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show CTA after a short delay when page loads
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    // Hide CTA when scrolling near top
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 200);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      <div
        className="rounded-2xl px-8 py-4 shadow-2xl backdrop-blur-sm flex items-center gap-4"
        style={{
          background:
            'linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 25%, #d8dade 50%, #f5f5f5 75%, #e8e8e8 100%)',
          boxShadow:
            '0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.6)',
        }}
      >
        {/* Chrome highlight overlay */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
          }}
        />

        <div className="relative z-10 flex items-center gap-4">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
              boxShadow: '0 4px 12px rgba(74, 144, 226, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            <Calendar size={24} color="white" />
          </div>

          {/* Text */}
          <div className="hidden sm:block">
            <p
              className="text-sm font-bold mb-0.5"
              style={{
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px',
              }}
            >
              Ready to Book?
            </p>
            <p
              className="text-xs"
              style={{
                color: '#4a5568',
                letterSpacing: '0.3px',
              }}
            >
              Secure your appointment today
            </p>
          </div>

          {/* Button */}
          <button
            onClick={onBookNow}
            className="px-6 py-3 rounded-xl font-bold transition-all relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
              boxShadow:
                '0 4px 12px rgba(74, 144, 226, 0.4), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#ffffff',
              letterSpacing: '0.5px',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(135deg, #357abd 0%, #2d6ba8 100%)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
