/**
 * Availability Controller
 *
 * Handles availability and location queries
 */

const db = require('../utils/db');

/**
 * GET /api/availability/:tenantId
 * Get available dates for a tenant
 * Query params: year, month
 */
const getAvailability = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { year, month } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tenant ID is required',
      });
    }

    // Build query with optional filters
    let query = `
      SELECT 
        ac.id,
        ac.tenant_id,
        ac.date,
        ac.time_slot_start,
        ac.time_slot_end,
        ac.status,
        ac.is_all_day,
        ac.min_duration_hours,
        ac.notes,
        ac.created_at,
        ac.updated_at
      FROM availability_calendar ac
      WHERE ac.tenant_id = $1
        AND ac.status = 'available'
        AND ac.date >= CURRENT_DATE
    `;

    const params = [tenantId];
    let paramIndex = 2;

    // Add year filter
    if (year) {
      query += ` AND EXTRACT(YEAR FROM ac.date) = $${paramIndex}`;
      params.push(parseInt(year));
      paramIndex++;
    }

    // Add month filter
    if (month) {
      query += ` AND EXTRACT(MONTH FROM ac.date) = $${paramIndex}`;
      params.push(parseInt(month));
      paramIndex++;
    }

    query += ` ORDER BY ac.date ASC, ac.time_slot_start ASC`;

    const result = await db.query(query, params);

    // Format response
    const availability = result.rows.map((row) => ({
      id: row.id,
      tenantId: row.tenant_id,
      date: row.date,
      timeSlotStart: row.time_slot_start,
      timeSlotEnd: row.time_slot_end,
      status: row.status,
      isAllDay: row.is_all_day,
      minDurationHours: row.min_duration_hours,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    res.json({
      success: true,
      data: availability,
      count: availability.length,
      filters: {
        tenantId,
        year: year || null,
        month: month || null,
      },
    });
  } catch (error) {
    console.error('Error in getAvailability:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch availability',
      details: error.message,
    });
  }
};

/**
 * GET /api/availability/:tenantId/check
 * Check if a specific date is available
 * Query params: date (YYYY-MM-DD)
 */
const checkDateAvailability = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { date } = req.query;

    if (!tenantId || !date) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tenant ID and date are required',
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Date must be in YYYY-MM-DD format',
      });
    }

    const result = await db.query(
      `SELECT 
        ac.id,
        ac.date,
        ac.time_slot_start,
        ac.time_slot_end,
        ac.status,
        ac.is_all_day,
        ac.min_duration_hours,
        ac.notes,
        -- Check if already booked
        (SELECT COUNT(*) FROM bookings 
         WHERE tenant_id = ac.tenant_id 
         AND preferred_date::date <= ac.date 
         AND COALESCE(preferred_date_end::date, preferred_date::date) >= ac.date
         AND status IN ('confirmed', 'pending')) as booking_count
      FROM availability_calendar ac
      WHERE ac.tenant_id = $1 
        AND ac.date = $2`,
      [tenantId, date]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: {
          date,
          isAvailable: false,
          reason: 'Date not in calendar',
        },
      });
    }

    const row = result.rows[0];
    const isBooked = parseInt(row.booking_count) > 0;
    const isAvailable = row.status === 'available' && !isBooked;

    res.json({
      success: true,
      data: {
        id: row.id,
        date: row.date,
        isAvailable,
        isInCalendar: true,
        status: row.status,
        isBooked,
        timeSlotStart: row.time_slot_start,
        timeSlotEnd: row.time_slot_end,
        isAllDay: row.is_all_day,
        minDurationHours: row.min_duration_hours,
        notes: row.notes,
      },
    });
  } catch (error) {
    console.error('Error in checkDateAvailability:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to check date availability',
      details: error.message,
    });
  }
};

/**
 * GET /api/locations/:tenantId
 * Get all locations for a tenant
 */
const getTenantLocations = async (req, res) => {
  try {
    const { tenantId } = req.params;

    if (!tenantId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tenant ID is required',
      });
    }

    const result = await db.query(
      `SELECT 
        l.id,
        l.tenant_id,
        l.location_type,
        l.city,
        l.state_province,
        l.country,
        l.country_name,
        l.latitude,
        l.longitude,
        l.available_from,
        l.available_until,
        l.is_current,
        l.is_public,
        l.notes,
        l.created_at,
        l.updated_at,
        -- Count available dates for this tenant
        (SELECT COUNT(*) 
         FROM availability_calendar 
         WHERE tenant_id = l.tenant_id
         AND status = 'available'
         AND date >= CURRENT_DATE) as available_dates_count
      FROM locations l
      WHERE l.tenant_id = $1
      ORDER BY l.is_current DESC, l.city ASC`,
      [tenantId]
    );

    const locations = result.rows.map((row) => ({
      id: row.id,
      tenantId: row.tenant_id,
      locationType: row.location_type,
      city: row.city,
      stateProvince: row.state_province,
      country: row.country,
      countryName: row.country_name,
      latitude: row.latitude ? parseFloat(row.latitude) : null,
      longitude: row.longitude ? parseFloat(row.longitude) : null,
      availableFrom: row.available_from,
      availableUntil: row.available_until,
      isCurrent: row.is_current,
      isPublic: row.is_public,
      notes: row.notes,
      availableDatesCount: parseInt(row.available_dates_count),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    res.json({
      success: true,
      data: locations,
      count: locations.length,
    });
  } catch (error) {
    console.error('Error in getTenantLocations:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch locations',
      details: error.message,
    });
  }
};

module.exports = {
  getAvailability,
  checkDateAvailability,
  getTenantLocations,
};
