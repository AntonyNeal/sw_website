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
    <button
      onClick={onBookNow}
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-500 flex items-center gap-3 px-6 py-4 rounded-2xl font-bold shadow-2xl ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
      style={{
        background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
        boxShadow:
          '0 20px 60px rgba(0,0,0,0.3), 0 8px 16px rgba(74, 144, 226, 0.4), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.2)',
        border: '1px solid rgba(255,255,255,0.3)',
        color: '#ffffff',
        letterSpacing: '0.5px',
        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, #357abd 0%, #2d6ba8 100%)';
        e.currentTarget.style.transform = 'scale(1.05) translateX(-50%)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)';
        e.currentTarget.style.transform = 'scale(1) translateX(-50%)';
      }}
    >
      <Calendar size={24} color="white" />
      <span>Book Now</span>
    </button>
  );
}
