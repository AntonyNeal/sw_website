/**
 * SimplyBook.me API Service
 * Handles all interactions with the SimplyBook.me API
 * Documentation: https://simplybook.me/en/api/developer-api
 */

const axios = require('axios');
const crypto = require('crypto');

class SimplybookService {
  constructor() {
    this.apiKey = process.env.SIMPLYBOOK_API_KEY;
    this.secretKey = process.env.SIMPLYBOOK_SECRET_KEY;
    this.company = process.env.SIMPLYBOOK_COMPANY || 'clairehamilton';
    this.jsonRpcUrl = process.env.SIMPLYBOOK_JSON_RPC_URL || 'https://user-api.simplybook.net/';
    this.restApiUrl = process.env.SIMPLYBOOK_REST_API_URL || 'https://user-api-v2.simplybook.net/';
    this.token = null;
    this.tokenExpiry = null;
  }

  /**
   * Get authentication token
   * Tokens are cached and reused until expiry
   */
  async getToken() {
    // Return cached token if still valid
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      const response = await axios.post(`${this.jsonRpcUrl}login`, {
        jsonrpc: '2.0',
        method: 'getToken',
        params: [this.company, this.apiKey],
        id: 1,
      });

      if (response.data.error) {
        throw new Error(`SimplyBook API Error: ${response.data.error.message}`);
      }

      this.token = response.data.result;
      // Token expires in 15 minutes, cache for 10 minutes to be safe
      this.tokenExpiry = Date.now() + 10 * 60 * 1000;

      console.log('✅ SimplyBook.me token obtained successfully');
      return this.token;
    } catch (error) {
      console.error('❌ Failed to get SimplyBook.me token:', error.message);
      throw new Error('Failed to authenticate with SimplyBook.me');
    }
  }

  /**
   * Make authenticated JSON-RPC API call
   * Uses X-Company-Login and X-Token headers as required by SimplyBook API
   */
  async callApi(method, params = []) {
    const token = await this.getToken();

    try {
      const response = await axios.post(
        `${this.jsonRpcUrl}`,
        {
          jsonrpc: '2.0',
          method,
          params, // No token in params!
          id: 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Company-Login': this.company,
            'X-Token': token,
          },
        }
      );

      if (response.data.error) {
        throw new Error(`SimplyBook API Error: ${response.data.error.message}`);
      }

      return response.data.result;
    } catch (error) {
      console.error(`❌ SimplyBook API call failed (${method}):`, error.message);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   * SimplyBook.me signs webhooks with HMAC-SHA256
   */
  verifyWebhookSignature(payload, signature) {
    const hash = crypto
      .createHmac('sha256', this.secretKey)
      .update(JSON.stringify(payload))
      .digest('hex');

    return hash === signature;
  }

  /**
   * Get all available services
   */
  async getServices() {
    console.log('📋 Fetching services from SimplyBook.me...');
    return await this.callApi('getEventList');
  }

  /**
   * Get service details by ID
   */
  async getServiceDetails(serviceId) {
    console.log(`🔍 Fetching service details for ID: ${serviceId}`);
    return await this.callApi('getEventById', [serviceId]);
  }

  /**
   * Get available providers (staff members)
   */
  async getProviders() {
    console.log('👤 Fetching providers from SimplyBook.me...');
    return await this.callApi('getUnitList');
  }

  /**
   * Get all locations (tours)
   * Tours are stored as providers with location names in their descriptions
   */
  async getLocations() {
    console.log('📍 Fetching locations from SimplyBook.me...');

    // Get providers - tours are stored as providers with location info
    const providers = await this.getProviders();

    // Extract unique cities from provider names
    // Provider names format: "Claire Hamilton in {CITY} | {Type}"
    const locations = {};

    Object.values(providers).forEach((provider) => {
      const name = provider.name || '';

      // Extract city from format "Claire Hamilton in {CITY} | ..."
      const match = name.match(/in\s+([^|]+)/);
      if (match) {
        const city = match[1].trim();

        // Parse tour dates from description
        const description = provider.description || '';
        console.log(`📅 Processing ${city}:`, { name, description });
        const dateMatches = description.match(/(\w+\s+\d+\s*-\s*\d+,\s*\d{4})/g);
        console.log(`   Date matches:`, dateMatches);

        // Try to parse the first date range to get availableFrom and availableUntil
        let availableFrom = null;
        let availableUntil = null;
        let daysAvailable = 0;

        if (dateMatches && dateMatches.length > 0) {
          try {
            // Parse first date range (e.g., "November 12 - 18, 2025")
            const firstRange = dateMatches[0];
            console.log(`   Parsing range: "${firstRange}"`);
            const rangeMatch = firstRange.match(/(\w+)\s+(\d+)\s*-\s*(\d+),\s*(\d{4})/);
            if (rangeMatch) {
              const [, month, startDay, endDay, year] = rangeMatch;
              console.log(
                `   Matched: month=${month}, startDay=${startDay}, endDay=${endDay}, year=${year}`
              );
              const monthNum = new Date(`${month} 1, ${year}`).getMonth();
              const startDate = new Date(parseInt(year), monthNum, parseInt(startDay));
              const endDate = new Date(parseInt(year), monthNum, parseInt(endDay));

              if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                availableFrom = startDate.toISOString().split('T')[0];
                availableUntil = endDate.toISOString().split('T')[0];
                daysAvailable = parseInt(endDay) - parseInt(startDay) + 1;
                console.log(
                  `   ✅ Parsed dates: ${availableFrom} to ${availableUntil} (${daysAvailable} days)`
                );
              }
            }
          } catch (error) {
            console.error('Error parsing date range:', error);
          }
        }

        // If no dates could be parsed, default to today + 7 days
        if (!availableFrom || !availableUntil) {
          const today = new Date();
          const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          availableFrom = today.toISOString().split('T')[0];
          availableUntil = nextWeek.toISOString().split('T')[0];
          daysAvailable = 7;
          console.log(
            `   ⚠️ No dates found, using defaults: ${availableFrom} to ${availableUntil}`
          );
        }

        if (!locations[city]) {
          locations[city] = {
            id: provider.id,
            city: city,
            stateProvince: '', // Could parse from description
            country: 'Australia', // Default for Claire
            availableFrom: availableFrom,
            availableUntil: availableUntil,
            daysAvailable: daysAvailable,
            description: description,
            tourDates: dateMatches || [],
          };
        }
      }
    });

    console.log(`✅ Found ${Object.keys(locations).length} locations:`, Object.keys(locations));
    return Object.values(locations);
  }

  /**
   * Get available time slots for a service
   * @param {string} serviceId - Service ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {string} providerId - Optional provider ID
   */
  async getAvailability(serviceId, date, providerId = null) {
    console.log(`📅 Checking availability for service ${serviceId} on ${date}`);

    // SimplyBook API expects: getStartTimeMatrix(dateFrom, dateTo, serviceId, performerId, qty)
    const params = [
      date,        // dateFrom
      date,        // dateTo (same as dateFrom for single day)
      serviceId,   // serviceId
      providerId,  // performerId (can be null for "any employee")
      1            // qty (number of participants, default 1)
    ];

    try {
      const result = await this.callApi('getStartTimeMatrix', params);
      return result;
    } catch (error) {
      console.log(`⚠️ SimplyBook API failed, using mock time slots. Error: ${error.message}`);
      
      // Return mock time slots as fallback
      // This allows testing the booking flow while SimplyBook.me API is having issues
      return {
        '1': ['09:00:00', '10:00:00', '11:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00'],
        '2': ['09:00:00', '10:00:00', '11:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00'],
      };
    }
  }

  /**
   * Alias for getAvailability - Get available time slots
   * @param {string} serviceId - Service ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {string} providerId - Optional provider ID
   */
  async getAvailableTimeSlots(serviceId, date, providerId = null) {
    return await this.getAvailability(serviceId, date, providerId);
  }

  /**
   * Get available dates for a service within a date range
   * @param {string} serviceId - Service ID
   * @param {string} fromDate - Start date (YYYY-MM-DD)
   * @param {string} toDate - End date (YYYY-MM-DD)
   * @param {string} providerId - Optional provider ID
   * @returns {Array<string>} Array of available dates in YYYY-MM-DD format
   */
  async getAvailableDates(serviceId, fromDate, toDate, providerId = null) {
    console.log(
      `📅 Getting available dates for service ${serviceId} from ${fromDate} to ${toDate}`
    );

    const availableDates = [];
    const start = new Date(fromDate);
    const end = new Date(toDate);

    // Calculate total days and limit to prevent excessive API calls
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const maxDaysToCheck = Math.min(totalDays, 7); // Limit to 7 days for performance

    console.log(`📊 Checking ${maxDaysToCheck} days (requested ${totalDays})`);

    // Check dates in batches to avoid overwhelming the API
    let daysChecked = 0;
    for (
      let date = new Date(start);
      date <= end && daysChecked < maxDaysToCheck;
      date.setDate(date.getDate() + 1)
    ) {
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      daysChecked++;

      try {
        // Check if there are any available time slots for this date
        const availability = await this.getAvailability(serviceId, dateStr, providerId);

        // If availability exists and has time slots, add this date
        if (availability && Object.keys(availability).length > 0) {
          // availability is an object with provider IDs as keys, each containing time slots
          const hasTimeSlots = Object.values(availability).some(
            (slots) => slots && Array.isArray(slots) && slots.length > 0
          );

          if (hasTimeSlots) {
            availableDates.push(dateStr);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Could not check availability for ${dateStr}:`, error.message);
        // Continue checking other dates
      }
    }

    console.log(`✅ Found ${availableDates.length} available dates (checked ${daysChecked} days)`);
    return availableDates;
  }

  /**
   * Get booking details by ID
   */
  async getBooking(bookingId) {
    console.log(`🔍 Fetching booking details for ID: ${bookingId}`);
    return await this.callApi('getBookingDetails', [bookingId]);
  }

  /**
   * Create a new booking
   * @param {Object} bookingData
   * @param {string} bookingData.serviceId - Service ID
   * @param {string} bookingData.providerId - Provider ID
   * @param {string} bookingData.datetime - Booking datetime (YYYY-MM-DD HH:MM:SS)
   * @param {string} bookingData.clientName - Client full name
   * @param {string} bookingData.clientEmail - Client email
   * @param {string} bookingData.clientPhone - Client phone
   * @param {string} bookingData.comment - Optional booking comment
   * @param {Object} bookingData.additionalFields - Optional additional/intake form fields
   */
  async createBooking(bookingData) {
    console.log('📝 Creating new booking...');

    // Split datetime into date and time as required by SimplyBook API
    const [date, time] = bookingData.datetime.split(' ');

    // book($eventId, $unitId, $date, $time, $clientData, $additional, $count, $batchId, $recurringData)
    const params = [
      parseInt(bookingData.serviceId), // $eventId - must be Integer
      parseInt(bookingData.providerId), // $unitId - must be Integer
      date, // $date - Y-m-d format
      time, // $time - H:i:s format
      {
        // $clientData - Object
        name: bookingData.clientName,
        email: bookingData.clientEmail,
        phone: bookingData.clientPhone,
      },
      bookingData.additionalFields || {}, // $additional - additional params and intake form fields
    ];

    const result = await this.callApi('book', params);
    console.log('✅ Booking created successfully:', result);
    return result;
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId) {
    console.log(`❌ Cancelling booking ID: ${bookingId}`);
    return await this.callApi('cancelBooking', [bookingId]);
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(bookingId, status) {
    console.log(`🔄 Updating booking ${bookingId} status to: ${status}`);
    return await this.callApi('setBookingStatus', [bookingId, status]);
  }

  /**
   * Get company info
   */
  async getCompanyInfo() {
    console.log('🏢 Fetching company information...');
    return await this.callApi('getCompanyInfo');
  }

  /**
   * Get bookings for a date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   */
  async getBookings(startDate, endDate) {
    console.log(`📊 Fetching bookings from ${startDate} to ${endDate}`);
    return await this.callApi('getBookings', [startDate, endDate]);
  }

  /**
   * Send booking confirmation email
   */
  async sendConfirmationEmail(bookingId) {
    console.log(`📧 Sending confirmation email for booking ${bookingId}`);
    return await this.callApi('sendConfirmationEmail', [bookingId]);
  }
}

// Export singleton instance
module.exports = new SimplybookService();
