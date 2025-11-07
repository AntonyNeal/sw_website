/**
 * Analytics Routes
 */

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Create or update session
router.post('/sessions', analyticsController.createSession);

// Log event
router.post('/events', analyticsController.logEvent);

// Get session details (must come before /:tenantId)
router.get('/sessions/:sessionId', analyticsController.getSessionDetails);

// Get analytics metrics for tenant
router.get('/:tenantId', analyticsController.getAnalytics);

module.exports = router;
