import React, { useState, useEffect, useRef } from 'react';
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
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
            Book an Appointment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close booking modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    state.currentStep === step
                      ? 'bg-blue-600 text-white shadow-lg'
                      : state.currentStep > step
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {state.currentStep > step ? '✓' : step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 h-1 ${
                      state.currentStep > step ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {state.currentStep === 1 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select a Date</h3>
                <p className="text-gray-600 mb-4">
                  Choose your preferred booking date from available dates.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center text-blue-700">
                  Calendar implementation coming soon
                </div>
              </div>
            )}

            {state.currentStep === 2 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time & Duration</h3>
                <p className="text-gray-600 mb-4">
                  Choose your preferred time and session duration.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center text-blue-700">
                  Time slot selection coming soon
                </div>
              </div>
            )}

            {state.currentStep === 3 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Details</h3>
                <p className="text-gray-600 mb-4">
                  Please review your booking details and provide contact information.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center text-blue-700">
                  Booking summary coming soon
                </div>
              </div>
            )}

            {state.currentStep === 4 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>
                <p className="text-gray-600 mb-4">
                  Complete your booking by selecting a payment method.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center text-blue-700">
                  Payment processing coming soon
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
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => {
                if (state.currentStep === 4) {
                  // Process booking
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {state.currentStep === 4 ? 'Complete Booking' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
