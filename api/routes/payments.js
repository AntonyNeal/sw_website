/**
 * Payment Routes
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create payment
router.post('/', paymentController.createPayment);

// Get payments for a booking (must come before /:paymentId)
router.get('/booking/:bookingId', paymentController.getBookingPayments);

// Get tenant payments (must come before /:paymentId)
router.get('/tenant/:tenantId', paymentController.getTenantPayments);

// Get payment by ID
router.get('/:paymentId', paymentController.getPayment);

// Process refund
router.post('/:paymentId/refund', paymentController.refundPayment);

module.exports = router;
