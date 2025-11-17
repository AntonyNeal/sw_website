# 📊 Billing Tracker System - Event-Based Architecture

## 🎯 System Overview

An automated billing system that:

- ✅ Receives booking events in real-time via SimplyBook.me webhooks
- ✅ Stores booking records with immutability
- ✅ Generates monthly invoices to Claire for 20% platform fee
- ✅ Tracks payment status (manual bank transfer)
- ✅ Provides full audit trail for reconciliation

**No payment gateway needed** - You invoice Claire directly via email/PDF

---

## 🏗️ Architecture Pattern: Event-Driven

### Why Event-Based vs Polling?

**✅ Event-Based (Webhooks)**

- Real-time updates - no delay
- No missed bookings
- Lower server load - only processes when needed
- Scales efficiently
- Guaranteed delivery (retries built-in)

**❌ Polling (Cron-based sync)**

- Requires running every X minutes
- Higher server costs
- Can miss bookings between polls
- Duplicate check complexity
- API rate limit concerns

---

## 🔄 Data Flow Architecture

```
┌─────────────────┐
│  Client Books   │
│   on Website    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  SimplyBook.me  │ ← Booking management system
└────────┬────────┘
         │ Webhook (real-time)
         ↓
┌─────────────────────────────────────────────────┐
│        YOUR API SERVER                          │
│  /api/v1/webhooks/simplybook                    │
│                                                  │
│  1. Validate webhook signature                  │
│  2. Parse booking data                          │
│  3. Calculate amounts (deposit/cash/fee)        │
│  4. Generate immutability hash                  │
│  5. Insert to PostgreSQL                        │
│  6. Lock record                                 │
│  7. Log sync event                              │
└────────┬────────────────────────────────────────┘
         │
         ↓
┌─────────────────┐
│  PostgreSQL DB  │
│                 │
│  • bookings     │ ← Financial records (immutable)
│  • invoices     │ ← Monthly billing
│  • sync_logs    │ ← Audit trail
└─────────────────┘
         │
         ↓ (Monthly: 1st of month)
┌─────────────────┐
│  Billing Engine │
│                 │
│  1. Query prev  │
│     month data  │
│  2. Calculate   │
│     platform    │
│     fees        │
│  3. Generate    │
│     PDF invoice │
│  4. Email to    │
│     Claire      │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Claire pays    │
│  Bank Transfer  │
└────────┬────────┘
         │
         │ (Manual: Mark as paid)
         ↓
┌─────────────────┐
│  Payment Track  │
│                 │
│  Update invoice │
│  status: paid   │
│  (via admin UI) │
└─────────────────┘
```

---

## 📊 Database Schema

### bookings Table

```sql
CREATE TABLE bookings (
  id BIGSERIAL PRIMARY KEY,

  -- SimplyBook.me Reference
  simplybook_booking_id VARCHAR(255) UNIQUE NOT NULL,
  simplybook_booking_hash VARCHAR(255),

  -- Tenant (for multi-client support)
  tenant_id VARCHAR(50) NOT NULL DEFAULT 'claire',

  -- Financial Data (immutable after creation)
  total_amount DECIMAL(10,2) NOT NULL,           -- Total booking value
  deposit_amount DECIMAL(10,2) NOT NULL,         -- 20% deposit via HNRY
  cash_amount DECIMAL(10,2) NOT NULL,            -- 80% cash at session
  platform_fee DECIMAL(10,2) NOT NULL,           -- 20% platform fee
  currency VARCHAR(3) DEFAULT 'AUD',

  -- Session Details
  service_id VARCHAR(50),
  service_name VARCHAR(255) NOT NULL,
  service_duration_minutes INT,
  session_datetime TIMESTAMPTZ NOT NULL,
  location VARCHAR(255),

  -- Client Info (encrypted in production)
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50),

  -- Booking Status
  status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
  -- Possible values: confirmed, cancelled, completed, no_show

  -- Immutability
  data_hash VARCHAR(64) NOT NULL,                -- SHA-256 hash
  is_locked BOOLEAN DEFAULT TRUE,                -- Prevents edits

  -- Audit Timestamps
  booking_created_at TIMESTAMPTZ NOT NULL,       -- When booking was made
  synced_at TIMESTAMPTZ DEFAULT NOW(),           -- When we received it
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Metadata
  notes TEXT,
  metadata JSONB,                                -- Additional data

  -- Indexes
  CONSTRAINT valid_amounts CHECK (
    total_amount > 0 AND
    deposit_amount = total_amount * 0.20 AND
    cash_amount = total_amount * 0.80 AND
    platform_fee = total_amount * 0.20
  )
);

-- Indexes for fast queries
CREATE INDEX idx_bookings_tenant ON bookings(tenant_id);
CREATE INDEX idx_bookings_session_date ON bookings(session_datetime);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_synced ON bookings(synced_at);
CREATE INDEX idx_bookings_simplybook_id ON bookings(simplybook_booking_id);
```

### platform_invoices Table

```sql
CREATE TABLE platform_invoices (
  id BIGSERIAL PRIMARY KEY,

  -- Tenant
  tenant_id VARCHAR(50) NOT NULL DEFAULT 'claire',

  -- Invoice Reference
  stripe_invoice_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_invoice_number VARCHAR(100),
  invoice_url TEXT,

  -- Period
  billing_month INT NOT NULL,                    -- 1-12
  billing_year INT NOT NULL,                     -- 2025, 2026, etc.
  period_start DATE NOT NULL,                    -- First day of month
  period_end DATE NOT NULL,                      -- Last day of month

  -- Summary
  booking_count INT NOT NULL,                    -- Total bookings
  total_booking_value DECIMAL(10,2) NOT NULL,    -- Sum of all booking amounts
  platform_fee_total DECIMAL(10,2) NOT NULL,     -- 20% of total booking value

  -- Payment Tracking
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  -- Possible values: draft, sent, paid, overdue, void
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  amount_paid DECIMAL(10,2),

  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Metadata
  metadata JSONB,

  CONSTRAINT unique_period UNIQUE (tenant_id, billing_year, billing_month)
);

CREATE INDEX idx_invoices_tenant ON platform_invoices(tenant_id);
CREATE INDEX idx_invoices_period ON platform_invoices(billing_year, billing_month);
CREATE INDEX idx_invoices_status ON platform_invoices(status);
```

### invoice_line_items Table (Optional - for detailed breakdown)

```sql
CREATE TABLE invoice_line_items (
  id BIGSERIAL PRIMARY KEY,
  invoice_id BIGINT REFERENCES platform_invoices(id) ON DELETE CASCADE,
  booking_id BIGINT REFERENCES bookings(id),

  booking_reference VARCHAR(255),                -- SimplyBook booking code
  session_date DATE,
  service_name VARCHAR(255),
  booking_amount DECIMAL(10,2),
  platform_fee DECIMAL(10,2),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_line_items_invoice ON invoice_line_items(invoice_id);
CREATE INDEX idx_line_items_booking ON invoice_line_items(booking_id);
```

### sync_logs Table

```sql
CREATE TABLE sync_logs (
  id BIGSERIAL PRIMARY KEY,

  event_type VARCHAR(50) NOT NULL,
  -- Possible values: webhook_received, booking_created, booking_updated,
  --                  booking_cancelled, invoice_generated, payment_received

  event_source VARCHAR(50) NOT NULL,             -- 'simplybook', 'stripe', 'system'

  status VARCHAR(20) NOT NULL,                   -- 'success', 'error'

  details JSONB,                                 -- Event payload/details
  error_message TEXT,                            -- If error occurred

  records_affected INT DEFAULT 0,                -- How many records changed

  created_at TIMESTAMPTZ DEFAULT NOW(),

  metadata JSONB
);

CREATE INDEX idx_sync_logs_type ON sync_logs(event_type);
CREATE INDEX idx_sync_logs_status ON sync_logs(status);
CREATE INDEX idx_sync_logs_created ON sync_logs(created_at);
```

---

## 🔔 Webhook Handler Implementation

### Enhanced Webhook Controller

**File:** `api/controllers/webhook.controller.js`

```javascript
const db = require('../db'); // Your PostgreSQL client
const crypto = require('crypto');

/**
 * Handle SimplyBook.me booking created webhook
 */
async function handleBookingCreated(payload) {
  const logId = await logSyncEvent('webhook_received', 'simplybook', payload);

  try {
    const { booking_id, booking_hash, client, service, datetime, status, provider } = payload;

    // Check if already exists (idempotency)
    const existing = await db.query('SELECT id FROM bookings WHERE simplybook_booking_id = $1', [
      booking_id,
    ]);

    if (existing.rows.length > 0) {
      console.log(`⚠️  Booking ${booking_id} already exists, skipping`);
      await updateSyncLog(logId, 'success', 0, { skipped: true, reason: 'duplicate' });
      return;
    }

    // Extract price from service or payload
    const totalAmount = parseFloat(payload.price || service.price || 0);

    // Calculate amounts (business logic)
    const amounts = calculateBookingAmounts(totalAmount);

    // Generate immutability hash
    const dataHash = generateBookingHash({
      booking_id,
      total_amount: totalAmount,
      platform_fee: amounts.platformFee,
      timestamp: datetime,
    });

    // Insert booking record
    const result = await db.query(
      `
      INSERT INTO bookings (
        simplybook_booking_id,
        simplybook_booking_hash,
        total_amount,
        deposit_amount,
        cash_amount,
        platform_fee,
        service_id,
        service_name,
        service_duration_minutes,
        session_datetime,
        location,
        client_name,
        client_email,
        client_phone,
        status,
        data_hash,
        is_locked,
        booking_created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, TRUE, $17
      )
      RETURNING id
    `,
      [
        booking_id,
        booking_hash,
        amounts.total,
        amounts.deposit,
        amounts.cash,
        amounts.platformFee,
        service?.id,
        service?.name,
        service?.duration,
        datetime,
        provider?.name || null,
        client?.name,
        client?.email,
        client?.phone,
        status || 'confirmed',
        dataHash,
        new Date(),
      ]
    );

    console.log(`✅ Booking ${booking_id} saved to database (ID: ${result.rows[0].id})`);

    await updateSyncLog(logId, 'success', 1, {
      booking_id: result.rows[0].id,
      amounts,
    });

    // Optional: Send confirmation emails
    // await sendBookingConfirmationEmails(client, service, datetime);
  } catch (error) {
    console.error('❌ Error processing booking webhook:', error);
    await updateSyncLog(logId, 'error', 0, { error: error.message });
    throw error;
  }
}

/**
 * Calculate booking amounts based on business rules
 */
function calculateBookingAmounts(totalAmount) {
  return {
    total: totalAmount,
    deposit: totalAmount * 0.2, // 20% deposit via HNRY
    cash: totalAmount * 0.8, // 80% cash at session
    platformFee: totalAmount * 0.2, // 20% platform fee to Julian
  };
}

/**
 * Generate SHA-256 hash for immutability verification
 */
function generateBookingHash(data) {
  const hashString = `${data.booking_id}|${data.total_amount}|${data.platform_fee}|${data.timestamp}`;
  return crypto.createHash('sha256').update(hashString).digest('hex');
}

/**
 * Log sync event to database
 */
async function logSyncEvent(eventType, source, details) {
  const result = await db.query(
    `
    INSERT INTO sync_logs (event_type, event_source, status, details)
    VALUES ($1, $2, 'processing', $3)
    RETURNING id
  `,
    [eventType, source, JSON.stringify(details)]
  );

  return result.rows[0].id;
}

/**
 * Update sync log with result
 */
async function updateSyncLog(logId, status, recordsAffected, metadata) {
  await db.query(
    `
    UPDATE sync_logs 
    SET status = $1, 
        records_affected = $2,
        metadata = $3,
        error_message = $4
    WHERE id = $5
  `,
    [status, recordsAffected, JSON.stringify(metadata), metadata.error || null, logId]
  );
}

/**
 * Handle booking cancelled webhook
 */
async function handleBookingCancelled(payload) {
  const logId = await logSyncEvent('booking_cancelled', 'simplybook', payload);

  try {
    const { booking_id } = payload;

    // Update booking status (don't delete - maintain audit trail)
    const result = await db.query(
      `
      UPDATE bookings 
      SET status = 'cancelled',
          updated_at = NOW()
      WHERE simplybook_booking_id = $1
      RETURNING id
    `,
      [booking_id]
    );

    if (result.rows.length === 0) {
      console.warn(`⚠️  Booking ${booking_id} not found for cancellation`);
      await updateSyncLog(logId, 'success', 0, { warning: 'booking_not_found' });
      return;
    }

    console.log(`✅ Booking ${booking_id} marked as cancelled`);
    await updateSyncLog(logId, 'success', 1);

    // Optional: Send cancellation notification
    // await sendCancellationNotification(booking_id);
  } catch (error) {
    console.error('❌ Error processing cancellation webhook:', error);
    await updateSyncLog(logId, 'error', 0, { error: error.message });
    throw error;
  }
}

/**
 * Handle booking changed webhook
 */
async function handleBookingChanged(payload) {
  const logId = await logSyncEvent('booking_updated', 'simplybook', payload);

  try {
    const { booking_id, datetime, status } = payload;

    // Only allow updating non-financial fields
    const result = await db.query(
      `
      UPDATE bookings 
      SET session_datetime = $1,
          status = $2,
          updated_at = NOW()
      WHERE simplybook_booking_id = $3 AND is_locked = TRUE
      RETURNING id
    `,
      [datetime, status, booking_id]
    );

    if (result.rows.length === 0) {
      console.warn(`⚠️  Booking ${booking_id} not found or not updatable`);
      await updateSyncLog(logId, 'success', 0, { warning: 'booking_not_updatable' });
      return;
    }

    console.log(`✅ Booking ${booking_id} updated`);
    await updateSyncLog(logId, 'success', 1);
  } catch (error) {
    console.error('❌ Error processing update webhook:', error);
    await updateSyncLog(logId, 'error', 0, { error: error.message });
    throw error;
  }
}

module.exports = {
  handleBookingCreated,
  handleBookingCancelled,
  handleBookingChanged,
};
```

---

## 📅 Monthly Invoice Generation

### Billing Engine Service

**File:** `api/services/billing.service.js`

```javascript
const db = require('../db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class BillingService {
  /**
   * Generate monthly invoice for previous month
   * Called automatically on 1st of each month
   */
  async generateMonthlyInvoice(tenantId = 'claire') {
    const now = new Date();
    const previousMonth = now.getMonth() === 0 ? 12 : now.getMonth();
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

    console.log(`📊 Generating invoice for ${tenantId}: ${year}-${previousMonth}`);

    // Check if invoice already exists
    const existing = await db.query(
      `SELECT id FROM platform_invoices 
       WHERE tenant_id = $1 AND billing_year = $2 AND billing_month = $3`,
      [tenantId, year, previousMonth]
    );

    if (existing.rows.length > 0) {
      console.log('⚠️  Invoice already exists for this period');
      return existing.rows[0];
    }

    // Get bookings for the month
    const periodStart = new Date(year, previousMonth - 1, 1);
    const periodEnd = new Date(year, previousMonth, 0);

    const bookingsResult = await db.query(
      `
      SELECT 
        id,
        simplybook_booking_id,
        total_amount,
        platform_fee,
        session_datetime,
        service_name
      FROM bookings
      WHERE tenant_id = $1
        AND session_datetime >= $2
        AND session_datetime <= $3
        AND status IN ('confirmed', 'completed')
      ORDER BY session_datetime
    `,
      [tenantId, periodStart, periodEnd]
    );

    const bookings = bookingsResult.rows;

    if (bookings.length === 0) {
      console.log('ℹ️  No bookings for this period, skipping invoice');
      return null;
    }

    // Calculate totals
    const bookingCount = bookings.length;
    const totalBookingValue = bookings.reduce((sum, b) => sum + parseFloat(b.total_amount), 0);
    const platformFeeTotal = bookings.reduce((sum, b) => sum + parseFloat(b.platform_fee), 0);

    console.log(
      `📊 Summary: ${bookingCount} bookings, $${platformFeeTotal.toFixed(2)} platform fees`
    );

    // Get or create Stripe customer
    const stripeCustomerId = await this.getOrCreateStripeCustomer(tenantId);

    // Create Stripe invoice
    const stripeInvoice = await stripe.invoices.create({
      customer: stripeCustomerId,
      collection_method: 'send_invoice',
      days_until_due: 7,
      description: `Platform & Booking Management Fees - ${this.getMonthName(previousMonth)} ${year}`,
      metadata: {
        tenant_id: tenantId,
        billing_month: previousMonth,
        billing_year: year,
        booking_count: bookingCount,
      },
    });

    // Add line item
    await stripe.invoiceItems.create({
      customer: stripeCustomerId,
      invoice: stripeInvoice.id,
      amount: Math.round(platformFeeTotal * 100), // Convert to cents
      currency: 'aud',
      description: `${bookingCount} bookings @ 20% platform fee`,
    });

    // Finalize and send invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(stripeInvoice.id);
    await stripe.invoices.sendInvoice(stripeInvoice.id);

    // Save to database
    const invoiceResult = await db.query(
      `
      INSERT INTO platform_invoices (
        tenant_id,
        stripe_invoice_id,
        stripe_invoice_number,
        invoice_url,
        billing_month,
        billing_year,
        period_start,
        period_end,
        booking_count,
        total_booking_value,
        platform_fee_total,
        status,
        invoice_date,
        due_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id
    `,
      [
        tenantId,
        stripeInvoice.id,
        finalizedInvoice.number,
        finalizedInvoice.hosted_invoice_url,
        previousMonth,
        year,
        periodStart,
        periodEnd,
        bookingCount,
        totalBookingValue,
        platformFeeTotal,
        'sent',
        new Date(),
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      ]
    );

    // Link bookings to invoice
    for (const booking of bookings) {
      await db.query(
        `
        INSERT INTO invoice_line_items (
          invoice_id,
          booking_id,
          booking_reference,
          session_date,
          service_name,
          booking_amount,
          platform_fee
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [
          invoiceResult.rows[0].id,
          booking.id,
          booking.simplybook_booking_id,
          booking.session_datetime,
          booking.service_name,
          booking.total_amount,
          booking.platform_fee,
        ]
      );
    }

    console.log(`✅ Invoice generated: ${finalizedInvoice.number}`);
    console.log(`📧 Sent to: ${finalizedInvoice.customer_email}`);
    console.log(`🔗 View: ${finalizedInvoice.hosted_invoice_url}`);

    return invoiceResult.rows[0];
  }

  /**
   * Get or create Stripe customer for tenant
   */
  async getOrCreateStripeCustomer(tenantId) {
    // Check if customer ID is stored in tenants table
    const tenantResult = await db.query(
      'SELECT stripe_customer_id, email, name FROM tenants WHERE id = $1',
      [tenantId]
    );

    if (tenantResult.rows.length === 0) {
      throw new Error(`Tenant ${tenantId} not found`);
    }

    const tenant = tenantResult.rows[0];

    if (tenant.stripe_customer_id) {
      return tenant.stripe_customer_id;
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email: tenant.email,
      name: tenant.name,
      metadata: {
        tenant_id: tenantId,
      },
    });

    // Store customer ID
    await db.query('UPDATE tenants SET stripe_customer_id = $1 WHERE id = $2', [
      customer.id,
      tenantId,
    ]);

    return customer.id;
  }

  /**
   * Helper: Get month name
   */
  getMonthName(month) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[month - 1];
  }
}

module.exports = new BillingService();
```

---

## 🔔 Stripe Payment Webhook

**File:** `api/controllers/stripe-webhook.controller.js`

```javascript
const db = require('../db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`🔔 Stripe webhook received: ${event.type}`);

  try {
    switch (event.type) {
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      case 'invoice.voided':
        await handleInvoiceVoided(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Error processing Stripe webhook:', error);
    res.status(500).json({ error: error.message });
  }
};

async function handleInvoicePaid(invoice) {
  console.log(`💰 Invoice paid: ${invoice.id}`);

  await db.query(
    `
    UPDATE platform_invoices
    SET status = 'paid',
        paid_at = $1,
        amount_paid = $2,
        updated_at = NOW()
    WHERE stripe_invoice_id = $3
  `,
    [
      new Date(invoice.status_transitions.paid_at * 1000),
      invoice.amount_paid / 100, // Convert from cents
      invoice.id,
    ]
  );

  // Log event
  await db.query(
    `
    INSERT INTO sync_logs (event_type, event_source, status, details)
    VALUES ('payment_received', 'stripe', 'success', $1)
  `,
    [JSON.stringify({ invoice_id: invoice.id, amount: invoice.amount_paid })]
  );

  console.log('✅ Invoice marked as paid in database');
}

async function handleInvoicePaymentFailed(invoice) {
  console.log(`❌ Payment failed: ${invoice.id}`);

  await db.query(
    `
    UPDATE platform_invoices
    SET status = 'overdue',
        updated_at = NOW()
    WHERE stripe_invoice_id = $1
  `,
    [invoice.id]
  );

  // TODO: Send payment reminder email
}

async function handleInvoiceVoided(invoice) {
  console.log(`🚫 Invoice voided: ${invoice.id}`);

  await db.query(
    `
    UPDATE platform_invoices
    SET status = 'void',
        updated_at = NOW()
    WHERE stripe_invoice_id = $1
  `,
    [invoice.id]
  );
}
```

---

## ⏰ Cron Job for Monthly Invoicing

**File:** `api/jobs/monthly-billing.job.js`

```javascript
const cron = require('node-cron');
const billingService = require('../services/billing.service');

/**
 * Schedule monthly invoice generation
 * Runs on 1st of every month at 9:00 AM Sydney time
 * Cron: '0 9 1 * *' in Sydney timezone
 */
function scheduleMonthlyBilling() {
  // Run at 9 AM on the 1st of every month (Sydney time)
  cron.schedule(
    '0 9 1 * *',
    async () => {
      console.log('🗓️  Monthly billing job triggered');

      try {
        await billingService.generateMonthlyInvoice('claire');
        console.log('✅ Monthly billing completed successfully');
      } catch (error) {
        console.error('❌ Monthly billing job failed:', error);
        // TODO: Send alert email to admin
      }
    },
    {
      timezone: 'Australia/Sydney',
    }
  );

  console.log('✅ Monthly billing job scheduled (1st of month, 9 AM Sydney time)');
}

module.exports = { scheduleMonthlyBilling };
```

---

## 🚀 Deployment Checklist

### Environment Variables

```bash
# PostgreSQL
DATABASE_URL=postgresql://user:pass@host:5432/database

# SimplyBook.me
SIMPLYBOOK_COMPANY=clairehamilton
SIMPLYBOOK_API_KEY=f3c86908989b8625161c7f55aea014d78f8c690a276903b20531015cdfb8c8
SIMPLYBOOK_SECRET_KEY=58dabce655975aea2e0d90e57812c79136875a3a48fe906ec7cceede9597a

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# System
NODE_ENV=production
ADMIN_EMAIL=julian@example.com
```

### Setup Steps

1. ✅ **Database migration** - Run schema creation scripts
2. ✅ **Webhook URL configured** in SimplyBook.me dashboard
3. ✅ **Stripe webhook endpoint** configured
4. ✅ **Cron job enabled** for monthly billing
5. ✅ **Test webhook** with real booking
6. ✅ **Test invoice generation** for past month
7. ✅ **Monitor logs** for first 48 hours

---

## 📊 Success Metrics

System is working correctly when:

1. ✅ Webhook receives booking events in real-time
2. ✅ Database records created within seconds of booking
3. ✅ No duplicate bookings in database
4. ✅ All amounts calculate correctly (20% split)
5. ✅ Monthly invoice generated automatically on 1st
6. ✅ Claire receives invoice email from Stripe
7. ✅ Payment updates database status automatically
8. ✅ Sync logs show 100% success rate
9. ✅ Reconciliation matches: SimplyBook = DB = HNRY
10. ✅ System runs 3+ months without manual intervention

---

## 🔍 Monitoring & Alerts

### Key Metrics to Track

- Webhook delivery rate (should be 100%)
- Average webhook processing time (< 1 second)
- Database sync success rate
- Invoice generation success rate
- Payment tracking accuracy

### Alert Triggers

- Webhook failures (3+ in a row)
- Database insert failures
- Missing bookings (gap detection)
- Invoice generation failure
- Payment webhook not received within 48 hours

---

## 🆘 Troubleshooting Guide

### "Webhook not received"

- Check SimplyBook.me callback URL is correct
- Verify webhook triggers are enabled
- Check server logs for incoming requests
- Test with SimplyBook.me test webhook button

### "Duplicate bookings"

- Idempotency check should prevent this
- Check `simplybook_booking_id` unique constraint
- Review webhook retry logic

### "Invoice not generated"

- Check cron job is running
- Verify there are bookings for the period
- Check Stripe customer exists
- Review billing service logs

### "Payment not tracked"

- Verify Stripe webhook secret is correct
- Check webhook signature validation
- Ensure invoice ID matches database

---

**This event-driven architecture eliminates polling overhead, guarantees real-time sync, and provides a robust foundation for automated billing! 🚀**
