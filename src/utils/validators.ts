/**
 * Validation Utilities
 * Form validation, email, phone, and booking data validation
 */

import type { ClientInfo, ValidationResult, FormValidationRules } from '../types/booking.types';

// ============================================================================
// Regex Patterns
// ============================================================================

export const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\d\s+()\\-]+$/,
  phoneInternational: /^\+?[\d\s()\\-]{10,}$/,
  phoneUS: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  name: /^[a-zA-Z\s'-]{2,}$/,
  url: /^https?:\/\/.+/,
};

// ============================================================================
// Email Validation
// ============================================================================

export function validateEmail(email: string): boolean {
  return PATTERNS.email.test(email.trim());
}

export function validateEmailRequired(email: string): string {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  if (!validateEmail(email)) {
    return 'Please enter a valid email address';
  }
  return '';
}

// ============================================================================
// Phone Validation
// ============================================================================

export function validatePhone(phone: string, format: 'us' | 'intl' = 'intl'): boolean {
  const pattern = format === 'us' ? PATTERNS.phoneUS : PATTERNS.phoneInternational;
  return pattern.test(phone.trim());
}

export function validatePhoneRequired(phone: string): string {
  if (!phone || !phone.trim()) {
    return 'Phone number is required';
  }
  if (!validatePhone(phone)) {
    return 'Please enter a valid phone number';
  }
  return '';
}

// Clean phone number (remove spaces, dashes, parentheses)
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[\s()\\-]/g, '');
}

// Format phone number for display
export function formatPhoneDisplay(phone: string): string {
  const cleaned = cleanPhoneNumber(phone);

  // US format: (123) 456-7890
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  // International format with country code
  if (cleaned.startsWith('+')) {
    const countryCode = cleaned.slice(0, 3);
    const rest = cleaned.slice(3);
    return `${countryCode} ${rest.slice(0, 3)} ${rest.slice(3)}`;
  }

  return phone;
}

// ============================================================================
// Name Validation
// ============================================================================

export function validateName(name: string): boolean {
  return name.trim().length >= 2;
}

export function validateNameRequired(name: string): string {
  if (!name || !name.trim()) {
    return 'Name is required';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }
  if (name.trim().length > 100) {
    return 'Name must be less than 100 characters';
  }
  return '';
}

// ============================================================================
// URL Validation
// ============================================================================

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// Text Validation
// ============================================================================

export function validateMinLength(text: string, minLength: number): boolean {
  return text.trim().length >= minLength;
}

export function validateMaxLength(text: string, maxLength: number): boolean {
  return text.trim().length <= maxLength;
}

export function validateLength(text: string, minLength: number, maxLength: number): string {
  const trimmed = text.trim();

  if (trimmed.length < minLength) {
    return `Must be at least ${minLength} characters`;
  }

  if (trimmed.length > maxLength) {
    return `Must be no more than ${maxLength} characters`;
  }

  return '';
}

export function validateNotEmpty(value: string): string {
  if (!value || !value.trim()) {
    return 'This field is required';
  }
  return '';
}

// ============================================================================
// Client Info Validation
// ============================================================================

export function validateClientInfo(clientInfo: ClientInfo): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate name
  const nameError = validateNameRequired(clientInfo.name);
  if (nameError) {
    errors.name = nameError;
  }

  // Validate email
  const emailError = validateEmailRequired(clientInfo.email);
  if (emailError) {
    errors.email = emailError;
  }

  // Validate phone
  const phoneError = validatePhoneRequired(clientInfo.phone);
  if (phoneError) {
    errors.phone = phoneError;
  }

  // Validate notes if present
  if (clientInfo.notes && clientInfo.notes.length > 500) {
    errors.notes = 'Notes must be no more than 500 characters';
  }

  // Validate terms agreement
  if (!clientInfo.agreedToTerms) {
    errors.agreedToTerms = 'You must agree to terms and conditions';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================================================
// Form Validation with Rules
// ============================================================================

export interface FieldValidation {
  field: string;
  value: unknown;
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: unknown) => boolean;
    customMessage?: string;
  };
}

export function validateField(validation: FieldValidation): string {
  const { value, rules } = validation;
  const stringValue = String(value || '').trim();

  // Required validation
  if (rules.required && !stringValue) {
    return `${validation.field} is required`;
  }

  if (!stringValue) {
    return '';
  }

  // Min length validation
  if (rules.minLength && stringValue.length < rules.minLength) {
    return `${validation.field} must be at least ${rules.minLength} characters`;
  }

  // Max length validation
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    return `${validation.field} must be no more than ${rules.maxLength} characters`;
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    return `${validation.field} format is invalid`;
  }

  // Custom validation
  if (rules.custom && !rules.custom(value)) {
    return rules.customMessage || `${validation.field} is invalid`;
  }

  return '';
}

export function validateForm(
  data: Record<string, unknown>,
  rules: FormValidationRules
): ValidationResult {
  const errors: Record<string, string> = {};

  Object.entries(rules).forEach(([field, fieldRules]) => {
    if (!fieldRules) return;

    const value = data[field];
    const error = validateField({
      field: field.charAt(0).toUpperCase() + field.slice(1),
      value,
      rules: fieldRules as FieldValidation['rules'],
    });

    if (error) {
      errors[field] = error;
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================================================
// Booking Data Validation
// ============================================================================

export function validateBookingDate(date: Date): string {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1); // Can't book for today

  if (date < minDate) {
    return 'Please select a future date';
  }

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 12); // Can't book more than 12 months out

  if (date > maxDate) {
    return 'Can only book up to 12 months in advance';
  }

  return '';
}

export function validateBookingTime(timeString: string): string {
  if (!timeString) {
    return 'Time is required';
  }

  const timePattern = /^\d{2}:\d{2}$/;
  if (!timePattern.test(timeString)) {
    return 'Invalid time format';
  }

  const [hours, minutes] = timeString.split(':').map(Number);

  if (hours < 0 || hours > 23) {
    return 'Invalid hour';
  }

  if (minutes < 0 || minutes > 59) {
    return 'Invalid minutes';
  }

  return '';
}

export function validateDuration(duration: number): string {
  if (!duration || duration <= 0) {
    return 'Duration must be greater than 0';
  }

  if (duration > 24) {
    return 'Duration cannot exceed 24 hours';
  }

  return '';
}

// ============================================================================
// Payment Validation
// ============================================================================

export function validateAmount(amount: number): string {
  if (amount <= 0) {
    return 'Amount must be greater than 0';
  }

  if (!Number.isFinite(amount)) {
    return 'Invalid amount';
  }

  return '';
}

export function validateCreditCardNumber(cardNumber: string): boolean {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');

  // Basic length check
  if (!/^\d{13,19}$/.test(cleaned)) {
    return false;
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

export function validateCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv.trim());
}

export function validateExpiryDate(month: number, year: number): boolean {
  if (month < 1 || month > 12) {
    return false;
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  if (year < currentYear) {
    return false;
  }

  if (year === currentYear && month < currentMonth) {
    return false;
  }

  return true;
}

// ============================================================================
// Sanitization
// ============================================================================

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 500); // Limit length
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function sanitizeName(name: string): string {
  return sanitizeInput(name)
    .replace(/[^a-zA-Z\s'-]/g, '') // Keep only letters, spaces, hyphens, apostrophes
    .trim();
}

// ============================================================================
// Conditional Validation
// ============================================================================

export function validateIfPresent(value: unknown, validator: (val: string) => boolean): boolean {
  if (!value) {
    return true;
  }

  return validator(String(value));
}

export function validateOneOfRequired(...values: unknown[]): boolean {
  return values.some((val) => val && String(val).trim());
}

// ============================================================================
// Debounced Validation
// ============================================================================

export function createDebouncedValidator(
  validator: (value: string) => string,
  delay: number = 300
): (value: string, callback: (error: string) => void) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (value: string, callback: (error: string) => void) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      const error = validator(value);
      callback(error);
    }, delay);
  };
}
