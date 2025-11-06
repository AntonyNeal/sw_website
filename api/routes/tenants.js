/**
 * Tenant Routes
 */

const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');

// GET tenant by subdomain
router.get('/:subdomain', tenantController.getTenantBySubdomain);

// GET tenant by custom domain
router.get('/domain/:domain', tenantController.getTenantByDomain);

// GET list all active tenants
router.get('/', tenantController.listTenants);

module.exports = router;
