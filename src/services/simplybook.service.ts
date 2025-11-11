// SimplyBook.me API Service
// Full API integration using JSON-RPC 2.0

import axios from 'axios';

const LOGIN_API_URL = 'https://user-api.simplybook.me/login';
const USER_API_URL = 'https://user-api.simplybook.me';

export interface SimplybookConfig {
  company: string;
  apiKey: string;
  secretKey: string;
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
  private rpcId = 1;

  constructor() {
    this.config = {
      company: import.meta.env.VITE_SIMPLYBOOK_COMPANY || '',
      apiKey: import.meta.env.VITE_SIMPLYBOOK_API_KEY || '',
      secretKey: import.meta.env.VITE_SIMPLYBOOK_SECRET_KEY || '',
    };
  }

  /**
   * Make a JSON-RPC 2.0 call
   */
  private async rpcCall(method: string, params: unknown[] = []): Promise<unknown> {
    const token = await this.getToken();
    
    try {
      console.log(`Making RPC call: ${method}`, { params, url: `${USER_API_URL}/${token}` });
      
      const response = await axios.post(`${USER_API_URL}/${token}`, {
        jsonrpc: '2.0',
        method,
        params,
        id: this.rpcId++,
      });

      console.log(`RPC response for ${method}:`, response.data);

      if (response.data.error) {
        console.error(`RPC error for ${method}:`, response.data.error);
        throw new Error(response.data.error.message || 'RPC call failed');
      }

      return response.data.result;
    } catch (error) {
      console.error(`RPC call failed (${method}):`, error);
      if (axios.isAxiosError(error)) {
        console.error('Response:', error.response?.data);
        console.error('Status:', error.response?.status);
      }
      throw error;
    }
  }

  /**
   * Authenticate and get access token using SimplyBook.me JSON-RPC API
   */
  private async getToken(): Promise<string> {
    // Return cached token if still valid
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      // Get login token using API key
      const loginResponse = await axios.post(
        LOGIN_API_URL,
        {
          jsonrpc: '2.0',
          method: 'getToken',
          params: [this.config.company, this.config.apiKey],
          id: 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (loginResponse.data.error) {
        throw new Error(loginResponse.data.error.message || 'Authentication failed');
      }

      const loginToken = loginResponse.data.result;
      console.log('Login token obtained:', loginToken);

      // Try to get admin token using the login token
      try {
        const adminResponse = await axios.post(
          `${USER_API_URL}/${loginToken}`,
          {
            jsonrpc: '2.0',
            method: 'auth',
            params: [this.config.company, this.config.secretKey],
            id: 2,
          }
        );

        console.log('Admin auth response:', adminResponse.data);

        if (adminResponse.data.result) {
          this.token = adminResponse.data.result;
          console.log('Admin token obtained:', this.token);
        } else {
          // If admin token fails, use login token
          console.log('No admin token, using login token');
          this.token = loginToken;
        }
      } catch (adminError) {
        console.log('Admin token failed, using login token:', adminError);
        this.token = loginToken;
      }

      // Token typically valid for 24 hours, set expiry to 23 hours from now
      this.tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;

      return this.token as string;
    } catch (error) {
      console.error('SimplyBook.me authentication failed:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response data:', error.response.data);
      }
      throw new Error('Failed to authenticate with booking system');
    }
  }

  /**
   * Get all available services
   */
  async getServices(): Promise<ApiResponse<Service[]>> {
    try {
      // Try different method names that SimplyBook.me might use
      let result;
      try {
        result = await this.rpcCall('getEventList') as Record<string, unknown>;
      } catch {
        console.log('getEventList failed, trying getServices...');
        try {
          result = await this.rpcCall('getServices') as Record<string, unknown>;
        } catch {
          console.log('getServices failed, trying getActiveServices...');
          result = await this.rpcCall('getActiveServices') as Record<string, unknown>;
        }
      }

      console.log('Services result:', result);
      
      const services: Service[] = Object.entries(result).map(([id, service]: [string, unknown]) => {
        const s = service as Record<string, unknown>;
        return {
          id,
          name: String(s.name || ''),
          description: String(s.description || ''),
          duration: Number(s.duration || 0),
          price: Number(s.price || 0),
          currency: String(s.currency || 'USD'),
          is_active: Boolean(s.is_visible),
          picture: s.picture as string | undefined,
        };
      });
      
      return {
        success: true,
        data: services,
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
      const services = await this.getServices();
      if (!services.success || !services.data) {
        throw new Error('Failed to load services');
      }
      
      const service = services.data.find(s => s.id === serviceId);
      if (!service) {
        throw new Error('Service not found');
      }

      return {
        success: true,
        data: service,
      };
    } catch (error) {
      console.error('Failed to fetch service details:', error);
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
      const result = await this.rpcCall('getUnitList') as Record<string, unknown>[];
      const providers: Provider[] = Object.entries(result).map(([id, provider]: [string, unknown]) => {
        const p = provider as Record<string, unknown>;
        return {
          id,
          name: String(p.name || ''),
          description: String(p.description || ''),
          picture: p.picture as string | undefined,
          is_active: Boolean(p.is_visible),
        };
      });

      return {
        success: true,
        data: providers,
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
      const params = [serviceId, providerId || null, fromDate || null, toDate || null];
      const result = await this.rpcCall('getFirstWorkingDate', params) as string[];

      return {
        success: true,
        data: result || [],
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
      const params = [serviceId, date, providerId || null];
      const result = await this.rpcCall('getStartTimeMatrix', params) as Record<string, string[]>;

      const timeSlots: TimeSlot[] = [];
      for (const [time, slots] of Object.entries(result)) {
        timeSlots.push({
          time,
          datetime: `${date}T${time}:00`,
          is_available: slots.length > 0,
        });
      }

      return {
        success: true,
        data: timeSlots,
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
      const params = [
        bookingData.service_id,
        bookingData.provider_id,
        `${bookingData.date} ${bookingData.time}`,
        bookingData.client.name,
        bookingData.client.email,
        bookingData.client.phone,
        bookingData.additional_fields || {},
      ];
      
      const result = await this.rpcCall('book', params) as string;

      return {
        success: true,
        data: {
          id: result,
          service_id: bookingData.service_id,
          provider_id: bookingData.provider_id,
          client_id: '',
          start_datetime: `${bookingData.date} ${bookingData.time}`,
          end_datetime: '',
          status: 'confirmed',
          price: 0,
          currency: 'USD',
        },
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
      const result = await this.rpcCall('getBookingDetails', [bookingId]) as Record<string, unknown>;

      return {
        success: true,
        data: {
          id: bookingId,
          service_id: String(result.event_id || ''),
          provider_id: String(result.unit_id || ''),
          client_id: String(result.client_id || ''),
          start_datetime: String(result.start_date_time || ''),
          end_datetime: String(result.end_date_time || ''),
          status: result.status as 'pending' | 'confirmed' | 'cancelled' || 'confirmed',
          price: Number(result.price || 0),
          currency: String(result.currency || 'USD'),
        },
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
      await this.rpcCall('cancelBooking', [bookingId]);
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
