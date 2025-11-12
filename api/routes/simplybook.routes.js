/**
 * SimplyBook Routes
 * Proxy routes to SimplyBook.me API through backend
 */

const express = require('express');
const router = express.Router();
const simplebookService = require('../services/simplybook.service');

/**
 * GET /api/simplybook/services
 * Get all available services
 */
router.get('/services', async (req, res) => {
  try {
    console.log('📋 Getting services from SimplyBook');
    const services = await simplebookService.getServices();
    res.json(services);
  } catch (error) {
    console.error('Error getting services:', error);
    res.status(500).json({ error: error.message || 'Failed to get services' });
  }
});

/**
 * GET /api/simplybook/services/:id
 * Get service details by ID
 */
router.get('/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Getting service ${id} details`);
    const service = await simplebookService.getServiceDetails(id);
    res.json(service);
  } catch (error) {
    console.error('Error getting service details:', error);
    res.status(500).json({ error: error.message || 'Failed to get service details' });
  }
});

/**
 * GET /api/simplybook/company
 * Get company information
 */
router.get('/company', async (req, res) => {
  try {
    console.log('🏢 Getting company info');
    const companyInfo = await simplebookService.getCompanyInfo();
    res.json(companyInfo);
  } catch (error) {
    console.error('Error getting company info:', error);
    res.status(500).json({ error: error.message || 'Failed to get company info' });
  }
});

/**
 * GET /api/simplybook/timeslots
 * Get available time slots for a service on a specific date
 * Query params: service_id, date, provider_id (optional)
 */
router.get('/timeslots', async (req, res) => {
  try {
    const { service_id, date, provider_id } = req.query;

    if (!service_id || !date) {
      return res.status(400).json({ error: 'service_id and date are required' });
    }

    console.log(`⏰ Getting time slots for service ${service_id} on ${date}`);
    const slots = await simplebookService.getAvailableTimeSlots(service_id, date, provider_id);
    res.json(slots);
  } catch (error) {
    console.error('Error getting time slots:', error);
    res.status(500).json({ error: error.message || 'Failed to get time slots' });
  }
});

/**
 * GET /api/simplybook/providers
 * Get list of all providers/staff
 */
router.get('/providers', async (req, res) => {
  try {
    console.log('👤 Getting providers');
    const providers = await simplebookService.getProviders();
    res.json(providers);
  } catch (error) {
    console.error('Error getting providers:', error);
    res.status(500).json({ error: error.message || 'Failed to get providers' });
  }
});

/**
 * GET /api/simplybook/services/:id/providers
 * Get providers available for a specific service
 */
router.get('/services/:id/providers', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`👥 Getting providers for service ${id}`);
    const providers = await simplebookService.getProvidersForService(id);
    res.json(providers);
  } catch (error) {
    console.error('Error getting providers for service:', error);
    res.status(500).json({ error: error.message || 'Failed to get providers for service' });
  }
});

/**
 * POST /api/simplybook/bookings
 * Create a new booking
 */
router.post('/bookings', async (req, res) => {
  try {
    const bookingData = req.body;

    if (!bookingData.event_id || !bookingData.date || !bookingData.time || !bookingData.client) {
      return res.status(400).json({ error: 'Missing required booking fields' });
    }

    console.log('📅 Creating booking:', bookingData);
    const booking = await simplebookService.createBooking(bookingData);
    res.json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: error.message || 'Failed to create booking' });
  }
});

/**
 * GET /api/simplybook/bookings/:id
 * Get booking details by ID
 */
router.get('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📖 Getting booking ${id}`);
    const booking = await simplebookService.getBookingById(id);
    res.json(booking);
  } catch (error) {
    console.error('Error getting booking:', error);
    res.status(500).json({ error: error.message || 'Failed to get booking' });
  }
});

/**
 * GET /api/simplybook/bookings/code/:code
 * Get booking details by booking code
 */
router.get('/bookings/code/:code', async (req, res) => {
  try {
    const { code } = req.params;
    console.log(`📖 Getting booking by code ${code}`);
    const booking = await simplebookService.getBookingByCode(code);
    res.json(booking);
  } catch (error) {
    console.error('Error getting booking by code:', error);
    res.status(500).json({ error: error.message || 'Failed to get booking' });
  }
});

/**
 * DELETE /api/simplybook/bookings/:id
 * Cancel a booking
 */
router.delete('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`❌ Canceling booking ${id}`);
    const result = await simplebookService.cancelBooking(id);
    res.json(result);
  } catch (error) {
    console.error('Error canceling booking:', error);
    res.status(500).json({ error: error.message || 'Failed to cancel booking' });
  }
});

/**
 * GET /api/simplybook/services/:id/fields
 * Get intake form fields for a service
 */
router.get('/services/:id/fields', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📝 Getting intake form fields for service ${id}`);
    const fields = await simplebookService.getIntakeFormFields(id);
    res.json(fields);
  } catch (error) {
    console.error('Error getting intake form fields:', error);
    res.status(500).json({ error: error.message || 'Failed to get intake form fields' });
  }
});

/**
 * GET /api/simplybook/available-dates
 * Get available dates for a service within a date range
 * Query params: service_id, from, to, provider_id (optional)
 */
router.get('/available-dates', async (req, res) => {
  try {
    const { service_id, from, to, provider_id } = req.query;

    if (!service_id || !from || !to) {
      return res.status(400).json({ error: 'service_id, from, and to are required' });
    }

    console.log(`📅 Getting available dates for service ${service_id} from ${from} to ${to}`);
    const dates = await simplebookService.getAvailableDates(service_id, from, to, provider_id);
    res.json(dates);
  } catch (error) {
    console.error('Error getting available dates:', error);
    res.status(500).json({ error: error.message || 'Failed to get available dates' });
  }
});

/**
 * GET /api/simplybook/check-availability
 * Check if a specific time is available
 * Query params: service_id, datetime, provider_id (optional)
 */
router.get('/check-availability', async (req, res) => {
  try {
    const { service_id, datetime, provider_id } = req.query;

    if (!service_id || !datetime) {
      return res.status(400).json({ error: 'service_id and datetime are required' });
    }

    console.log(`✓ Checking availability for service ${service_id} at ${datetime}`);
    const availability = await simplebookService.checkTimeAvailability(
      service_id,
      datetime,
      provider_id
    );
    res.json(availability);
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: error.message || 'Failed to check availability' });
  }
});

/**
 * GET /api/simplybook/company/param/:param
 * Get company parameter (timezone, date format, etc.)
 */
router.get('/company/param/:param', async (req, res) => {
  try {
    const { param } = req.params;
    console.log(`⚙️ Getting company parameter: ${param}`);
    const value = await simplebookService.getCompanyParam(param);
    res.json(value);
  } catch (error) {
    console.error('Error getting company parameter:', error);
    res.status(500).json({ error: error.message || 'Failed to get company parameter' });
  }
});

/**
 * GET /api/simplybook/bookings
 * Get bookings for a specific date range
 * Query params: from, to
 */
router.get('/bookings', async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: 'from and to dates are required' });
    }

    console.log(`📚 Getting bookings from ${from} to ${to}`);
    const bookings = await simplebookService.getBookings(from, to);
    res.json(bookings);
  } catch (error) {
    console.error('Error getting bookings:', error);
    res.status(500).json({ error: error.message || 'Failed to get bookings' });
  }
});

module.exports = router;
