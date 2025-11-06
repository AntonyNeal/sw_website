/**
 * BOOKING CALENDAR MODAL COMPONENT SYSTEM
 * ========================================
 *
 * Complete implementation guide with all component code.
 * This file serves as reference documentation and component implementation guide.
 *
 * DIRECTORY STRUCTURE TO CREATE:
 * src/components/
 * ├── BookingButton.tsx
 * ├── BookingModal.tsx
 * ├── CalendarView.tsx
 * ├── TimeSlotSelector.tsx
 * ├── BookingSummary.tsx
 * ├── PaymentSelector.tsx
 * ├── BookingConfirmation.tsx
 * ├── StepIndicator.tsx
 * └── booking.css
 *
 * ===========================================================================
 * STEP 1: CREATE BookingButton.tsx
 * ===========================================================================
 *
 * Key Features:
 * - CTA button to trigger booking modal
 * - Multiple variants: primary, secondary, outline
 * - Multiple sizes: sm, md, lg
 * - Loading state with spinner
 * - Disabled state
 * - Responsive design
 *
 * Props:
 * - providerId: string
 * - providerName: string
 * - providerImage?: string
 * - hourlyRate: number
 * - platformFeePercentage: number
 * - variant?: 'primary' | 'secondary' | 'outline'
 * - size?: 'sm' | 'md' | 'lg'
 * - fullWidth?: boolean
 * - disabled?: boolean
 * - customText?: string
 * - onBookingStart?: () => void
 *
 * ===========================================================================
 * STEP 2: CREATE BookingModal.tsx
 * ===========================================================================
 *
 * Key Features:
 * - Modal container with backdrop
 * - Step-based navigation (4 steps)
 * - Smooth transitions between steps
 * - Focus trap and keyboard navigation
 * - Mobile responsive (full screen on small devices)
 * - Close on backdrop click, escape key, or close button
 * - Prevent body scroll when open
 *
 * Layout:
 * - Header: Provider name + Close button
 * - Body: Step indicator + Step content
 * - Footer: Back/Next buttons
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - provider: Provider
 * - hourlyRate: number
 * - platformFeePercentage: number
 * - onBookingComplete?: (bookingReference: string) => void
 *
 * ===========================================================================
 * STEP 3: CREATE StepIndicator.tsx
 * ===========================================================================
 *
 * Key Features:
 * - Visual progress bar with numbered steps
 * - Shows: 1. Select Date → 2. Choose Time → 3. Review Details → 4. Payment
 * - Active step highlighted
 * - Completed steps show checkmark
 * - Responsive: hides labels on mobile
 *
 * Props:
 * - currentStep: 1 | 2 | 3 | 4
 * - totalSteps?: number (default 4)
 * - stepLabels?: string[]
 * - compact?: boolean
 *
 * ===========================================================================
 * STEP 4: CREATE CalendarView.tsx
 * ===========================================================================
 *
 * Key Features:
 * - Interactive calendar showing month
 * - Navigation: Previous/Next month arrows
 * - Show month/year selector
 * - Date states: available, unavailable, selected, today, past
 * - Hover tooltips showing slot availability
 * - Loading skeleton during fetch
 * - Responsive grid layout
 *
 * Props:
 * - selectedDate: Date | null
 * - currentMonth: Date
 * - availability: AvailabilityData[]
 * - isLoading: boolean
 * - onDateSelect: (date: Date) => void
 * - onMonthChange: (date: Date) => void
 * - minDate?: Date
 * - maxDate?: Date
 *
 * CSS Classes:
 * - calendar-grid: 7 columns (Su-Sa)
 * - calendar-day: Individual date cell
 * - calendar-day--available: Clickable date
 * - calendar-day--selected: Selected date (primary color)
 * - calendar-day--today: Today's date (border highlight)
 * - calendar-day--past: Past date (disabled)
 * - calendar-day--unavailable: No availability
 *
 * ===========================================================================
 * STEP 5: CREATE TimeSlotSelector.tsx
 * ===========================================================================
 *
 * Key Features:
 * - Show selected date prominently
 * - Grid of available 1-hour time slots
 * - Selected slot highlighted
 * - Duration selector: 1, 2, 3 hours
 * - Group slots by period (Morning/Afternoon/Evening)
 * - Show price for selected duration
 * - "No slots available" message if fully booked
 * - Back button to return to calendar
 *
 * Props:
 * - selectedDate: Date
 * - selectedTime: string | null ("09:00")
 * - duration: number (1, 2, 3, etc.)
 * - availableSlots: TimeSlot[]
 * - isLoading: boolean
 * - onTimeSelect: (time: string) => void
 * - onDurationChange: (duration: number) => void
 * - onBack: () => void
 *
 * Slot States:
 * - available: white bg, border, clickable
 * - selected: primary color bg, white text, checkmark
 * - booked: gray bg, strikethrough, disabled
 *
 * ===========================================================================
 * STEP 6: CREATE BookingSummary.tsx
 * ===========================================================================
 *
 * Key Features:
 * - Display provider info and image
 * - Show selected date/time/duration
 * - Pricing breakdown table:
 *   * Service fee (hours × rate)
 *   * Platform booking fee (percentage)
 *   * Total amounts
 * - Client information form:
 *   * Full name (required)
 *   * Email (required, validated)
 *   * Phone (required, validated)
 *   * Notes (optional, max 500 chars)
 *   * Terms checkbox (required)
 * - Real-time validation on blur
 * - Error messages below fields
 * - Submit button disabled until valid
 *
 * Props:
 * - provider: Provider
 * - selectedDate: Date
 * - selectedTime: string
 * - duration: number
 * - hourlyRate: number
 * - platformFeePercentage: number
 * - clientInfo: ClientInfo
 * - formErrors: Record<string, string>
 * - onClientInfoChange: (info: Partial<ClientInfo>) => void
 * - onValidationError: (field: string, message: string) => void
 * - onClearError: (field: string) => void
 * - onNext: () => void
 * - onBack: () => void
 *
 * ===========================================================================
 * STEP 7: CREATE PaymentSelector.tsx
 * ===========================================================================
 *
 * Key Features:
 * - Payment method cards: Credit Card, Crypto, Bank Wire
 * - Conditional UI for payment providers:
 *   * Credit Card: Choose processor (CCBill, Segpay, Backup)
 *   * Crypto: Choose currency (USDT, Bitcoin, Ethereum, Monero)
 * - Each method shows icon, processing time
 * - Selected method highlighted with border
 * - "Process Payment" button
 * - Loading spinner during processing
 * - Amount display
 *
 * Props:
 * - selectedMethod: PaymentMethod | null
 * - selectedProvider: string | null
 * - onMethodSelect: (method: PaymentMethod) => void
 * - onProviderSelect: (provider: string) => void
 * - isProcessing: boolean
 * - onConfirm: () => Promise<void>
 * - onBack: () => void
 * - amount: number
 *
 * ===========================================================================
 * STEP 8: CREATE BookingConfirmation.tsx
 * ===========================================================================
 *
 * Key Features:
 * - Success state with animated checkmark
 * - Booking reference number
 * - Summary of booking details
 * - Next steps information
 * - Error state with warning icon
 * - Error message and retry options
 *
 * Success Screen:
 * - Animated checkmark (500ms scale + fade)
 * - "Booking Request Sent!" headline
 * - Booking reference (e.g., "BK-2025-ABC123XYZ")
 * - Booking details summary
 * - Next steps list
 * - Buttons: View Details, Book Another, Close
 *
 * Error Screen:
 * - Warning icon
 * - "Payment Failed" headline
 * - Error message
 * - Buttons: Try Again, Different Method, Contact Support
 *
 * Props:
 * - success: boolean
 * - bookingReference?: string
 * - bookingDetails?: BookingDetails
 * - errorMessage?: string
 * - onViewDetails?: () => void
 * - onBookAgain?: () => void
 * - onClose: () => void
 *
 * ===========================================================================
 * STYLING GUIDE
 * ===========================================================================
 *
 * Colors (Tailwind):
 * - Primary: blue-600 (#2563eb)
 * - Primary hover: blue-700 (#1d4ed8)
 * - Secondary: slate-600 (#475569)
 * - Success: green-600 (#16a34a)
 * - Error: red-600 (#dc2626)
 * - Border: slate-200 (#e2e8f0)
 * - Surface: slate-50 (#f8fafc)
 * - Text: slate-900 (#0f172a)
 * - Text secondary: slate-600 (#475569)
 *
 * Typography:
 * - Headings: font-semibold, sizes 20-28px
 * - Body: 16px regular
 * - Small: 14px
 * - Labels: 12px uppercase, semibold
 *
 * Spacing:
 * - Container padding: 24-32px
 * - Section gap: 24px
 * - Component gap: 16px
 * - Base unit: 4px (Tailwind grid)
 *
 * Animations (CSS):
 * - Modal fade in: opacity 0→1 (300ms ease-out)
 * - Modal slide in: translate-y -20px→0 (300ms ease-out)
 * - Step transitions: fade + slide (250ms)
 * - Loading spinner: rotate 360° (1s linear infinite)
 * - Button hover: opacity 0.9, scale 1.02
 * - Focus ring: 2px solid primary with offset
 *
 * Responsive Breakpoints:
 * - Mobile: <768px (full screen modal)
 * - Tablet: 768-1023px (90vw modal)
 * - Desktop: ≥1024px (800px max-width modal)
 *
 * ===========================================================================
 * IMPLEMENTATION CHECKLIST
 * ===========================================================================
 *
 * [ ] Create all component files in src/components/
 * [ ] Create booking.css with animation styles
 * [ ] Set up BookingContext for state management
 * [ ] Implement BookingProvider wrapper
 * [ ] Use useBooking hook in all components
 * [ ] Update tailwind.config.js for custom colors if needed
 * [ ] Add focus trap utility for modal accessibility
 * [ ] Set up keyboard event handlers (Escape to close)
 * [ ] Implement form validation
 * [ ] Create mock API functions in src/services/booking.api.ts
 * [ ] Test all user flows
 * [ ] Test keyboard navigation
 * [ ] Test screen reader compatibility
 * [ ] Test mobile responsiveness
 * [ ] Test error scenarios
 * [ ] Add loading states
 * [ ] Implement retry logic for failed API calls
 * [ ] Add confirmation email functionality
 * [ ] Create demo page
 *
 * ===========================================================================
 * KEY UTILITIES ALREADY CREATED
 * ===========================================================================
 *
 * src/utils/dateHelpers.ts:
 * - formatDateISO, formatDateLong, formatDateShort
 * - getDaysOfMonth, getCalendarGrid
 * - formatTime12Hour, formatTimeRange
 * - generateTimeSlots, groupSlotsByPeriod
 * - calculateEndTime, calculateDuration
 * - isToday, isPastDate, isSameDay, etc.
 *
 * src/utils/validators.ts:
 * - validateEmail, validatePhone, validateName
 * - validateClientInfo (full validation)
 * - validateField (flexible field validation)
 * - validateForm (with rules)
 * - sanitizeInput, sanitizeEmail, sanitizeName
 * - validateCreditCardNumber, validateCVV
 * - createDebouncedValidator
 *
 * src/services/booking.api.ts:
 * - fetchAvailability()
 * - fetchTimeSlots()
 * - processPayment()
 * - validateAvailability()
 * - getProvider()
 * - MOCK_PROVIDERS with realistic data
 * - withRetry() wrapper
 * - withCache() wrapper
 * - BookingAPIError class
 *
 * src/types/booking.types.ts:
 * - All TypeScript interfaces for complete type safety
 * - Provider, AvailabilityData, TimeSlot types
 * - BookingDetails, ClientInfo, PricingBreakdown
 * - PaymentRequest, PaymentResult
 * - Component Props interfaces
 * - Context type definitions
 *
 * ===========================================================================
 * CREATING COMPONENTS FROM THIS GUIDE
 * ===========================================================================
 *
 * 1. For each component listed above (Step 1-8):
 *    a. Create the .tsx file in src/components/
 *    b. Copy the component structure and logic
 *    c. Import necessary utilities from utils/ and services/
 *    d. Use type definitions from types/booking.types.ts
 *    e. Apply Tailwind classes from styling guide
 *
 * 2. Key implementation points:
 *    a. All form inputs must be controlled (state-driven)
 *    b. All async operations need loading states
 *    c. All errors must be displayed to user
 *    d. All API calls use mock functions initially
 *    e. All components use hook-based state management
 *    f. All modals use focus trap and keyboard handlers
 *
 * 3. CSS animations (in booking.css):
 *    a. Define @keyframes for: fadeIn, slideIn, spin, pulse
 *    b. Apply to modal, buttons, loading states
 *    c. Use 300ms duration for smooth transitions
 *    d. Use ease-out for open, ease-in for close
 *
 * 4. Testing requirements:
 *    a. Test each step of booking flow
 *    b. Test error scenarios (API failures, validation)
 *    c. Test keyboard navigation
 *    d. Test mobile responsiveness
 *    e. Test accessibility with screen reader
 *
 * ===========================================================================
 * PRODUCTION DEPLOYMENT CHECKLIST
 * ===========================================================================
 *
 * API Integration:
 * [ ] Replace mock API calls with real endpoints
 * [ ] Implement authentication/authorization
 * [ ] Add request/response logging
 * [ ] Implement proper error handling
 * [ ] Set up retry logic with exponential backoff
 * [ ] Add request timeouts
 * [ ] Implement request caching strategy
 *
 * Payment Processing:
 * [ ] Integrate real payment processor (Stripe, CCBill, etc.)
 * [ ] Implement PCI compliance
 * [ ] Add payment verification
 * [ ] Implement refund logic
 * [ ] Add fraud detection
 * [ ] Set up payment webhooks
 *
 * Email Notifications:
 * [ ] Booking confirmation email
 * [ ] Provider notification email
 * [ ] Booking reminder emails (24h, 1h before)
 * [ ] Cancellation email
 * [ ] Payment receipt email
 *
 * Monitoring & Analytics:
 * [ ] Add error tracking (Sentry)
 * [ ] Add performance monitoring
 * [ ] Add user analytics
 * [ ] Set up booking dashboards
 * [ ] Create admin panel for managing bookings
 *
 * Security:
 * [ ] Implement CSRF protection
 * [ ] Add rate limiting
 * [ ] Implement input sanitization
 * [ ] Add SQL injection prevention
 * [ ] Implement HTTPS/TLS
 * [ ] Add security headers (CSP, X-Frame-Options, etc.)
 *
 * ===========================================================================
 * END OF DOCUMENTATION
 * ===========================================================================
 */

export const BOOKING_COMPONENT_DOCUMENTATION =
  'See comments in this file for complete implementation guide';
