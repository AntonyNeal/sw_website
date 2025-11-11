//clairehamilton.com.au
//www.clairehamilton.com.auimport React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { BookingModalProps } from '../types/booking.types';

interface BookingModalState {
  currentStep: number;
  selectedDate: Date | null;
  selectedTime: string | null;
  duration: number;
  clientInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  paymentMethod: string | null;
  isProcessing: boolean;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [state, setState] = useState<BookingModalState>({
    currentStep: 1,
    selectedDate: null,
    selectedTime: null,
    duration: 1,
    clientInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    paymentMethod: null,
    isProcessing: false,
  });

  const modalRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="presentation"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(30, 30, 40, 0.9) 100%)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        ref={modalRef}
        className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          background:
            'linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 25%, #d8dade 50%, #f5f5f5 75%, #e8e8e8 100%)',
          boxShadow:
            '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.5)',
        }}
      >
        {/* Chrome Edge Highlight */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.08) 100%)',
          }}
        />

        {/* Header */}
        <div
          className="sticky top-0 p-6 flex justify-between items-center relative z-10 rounded-t-2xl"
          style={{
            background: 'linear-gradient(135deg, #d0d4d8 0%, #e8eaed 50%, #d0d4d8 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
                boxShadow: '0 2px 8px rgba(74, 144, 226, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1v14M1 8h14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            <h2
              id="modal-title"
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 1px 0 rgba(255,255,255,0.5)',
                letterSpacing: '0.5px',
              }}
            >
              Secure Booking Portal
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-all"
            aria-label="Close booking modal"
            style={{
              background: 'linear-gradient(135deg, #e0e0e0 0%, #f0f0f0 100%)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,255,255,0.6)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(135deg, #d0d0d0 0%, #e0e0e0 100%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(135deg, #e0e0e0 0%, #f0f0f0 100%)';
            }}
          >
            <X size={20} style={{ color: '#4a5568' }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 relative z-10">
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div
              className="px-4 py-2 rounded-full flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #e8f4f8 0%, #d4e8f0 100%)',
                border: '1px solid rgba(74, 144, 226, 0.3)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(74, 144, 226, 0.15)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 0L9 4H13L10 7L11 11L7 9L3 11L4 7L1 4H5L7 0Z" fill="#4a90e2" />
              </svg>
              <span
                className="text-xs font-semibold"
                style={{ color: '#2c5282', letterSpacing: '0.5px' }}
              >
                SECURE & ENCRYPTED
              </span>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className="relative w-11 h-11 flex items-center justify-center font-bold text-sm transition-all"
                  style={{
                    background:
                      state.currentStep === step
                        ? 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)'
                        : state.currentStep > step
                          ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
                          : 'linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)',
                    boxShadow:
                      state.currentStep === step
                        ? '0 4px 12px rgba(74, 144, 226, 0.4), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.2)'
                        : '0 2px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.4)',
                    color: state.currentStep >= step ? '#ffffff' : '#4a5568',
                    fontWeight: '700',
                  }}
                >
                  {state.currentStep > step ? '✓' : step}
                  {state.currentStep === step && (
                    <div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
                        animation: 'pulse 2s ease-in-out infinite',
                      }}
                    />
                  )}
                </div>
                {step < 4 && (
                  <div
                    className="h-1 transition-all"
                    style={{
                      width: '40px',
                      background:
                        state.currentStep > step
                          ? 'linear-gradient(90deg, #48bb78 0%, #38a169 100%)'
                          : 'linear-gradient(90deg, #e2e8f0 0%, #cbd5e0 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div
            className="mb-8 rounded-xl p-6"
            style={{
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,255,255,0.6)',
            }}
          >
            {state.currentStep === 1 && (
              <div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.3px',
                  }}
                >
                  Select a Date
                </h3>
                <p className="mb-6 text-sm" style={{ color: '#4a5568' }}>
                  Choose your preferred booking date from available dates.
                </p>
                <div
                  className="rounded-lg p-6 text-center"
                  style={{
                    background: 'linear-gradient(135deg, #e6f2ff 0%, #cfe7ff 100%)',
                    border: '1px solid rgba(74, 144, 226, 0.3)',
                    boxShadow:
                      'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(74, 144, 226, 0.1)',
                    color: '#2c5282',
                    fontWeight: '600',
                  }}
                >
                  📅 Calendar implementation coming soon
                </div>
              </div>
            )}

            {state.currentStep === 2 && (
              <div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.3px',
                  }}
                >
                  Select Time & Duration
                </h3>
                <p className="mb-6 text-sm" style={{ color: '#4a5568' }}>
                  Choose your preferred time and session duration.
                </p>
                <div
                  className="rounded-lg p-6 text-center"
                  style={{
                    background: 'linear-gradient(135deg, #e6f2ff 0%, #cfe7ff 100%)',
                    border: '1px solid rgba(74, 144, 226, 0.3)',
                    boxShadow:
                      'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(74, 144, 226, 0.1)',
                    color: '#2c5282',
                    fontWeight: '600',
                  }}
                >
                  ⏰ Time slot selection coming soon
                </div>
              </div>
            )}

            {state.currentStep === 3 && (
              <div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.3px',
                  }}
                >
                  Review Details
                </h3>
                <p className="mb-6 text-sm" style={{ color: '#4a5568' }}>
                  Please review your booking details and provide contact information.
                </p>
                <div
                  className="rounded-lg p-6 text-center"
                  style={{
                    background: 'linear-gradient(135deg, #e6f2ff 0%, #cfe7ff 100%)',
                    border: '1px solid rgba(74, 144, 226, 0.3)',
                    boxShadow:
                      'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(74, 144, 226, 0.1)',
                    color: '#2c5282',
                    fontWeight: '600',
                  }}
                >
                  📋 Booking summary coming soon
                </div>
              </div>
            )}

            {state.currentStep === 4 && (
              <div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.3px',
                  }}
                >
                  Secure Payment
                </h3>
                <p className="mb-6 text-sm" style={{ color: '#4a5568' }}>
                  Complete your booking with our encrypted payment system.
                </p>
                <div
                  className="rounded-lg p-6 text-center"
                  style={{
                    background: 'linear-gradient(135deg, #e6ffe6 0%, #cfffcf 100%)',
                    border: '1px solid rgba(72, 187, 120, 0.3)',
                    boxShadow:
                      'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(72, 187, 120, 0.1)',
                    color: '#2f855a',
                    fontWeight: '600',
                  }}
                >
                  🔒 Payment processing coming soon
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4">
            <button
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  currentStep: Math.max(1, prev.currentStep - 1),
                }))
              }
              disabled={state.currentStep === 1}
              className="px-8 py-3 rounded-lg font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background:
                  state.currentStep === 1
                    ? 'linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%)'
                    : 'linear-gradient(135deg, #e8e8e8 0%, #d8d8d8 100%)',
                boxShadow:
                  state.currentStep === 1
                    ? 'none'
                    : '0 2px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.5)',
                color: '#4a5568',
                letterSpacing: '0.5px',
              }}
              onMouseEnter={(e) => {
                if (state.currentStep !== 1) {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #d8d8d8 0%, #c8c8c8 100%)';
                }
              }}
              onMouseLeave={(e) => {
                if (state.currentStep !== 1) {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #e8e8e8 0%, #d8d8d8 100%)';
                }
              }}
            >
              ← Back
            </button>
            <button
              onClick={() => {
                if (state.currentStep === 4) {
                  setState((prev) => ({ ...prev, isProcessing: true }));
                  setTimeout(() => {
                    onClose();
                  }, 1000);
                } else {
                  setState((prev) => ({
                    ...prev,
                    currentStep: Math.min(4, prev.currentStep + 1),
                  }));
                }
              }}
              disabled={state.isProcessing}
              className="px-8 py-3 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
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
                if (!state.isProcessing) {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #357abd 0%, #2d6ba8 100%)';
                  e.currentTarget.style.boxShadow =
                    '0 6px 16px rgba(74, 144, 226, 0.5), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!state.isProcessing) {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(74, 144, 226, 0.4), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.2)';
                }
              }}
            >
              {state.currentStep === 4 ? (
                <>
                  <span>🔒 Complete Booking</span>
                </>
              ) : (
                <>
                  <span>Next →</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
