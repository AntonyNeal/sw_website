/**
 * Booking System Type Definitions
 * Comprehensive types for calendar booking modal component
 */

// ============================================================================
// Provider Types
// ============================================================================

export interface Provider {
  id: string;
  name: string;
  image?: string;
  specialty?: string;
  isVerified?: boolean;
  verificationBadges?: Badge[];
  timezone?: string;
}

export interface Badge {
  type: 'verified' | 'premium' | 'certified' | 'award';
  label: string;
  icon?: string;
}

// ============================================================================
// Availability Types
// ============================================================================

export interface AvailabilityData {
  date: string; // YYYY-MM-DD format
  availableSlots: number;
  isFullyBooked: boolean;
  isBlocked: boolean; // provider blocked this date
  dayOfWeek?: number; // 0 = Sunday, 6 = Saturday
}

export interface TimeSlot {
  startTime: string; // "09:00" format
  endTime: string; // "10:00" format
  isAvailable: boolean;
  isBooked: boolean;
  isBuffer?: boolean; // Buffer time not shown to users
}

// ============================================================================
// Booking Details Types
// ============================================================================

export interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  notes?: string;
  agreedToTerms: boolean;
}

export interface BookingDetails {
  providerId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "09:00"
  endTime: string; // "11:00"
  duration: number; // hours
  clientInfo: ClientInfo;
}

export interface PricingBreakdown {
  serviceHourlyRate: number;
  serviceDuration: number; // hours
  serviceFeeTotal: number; // rate * duration
  platformFeePercentage: number; // e.g., 15 for 15%
  platformFeeAmount: number;
  totalPlatformPayment: number;
  totalServiceFee: number; // Paid to provider
  currency?: string; // 'USD', 'EUR', etc.
}

// ============================================================================
// Payment Types
// ============================================================================

export type PaymentMethod = 'credit_card' | 'crypto' | 'bank_transfer';

export type CreditCardProcessor = 'ccbill' | 'segpay' | 'backup';
export type CryptoType = 'usdt_trc20' | 'bitcoin' | 'ethereum' | 'monero';

export interface PaymentOption {
  id: string;
  method: PaymentMethod;
  name: string;
  icon: string;
  processingTime: string;
  isAvailable: boolean;
  description?: string;
}

export interface CreditCardOption {
  processor: CreditCardProcessor;
  label: string;
  processingTime: string;
  isAvailable: boolean;
}

export interface CryptoOption {
  currency: CryptoType;
  label: string;
  processingTime: string;
  isAvailable: boolean;
}

export interface PaymentRequest {
  bookingId?: string;
  providerId: string;
  bookingDetails: BookingDetails;
  paymentMethod: PaymentMethod;
  paymentProvider: string; // 'ccbill', 'segpay', 'nowpayments', etc.
  amount: number;
  currency: string;
  timestamp?: string;
}

export interface PaymentResult {
  success: boolean;
  bookingId: string;
  bookingReference: string;
  transactionId?: string;
  amount: number;
  method: PaymentMethod;
  status: 'processing' | 'completed' | 'failed' | 'pending';
  message?: string;
  error?: string;
  nextSteps?: string[];
}

// ============================================================================
// Booking State Types
// ============================================================================

export type BookingStep = 1 | 2 | 3 | 4;

export interface BookingState {
  // Modal state
  isOpen: boolean;
  currentStep: BookingStep;

  // Calendar state
  selectedDate: Date | null;
  currentMonth: Date;
  availability: AvailabilityData[];
  isLoadingAvailability: boolean;

  // Time slot state
  selectedTime: string | null; // "09:00"
  duration: number; // hours (default 1)
  availableSlots: TimeSlot[];
  isLoadingSlots: boolean;

  // Form state
  clientInfo: ClientInfo;
  formErrors: Record<string, string>;

  // Payment state
  paymentMethod: PaymentMethod | null;
  paymentProvider: string | null;
  selectedCryptoType?: CryptoType;
  selectedCreditCardProcessor?: CreditCardProcessor;

  // Processing state
  isProcessingPayment: boolean;

  // Result state
  bookingConfirmed: boolean;
  bookingReference: string | null;
  paymentError: string | null;
}

export interface BookingContextType extends BookingState {
  // Calendar actions
  setCurrentMonth: (date: Date) => void;
  selectDate: (date: Date) => void;
  fetchAvailability: (month: number, year: number) => Promise<void>;

  // Time actions
  selectTime: (time: string) => void;
  setDuration: (hours: number) => void;
  fetchTimeSlots: (date: string, duration: number) => Promise<void>;

  // Form actions
  updateClientInfo: (info: Partial<ClientInfo>) => void;
  setFormError: (field: string, message: string) => void;
  clearFormError: (field: string) => void;
  validateForm: () => boolean;

  // Step navigation
  goToStep: (step: BookingStep) => void;
  nextStep: () => void;
  previousStep: () => void;

  // Payment actions
  selectPaymentMethod: (method: PaymentMethod) => void;
  selectPaymentProvider: (provider: string) => void;
  processPayment: () => Promise<void>;

  // Modal actions
  openModal: () => void;
  closeModal: () => void;
  resetBooking: () => void;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface BookingButtonProps {
  providerId: string;
  providerName: string;
  providerImage?: string;
  hourlyRate: number;
  platformFeePercentage: number;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  customText?: string;
  className?: string;
  onBookingStart?: () => void;
  onBookingComplete?: (bookingReference: string) => void;
}

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider;
  hourlyRate: number;
  platformFeePercentage: number;
  onBookingComplete?: (bookingReference: string) => void;
}

export interface CalendarViewProps {
  selectedDate: Date | null;
  currentMonth: Date;
  availability: AvailabilityData[];
  isLoading: boolean;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  timezone?: string;
}

export interface TimeSlotSelectorProps {
  selectedDate: Date;
  selectedTime: string | null;
  duration: number;
  availableSlots: TimeSlot[];
  isLoading: boolean;
  onTimeSelect: (time: string) => void;
  onDurationChange: (duration: number) => void;
  onBack: () => void;
  timezone?: string;
  availableDurations?: number[];
}

export interface BookingSummaryProps {
  provider: Provider;
  selectedDate: Date;
  selectedTime: string;
  duration: number;
  hourlyRate: number;
  platformFeePercentage: number;
  clientInfo: ClientInfo;
  formErrors: Record<string, string>;
  onClientInfoChange: (info: Partial<ClientInfo>) => void;
  onValidationError: (field: string, message: string) => void;
  onClearError: (field: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export interface PaymentSelectorProps {
  selectedMethod: PaymentMethod | null;
  selectedProvider: string | null;
  selectedCrypto?: CryptoType;
  selectedCreditCardProcessor?: CreditCardProcessor;
  onMethodSelect: (method: PaymentMethod) => void;
  onProviderSelect: (provider: string) => void;
  onCryptoSelect?: (crypto: CryptoType) => void;
  onCreditCardProcessorSelect?: (processor: CreditCardProcessor) => void;
  isProcessing: boolean;
  onConfirm: () => Promise<void>;
  onBack: () => void;
  amount: number;
  currency?: string;
}

export interface BookingConfirmationProps {
  success: boolean;
  bookingReference?: string;
  bookingDetails?: BookingDetails;
  errorMessage?: string;
  onViewDetails?: () => void;
  onBookAgain?: () => void;
  onClose: () => void;
}

export interface StepIndicatorProps {
  currentStep: BookingStep;
  totalSteps?: number;
  stepLabels?: string[];
  compact?: boolean;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface FetchAvailabilityRequest {
  providerId: string;
  month: number; // 1-12
  year: number;
}

export interface FetchAvailabilityResponse {
  success: boolean;
  data: AvailabilityData[];
  error?: string;
}

export interface FetchTimeSlotsRequest {
  providerId: string;
  date: string; // YYYY-MM-DD
  duration: number; // hours
}

export interface FetchTimeSlotsResponse {
  success: boolean;
  data: TimeSlot[];
  error?: string;
}

export interface CreateBookingRequest {
  providerId: string;
  date: string;
  startTime: string;
  duration: number;
  clientInfo: ClientInfo;
  paymentMethod: PaymentMethod;
  paymentProvider: string;
}

export interface CreateBookingResponse {
  success: boolean;
  bookingId: string;
  bookingReference: string;
  status: 'pending' | 'confirmed';
  message?: string;
  error?: string;
}

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export interface FormValidationRules {
  name?: {
    required: boolean;
    minLength?: number;
    maxLength?: number;
  };
  email?: {
    required: boolean;
    pattern?: RegExp;
  };
  phone?: {
    required: boolean;
    pattern?: RegExp;
    minLength?: number;
  };
  notes?: {
    maxLength?: number;
  };
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface BookingConfig {
  minAdvanceHours?: number; // Minimum hours to book in advance
  maxAdvanceMonths?: number; // Maximum months to book in advance
  slotDurationMinutes?: number; // 30, 60, etc.
  availableDurations?: number[]; // Hours (1, 2, 3, etc.)
  timeZone?: string;
  bufferMinutes?: number; // Buffer between bookings
  currency?: string;
  paymentMethods?: PaymentMethod[];
  creditCardProcessors?: CreditCardProcessor[];
  cryptoCurrencies?: CryptoType[];
  allowBackdropClick?: boolean;
  allowEscapeClose?: boolean;
  showPrivacyNotice?: boolean;
  requiredFields?: string[];
}

// ============================================================================
// Mock Data Types
// ============================================================================

export interface MockProviderData {
  provider: Provider;
  hourlyRate: number;
  platformFeePercentage: number;
  availability: AvailabilityData[];
  timeSlots: Record<string, TimeSlot[]>; // date string -> slots
}
