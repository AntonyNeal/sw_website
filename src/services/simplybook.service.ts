// SimplyBook.me API Service
// Full API integration for booking management

import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_SIMPLYBOOK_API_URL || 'https://user-api.simplybook.me';

export interface SimplybookConfig {
  company: string;
  apiKey: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  currency: string;
  is_active: boolean;
  picture?: string;
}

export interface Provider {
  id: string;
  name: string;
  description?: string;
  picture?: string;
  is_active: boolean;
}

export interface TimeSlot {
  time: string; // HH:mm format
  datetime: string; // ISO 8601 format
  is_available: boolean;
}

export interface BookingData {
  service_id: string;
  provider_id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  client: {
    name: string;
    email: string;
    phone: string;
  };
  additional_fields?: Record<string, unknown>;
}

export interface Booking {
  id: string;
  service_id: string;
  provider_id: string;
  client_id: string;
  start_datetime: string;
  end_datetime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  price: number;
  currency: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class SimplybookService {
  private config: SimplybookConfig;
  private token: string | null = null;
  private tokenExpiry: number | null = null;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.config = {
      company: import.meta.env.VITE_SIMPLYBOOK_COMPANY || '',
      apiKey: import.meta.env.VITE_SIMPLYBOOK_API_KEY || '',
    };

    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add authentication
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        if (config.url !== '/login') {
          const token = await this.getToken();
          config.headers['X-Company-Login'] = this.config.company;
          config.headers['X-Token'] = token;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, clear and retry
          this.token = null;
          this.tokenExpiry = null;

          const originalRequest = error.config;
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            const token = await this.getToken();
            originalRequest.headers['X-Token'] = token;
            return this.axiosInstance(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Authenticate and get access token
   */
  private async getToken(): Promise<string> {
    // Return cached token if still valid
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        company: this.config.company,
        login: this.config.apiKey,
      });

      this.token = response.data.token;
      // Token typically valid for 24 hours, set expiry to 23 hours from now
      this.tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;

      return this.token as string;
    } catch (error) {
      console.error('SimplyBook.me authentication failed:', error);
      throw new Error('Failed to authenticate with booking system');
    }
  }

  /**
   * Get all available services
   */
  async getServices(): Promise<ApiResponse<Service[]>> {
    try {
      const response = await this.axiosInstance.get('/admin/services');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Failed to fetch services:', error);
      return {
        success: false,
        error: 'Failed to load available services',
      };
    }
  }

  /**
   * Get service details by ID
   */
  async getService(serviceId: string): Promise<ApiResponse<Service>> {
    try {
      const response = await this.axiosInstance.get(`/admin/services/${serviceId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Failed to fetch service:', error);
      return {
        success: false,
        error: 'Failed to load service details',
      };
    }
  }

  /**
   * Get all providers (staff members)
   */
  async getProviders(): Promise<ApiResponse<Provider[]>> {
    try {
      const response = await this.axiosInstance.get('/admin/providers');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Failed to fetch providers:', error);
      return {
        success: false,
        error: 'Failed to load providers',
      };
    }
  }

  /**
   * Get available dates for a service
   */
  async getAvailableDates(
    serviceId: string,
    providerId?: string,
    fromDate?: string,
    toDate?: string
  ): Promise<ApiResponse<string[]>> {
    try {
      const params: Record<string, string> = {};
      if (providerId) params.provider_id = providerId;
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const response = await this.axiosInstance.get(
        `/admin/services/${serviceId}/available-dates`,
        { params }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Failed to fetch available dates:', error);
      return {
        success: false,
        error: 'Failed to load available dates',
      };
    }
  }

  /**
   * Get available time slots for a specific date and service
   */
  async getAvailableTimeSlots(
    serviceId: string,
    date: string,
    providerId?: string
  ): Promise<ApiResponse<TimeSlot[]>> {
    try {
      const params: Record<string, string> = { date };
      if (providerId) params.provider_id = providerId;

      const response = await this.axiosInstance.get(
        `/admin/services/${serviceId}/available-slots`,
        { params }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Failed to fetch available time slots:', error);
      return {
        success: false,
        error: 'Failed to load available time slots',
      };
    }
  }

  /**
   * Create a new booking
   */
  async createBooking(bookingData: BookingData): Promise<ApiResponse<Booking>> {
    try {
      const response = await this.axiosInstance.post('/admin/bookings', {
        service_id: bookingData.service_id,
        provider_id: bookingData.provider_id,
        start_date_time: `${bookingData.date} ${bookingData.time}`,
        client_name: bookingData.client.name,
        client_email: bookingData.client.email,
        client_phone: bookingData.client.phone,
        ...bookingData.additional_fields,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Failed to create booking:', error);
      return {
        success: false,
        error: 'Failed to create booking. Please try again.',
      };
    }
  }

  /**
   * Get booking details by ID
   */
  async getBooking(bookingId: string): Promise<ApiResponse<Booking>> {
    try {
      const response = await this.axiosInstance.get(`/admin/bookings/${bookingId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Failed to fetch booking:', error);
      return {
        success: false,
        error: 'Failed to load booking details',
      };
    }
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string): Promise<ApiResponse<boolean>> {
    try {
      await this.axiosInstance.delete(`/admin/bookings/${bookingId}`);
      return {
        success: true,
        data: true,
      };
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      return {
        success: false,
        error: 'Failed to cancel booking',
      };
    }
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return !!(this.config.company && this.config.apiKey);
  }

  /**
   * Get configuration status (for debugging)
   */
  getConfigStatus(): { configured: boolean; company: string; hasApiKey: boolean } {
    return {
      configured: this.isConfigured(),
      company: this.config.company,
      hasApiKey: !!this.config.apiKey,
    };
  }
}

// Export singleton instance
export const simplybookService = new SimplybookService();

// Export service class for testing
export { SimplybookService };
