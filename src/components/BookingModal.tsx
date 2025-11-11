import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { BookingModalProps } from '../types/booking.types';
import {
  simplybookService,
  type Service,
  type TimeSlot,
  type BookingData,
} from '../services/simplybook.service';

interface ClientInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  comments?: string;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    comments: '',
  });
  const [bookingId, setBookingId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // API Functions
  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await simplybookService.getServices();
    if (result.success && result.data) {
      setServices(result.data);
    } else {
      setError(result.error || 'Failed to load services');
    }
    setLoading(false);
  }, []);

  const loadAvailableDates = useCallback(async () => {
    if (!selectedService) return;
    setLoading(true);
    setError(null);
    const result = await simplybookService.getAvailableDates(selectedService.id);
    if (result.success && result.data) {
      setAvailableDates(result.data);
    } else {
      setError(result.error || 'Failed to load available dates');
    }
    setLoading(false);
  }, [selectedService]);

  const loadTimeSlots = useCallback(async () => {
    if (!selectedService || !selectedDate) return;
    setLoading(true);
    setError(null);
    const result = await simplybookService.getAvailableTimeSlots(selectedService.id, selectedDate);
    if (result.success && result.data) {
      setTimeSlots(result.data);
    } else {
      setError(result.error || 'Failed to load time slots');
    }
    setLoading(false);
  }, [selectedService, selectedDate]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setSelectedService(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setClientInfo({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        comments: '',
      });
      setBookingId(null);
      setError(null);
    }
  }, [isOpen]);

  // Load services when modal opens
  useEffect(() => {
    if (isOpen && currentStep === 1 && services.length === 0) {
      loadServices();
    }
  }, [isOpen, currentStep, services.length, loadServices]);

  // Load dates when service is selected
  useEffect(() => {
    if (selectedService && currentStep === 2 && availableDates.length === 0) {
      loadAvailableDates();
    }
  }, [selectedService, currentStep, availableDates.length, loadAvailableDates]);

  // Load time slots when date is selected
  useEffect(() => {
    if (selectedService && selectedDate) {
      loadTimeSlots();
    }
  }, [selectedService, selectedDate, loadTimeSlots]);

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

  const createBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    setLoading(true);
    setError(null);

    const bookingData: BookingData = {
      service_id: selectedService.id,
      provider_id: '1', // Default provider - will need to be selected if multiple providers
      date: selectedDate,
      time: selectedTime,
      client: {
        name: `${clientInfo.firstName} ${clientInfo.lastName}`,
        email: clientInfo.email,
        phone: clientInfo.phone,
      },
      additional_fields: clientInfo.comments ? { comments: clientInfo.comments } : undefined,
    };

    const result = await simplybookService.createBooking(bookingData);
    if (result.success && result.data) {
      setBookingId(result.data.id);
      setCurrentStep(4);
    } else {
      setError(result.error || 'Failed to create booking');
    }
    setLoading(false);
  };

  // Navigation
  const handleNext = () => {
    if (currentStep === 1 && selectedService) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedDate && selectedTime) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!clientInfo.firstName || !clientInfo.lastName || !clientInfo.email || !clientInfo.phone) {
        setError('Please fill in all required fields');
        return;
      }
      createBooking();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

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
        className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative flex flex-col"
        role="dialog"
        aria-modal="true"
        style={{
          background:
            'linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 25%, #d8dade 50%, #f5f5f5 75%, #e8e8e8 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)',
          border: '1px solid rgba(255,255,255,0.5)',
        }}
      >
        <div className="p-6 flex justify-between items-center relative z-10">
          <h2 className="text-2xl font-bold text-gray-900">Book Your Session</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10">
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 pb-4 relative z-10">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                      currentStep >= step
                        ? 'bg-gradient-to-br from-gray-700 to-gray-900 text-white shadow-lg'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                  <span className="text-xs mt-1 text-gray-600 font-medium">
                    {step === 1 && 'Service'}
                    {step === 2 && 'Date & Time'}
                    {step === 3 && 'Details'}
                    {step === 4 && 'Confirm'}
                  </span>
                </div>
                {step < 4 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-all duration-300 ${
                      currentStep > step
                        ? 'bg-gradient-to-r from-gray-700 to-gray-900'
                        : 'bg-gray-300'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mb-4 p-4 bg-red-100 border border-red-300 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 pb-6 relative z-10">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Select a Service</h3>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No services available at this time.</p>
                </div>
              ) : (
                services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`w-full p-6 rounded-lg text-left transition-all duration-200 ${
                      selectedService?.id === service.id
                        ? 'ring-2 ring-gray-800 shadow-lg'
                        : 'hover:shadow-md border border-gray-300'
                    }`}
                    style={{
                      background:
                        selectedService?.id === service.id
                          ? 'linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%)'
                          : 'white',
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h4>
                        {service.description && (
                          <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-700">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {service.duration} min
                          </span>
                          {service.price && (
                            <span className="font-semibold text-lg">
                              {service.currency || '$'}
                              {service.price}
                            </span>
                          )}
                        </div>
                      </div>
                      {selectedService?.id === service.id && (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Choose Date & Time</h3>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Select Date
                </label>
                {loading && !selectedDate ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
                  </div>
                ) : availableDates.length === 0 ? (
                  <p className="text-gray-600 text-sm">
                    No dates available. Please try again later.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableDates.slice(0, 21).map((date) => (
                      <button
                        key={date}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime(null);
                          setTimeSlots([]);
                        }}
                        className={`p-3 rounded-lg text-sm font-medium transition-all ${
                          selectedDate === date
                            ? 'bg-gradient-to-br from-gray-700 to-gray-900 text-white shadow-md'
                            : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-500'
                        }`}
                      >
                        {new Date(date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Time Slot Selection */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Select Time
                  </label>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
                    </div>
                  ) : timeSlots.length === 0 ? (
                    <p className="text-gray-600 text-sm">No time slots available for this date.</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots
                        .filter((slot) => slot.is_available)
                        .map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`p-3 rounded-lg text-sm font-medium transition-all ${
                              selectedTime === slot.time
                                ? 'bg-gradient-to-br from-gray-700 to-gray-900 text-white shadow-md'
                                : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-500'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Client Information */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Your Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={clientInfo.firstName}
                    onChange={(e) => setClientInfo({ ...clientInfo, firstName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={clientInfo.lastName}
                    onChange={(e) => setClientInfo({ ...clientInfo, lastName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={clientInfo.email}
                  onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={clientInfo.phone}
                  onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments (Optional)
                </label>
                <textarea
                  value={clientInfo.comments}
                  onChange={(e) => setClientInfo({ ...clientInfo, comments: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent resize-none"
                  placeholder="Any special requests or notes..."
                />
              </div>

              {/* Booking Summary */}
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <strong>Service:</strong> {selectedService?.name}
                  </p>
                  <p>
                    <strong>Date:</strong>{' '}
                    {selectedDate &&
                      new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                  </p>
                  <p>
                    <strong>Time:</strong> {selectedTime}
                  </p>
                  <p>
                    <strong>Duration:</strong> {selectedService?.duration} minutes
                  </p>
                  {selectedService?.price && (
                    <p className="text-lg font-semibold mt-2">
                      <strong>Total:</strong> {selectedService.currency || '$'}
                      {selectedService.price}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="text-center py-8">
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-4">Your booking has been successfully created.</p>
              {bookingId && (
                <p className="text-sm text-gray-500 mb-6">
                  Booking ID: <span className="font-mono font-semibold">{bookingId}</span>
                </p>
              )}
              <div className="bg-gray-100 rounded-lg p-6 text-left max-w-md mx-auto mb-6">
                <h4 className="font-semibold mb-3">Booking Details</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>Service:</strong> {selectedService?.name}
                  </p>
                  <p>
                    <strong>Date:</strong>{' '}
                    {selectedDate &&
                      new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                  </p>
                  <p>
                    <strong>Time:</strong> {selectedTime}
                  </p>
                  <p>
                    <strong>Name:</strong> {clientInfo.firstName} {clientInfo.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {clientInfo.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {clientInfo.phone}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                A confirmation email has been sent to <strong>{clientInfo.email}</strong>
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-lg text-white font-semibold transition-all hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #2a2a4e 100%)',
                }}
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {currentStep < 4 && (
          <div className="p-6 border-t border-gray-300 flex justify-between items-center relative z-10">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-500'
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={
                loading ||
                (currentStep === 1 && !selectedService) ||
                (currentStep === 2 && (!selectedDate || !selectedTime))
              }
              className={`px-6 py-2 rounded-lg font-medium text-white transition-all flex items-center gap-2 ${
                loading ||
                (currentStep === 1 && !selectedService) ||
                (currentStep === 2 && (!selectedDate || !selectedTime))
                  ? 'opacity-50 cursor-not-allowed bg-gray-400'
                  : 'hover:shadow-lg'
              }`}
              style={{
                background:
                  loading ||
                  (currentStep === 1 && !selectedService) ||
                  (currentStep === 2 && (!selectedDate || !selectedTime))
                    ? undefined
                    : 'linear-gradient(135deg, #1a1a2e 0%, #2a2a4e 100%)',
              }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {currentStep === 3 ? 'Confirm Booking' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
