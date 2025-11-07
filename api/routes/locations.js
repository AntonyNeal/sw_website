/**
 * Location Routes
 */

const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

// Get all locations for a tenant
router.get('/:tenantId', availabilityController.getTenantLocations);

module.exports = router;
