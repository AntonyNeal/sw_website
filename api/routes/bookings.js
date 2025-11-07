/**
 * Booking Routes
 */

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create new booking
router.post('/', bookingController.createBooking);

// Get booking by ID
router.get('/:bookingId', bookingController.getBooking);

// Update booking status
router.patch('/:bookingId/status', bookingController.updateBookingStatus);

// Get all bookings for a tenant
router.get('/tenant/:tenantId', bookingController.getTenantBookings);

module.exports = router;
