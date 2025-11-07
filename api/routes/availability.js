/**
 * Availability Routes
 */

const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

// Get availability calendar for tenant
router.get('/:tenantId', availabilityController.getAvailability);

// Check specific date availability
router.get('/:tenantId/check', availabilityController.checkDateAvailability);

module.exports = router;
