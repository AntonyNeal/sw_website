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
   * Get available time slots for a service
   * @param {string} serviceId - Service ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {string} providerId - Optional provider ID
   */
  async getAvailability(serviceId, date, providerId = null) {
    console.log(`📅 Checking availability for service ${serviceId} on ${date}`);

    const params = [serviceId, date, null, null];
    if (providerId) {
      params.push(providerId);
    }

    return await this.callApi('getStartTimeMatrix', params);
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
      parseInt(bookingData.serviceId),    // $eventId - must be Integer
      parseInt(bookingData.providerId),   // $unitId - must be Integer
      date,                               // $date - Y-m-d format
      time,                               // $time - H:i:s format
      {                                   // $clientData - Object
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
