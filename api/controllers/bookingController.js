/**
 * Booking Controller
 *
 * Handles booking creation, retrieval, and status updates
 */

const db = require('../utils/db');

/**
 * POST /api/bookings
 * Create a new booking
 */
const createBooking = async (req, res) => {
  try {
    const {
      tenantId,
      sessionId,
      locationId,
      availabilityId,
      clientName,
      clientEmail,
      clientPhone,
      serviceType,
      preferredDate,
      preferredDateEnd,
      duration,
      durationHours,
      bookingCity,
      bookingCountry,
      outcallAddress,
      incallLocation,
      message,
    } = req.body;

    // Validate required fields
    if (!tenantId || !clientName || !clientEmail || !preferredDate) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'tenantId, clientName, clientEmail, and preferredDate are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid email format',
      });
    }

    // Validate tenant exists
    const tenantCheck = await db.query('SELECT id FROM tenants WHERE id = $1 AND status = $2', [
      tenantId,
      'active',
    ]);

    if (tenantCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Tenant not found or inactive',
      });
    }

    // Check if date is available (if availabilityId provided)
    if (availabilityId) {
      const availCheck = await db.query(
        'SELECT id, status FROM availability_calendar WHERE id = $1 AND tenant_id = $2',
        [availabilityId, tenantId]
      );

      if (availCheck.rows.length === 0) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Availability slot not found',
        });
      }

      if (availCheck.rows[0].status !== 'available') {
        return res.status(409).json({
          error: 'Conflict',
          message: 'Selected date is no longer available',
        });
      }
    }

    // Insert booking
    const result = await db.query(
      `INSERT INTO bookings (
        tenant_id,
        session_id,
        location_id,
        availability_id,
        client_name,
        client_email,
        client_phone,
        service_type,
        preferred_date,
        preferred_date_end,
        duration,
        duration_hours,
        booking_city,
        booking_country,
        outcall_address,
        incall_location,
        message,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING 
        id,
        tenant_id,
        session_id,
        location_id,
        availability_id,
        client_name,
        client_email,
        client_phone,
        service_type,
        preferred_date,
        preferred_date_end,
        duration,
        duration_hours,
        booking_city,
        booking_country,
        outcall_address,
        incall_location,
        message,
        status,
        created_at`,
      [
        tenantId,
        sessionId || null,
        locationId || null,
        availabilityId || null,
        clientName,
        clientEmail,
        clientPhone || null,
        serviceType || null,
        preferredDate,
        preferredDateEnd || null,
        duration || null,
        durationHours || null,
        bookingCity || null,
        bookingCountry || null,
        outcallAddress || null,
        incallLocation || null,
        message || null,
        'pending',
      ]
    );

    const booking = result.rows[0];

    res.status(201).json({
      success: true,
      data: {
        id: booking.id,
        tenantId: booking.tenant_id,
        sessionId: booking.session_id,
        locationId: booking.location_id,
        availabilityId: booking.availability_id,
        clientName: booking.client_name,
        clientEmail: booking.client_email,
        clientPhone: booking.client_phone,
        serviceType: booking.service_type,
        preferredDate: booking.preferred_date,
        preferredDateEnd: booking.preferred_date_end,
        duration: booking.duration,
        durationHours: booking.duration_hours,
        bookingCity: booking.booking_city,
        bookingCountry: booking.booking_country,
        outcallAddress: booking.outcall_address,
        incallLocation: booking.incall_location,
        message: booking.message,
        status: booking.status,
        createdAt: booking.created_at,
      },
    });
  } catch (error) {
    console.error('Error in createBooking:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create booking',
      details: error.message,
    });
  }
};

/**
 * GET /api/bookings/:bookingId
 * Get booking details by ID
 */
const getBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Booking ID is required',
      });
    }

    const result = await db.query(
      `SELECT 
        b.id,
        b.tenant_id,
        b.session_id,
        b.location_id,
        b.availability_id,
        b.client_name,
        b.client_email,
        b.client_phone,
        b.service_type,
        b.preferred_date,
        b.preferred_date_end,
        b.duration,
        b.duration_hours,
        b.booking_city,
        b.booking_country,
        b.outcall_address,
        b.incall_location,
        b.message,
        b.status,
        b.cancellation_reason,
        b.created_at,
        t.name as tenant_name,
        t.email as tenant_email,
        l.city as location_city,
        l.country as location_country
      FROM bookings b
      LEFT JOIN tenants t ON b.tenant_id = t.id
      LEFT JOIN locations l ON b.location_id = l.id
      WHERE b.id = $1`,
      [bookingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Booking not found',
      });
    }

    const booking = result.rows[0];

    res.json({
      success: true,
      data: {
        id: booking.id,
        tenantId: booking.tenant_id,
        sessionId: booking.session_id,
        locationId: booking.location_id,
        availabilityId: booking.availability_id,
        clientName: booking.client_name,
        clientEmail: booking.client_email,
        clientPhone: booking.client_phone,
        serviceType: booking.service_type,
        preferredDate: booking.preferred_date,
        preferredDateEnd: booking.preferred_date_end,
        duration: booking.duration,
        durationHours: booking.duration_hours,
        bookingCity: booking.booking_city,
        bookingCountry: booking.booking_country,
        outcallAddress: booking.outcall_address,
        incallLocation: booking.incall_location,
        message: booking.message,
        status: booking.status,
        cancellationReason: booking.cancellation_reason,
        createdAt: booking.created_at,
        tenant: {
          name: booking.tenant_name,
          email: booking.tenant_email,
        },
        location: booking.location_city
          ? {
              city: booking.location_city,
              country: booking.location_country,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Error in getBooking:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve booking',
      details: error.message,
    });
  }
};

/**
 * PATCH /api/bookings/:bookingId/status
 * Update booking status
 */
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, cancellationReason } = req.body;

    if (!bookingId || !status) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Booking ID and status are required',
      });
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    // If cancelling, require reason
    if (status === 'cancelled' && !cancellationReason) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Cancellation reason is required when status is cancelled',
      });
    }

    // Update booking with status-specific timestamps
    let updateQuery = `
      UPDATE bookings
      SET status = $1,
          cancellation_reason = $2`;

    if (status === 'confirmed') {
      updateQuery += `, confirmed_at = NOW()`;
    } else if (status === 'cancelled') {
      updateQuery += `, cancelled_at = NOW()`;
    } else if (status === 'completed') {
      updateQuery += `, completed_at = NOW()`;
    }

    updateQuery += `
      WHERE id = $3
      RETURNING 
        id,
        tenant_id,
        client_name,
        client_email,
        preferred_date,
        status,
        cancellation_reason,
        confirmed_at,
        cancelled_at,
        completed_at,
        created_at`;

    const result = await db.query(updateQuery, [status, cancellationReason || null, bookingId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Booking not found',
      });
    }

    const booking = result.rows[0];

    res.json({
      success: true,
      data: {
        id: booking.id,
        tenantId: booking.tenant_id,
        clientName: booking.client_name,
        clientEmail: booking.client_email,
        preferredDate: booking.preferred_date,
        status: booking.status,
        cancellationReason: booking.cancellation_reason,
        confirmedAt: booking.confirmed_at,
        cancelledAt: booking.cancelled_at,
        completedAt: booking.completed_at,
        createdAt: booking.created_at,
      },
    });
  } catch (error) {
    console.error('Error in updateBookingStatus:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update booking status',
      details: error.message,
    });
  }
};

/**
 * GET /api/bookings/tenant/:tenantId
 * Get all bookings for a tenant
 */
const getTenantBookings = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { status, startDate, endDate, limit = 50, offset = 0 } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tenant ID is required',
      });
    }

    let query = `
      SELECT 
        b.id,
        b.client_name,
        b.client_email,
        b.client_phone,
        b.service_type,
        b.preferred_date,
        b.preferred_date_end,
        b.duration,
        b.status,
        b.created_at,
        l.city as location_city
      FROM bookings b
      LEFT JOIN locations l ON b.location_id = l.id
      WHERE b.tenant_id = $1
    `;

    const params = [tenantId];
    let paramIndex = 2;

    // Filter by status
    if (status) {
      query += ` AND b.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Filter by date range
    if (startDate) {
      query += ` AND b.preferred_date >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND b.preferred_date <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    query += ` ORDER BY b.preferred_date DESC, b.created_at DESC`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);

    const bookings = result.rows.map((row) => ({
      id: row.id,
      clientName: row.client_name,
      clientEmail: row.client_email,
      clientPhone: row.client_phone,
      serviceType: row.service_type,
      preferredDate: row.preferred_date,
      preferredDateEnd: row.preferred_date_end,
      duration: row.duration,
      status: row.status,
      locationCity: row.location_city,
      createdAt: row.created_at,
    }));

    res.json({
      success: true,
      data: bookings,
      count: bookings.length,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Error in getTenantBookings:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve bookings',
      details: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getBooking,
  updateBookingStatus,
  getTenantBookings,
};
