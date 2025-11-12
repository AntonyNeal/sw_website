/**
 * Webhook Routes
 * Handles incoming webhook requests from external services
 */

const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

/**
 * SimplyBook.me webhook endpoint
 * POST /api/v1/webhooks/simplybook
 *
 * Receives notifications for:
 * - Booking created (trigger on create)
 * - Booking changed (trigger on change)
 * - Booking cancelled (trigger on cancel)
 * - Booking reminder (trigger on remind)
 */
router.post('/simplybook', webhookController.handleSimplybookWebhook);

/**
 * Test endpoint
 * GET /api/v1/webhooks/test
 *
 * Used to verify webhook functionality is working
 */
router.get('/test', webhookController.testWebhook);
router.post('/test', webhookController.testWebhook);

module.exports = router;
