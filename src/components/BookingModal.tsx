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
  Plane,
} from 'lucide-react';
import type { BookingModalProps } from '../types/booking.types';
import sdk from '../config/sdk.config';
import type {
  SimplybookService,
  SimplybookTimeSlot,
  SimplybookBookingData,
} from '../../sdk/src/index';

interface Tour {
  id: string;
  city: string;
  stateProvince: string;
  country: string;
  availableFrom: string;
  availableUntil: string;
  daysAvailable: number;
}

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
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [services, setServices] = useState<SimplybookService[]>([]);
  const [selectedService, setSelectedService] = useState<SimplybookService | null>(null);
  const [_selectedExtras, _setSelectedExtras] = useState<SimplybookService[]>([]);
  const [_availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<SimplybookTimeSlot[]>([]);
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
  const loadTours = useCallback(async () => {
    console.log('🎯 [BookingModal] Loading tours...');
    setLoading(true);
    setError(null);
    try {
      console.log('📡 [BookingModal] Calling sdk.simplybook.getLocations()');
      const locations = await sdk.simplybook.getLocations();
      console.log('✅ [BookingModal] Received locations:', locations);
      console.log('📊 [BookingModal] Locations count:', locations?.length || 0);

      // Transform SimplyBook locations to our Tour format
      const toursData = locations.map(
        (loc: {
          id?: string | number;
          name?: string;
          city?: string;
          state?: string;
          region?: string;
          country?: string;
          availableFrom?: string;
          availableUntil?: string;
          daysAvailable?: number;
        }) => {
          console.log('🔄 [BookingModal] Transforming location:', loc);
          return {
            id: loc.id?.toString() || String(Math.random()),
            city: loc.name || loc.city || 'Unknown',
            stateProvince: loc.state || loc.region || '',
            country: loc.country || 'Australia',
            availableFrom: loc.availableFrom || new Date().toISOString().split('T')[0],
            availableUntil: loc.availableUntil || new Date().toISOString().split('T')[0],
            daysAvailable: loc.daysAvailable || 7,
          };
        }
      );
      console.log('✨ [BookingModal] Transformed tours:', toursData);
      setTours(toursData);
      console.log('💾 [BookingModal] Tours state updated');
    } catch (err) {
      console.error('❌ [BookingModal] Error loading tours:', err);
      console.error('📄 [BookingModal] Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        error: err,
      });

      // Extract detailed error message
      let errorMessage = 'Failed to load tour locations';
      if (
        err &&
        typeof err === 'object' &&
        'getUserMessage' in err &&
        typeof err.getUserMessage === 'function'
      ) {
        errorMessage = err.getUserMessage();
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    }
    setLoading(false);
    console.log('🏁 [BookingModal] Tour loading complete');
  }, []);

  const loadServices = useCallback(async () => {
    console.log('🎯 [BookingModal] Loading services...');
    setLoading(true);
    setError(null);
    try {
      console.log('📡 [BookingModal] Calling sdk.simplybook.getServices()');
      const services = await sdk.simplybook.getServices();
      console.log('✅ [BookingModal] Received services:', services);
      setServices(services);
    } catch (err) {
      console.error('❌ [BookingModal] Error loading services:', err);

      // Extract detailed error message
      let errorMessage = 'Failed to load services';
      if (
        err &&
        typeof err === 'object' &&
        'getUserMessage' in err &&
        typeof err.getUserMessage === 'function'
      ) {
        errorMessage = err.getUserMessage();
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    }
    setLoading(false);
  }, []);

  const _loadAvailableDates = useCallback(async () => {
    if (!selectedService) return;
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 90); // 90 days ahead

      const dates = await sdk.simplybook.getAvailableDates(
        selectedService.id,
        today.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      setAvailableDates(dates);
    } catch (err) {
      // Extract detailed error message
      let errorMessage = 'Failed to load available dates';
      if (
        err &&
        typeof err === 'object' &&
        'getUserMessage' in err &&
        typeof err.getUserMessage === 'function'
      ) {
        errorMessage = err.getUserMessage();
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    }
    setLoading(false);
  }, [selectedService]);

  const loadTimeSlots = useCallback(async () => {
    if (!selectedService || !selectedDate) return;
    setLoading(true);
    setError(null);
    try {
      const slots = await sdk.simplybook.getTimeSlots(selectedService.id, selectedDate);
      setTimeSlots(slots);
    } catch (err) {
      // Extract detailed error message
      let errorMessage = 'Failed to load time slots';
      if (
        err &&
        typeof err === 'object' &&
        'getUserMessage' in err &&
        typeof err.getUserMessage === 'function'
      ) {
        errorMessage = err.getUserMessage();
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
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

  // Load tours when modal opens
  useEffect(() => {
    console.log('🔍 [useEffect] Tour loading check:', {
      isOpen,
      currentStep,
      toursLength: tours.length,
      shouldLoad: isOpen && currentStep === 1 && tours.length === 0,
    });
    if (isOpen && currentStep === 1 && tours.length === 0) {
      console.log('✨ [useEffect] Triggering tour load!');
      loadTours();
    }
  }, [isOpen, currentStep, tours.length, loadTours]);

  // Load services when tour is selected (step 2)
  useEffect(() => {
    if (isOpen && currentStep === 2 && selectedTour && services.length === 0) {
      loadServices();
    }
  }, [isOpen, currentStep, selectedTour, services.length, loadServices]);

  // Load dates when service is selected (step 3) - DISABLED for performance
  // The date availability check is too slow, so we'll just let users pick any date
  // and check availability for that specific date only
  // useEffect(() => {
  //   if (selectedService && selectedTour && currentStep === 3 && availableDates.length === 0) {
  //     loadAvailableDates();
  //   }
  // }, [selectedService, selectedTour, currentStep, availableDates.length, loadAvailableDates]);

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

    try {
      const bookingData: SimplybookBookingData = {
        event_id: selectedService.id,
        unit_id: '1', // Default provider - will need to be selected if multiple providers
        date: selectedDate,
        time: selectedTime,
        client: {
          name: `${clientInfo.firstName} ${clientInfo.lastName}`,
          email: clientInfo.email,
          phone: clientInfo.phone,
        },
        fields: clientInfo.comments ? { comments: clientInfo.comments } : undefined,
      };

      const result = await sdk.simplybook.createBooking(bookingData);
      setBookingId(result.id.toString());
      setCurrentStep(4);
    } catch (err) {
      // Extract detailed error message
      let errorMessage = 'Failed to create booking';
      if (
        err &&
        typeof err === 'object' &&
        'getUserMessage' in err &&
        typeof err.getUserMessage === 'function'
      ) {
        errorMessage = err.getUserMessage();
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    }
    setLoading(false);
  };

  // Navigation
  const handleNext = () => {
    if (currentStep === 1 && selectedTour) {
      // Move from Tour to Service
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedService) {
      // Move from Service to Schedule
      setCurrentStep(3);
    } else if (currentStep === 3 && selectedDate && selectedTime) {
      // Move from Schedule to Extras
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Move from Extras to Confirm
      setCurrentStep(5);
    } else if (currentStep === 5) {
      // Final confirmation - create booking
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleBackdropClick}
      role="presentation"
      style={{
        background:
          'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div
        ref={modalRef}
        className="rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden relative flex flex-col animate-slideUp"
        role="dialog"
        aria-modal="true"
        style={{
          background: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Header with Gradient Bar */}
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <div className="p-8 pb-6 flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                Book Your Experience
              </h2>
              <p className="text-slate-500 text-sm font-medium">Let&apos;s get you scheduled</p>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl hover:bg-slate-100 transition-all duration-200 group"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </button>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="px-8 pb-6">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Tour' },
              { num: 2, label: 'Service' },
              { num: 3, label: 'Schedule' },
              { num: 4, label: 'Extras' },
              { num: 5, label: 'Confirm' },
            ].map((step, index) => (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center flex-1 group">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      currentStep >= step.num
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                        : 'bg-slate-100 text-slate-400 border-2 border-slate-200'
                    }`}
                  >
                    {currentStep > step.num ? <CheckCircle className="w-6 h-6" /> : step.num}
                  </div>
                  <span
                    className={`text-xs mt-2 font-semibold transition-colors ${
                      currentStep >= step.num ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < 4 && (
                  <div className="flex-1 mx-3 mt-[-16px]">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        currentStep > step.num
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
                          : 'bg-slate-200'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-8 mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start gap-3 animate-slideDown">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {/* Step 1: Tour Selection */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Choose your tour location
                </h3>
                <p className="text-slate-500 text-sm">
                  Select where you&apos;d like to book your experience
                </p>
              </div>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                  <p className="text-slate-500 text-sm">Loading tour locations...</p>
                </div>
              ) : tours.length === 0 ? (
                <div className="text-center py-16 px-6 bg-slate-50 rounded-2xl">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium">
                    No tour locations available at this time.
                  </p>
                  <p className="text-slate-400 text-sm mt-1">Please check back later.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Fly Me to You - Special Card */}
                  <div
                    className={`rounded-2xl transition-all duration-300 border-2 bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg ${
                      selectedTour?.id === 'fly-to-you'
                        ? 'border-purple-600 shadow-purple-500/50 scale-[1.02]'
                        : 'border-purple-400 hover:border-purple-500 hover:shadow-xl hover:scale-[1.01]'
                    }`}
                  >
                    <button
                      onClick={() =>
                        setSelectedTour(
                          selectedTour?.id === 'fly-to-you'
                            ? null
                            : {
                                id: 'fly-to-you',
                                city: 'Your Location',
                                stateProvince: '',
                                country: 'Custom',
                                availableFrom: new Date().toISOString().split('T')[0],
                                availableUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                                  .toISOString()
                                  .split('T')[0],
                                daysAvailable: 365,
                              }
                        )
                      }
                      className="w-full p-6 text-left group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Plane className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-white mb-1 group-hover:scale-105 transition-transform">
                              Fly Me to You
                            </h4>
                            <p className="text-sm text-purple-100">
                              I&apos;ll come to your location
                            </p>
                          </div>
                        </div>
                        <div
                          className={`flex-shrink-0 ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            selectedTour?.id === 'fly-to-you'
                              ? 'bg-white scale-110'
                              : 'bg-white/20 group-hover:bg-white/30'
                          }`}
                        >
                          {selectedTour?.id === 'fly-to-you' ? (
                            <CheckCircle className="w-6 h-6 text-purple-600" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-white" />
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-purple-100">
                        <p>Book a personalized session at your preferred location</p>
                      </div>
                    </button>
                  </div>

                  {/* Regular Tour Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tours.map((tour) => (
                      <div
                        key={tour.id}
                        className={`rounded-2xl transition-all duration-300 border-2 ${
                          selectedTour?.id === tour.id
                            ? 'border-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg shadow-indigo-200/50'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                        }`}
                      >
                        <button
                          onClick={() =>
                            setSelectedTour(selectedTour?.id === tour.id ? null : tour)
                          }
                          className="w-full p-6 text-left group"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                {tour.city}, {tour.stateProvince}
                              </h4>
                              <p className="text-sm text-slate-500">{tour.country}</p>
                            </div>
                            <div
                              className={`flex-shrink-0 ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                selectedTour?.id === tour.id
                                  ? 'bg-indigo-600 scale-110'
                                  : 'bg-slate-100 group-hover:bg-slate-200'
                              }`}
                            >
                              {selectedTour?.id === tour.id ? (
                                <CheckCircle className="w-6 h-6 text-white" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-slate-400" />
                              )}
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-slate-700">
                              <Calendar className="w-4 h-4 text-indigo-600" />
                              <span>
                                {new Date(tour.availableFrom).toLocaleDateString()} -{' '}
                                {new Date(tour.availableUntil).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="px-3 py-1.5 bg-slate-100 rounded-lg inline-block font-medium text-slate-700">
                              {tour.daysAvailable} days available
                            </div>
                          </div>
                        </button>

                        {/* Expanded Date Selection - Shown when tour is selected */}
                        {selectedTour?.id === tour.id && (
                          <div className="px-6 pb-6 pt-2 border-t border-indigo-200 animate-fadeIn">
                            <div className="mb-3">
                              <h5 className="text-sm font-bold text-indigo-900 mb-1">
                                Select a date
                              </h5>
                              <p className="text-xs text-slate-500">
                                Choose when you&apos;d like to visit
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                              {(() => {
                                const dates = [];
                                const start = new Date(tour.availableFrom);
                                const end = new Date(tour.availableUntil);

                                for (
                                  let d = new Date(start);
                                  d <= end;
                                  d.setDate(d.getDate() + 1)
                                ) {
                                  dates.push(new Date(d));
                                }

                                return dates.map((date) => {
                                  const dateStr = date.toISOString().split('T')[0];
                                  const isSelected = selectedDate === dateStr;
                                  const dayName = date.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                  });
                                  const monthDay = date.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  });

                                  return (
                                    <button
                                      key={dateStr}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedDate(dateStr);
                                        setSelectedTime(null);
                                        setTimeSlots([]);
                                      }}
                                      className={`p-3 rounded-lg text-left transition-all duration-200 border ${
                                        isSelected
                                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                                          : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <div
                                            className={`text-xs font-semibold ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}
                                          >
                                            {dayName}
                                          </div>
                                          <div
                                            className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}
                                          >
                                            {monthDay}
                                          </div>
                                        </div>
                                        {isSelected && (
                                          <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                                        )}
                                      </div>
                                    </button>
                                  );
                                });
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Service Selection */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Choose your service</h3>
                <p className="text-slate-500 text-sm">Select the experience that fits your needs</p>
              </div>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                  <p className="text-slate-500 text-sm">Loading services...</p>
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-16 px-6 bg-slate-50 rounded-2xl">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium">No services available at this time.</p>
                  <p className="text-slate-400 text-sm mt-1">Please check back later.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`w-full p-6 rounded-2xl text-left transition-all duration-300 border-2 group hover:scale-[1.02] ${
                        selectedService?.id === service.id
                          ? 'border-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg shadow-indigo-200/50'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                            {service.name}
                          </h4>
                          {service.description && (
                            <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                              {service.description}
                            </p>
                          )}
                          <div className="flex items-center gap-6 text-sm">
                            <span className="flex items-center gap-2 text-slate-700 font-medium">
                              <Clock className="w-4 h-4 text-slate-400" />
                              {service.duration} min
                            </span>
                            {service.price && (
                              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                {service.currency || '$'}
                                {Math.round(Number(service.price))}
                              </span>
                            )}
                          </div>
                        </div>
                        <div
                          className={`flex-shrink-0 ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            selectedService?.id === service.id
                              ? 'bg-indigo-600 scale-110'
                              : 'bg-slate-100 group-hover:bg-slate-200'
                          }`}
                        >
                          {selectedService?.id === service.id ? (
                            <CheckCircle className="w-6 h-6 text-white" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-400" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Date & Time Selection */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Pick your time</h3>
                <p className="text-slate-500 text-sm">
                  Select a date for your tour in {selectedTour?.city}
                </p>
              </div>

              {/* Date Selection - List of Available Dates */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                  </div>
                  Select Date
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {selectedTour &&
                    (() => {
                      const dates = [];
                      const start = new Date(selectedTour.availableFrom);
                      const end = new Date(selectedTour.availableUntil);

                      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                        dates.push(new Date(d));
                      }

                      return dates.map((date) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const isSelected = selectedDate === dateStr;
                        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                        const monthDay = date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        });

                        return (
                          <button
                            key={dateStr}
                            onClick={() => {
                              setSelectedDate(dateStr);
                              setSelectedTime(null);
                              setTimeSlots([]);
                            }}
                            className={`p-4 rounded-xl text-left transition-all duration-200 border-2 hover:scale-[1.02] ${
                              isSelected
                                ? 'border-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg shadow-indigo-200/50'
                                : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div
                                  className={`text-sm font-semibold ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`}
                                >
                                  {dayName}
                                </div>
                                <div
                                  className={`text-lg font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}
                                >
                                  {monthDay}
                                </div>
                              </div>
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  isSelected ? 'bg-indigo-600' : 'bg-slate-100'
                                }`}
                              >
                                {isSelected && <Calendar className="w-4 h-4 text-white" />}
                              </div>
                            </div>
                          </button>
                        );
                      });
                    })()}
                </div>
              </div>

              {/* Time Slot Selection */}
              {selectedDate && (
                <div className="animate-fadeIn">
                  <label className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-purple-600" />
                    </div>
                    Select Time
                  </label>
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-2xl">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-3" />
                      <p className="text-slate-500 text-sm">Loading time slots...</p>
                    </div>
                  ) : timeSlots.length === 0 ? (
                    <div className="text-center py-12 px-6 bg-slate-50 rounded-2xl">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-600 font-medium">No time slots available</p>
                      <p className="text-slate-400 text-sm mt-1">Try selecting a different date.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-3">
                      {timeSlots
                        .filter((slot) => slot.available)
                        .map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`p-4 rounded-xl text-center font-semibold transition-all duration-200 border-2 hover:scale-105 ${
                              selectedTime === slot.time
                                ? 'border-purple-600 bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:shadow-md'
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

          {/* Step 4: Extras Selection */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Add extras</h3>
                <p className="text-slate-500 text-sm">
                  Enhance your experience with additional services
                </p>
              </div>
              <div className="text-center py-16 px-6 bg-slate-50 rounded-2xl">
                <p className="text-slate-600 font-medium">No extras available</p>
                <p className="text-slate-400 text-sm mt-1">Continue to complete your booking</p>
              </div>
            </div>
          )}

          {/* Step 5: Client Information & Confirmation */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Your information</h3>
                <p className="text-slate-500 text-sm">Tell us a bit about yourself</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex text-sm font-semibold text-slate-700 mb-2 items-center gap-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    First Name
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={clientInfo.firstName}
                    onChange={(e) => setClientInfo({ ...clientInfo, firstName: e.target.value })}
                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="flex text-sm font-semibold text-slate-700 mb-2 items-center gap-2">
                    Last Name
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={clientInfo.lastName}
                    onChange={(e) => setClientInfo({ ...clientInfo, lastName: e.target.value })}
                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex text-sm font-semibold text-slate-700 mb-2 items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  Email Address
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={clientInfo.email}
                  onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="flex text-sm font-semibold text-slate-700 mb-2 items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-600" />
                  Phone Number
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={clientInfo.phone}
                  onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>

              <div>
                <label className="flex text-sm font-semibold text-slate-700 mb-2">
                  Additional Comments
                  <span className="text-slate-400 ml-2 font-normal text-xs">(Optional)</span>
                </label>
                <textarea
                  value={clientInfo.comments}
                  onChange={(e) => setClientInfo({ ...clientInfo, comments: e.target.value })}
                  rows={4}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-slate-900 placeholder:text-slate-400"
                  placeholder="Any special requests or notes..."
                />
              </div>

              {/* Booking Summary Card */}
              <div className="mt-8 p-6 bg-gradient-to-br from-slate-50 to-indigo-50 border-2 border-indigo-100 rounded-2xl">
                <h4 className="font-bold text-slate-900 mb-4 text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                  Booking Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-slate-600 font-medium">Service</span>
                    <span className="text-sm text-slate-900 font-semibold text-right">
                      {selectedService?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-slate-600 font-medium">Date</span>
                    <span className="text-sm text-slate-900 font-semibold text-right">
                      {selectedDate &&
                        new Date(selectedDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-slate-600 font-medium">Time</span>
                    <span className="text-sm text-slate-900 font-semibold">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-slate-600 font-medium">Duration</span>
                    <span className="text-sm text-slate-900 font-semibold">
                      {selectedService?.duration} minutes
                    </span>
                  </div>
                  {selectedService?.price && (
                    <>
                      <div className="border-t border-indigo-200 pt-3 mt-3" />
                      <div className="flex justify-between items-center">
                        <span className="text-base text-slate-700 font-bold">Total</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {selectedService.currency || '$'}
                          {selectedService.price}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Success/Confirmation Screen */}
          {currentStep === 6 && (
            <div className="text-center py-12 animate-fadeIn">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30 animate-bounce-in">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-3">You&apos;re all set!</h3>
                <p className="text-slate-600 text-lg mb-2">Your booking has been confirmed</p>
                {bookingId && (
                  <p className="text-sm text-slate-400 font-mono">Confirmation #{bookingId}</p>
                )}
              </div>

              <div className="max-w-md mx-auto mb-8">
                <div className="bg-gradient-to-br from-slate-50 to-indigo-50 border-2 border-indigo-100 rounded-2xl p-6 text-left">
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Booking Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-slate-600 font-medium">Service</span>
                      <span className="text-sm text-slate-900 font-semibold text-right max-w-[60%]">
                        {selectedService?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-slate-600 font-medium">Date</span>
                      <span className="text-sm text-slate-900 font-semibold text-right">
                        {selectedDate &&
                          new Date(selectedDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-slate-600 font-medium">Time</span>
                      <span className="text-sm text-slate-900 font-semibold">{selectedTime}</span>
                    </div>
                    <div className="border-t border-indigo-200 pt-3 mt-3" />
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-slate-600 font-medium">Name</span>
                      <span className="text-sm text-slate-900 font-semibold text-right">
                        {clientInfo.firstName} {clientInfo.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-slate-600 font-medium">Email</span>
                      <span className="text-sm text-slate-900 font-semibold text-right break-all">
                        {clientInfo.email}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-slate-600 font-medium">Phone</span>
                      <span className="text-sm text-slate-900 font-semibold">
                        {clientInfo.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="max-w-md mx-auto mb-8">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-left">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900 font-medium">Confirmation email sent</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Check your inbox at <span className="font-semibold">{clientInfo.email}</span>{' '}
                      for all the details
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-8 py-4 rounded-xl text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-2xl shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {currentStep < 4 && (
          <div className="p-8 border-t border-slate-200 flex justify-between items-center bg-white/50 backdrop-blur-sm">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                currentStep === 1
                  ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-md hover:scale-105'
              }`}
            >
              <span className="text-xl">←</span>
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={
                loading ||
                (currentStep === 1 && !selectedTour) ||
                (currentStep === 2 && !selectedService) ||
                (currentStep === 3 && (!selectedDate || !selectedTime))
              }
              className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-white ${
                loading ||
                (currentStep === 1 && !selectedTour) ||
                (currentStep === 2 && !selectedService) ||
                (currentStep === 3 && (!selectedDate || !selectedTime))
                  ? 'opacity-50 cursor-not-allowed bg-slate-400'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl hover:scale-105 shadow-lg shadow-indigo-500/30'
              }`}
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {currentStep === 5 ? 'Confirm Booking' : 'Continue'}
              {!loading && <span className="text-xl">→</span>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
