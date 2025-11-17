# 🚀 Billing Tracker Deployment Guide

## Overview

Simple automated billing system that:

- Syncs bookings from SimplyBook.me via webhooks (real-time)
- Tracks financial records (immutable)
- Generates monthly PDF invoices
- Email invoices to Claire
- Track payments manually (bank transfer)

**No Stripe, no payment gateway** - Just automated record keeping and invoicing.

---

## ✅ Prerequisites

- ✅ DigitalOcean App Platform (already deployed)
- ✅ PostgreSQL database (already running)
- ✅ SimplyBook.me webhook configured (already done)
- ✅ SendGrid for emails (already configured)

---

## 📋 Step 1: Apply Database Schema

### Option A: Using psql (Recommended)

```bash
# Get your database connection string from DigitalOcean
# Format: postgresql://user:pass@host:port/dbname?sslmode=require

# Apply the schema
psql "your-connection-string-here" -f db/schema.sql
```

### Option B: Using DigitalOcean Console

1. Go to https://cloud.digitalocean.com/databases
2. Click your PostgreSQL database
3. Click **Console** tab
4. Copy/paste contents of `db/schema.sql`
5. Execute

### What Gets Created

**New Tables:**

- `tenants` - Claire's business info (already seeded)
- `simplybook_bookings` - Financial records from webhooks
- `platform_invoices` - Monthly invoices
- `invoice_line_items` - Detailed breakdowns
- `sync_logs` - Audit trail
- `payment_reconciliation` - Track deposits vs bookings
- `notification_queue` - Email queue

**Functions & Triggers:**

- Auto-generate invoice numbers
- Immutability protection for financial records
- Auto-update timestamps

---

## 🔧 Step 2: Update API Server

### Add These Files to `/api`

**1. Database Client** (`api/db/index.js`)

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
```

**2. Enhanced Webhook Handler** (`api/controllers/webhook.controller.js`)

Update the existing `handleBookingCreated` function to save to database.

**3. Billing Service** (`api/services/billing.service.js`)

Generates monthly invoices and PDFs.

**4. Cron Job** (`api/jobs/monthly-billing.job.js`)

Runs on 1st of each month.

---

## 🔔 Step 3: Enhance Webhook Handler

Update `api/controllers/webhook.controller.js`:

```javascript
const db = require('../db');
const crypto = require('crypto');

async function handleBookingCreated(payload) {
  const logId = await logSyncEvent('webhook_received', 'simplybook', payload);

  try {
    const { booking_id, booking_hash, client, service, datetime, status, provider, price } =
      payload;

    // Check if already exists
    const existing = await db.query(
      'SELECT id FROM simplybook_bookings WHERE simplybook_booking_id = $1 AND tenant_id = $2',
      [booking_id, 'claire']
    );

    if (existing.rows.length > 0) {
      console.log(`⚠️  Booking ${booking_id} already exists, skipping`);
      await updateSyncLog(logId, 'success', 0, { skipped: true });
      return;
    }

    // Get tenant to check platform fee percentage
    const tenantResult = await db.query(
      'SELECT platform_fee_percentage FROM tenants WHERE id = $1',
      ['claire']
    );
    const tenant = tenantResult.rows[0];
    const feePercentage = parseFloat(tenant.platform_fee_percentage) / 100;

    // Calculate amounts (deposit always 20%, platform fee is configurable)
    const totalAmount = parseFloat(price || 0);
    const depositAmount = totalAmount * 0.2; // 20% deposit via HNRY
    const cashAmount = totalAmount * 0.8; // 80% cash at session
    const platformFee = totalAmount * feePercentage; // Configurable platform fee

    // Generate hash for immutability
    const dataHash = crypto
      .createHash('sha256')
      .update(`${booking_id}|${totalAmount}|${platformFee}|${datetime}`)
      .digest('hex');

    // Insert booking
    const result = await db.query(
      `
      INSERT INTO simplybook_bookings (
        tenant_id, simplybook_booking_id, simplybook_booking_hash,
        total_amount, deposit_amount, cash_amount, platform_fee,
        service_id, service_name, session_datetime,
        client_name, client_email, client_phone,
        status, data_hash, is_locked, booking_created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, TRUE, $16
      ) RETURNING id
    `,
      [
        'claire',
        booking_id,
        booking_hash,
        totalAmount,
        depositAmount,
        cashAmount,
        platformFee,
        service?.id,
        service?.name,
        datetime,
        client?.name,
        client?.email,
        client?.phone,
        status || 'confirmed',
        dataHash,
        new Date(),
      ]
    );

    console.log(`✅ Booking ${booking_id} saved (ID: ${result.rows[0].id})`);
    await updateSyncLog(logId, 'success', 1);
  } catch (error) {
    console.error('❌ Error:', error);
    await updateSyncLog(logId, 'error', 0, { error: error.message });
    throw error;
  }
}

async function logSyncEvent(eventType, source, details) {
  const result = await db.query(
    `
    INSERT INTO sync_logs (event_type, event_source, status, details, tenant_id)
    VALUES ($1, $2, 'processing', $3, 'claire')
    RETURNING id
  `,
    [eventType, source, JSON.stringify(details)]
  );
  return result.rows[0].id;
}

async function updateSyncLog(logId, status, recordsAffected, metadata = {}) {
  await db.query(
    `
    UPDATE sync_logs 
    SET status = $1, records_affected = $2, metadata = $3, error_message = $4
    WHERE id = $5
  `,
    [status, recordsAffected, JSON.stringify(metadata), metadata.error || null, logId]
  );
}
```

---

## 📅 Step 4: Create Monthly Billing Service

Create `api/services/billing.service.js`:

```javascript
const db = require('../db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class BillingService {
  /**
   * Generate monthly invoice for previous month
   */
  async generateMonthlyInvoice(tenantId = 'claire') {
    const now = new Date();
    const previousMonth = now.getMonth() === 0 ? 12 : now.getMonth();
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

    console.log(`📊 Generating invoice for ${tenantId}: ${year}-${previousMonth}`);

    // Check if already exists
    const existing = await db.query(
      `SELECT id FROM platform_invoices 
       WHERE tenant_id = $1 AND billing_year = $2 AND billing_month = $3`,
      [tenantId, year, previousMonth]
    );

    if (existing.rows.length > 0) {
      console.log('⚠️  Invoice already exists');
      return existing.rows[0];
    }

    // Get bookings for the period
    const periodStart = new Date(year, previousMonth - 1, 1);
    const periodEnd = new Date(year, previousMonth, 0);

    const bookingsResult = await db.query(
      `
      SELECT 
        id, simplybook_booking_id, total_amount, platform_fee,
        session_datetime, service_name, client_name
      FROM simplybook_bookings
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
      console.log('ℹ️  No bookings for this period');
      return null;
    }

    // Calculate totals
    const bookingCount = bookings.length;
    const totalBookingValue = bookings.reduce((sum, b) => sum + parseFloat(b.total_amount), 0);
    const platformFeeTotal = bookings.reduce((sum, b) => sum + parseFloat(b.platform_fee), 0);

    // Get tenant info (includes platform_fee_percentage)
    const tenantResult = await db.query('SELECT * FROM tenants WHERE id = $1', [tenantId]);
    const tenant = tenantResult.rows[0];
    const feePercentage = parseFloat(tenant.platform_fee_percentage);

    // Get tenant info
    const tenantResult = await db.query('SELECT * FROM tenants WHERE id = $1', [tenantId]);
    const tenant = tenantResult.rows[0];

    // Generate invoice number
    const invoiceNumber = await this.generateInvoiceNumber();

    // Create PDF
    const pdfPath = await this.generateInvoicePDF({
      invoiceNumber,
      tenant,
      bookings,
      periodStart,
      periodEnd,
      bookingCount,
      totalBookingValue,
      platformFeeTotal,
    });

    // Save to database
    const invoiceResult = await db.query(
      `
      INSERT INTO platform_invoices (
        tenant_id, invoice_number, invoice_pdf_path,
        billing_month, billing_year, period_start, period_end,
        booking_count, total_booking_value, platform_fee_rate,
        platform_fee_total, total_amount, status,
        invoice_date, due_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id
    `,
      [
        tenantId,
        invoiceNumber,
        pdfPath,
        previousMonth,
        year,
        periodStart,
        periodEnd,
        bookingCount,
        totalBookingValue,
        feePercentage,  // Use tenant's configured fee percentage
        platformFeeTotal,
        platformFeeTotal,
        'draft',
        new Date(),
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ]
    );

    const invoiceId = invoiceResult.rows[0].id;

    // Link bookings to invoice
    for (const booking of bookings) {
      await db.query(
        `
        INSERT INTO invoice_line_items (
          invoice_id, booking_id, booking_reference,
          session_date, service_name, client_name,
          booking_amount, platform_fee
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
        [
          invoiceId,
          booking.id,
          booking.simplybook_booking_id,
          booking.session_datetime,
          booking.service_name,
          booking.client_name,
          booking.total_amount,
          booking.platform_fee,
        ]
      );
    }

    console.log(`✅ Invoice generated: ${invoiceNumber}`);
    console.log(`📄 PDF: ${pdfPath}`);

    // TODO: Email invoice to Claire
    // await this.emailInvoice(invoiceId, tenant.email, pdfPath);

    return invoiceResult.rows[0];
  }

  async generateInvoiceNumber() {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');

    const result = await db.query(`
      SELECT generate_invoice_number('claire') AS invoice_number
    `);

    return result.rows[0].invoice_number;
  }

  async generateInvoicePDF(data) {
    // TODO: Implement PDF generation with pdfkit
    // For now, return placeholder
    return `/invoices/${data.invoiceNumber}.pdf`;
  }
}

module.exports = new BillingService();
```

---

## ⏰ Step 5: Set Up Cron Job

Create `api/jobs/monthly-billing.job.js`:

```javascript
const cron = require('node-cron');
const billingService = require('../services/billing.service');

function scheduleMonthlyBilling() {
  // Run at 9 AM on the 1st of every month (Sydney time)
  cron.schedule(
    '0 9 1 * *',
    async () => {
      console.log('🗓️  Monthly billing job triggered');

      try {
        await billingService.generateMonthlyInvoice('claire');
        console.log('✅ Monthly billing completed');
      } catch (error) {
        console.error('❌ Monthly billing failed:', error);
        // TODO: Send alert email
      }
    },
    {
      timezone: 'Australia/Sydney',
    }
  );

  console.log('✅ Monthly billing job scheduled');
}

module.exports = { scheduleMonthlyBilling };
```

Update `api/server.js` to start the cron:

```javascript
const { scheduleMonthlyBilling } = require('./jobs/monthly-billing.job');

// ... existing code ...

// Start cron jobs
if (process.env.NODE_ENV === 'production') {
  scheduleMonthlyBilling();
}
```

---

## 📦 Step 6: Install Dependencies

```bash
cd api
npm install pg node-cron pdfkit
```

---

## 🌍 Step 7: Update Environment Variables

Add to your DigitalOcean app settings (or `.env`):

```bash
# Database (auto-injected by DigitalOcean)
DATABASE_URL=${db.DATABASE_URL}

# Existing vars...
SIMPLYBOOK_API_KEY=...
SIMPLYBOOK_COMPANY=clairehamilton
```

---

## 🚀 Step 8: Deploy

```bash
# Commit changes
git add .
git commit -m "Add billing tracker with webhook integration"
git push origin main
```

DigitalOcean will auto-deploy from main branch.

---

## ✅ Step 9: Test the System

### Test Webhook

Create a test booking in SimplyBook.me and watch the logs:

```bash
# View logs in DigitalOcean Console
# Or check database:
psql "connection-string" -c "SELECT * FROM simplybook_bookings ORDER BY synced_at DESC LIMIT 5;"
```

### Test Invoice Generation

```bash
# Manually trigger (add API endpoint for this)
curl -X POST https://your-api.com/api/billing/generate?tenant=claire
```

---

## 📊 Manual Operations

### Update Platform Fee Percentage

Change Claire's platform fee (currently 20%):

```sql
-- Update to different percentage (e.g., 15%)
UPDATE tenants
SET platform_fee_percentage = 15.00,
    updated_at = NOW()
WHERE id = 'claire';
```

**Note:** This only affects NEW bookings synced after the change. Existing bookings retain their original platform fee.

Or via API endpoint (create this in your routes):

```javascript
// PUT /api/tenants/:tenantId/fee
app.put('/api/tenants/:tenantId/fee', async (req, res) => {
  const { tenantId } = req.params;
  const { percentage } = req.body;

  if (!percentage || percentage < 0 || percentage > 100) {
    return res.status(400).json({ error: 'Invalid percentage (0-100)' });
  }

  await db.query(
    'UPDATE tenants SET platform_fee_percentage = $1, updated_at = NOW() WHERE id = $2',
    [percentage, tenantId]
  );

  res.json({ 
    success: true, 
    message: `Platform fee updated to ${percentage}%`,
    note: 'Only affects new bookings'
  });
});
```

### Mark Invoice as Paid

When Claire pays via bank transfer:

```sql
UPDATE platform_invoices
SET status = 'paid',
    paid_at = NOW(),
    amount_paid = total_amount,
    payment_method = 'bank_transfer',
    payment_reference = 'Bank ref: 123456'
WHERE invoice_number = 'INV-2025-11-001';
```

### View Outstanding Invoices

```sql
SELECT * FROM v_outstanding_invoices;
```

### Monthly Summary

```sql
SELECT * FROM v_monthly_booking_summary
WHERE tenant_id = 'claire'
ORDER BY month DESC
LIMIT 12;
```

---

## 🎯 Success Checklist

- [ ] Schema applied to production database
- [ ] Claire seeded as tenant in database
- [ ] Webhook handler saves bookings to database
- [ ] Test booking syncs successfully
- [ ] Cron job scheduled for monthly billing
- [ ] Invoice generation tested
- [ ] PDF generation works
- [ ] Email delivery configured
- [ ] Manual payment tracking tested

---

## 🆘 Troubleshooting

### Bookings not syncing

- Check SimplyBook webhook URL is correct
- Check sync_logs table for errors
- Verify DATABASE_URL in production

### Invoice generation fails

- Check bookings exist for the period
- Verify tenant exists in tenants table
- Check cron timezone is correct

### Database connection issues

- Verify SSL mode in connection string
- Check connection pool settings
- Test connection with psql

---

**Simple, automated, no payment gateway needed! 🎉**
