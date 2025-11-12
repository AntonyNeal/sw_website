/**
 * SimplyBook.me Data Source
 * Handles all SimplyBook API interactions through the SDK
 */

import type { EnhancedApiClient } from '../enhancedClient';

export interface SimplybookService {
  id: string;
  name: string;
  duration: string;
  description: string;
  is_public: string;
  is_active: string;
  position: string;
  buffertime_before?: string;
  buffertime_after?: string;
  price?: string;
  currency?: string;
  picture?: string | null;
  picture_path?: string | null;
  unit_map?: Record<string, unknown>;
}

export interface SimplybookCompanyInfo {
  company: string;
  email: string;
  phone: string;
  city: string;
  country?: string;
  address?: string;
  description?: string;
  timezone: string;
  currency?: string;
  date_format?: string;
  time_format?: string;
  week_start?: string;
}

export interface SimplybookTimeSlot {
  time: string;
  datetime: string;
  available: boolean;
}

export interface SimplybookProvider {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  picture?: string | null;
  is_active: string;
  position: string;
}

export interface SimplybookBookingData {
  event_id: string | number;
  unit_id?: string | number;
  date: string;
  time: string;
  client: {
    name: string;
    email: string;
    phone: string;
  };
  fields?: Record<string, string | number>;
  comment?: string;
}

export interface SimplybookBookingResponse {
  id: string | number;
  booking_code: string;
  start_date: string;
  end_date: string;
  status: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_name: string;
  provider_name?: string;
}

export interface SimplybookIntakeField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  values?: string[];
  default_value?: string;
}

export const SimplybookDataSource = {
  /**
   * Get all services from SimplyBook
   */
  async getServices(this: { client: EnhancedApiClient }): Promise<SimplybookService[]> {
    const response = await this.client.get<Record<string, SimplybookService> | SimplybookService[]>('/simplybook/services');
    
    // Convert object to array if needed
    if (typeof response === 'object' && response !== null && !Array.isArray(response)) {
      return Object.values(response) as SimplybookService[];
    }
    
    return response as SimplybookService[];
  },

  /**
   * Get service details by ID
   */
  async getServiceById(
    this: { client: EnhancedApiClient },
    serviceId: string | number
  ): Promise<SimplybookService> {
    return this.client.get(`/simplybook/services/${serviceId}`);
  },

  /**
   * Get company information
   */
  async getCompanyInfo(this: { client: EnhancedApiClient }): Promise<SimplybookCompanyInfo> {
    return this.client.get('/simplybook/company');
  },

  /**
   * Get available time slots for a service on a specific date
   */
  async getTimeSlots(
    this: { client: EnhancedApiClient },
    serviceId: string | number,
    date: string,
    providerId?: string | number
  ): Promise<SimplybookTimeSlot[]> {
    const params: Record<string, string | number> = {
      service_id: serviceId,
      date,
    };
    
    if (providerId) {
      params.provider_id = providerId;
    }
    
    return this.client.get('/simplybook/timeslots', params);
  },

  /**
   * Get list of providers/staff
   */
  async getProviders(this: { client: EnhancedApiClient }): Promise<SimplybookProvider[]> {
    const response = await this.client.get<Record<string, SimplybookProvider> | SimplybookProvider[]>('/simplybook/providers');
    
    // Convert object to array if needed
    if (typeof response === 'object' && response !== null && !Array.isArray(response)) {
      return Object.values(response) as SimplybookProvider[];
    }
    
    return response as SimplybookProvider[];
  },

  /**
   * Get providers available for a specific service
   */
  async getProvidersForService(
    this: { client: EnhancedApiClient },
    serviceId: string | number
  ): Promise<SimplybookProvider[]> {
    return this.client.get(`/simplybook/services/${serviceId}/providers`);
  },

  /**
   * Create a new booking
   */
  async createBooking(
    this: { client: EnhancedApiClient },
    bookingData: SimplybookBookingData
  ): Promise<SimplybookBookingResponse> {
    return this.client.post('/simplybook/bookings', bookingData);
  },

  /**
   * Get booking details by ID
   */
  async getBookingById(
    this: { client: EnhancedApiClient },
    bookingId: string | number
  ): Promise<SimplybookBookingResponse> {
    return this.client.get(`/simplybook/bookings/${bookingId}`);
  },

  /**
   * Get booking details by booking code
   */
  async getBookingByCode(
    this: { client: EnhancedApiClient },
    bookingCode: string
  ): Promise<SimplybookBookingResponse> {
    return this.client.get(`/simplybook/bookings/code/${bookingCode}`);
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(
    this: { client: EnhancedApiClient },
    bookingId: string | number
  ): Promise<{ success: boolean; message: string }> {
    return this.client.delete(`/simplybook/bookings/${bookingId}`);
  },

  /**
   * Get intake form fields for a service
   */
  async getIntakeFormFields(
    this: { client: EnhancedApiClient },
    serviceId: string | number
  ): Promise<SimplybookIntakeField[]> {
    return this.client.get(`/simplybook/services/${serviceId}/fields`);
  },

  /**
   * Get available dates for a service within a date range
   */
  async getAvailableDates(
    this: { client: EnhancedApiClient },
    serviceId: string | number,
    startDate: string,
    endDate: string,
    providerId?: string | number
  ): Promise<string[]> {
    const params: Record<string, string | number> = {
      service_id: serviceId,
      from: startDate,
      to: endDate,
    };
    
    if (providerId) {
      params.provider_id = providerId;
    }
    
    return this.client.get('/simplybook/available-dates', params);
  },

  /**
   * Check if a specific time is available
   */
  async checkTimeAvailability(
    this: { client: EnhancedApiClient },
    serviceId: string | number,
    datetime: string,
    providerId?: string | number
  ): Promise<{ available: boolean; reason?: string }> {
    const params: Record<string, string | number> = {
      service_id: serviceId,
      datetime,
    };
    
    if (providerId) {
      params.provider_id = providerId;
    }
    
    return this.client.get('/simplybook/check-availability', params);
  },

  /**
   * Get company parameters (timezone, date format, etc.)
   */
  async getCompanyParam(
    this: { client: EnhancedApiClient },
    param: string
  ): Promise<string | number | boolean> {
    return this.client.get(`/simplybook/company/param/${param}`);
  },

  /**
   * Get bookings for a specific date range
   */
  async getBookings(
    this: { client: EnhancedApiClient },
    startDate: string,
    endDate: string
  ): Promise<SimplybookBookingResponse[]> {
    const params = {
      from: startDate,
      to: endDate,
    };
    
    return this.client.get('/simplybook/bookings', params);
  },
};
