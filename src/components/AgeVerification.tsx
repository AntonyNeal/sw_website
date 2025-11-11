import { useState } from 'react';

interface AgeVerificationProps {
  onVerified: () => void;
}

export default function AgeVerification({ onVerified }: AgeVerificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // Temporarily disabled sessionStorage check - modal appears on every refresh
  // useEffect(() => {
  //   // Check if user has already verified age (stored in session)
  //   const isVerified = sessionStorage.getItem('ageVerified');
  //   if (isVerified === 'true') {
  //     setIsVisible(false);
  //     onVerified();
  //   }
  // }, [onVerified]);

  const handleEnter = () => {
    setIsAnimating(true);
    // sessionStorage.setItem('ageVerified', 'true'); // Disabled for now

    // Fade out animation
    setTimeout(() => {
      setIsVisible(false);
      onVerified();
    }, 400);
  };

  const handleExit = () => {
    // Redirect to a safe page or show message
    window.location.href = 'https://www.google.com';
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-rose-50/95 via-white/95 to-pink-50/95 backdrop-blur-md transition-opacity duration-400 ${
        isAnimating ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Main content card */}
      <div className="relative w-full max-w-md mx-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-12 border border-rose-100/50">
        {/* Logo or brand element (optional) */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-3">
              Age
              <span className="block text-3xl sm:text-4xl font-light italic text-rose-600 mt-1">
                Verification
              </span>
            </h1>
          </div>

          <p className="text-gray-600 text-base sm:text-lg font-light leading-relaxed">
            This website contains adult content intended for individuals
            <span className="font-medium text-gray-900"> 18 years of age and older</span>.
          </p>

          <div className="pt-4">
            <p className="text-sm text-gray-500 mb-6">
              Please confirm you meet the age requirement to continue.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleEnter}
                className="group relative px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium rounded-xl hover:from-rose-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                aria-label="I am 18 or older"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  I&apos;m 18+
                </span>
              </button>

              <button
                onClick={handleExit}
                className="px-8 py-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300"
                aria-label="I am under 18"
              >
                Exit
              </button>
            </div>
          </div>

          {/* Legal disclaimer */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400 leading-relaxed">
              By entering this site, you confirm that you are of legal age and agree to our terms of
              service. This verification is required by law.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
