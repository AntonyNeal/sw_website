/**
 * Date Helper Functions
 * Utilities for date manipulation and formatting in booking system
 */

/**
 * Get the first day of the month
 */
export function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Get the last day of the month
 */
export function getLastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Get number of days in month
 */
export function getDaysInMonth(date: Date): number {
  return getLastDayOfMonth(date).getDate();
}

/**
 * Get all days in month as array of dates
 */
export function getDaysOfMonth(date: Date): Date[] {
  const days: Date[] = [];
  const firstDay = getFirstDayOfMonth(date);
  const lastDay = getLastDayOfMonth(date);

  for (let i = firstDay.getDate(); i <= lastDay.getDate(); i++) {
    days.push(new Date(date.getFullYear(), date.getMonth(), i));
  }

  return days;
}

/**
 * Get calendar grid (including previous/next month days)
 * Returns array of dates that make a complete calendar grid
 */
export function getCalendarGrid(date: Date): Date[] {
  const days: Date[] = [];
  const firstDay = getFirstDayOfMonth(date);
  const lastDay = getLastDayOfMonth(date);
  const startingDayOfWeek = firstDay.getDay();

  // Add previous month's days
  const prevMonthLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(date.getFullYear(), date.getMonth() - 1, prevMonthLastDay - i));
  }

  // Add current month's days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(date.getFullYear(), date.getMonth(), i));
  }

  // Add next month's days to complete grid
  const totalDays = days.length;
  const remainingDays = 42 - totalDays; // 6 weeks * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(date.getFullYear(), date.getMonth() + 1, i));
  }

  return days;
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse date string from YYYY-MM-DD format
 */
export function parseDateISO(dateString: string): Date {
  return new Date(dateString + 'T00:00:00Z');
}

/**
 * Format date for display (e.g., "Tuesday, January 15, 2025")
 */
export function formatDateLong(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Format date for compact display (e.g., "Jan 15")
 */
export function formatDateShort(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Format date for calendar header (e.g., "January 2025")
 */
export function formatDateMonth(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Get day of week abbreviation (e.g., "Mon", "Tue")
 */
export function getDayOfWeekAbbr(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Get day of week name (e.g., "Monday", "Tuesday")
 */
export function getDayOfWeekName(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * Check if date is in the past
 */
export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Check if date is in the future
 */
export function isFutureDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Add days to date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add months to date
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Subtract months from date
 */
export function subtractMonths(date: Date, months: number): Date {
  return addMonths(date, -months);
}

/**
 * Get next available date (considering minimum advance hours)
 */
export function getNextAvailableDate(minAdvanceHours: number = 24): Date {
  const now = new Date();
  now.setHours(now.getHours() + minAdvanceHours);
  const date = new Date(now);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Get max bookable date (considering max advance months)
 */
export function getMaxBookableDate(maxAdvanceMonths: number = 12): Date {
  return addMonths(new Date(), maxAdvanceMonths);
}

/**
 * Parse time string "HH:MM" to minutes
 */
export function timeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes to time string "HH:MM"
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Format time for display (e.g., "9:00 AM")
 */
export function formatTime12Hour(timeString: string): string {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  return date.toLocaleTimeString('en-US', options);
}

/**
 * Format time range (e.g., "9:00 AM - 11:00 AM")
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  return `${formatTime12Hour(startTime)} - ${formatTime12Hour(endTime)}`;
}

/**
 * Generate time slots for a day
 * @param startHour - Start hour (0-23)
 * @param endHour - End hour (0-23)
 * @param intervalMinutes - Interval between slots (30, 60)
 */
export function generateTimeSlots(
  startHour: number,
  endHour: number,
  intervalMinutes: number = 60
): string[] {
  const slots: string[] = [];
  let currentHour = startHour;
  let currentMinute = 0;

  while (currentHour < endHour) {
    slots.push(`${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`);

    currentMinute += intervalMinutes;
    if (currentMinute >= 60) {
      currentMinute = 0;
      currentHour += 1;
    }
  }

  return slots;
}

/**
 * Group time slots by period (morning, afternoon, evening)
 */
export function groupSlotsByPeriod(slots: string[]): Record<string, string[]> {
  return slots.reduce(
    (acc, slot) => {
      const hour = parseInt(slot.split(':')[0], 10);

      if (hour < 12) {
        acc.morning.push(slot);
      } else if (hour < 17) {
        acc.afternoon.push(slot);
      } else {
        acc.evening.push(slot);
      }

      return acc;
    },
    { morning: [], afternoon: [], evening: [] } as Record<string, string[]>
  );
}

/**
 * Calculate end time given start time and duration
 */
export function calculateEndTime(startTime: string, durationHours: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationHours * 60;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;

  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

/**
 * Calculate duration between two times in hours
 */
export function calculateDuration(startTime: string, endTime: string): number {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  return (endMinutes - startMinutes) / 60;
}

/**
 * Get relative date text (e.g., "Today", "Tomorrow", "Jan 15")
 */
export function getRelativeDateText(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (isSameDay(date, today)) {
    return 'Today';
  }

  if (isSameDay(date, tomorrow)) {
    return 'Tomorrow';
  }

  return formatDateShort(date);
}

/**
 * Check if time is in the morning (5 AM - 12 PM)
 */
export function isMorning(timeString: string): boolean {
  const hour = parseInt(timeString.split(':')[0], 10);
  return hour >= 5 && hour < 12;
}

/**
 * Check if time is in the afternoon (12 PM - 5 PM)
 */
export function isAfternoon(timeString: string): boolean {
  const hour = parseInt(timeString.split(':')[0], 10);
  return hour >= 12 && hour < 17;
}

/**
 * Check if time is in the evening (5 PM - 11 PM)
 */
export function isEvening(timeString: string): boolean {
  const hour = parseInt(timeString.split(':')[0], 10);
  return hour >= 17 && hour < 23;
}
