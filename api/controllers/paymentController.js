/**
 * Payment Controller
 * Handles payment recording and management (processor-agnostic)
 */

const db = require('../utils/db');

/**
 * POST /api/payments
 * Record a payment transaction
 */
const createPayment = async (req, res) => {
  try {
    const {
      tenantId,
      bookingId,
      processor,
      processorTransactionId,
      processorCustomerId,
      processorPaymentMethodId,
      amount,
      currency = 'USD',
      status = 'pending',
      paymentType,
      processorFee,
      netAmount,
      paymentMethodType,
      paymentMethodLast4,
      paymentMethodBrand,
      processorMetadata,
      receiptNumber,
      receiptUrl,
      invoiceNumber,
      description,
      internalNotes,
      customerNotes,
    } = req.body;

    // Validate required fields
    if (!tenantId || !processor || !amount || !paymentType) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'tenantId, processor, amount, and paymentType are required',
      });
    }

    // Validate tenant exists
    const tenantCheck = await db.query('SELECT id FROM tenants WHERE id = $1', [tenantId]);
    if (tenantCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Tenant not found',
      });
    }

    // Validate booking if provided
    if (bookingId) {
      const bookingCheck = await db.query(
        'SELECT id FROM bookings WHERE id = $1 AND tenant_id = $2',
        [bookingId, tenantId]
      );
      if (bookingCheck.rows.length === 0) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Booking not found or does not belong to this tenant',
        });
      }
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Amount must be a positive number',
      });
    }

    // Insert payment
    const result = await db.query(
      `INSERT INTO payments (
        tenant_id,
        booking_id,
        processor,
        processor_transaction_id,
        processor_customer_id,
        processor_payment_method_id,
        amount,
        currency,
        status,
        payment_type,
        processor_fee,
        net_amount,
        payment_method_type,
        payment_method_last4,
        payment_method_brand,
        processor_metadata,
        receipt_number,
        receipt_url,
        invoice_number,
        description,
        internal_notes,
        customer_notes,
        completed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      RETURNING 
        id,
        tenant_id,
        booking_id,
        processor,
        processor_transaction_id,
        amount,
        currency,
        status,
        payment_type,
        processor_fee,
        net_amount,
        receipt_number,
        description,
        created_at`,
      [
        tenantId,
        bookingId || null,
        processor,
        processorTransactionId || null,
        processorCustomerId || null,
        processorPaymentMethodId || null,
        amount,
        currency,
        status,
        paymentType,
        processorFee || null,
        netAmount || null,
        paymentMethodType || null,
        paymentMethodLast4 || null,
        paymentMethodBrand || null,
        processorMetadata ? JSON.stringify(processorMetadata) : '{}',
        receiptNumber || null,
        receiptUrl || null,
        invoiceNumber || null,
        description || null,
        internalNotes || null,
        customerNotes || null,
        status === 'completed' ? new Date() : null,
      ]
    );

    const payment = result.rows[0];

    res.status(201).json({
      success: true,
      data: {
        id: payment.id,
        tenantId: payment.tenant_id,
        bookingId: payment.booking_id,
        processor: payment.processor,
        processorTransactionId: payment.processor_transaction_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentType: payment.payment_type,
        processorFee: payment.processor_fee,
        netAmount: payment.net_amount,
        receiptNumber: payment.receipt_number,
        description: payment.description,
        createdAt: payment.created_at,
      },
    });
  } catch (error) {
    console.error('Error in createPayment:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create payment',
      details: error.message,
    });
  }
};

/**
 * GET /api/payments/:paymentId
 * Get payment details by ID
 */
const getPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Payment ID is required',
      });
    }

    const result = await db.query(
      `SELECT 
        p.*,
        t.name as tenant_name,
        t.email as tenant_email,
        b.client_name,
        b.client_email,
        b.preferred_date as booking_date
      FROM payments p
      LEFT JOIN tenants t ON p.tenant_id = t.id
      LEFT JOIN bookings b ON p.booking_id = b.id
      WHERE p.id = $1`,
      [paymentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Payment not found',
      });
    }

    const payment = result.rows[0];

    res.json({
      success: true,
      data: {
        id: payment.id,
        tenantId: payment.tenant_id,
        bookingId: payment.booking_id,
        processor: payment.processor,
        processorTransactionId: payment.processor_transaction_id,
        processorCustomerId: payment.processor_customer_id,
        processorPaymentMethodId: payment.processor_payment_method_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentType: payment.payment_type,
        processorFee: payment.processor_fee,
        netAmount: payment.net_amount,
        refundAmount: payment.refund_amount,
        refundReason: payment.refund_reason,
        refundedAt: payment.refunded_at,
        paymentMethodType: payment.payment_method_type,
        paymentMethodLast4: payment.payment_method_last4,
        paymentMethodBrand: payment.payment_method_brand,
        processorMetadata: payment.processor_metadata,
        receiptNumber: payment.receipt_number,
        receiptUrl: payment.receipt_url,
        invoiceNumber: payment.invoice_number,
        description: payment.description,
        internalNotes: payment.internal_notes,
        customerNotes: payment.customer_notes,
        createdAt: payment.created_at,
        updatedAt: payment.updated_at,
        completedAt: payment.completed_at,
        failedAt: payment.failed_at,
        tenant: {
          name: payment.tenant_name,
          email: payment.tenant_email,
        },
        booking: payment.booking_id
          ? {
              clientName: payment.client_name,
              clientEmail: payment.client_email,
              bookingDate: payment.booking_date,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Error in getPayment:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve payment',
      details: error.message,
    });
  }
};

/**
 * GET /api/payments/booking/:bookingId
 * Get all payments for a booking
 */
const getBookingPayments = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Booking ID is required',
      });
    }

    // Verify booking exists
    const bookingCheck = await db.query('SELECT id, tenant_id FROM bookings WHERE id = $1', [
      bookingId,
    ]);
    if (bookingCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Booking not found',
      });
    }

    const result = await db.query(
      `SELECT 
        id,
        tenant_id,
        booking_id,
        processor,
        processor_transaction_id,
        amount,
        currency,
        status,
        payment_type,
        processor_fee,
        net_amount,
        refund_amount,
        receipt_number,
        description,
        created_at,
        completed_at
      FROM payments
      WHERE booking_id = $1
      ORDER BY created_at DESC`,
      [bookingId]
    );

    const payments = result.rows.map((p) => ({
      id: p.id,
      tenantId: p.tenant_id,
      bookingId: p.booking_id,
      processor: p.processor,
      processorTransactionId: p.processor_transaction_id,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      paymentType: p.payment_type,
      processorFee: p.processor_fee,
      netAmount: p.net_amount,
      refundAmount: p.refund_amount,
      receiptNumber: p.receipt_number,
      description: p.description,
      createdAt: p.created_at,
      completedAt: p.completed_at,
    }));

    // Calculate totals
    const totalPaid = payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const totalRefunded = payments.reduce((sum, p) => sum + parseFloat(p.refundAmount || 0), 0);
    const netTotal = totalPaid - totalRefunded;

    res.json({
      success: true,
      data: {
        bookingId: bookingId,
        payments: payments,
        summary: {
          totalPayments: payments.length,
          totalPaid: totalPaid.toFixed(2),
          totalRefunded: totalRefunded.toFixed(2),
          netTotal: netTotal.toFixed(2),
          currency: payments.length > 0 ? payments[0].currency : 'USD',
        },
      },
    });
  } catch (error) {
    console.error('Error in getBookingPayments:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve booking payments',
      details: error.message,
    });
  }
};

/**
 * POST /api/payments/:paymentId/refund
 * Process a refund for a payment
 */
const refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { refundAmount, refundReason } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Payment ID is required',
      });
    }

    if (!refundAmount || !refundReason) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'refundAmount and refundReason are required',
      });
    }

    // Get existing payment
    const paymentCheck = await db.query(
      'SELECT id, amount, status, refund_amount FROM payments WHERE id = $1',
      [paymentId]
    );

    if (paymentCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Payment not found',
      });
    }

    const payment = paymentCheck.rows[0];

    // Validate payment can be refunded
    if (payment.status !== 'completed') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Only completed payments can be refunded',
      });
    }

    // Validate refund amount
    const currentRefundAmount = parseFloat(payment.refund_amount || 0);
    const requestedRefund = parseFloat(refundAmount);
    const totalRefunded = currentRefundAmount + requestedRefund;

    if (totalRefunded > parseFloat(payment.amount)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: `Refund amount exceeds payment amount. Already refunded: ${currentRefundAmount}, Requested: ${requestedRefund}, Payment: ${payment.amount}`,
      });
    }

    // Determine new status
    const newStatus =
      totalRefunded >= parseFloat(payment.amount) ? 'refunded' : 'partially_refunded';

    // Update payment with refund
    const result = await db.query(
      `UPDATE payments
       SET refund_amount = $1,
           refund_reason = $2,
           refunded_at = NOW(),
           status = $3,
           updated_at = NOW()
       WHERE id = $4
       RETURNING 
         id,
         tenant_id,
         booking_id,
         amount,
         currency,
         status,
         refund_amount,
         refund_reason,
         refunded_at,
         updated_at`,
      [totalRefunded, refundReason, newStatus, paymentId]
    );

    const updatedPayment = result.rows[0];

    res.json({
      success: true,
      data: {
        id: updatedPayment.id,
        tenantId: updatedPayment.tenant_id,
        bookingId: updatedPayment.booking_id,
        amount: updatedPayment.amount,
        currency: updatedPayment.currency,
        status: updatedPayment.status,
        refundAmount: updatedPayment.refund_amount,
        refundReason: updatedPayment.refund_reason,
        refundedAt: updatedPayment.refunded_at,
        updatedAt: updatedPayment.updated_at,
      },
    });
  } catch (error) {
    console.error('Error in refundPayment:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process refund',
      details: error.message,
    });
  }
};

/**
 * GET /api/payments/tenant/:tenantId
 * Get all payments for a tenant with filtering
 */
const getTenantPayments = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { status, paymentType, processor, startDate, endDate, page = 1, limit = 50 } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tenant ID is required',
      });
    }

    // Build WHERE clause
    const conditions = ['p.tenant_id = $1'];
    const params = [tenantId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      conditions.push(`p.status = $${paramCount}`);
      params.push(status);
    }

    if (paymentType) {
      paramCount++;
      conditions.push(`p.payment_type = $${paramCount}`);
      params.push(paymentType);
    }

    if (processor) {
      paramCount++;
      conditions.push(`p.processor = $${paramCount}`);
      params.push(processor);
    }

    if (startDate) {
      paramCount++;
      conditions.push(`p.created_at >= $${paramCount}`);
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      conditions.push(`p.created_at <= $${paramCount}`);
      params.push(endDate);
    }

    const whereClause = conditions.join(' AND ');

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM payments p WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Calculate pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const totalPages = Math.ceil(total / parseInt(limit));

    // Get payments
    const result = await db.query(
      `SELECT 
        p.id,
        p.booking_id,
        p.processor,
        p.processor_transaction_id,
        p.amount,
        p.currency,
        p.status,
        p.payment_type,
        p.processor_fee,
        p.net_amount,
        p.refund_amount,
        p.receipt_number,
        p.description,
        p.created_at,
        p.completed_at,
        b.client_name,
        b.client_email
      FROM payments p
      LEFT JOIN bookings b ON p.booking_id = b.id
      WHERE ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, parseInt(limit), offset]
    );

    const payments = result.rows.map((p) => ({
      id: p.id,
      bookingId: p.booking_id,
      processor: p.processor,
      processorTransactionId: p.processor_transaction_id,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      paymentType: p.payment_type,
      processorFee: p.processor_fee,
      netAmount: p.net_amount,
      refundAmount: p.refund_amount,
      receiptNumber: p.receipt_number,
      description: p.description,
      createdAt: p.created_at,
      completedAt: p.completed_at,
      booking: p.booking_id
        ? {
            clientName: p.client_name,
            clientEmail: p.client_email,
          }
        : null,
    }));

    res.json({
      success: true,
      data: {
        payments: payments,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: totalPages,
          hasMore: parseInt(page) < totalPages,
        },
      },
    });
  } catch (error) {
    console.error('Error in getTenantPayments:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve tenant payments',
      details: error.message,
    });
  }
};

module.exports = {
  createPayment,
  getPayment,
  getBookingPayments,
  refundPayment,
  getTenantPayments,
};
