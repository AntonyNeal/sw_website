/**
 * Tenant Controller
 *
 * Handles tenant-related operations
 */

const db = require('../utils/db');

/**
 * GET /api/tenants/:subdomain
 * Fetch tenant configuration by subdomain
 */
const getTenantBySubdomain = async (req, res) => {
  try {
    const { subdomain } = req.params;

    if (!subdomain) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Subdomain parameter is required',
      });
    }

    // Query tenant from database
    const result = await db.query(
      `SELECT 
        id,
        subdomain,
        name,
        email,
        custom_domain,
        status,
        theme_config,
        content_config,
        created_at,
        updated_at
      FROM tenants
      WHERE subdomain = $1 AND status = 'active'`,
      [subdomain.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Tenant with subdomain '${subdomain}' not found`,
      });
    }

    const tenant = result.rows[0];

    res.json({
      success: true,
      data: {
        id: tenant.id,
        subdomain: tenant.subdomain,
        name: tenant.name,
        email: tenant.email,
        customDomain: tenant.custom_domain,
        status: tenant.status,
        themeConfig: tenant.theme_config,
        contentConfig: tenant.content_config,
        createdAt: tenant.created_at,
        updatedAt: tenant.updated_at,
      },
    });
  } catch (error) {
    console.error('Error in getTenantBySubdomain:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch tenant data',
    });
  }
};

/**
 * GET /api/tenants/domain/:domain
 * Fetch tenant configuration by custom domain
 */
const getTenantByDomain = async (req, res) => {
  try {
    const { domain } = req.params;

    if (!domain) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Domain parameter is required',
      });
    }

    // Query tenant from database
    const result = await db.query(
      `SELECT 
        id,
        subdomain,
        name,
        email,
        custom_domain,
        status,
        theme_config,
        content_config,
        created_at,
        updated_at
      FROM tenants
      WHERE custom_domain = $1 AND status = 'active'`,
      [domain.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Tenant with domain '${domain}' not found`,
      });
    }

    const tenant = result.rows[0];

    res.json({
      success: true,
      data: {
        id: tenant.id,
        subdomain: tenant.subdomain,
        name: tenant.name,
        email: tenant.email,
        customDomain: tenant.custom_domain,
        status: tenant.status,
        themeConfig: tenant.theme_config,
        contentConfig: tenant.content_config,
        createdAt: tenant.created_at,
        updatedAt: tenant.updated_at,
      },
    });
  } catch (error) {
    console.error('Error in getTenantByDomain:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch tenant data',
    });
  }
};

/**
 * GET /api/tenants
 * List all active tenants (admin/internal use)
 */
const listTenants = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
        id,
        subdomain,
        name,
        email,
        custom_domain,
        status,
        created_at,
        updated_at
      FROM tenants
      WHERE status = 'active'
      ORDER BY name ASC`
    );

    res.json({
      success: true,
      data: result.rows.map((tenant) => ({
        id: tenant.id,
        subdomain: tenant.subdomain,
        name: tenant.name,
        email: tenant.email,
        customDomain: tenant.custom_domain,
        status: tenant.status,
        createdAt: tenant.created_at,
        updatedAt: tenant.updated_at,
      })),
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error in listTenants:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch tenants',
    });
  }
};

module.exports = {
  getTenantBySubdomain,
  getTenantByDomain,
  listTenants,
};
