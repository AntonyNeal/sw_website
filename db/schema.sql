-- Claire Hamilton Website Database Schema
-- Created: 2025-11-05
-- Purpose: Support booking system, analytics, and UTM attribution tracking

-- ============================================================================
-- 1. USER SESSIONS TABLE
-- Tracks visitor sessions for A/B testing and UTM attribution
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(64) NOT NULL UNIQUE,  -- Hashed ID: hash(IP + user_agent)
  session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  session_end TIMESTAMP,
  
  -- UTM Attribution Tracking
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_content VARCHAR(255),
  utm_term VARCHAR(255),
  
  -- Device & Network Info
  device_type VARCHAR(50),  -- mobile, tablet, desktop
  user_agent TEXT,
  ip_address_hash VARCHAR(64),  -- Hashed for privacy (DO NOT store raw IP)
  referrer VARCHAR(2048),
  
  -- A/B Testing Fields
  test_name VARCHAR(100),
  variant VARCHAR(50),
  
  -- Session Metadata
  page_count INT DEFAULT 1,
  last_page_visited VARCHAR(2048),
  converted_to_booking BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Auto-expire after 30 days (optional - can be handled by application)
  CONSTRAINT session_duration CHECK (session_end IS NULL OR session_end > session_start)
);

-- Indexes for session lookups
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_utm_source ON user_sessions(utm_source);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_start ON user_sessions(session_start);
CREATE INDEX IF NOT EXISTS idx_user_sessions_converted ON user_sessions(converted_to_booking) WHERE converted_to_booking = TRUE;

-- ============================================================================
-- 2. BOOKINGS TABLE
-- Stores all booking submissions with complete customer & appointment details
-- ============================================================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Customer Information
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(50),
  
  -- Appointment Details
  appointment_type VARCHAR(255) NOT NULL,  -- e.g., "dinner-date", "companionship"
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  notes TEXT,
  
  -- Booking Status
  status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- pending, confirmed, cancelled
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  
  payment_status VARCHAR(50) NOT NULL DEFAULT 'unpaid',  -- unpaid, paid, refunded
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  
  -- Booking Identification
  confirmation_number VARCHAR(20) NOT NULL UNIQUE,  -- Format: CH-YYYYMMDD-###
  
  -- UTM Attribution (Denormalized from session for query convenience)
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_content VARCHAR(255),
  utm_term VARCHAR(255),
  
  -- Session Relationship
  user_session_id UUID,
  CONSTRAINT fk_user_session FOREIGN KEY (user_session_id) REFERENCES user_sessions(id) ON DELETE SET NULL,
  
  -- Metadata
  created_ip_hash VARCHAR(64),  -- Hashed IP for rate limiting
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT future_appointment CHECK (appointment_date > CURRENT_DATE OR (appointment_date = CURRENT_DATE AND appointment_time > CURRENT_TIME))
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_appointment_date ON bookings(appointment_date);
CREATE INDEX IF NOT EXISTS idx_bookings_utm_source ON bookings(utm_source);
CREATE INDEX IF NOT EXISTS idx_bookings_confirmation_number ON bookings(confirmation_number);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_user_session_id ON bookings(user_session_id);

-- Composite index for analytics queries
CREATE INDEX IF NOT EXISTS idx_bookings_utm_date ON bookings(utm_source, appointment_date);

-- ============================================================================
-- 3. CONVERSIONS TABLE
-- Tracks conversion events throughout the customer journey
-- ============================================================================
CREATE TABLE IF NOT EXISTS conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Event Information
  event_type VARCHAR(100) NOT NULL,  -- inquiry_submitted, booking_confirmed, payment_completed, etc.
  event_data JSONB DEFAULT '{}',  -- Flexible metadata (button clicked, form field, etc.)
  
  -- Relationship to Session
  user_session_id UUID NOT NULL,
  CONSTRAINT fk_session FOREIGN KEY (user_session_id) REFERENCES user_sessions(id) ON DELETE CASCADE,
  
  -- Relationship to Booking (optional - only for booking-related events)
  booking_id UUID,
  CONSTRAINT fk_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT event_type_check CHECK (event_type IN (
    'page_view', 
    'cta_click', 
    'form_opened', 
    'form_step_completed', 
    'form_abandoned',
    'inquiry_submitted', 
    'booking_confirmed', 
    'payment_completed',
    'email_sent',
    'custom_event'
  ))
);

-- Indexes for analytics
CREATE INDEX IF NOT EXISTS idx_conversions_event_type ON conversions(event_type);
CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON conversions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversions_user_session_id ON conversions(user_session_id);
CREATE INDEX IF NOT EXISTS idx_conversions_booking_id ON conversions(booking_id) WHERE booking_id IS NOT NULL;

-- Composite index for event funnel analysis
CREATE INDEX IF NOT EXISTS idx_conversions_session_event ON conversions(user_session_id, event_type, created_at);

-- ============================================================================
-- 4. EMAIL LOGS TABLE
-- Track all email sends for debugging and compliance
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Email Details
  recipient_email VARCHAR(255) NOT NULL,
  email_type VARCHAR(100) NOT NULL,  -- booking_confirmation, claire_notification, etc.
  subject VARCHAR(255),
  
  -- Status Tracking
  status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- pending, sent, failed, bounced
  CONSTRAINT valid_email_status CHECK (status IN ('pending', 'sent', 'failed', 'bounced', 'deferred')),
  
  send_attempts INT DEFAULT 0,
  last_error VARCHAR(500),
  
  -- Relationship to Booking
  booking_id UUID,
  CONSTRAINT fk_email_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
  
  -- SendGrid Reference
  sendgrid_message_id VARCHAR(255),
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sent_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for email operations
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_booking_id ON email_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);

-- ============================================================================
-- 5. PAYMENTS TABLE (Prepared for Phase 2)
-- Structure ready for payment processing integration
-- ============================================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Booking Reference
  booking_id UUID NOT NULL,
  CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE RESTRICT,
  
  -- Payment Details
  amount_cents INT NOT NULL,  -- Store as cents to avoid floating point issues
  currency VARCHAR(3) DEFAULT 'AUD',
  
  -- Payment Gateway Info
  payment_gateway VARCHAR(50),  -- eway, tyro, stripe, etc.
  payment_id VARCHAR(255) UNIQUE,  -- Gateway's transaction ID
  status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- pending, completed, failed, refunded
  CONSTRAINT valid_payment_status_check CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  
  -- Payment Method
  payment_method VARCHAR(50),  -- payid, card, etc.
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Error Tracking
  error_message TEXT
);

-- Indexes for payment lookups
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- ============================================================================
-- 6. AB TESTS TABLE (Prepared for Phase 2)
-- Store A/B test results for statistical analysis
-- ============================================================================
CREATE TABLE IF NOT EXISTS ab_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Test Configuration
  test_name VARCHAR(100) NOT NULL,
  variant VARCHAR(50) NOT NULL,
  
  -- Event Tracking
  user_session_id UUID NOT NULL,
  CONSTRAINT fk_test_session FOREIGN KEY (user_session_id) REFERENCES user_sessions(id) ON DELETE CASCADE,
  
  booking_id UUID,
  CONSTRAINT fk_test_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
  
  -- Conversion Result
  event_type VARCHAR(100),
  converted BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for test analysis
CREATE INDEX IF NOT EXISTS idx_ab_test_name ON ab_test_results(test_name);
CREATE INDEX IF NOT EXISTS idx_ab_test_variant ON ab_test_results(test_name, variant);
CREATE INDEX IF NOT EXISTS idx_ab_test_converted ON ab_test_results(converted);
CREATE INDEX IF NOT EXISTS idx_ab_test_session ON ab_test_results(user_session_id);

-- ============================================================================
-- 7. HELPER FUNCTIONS
-- ============================================================================

-- Function to generate confirmation numbers (CH-YYYYMMDD-###)
CREATE OR REPLACE FUNCTION generate_confirmation_number()
RETURNS VARCHAR(20) AS $$
DECLARE
  v_date_part VARCHAR(8);
  v_seq_part INT;
  v_confirmation_number VARCHAR(20);
BEGIN
  v_date_part := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
  
  -- Get sequence number for today (reset daily)
  v_seq_part := (
    SELECT COALESCE(MAX(CAST(SUBSTRING(confirmation_number, 12) AS INT)), 0) + 1
    FROM bookings
    WHERE confirmation_number LIKE 'CH-' || v_date_part || '-%'
  );
  
  v_confirmation_number := 'CH-' || v_date_part || '-' || LPAD(v_seq_part::TEXT, 3, '0');
  
  RETURN v_confirmation_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 8. TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Update user_sessions.converted_to_booking when booking is confirmed
CREATE OR REPLACE FUNCTION update_session_conversion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' THEN
    UPDATE user_sessions
    SET converted_to_booking = TRUE, updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.user_session_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_booking_conversion
AFTER UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_session_conversion();

-- Update booking updated_at timestamp
CREATE OR REPLACE FUNCTION update_booking_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_booking_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_booking_timestamp();

-- Update email_logs timestamp
CREATE OR REPLACE FUNCTION update_email_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_email_updated_at
BEFORE UPDATE ON email_logs
FOR EACH ROW
EXECUTE FUNCTION update_email_timestamp();

-- ============================================================================
-- 9. DATA RETENTION & CLEANUP (Optional - run as scheduled job)
-- ============================================================================

-- Auto-expire old sessions (30+ days)
-- Run periodically: SELECT cleanup_expired_sessions();
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INT AS $$
DECLARE
  v_deleted_count INT;
BEGIN
  DELETE FROM user_sessions
  WHERE session_start < NOW() - INTERVAL '30 days'
    AND converted_to_booking = FALSE;
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 10. GRANTS & SECURITY
-- ============================================================================

-- Create restricted database user for application (if using DigitalOcean Managed DB)
-- Uncomment and adjust if you have a separate app user:
/*
CREATE ROLE app_user WITH PASSWORD 'secure_password';

GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Restrict delete permissions for safety
REVOKE DELETE ON bookings FROM app_user;
REVOKE DELETE ON user_sessions FROM app_user;
*/

-- ============================================================================
-- 11. SAMPLE DATA (For testing - remove in production)
-- ============================================================================

-- Commented out sample data (uncomment to populate test data)
/*
INSERT INTO user_sessions (user_id, utm_source, utm_medium, utm_campaign, device_type)
VALUES 
  ('user_hash_001', 'instagram', 'bio_link', 'january_promo', 'mobile'),
  ('user_hash_002', 'reddit', 'post', 'sw_community', 'desktop');

INSERT INTO bookings (
  first_name, last_name, email, phone, appointment_type, 
  appointment_date, appointment_time, confirmation_number, 
  utm_source, user_session_id
)
SELECT 
  'Test', 'Customer', 'test@example.com', '0400000000', 
  'dinner-date', CURRENT_DATE + INTERVAL '1 day', '19:00:00', 
  generate_confirmation_number(), 'instagram', id
FROM user_sessions
LIMIT 1;
*/

-- ============================================================================
-- 12. TENANTS TABLE
-- Multi-tenant support for managing different clients/businesses
-- ============================================================================
CREATE TABLE IF NOT EXISTS tenants (
  id VARCHAR(50) PRIMARY KEY,  -- e.g., 'claire', 'other-client'
  
  -- Business Information
  business_name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  
  -- Contact Details
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  
  -- Domain Configuration
  primary_domain VARCHAR(255) UNIQUE,
  custom_domains TEXT[],  -- Array of additional domains
  
  -- Billing Configuration
  billing_method VARCHAR(50) DEFAULT 'manual',  -- manual, bank_transfer, etc.
  CONSTRAINT valid_billing_method CHECK (billing_method IN ('manual', 'bank_transfer', 'direct_debit')),,
  
  -- SimplyBook.me Integration
  simplybook_company VARCHAR(255),
  simplybook_api_key TEXT,  -- Encrypted in production
  
  -- Status & Settings
  status VARCHAR(50) DEFAULT 'active',  -- active, suspended, cancelled
  CONSTRAINT valid_tenant_status CHECK (status IN ('active', 'suspended', 'cancelled')),
  
  settings JSONB DEFAULT '{}',  -- Custom settings per tenant
  
  -- Billing Configuration
  platform_fee_percentage DECIMAL(5,2) DEFAULT 20.00,  -- Default 20%
  billing_email VARCHAR(255),  -- Override for billing notifications
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_billed_at TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenants_primary_domain ON tenants(primary_domain);

-- ============================================================================
-- 13. SIMPLYBOOK BOOKINGS TABLE
-- Financial records synced from SimplyBook.me (immutable after creation)
-- ============================================================================
CREATE TABLE IF NOT EXISTS simplybook_bookings (
  id BIGSERIAL PRIMARY KEY,
  
  -- Tenant Relationship
  tenant_id VARCHAR(50) NOT NULL,
  CONSTRAINT fk_simplybook_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT,
  
  -- SimplyBook.me Reference (must be unique per tenant)
  simplybook_booking_id VARCHAR(255) NOT NULL,
  simplybook_booking_hash VARCHAR(255),
  simplybook_booking_code VARCHAR(100),
  
  -- Financial Data (immutable after creation - locked for audit)
  total_amount DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2) NOT NULL,  -- Typically 20% via HNRY PayID
  cash_amount DECIMAL(10,2) NOT NULL,     -- Typically 80% cash at session
  platform_fee DECIMAL(10,2) NOT NULL,    -- Platform commission (20% of total)
  currency VARCHAR(3) DEFAULT 'AUD',
  
  -- Session Details
  service_id VARCHAR(50),
  service_name VARCHAR(255) NOT NULL,
  service_duration_minutes INT,
  session_datetime TIMESTAMPTZ NOT NULL,
  session_end_datetime TIMESTAMPTZ,
  location VARCHAR(255),
  provider_name VARCHAR(255),
  
  -- Client Info (encrypted in production for privacy)
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50),
  
  -- Booking Status
  status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
  CONSTRAINT valid_booking_status CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show', 'rescheduled')),
  
  -- Payment Tracking
  deposit_received BOOLEAN DEFAULT FALSE,
  deposit_received_at TIMESTAMPTZ,
  cash_received BOOLEAN DEFAULT FALSE,
  cash_received_at TIMESTAMPTZ,
  
  -- Immutability & Audit Trail
  data_hash VARCHAR(64) NOT NULL,  -- SHA-256 hash of key financial fields
  is_locked BOOLEAN DEFAULT TRUE,  -- Prevents modifications to financial fields
  
  -- Link to Website Booking (if originated from our frontend)
  website_booking_id UUID,
  CONSTRAINT fk_website_booking FOREIGN KEY (website_booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
  
  -- Timestamps
  booking_created_at TIMESTAMPTZ NOT NULL,  -- When booking was made in SimplyBook
  synced_at TIMESTAMPTZ DEFAULT NOW(),      -- When we received webhook
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  
  -- Metadata
  notes TEXT,
  internal_notes TEXT,  -- Private notes not visible to client
  metadata JSONB,       -- Additional flexible data
  
  -- Constraints
  CONSTRAINT unique_simplybook_booking UNIQUE (tenant_id, simplybook_booking_id),
  CONSTRAINT valid_amounts CHECK (
    total_amount > 0 AND
    deposit_amount >= 0 AND
    cash_amount >= 0 AND
    platform_fee >= 0 AND
    deposit_amount + cash_amount = total_amount AND
    platform_fee <= total_amount
  ),
  CONSTRAINT valid_datetimes CHECK (session_end_datetime IS NULL OR session_end_datetime > session_datetime)
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_sb_bookings_tenant ON simplybook_bookings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sb_bookings_session_date ON simplybook_bookings(session_datetime);
CREATE INDEX IF NOT EXISTS idx_sb_bookings_status ON simplybook_bookings(status);
CREATE INDEX IF NOT EXISTS idx_sb_bookings_synced ON simplybook_bookings(synced_at);
CREATE INDEX IF NOT EXISTS idx_sb_bookings_simplybook_id ON simplybook_bookings(simplybook_booking_id);
CREATE INDEX IF NOT EXISTS idx_sb_bookings_client_email ON simplybook_bookings(client_email);
CREATE INDEX IF NOT EXISTS idx_sb_bookings_locked ON simplybook_bookings(is_locked) WHERE is_locked = TRUE;

-- Composite indexes for reporting
CREATE INDEX IF NOT EXISTS idx_sb_bookings_tenant_date ON simplybook_bookings(tenant_id, session_datetime);
CREATE INDEX IF NOT EXISTS idx_sb_bookings_tenant_status ON simplybook_bookings(tenant_id, status);

-- ============================================================================
-- 14. PLATFORM INVOICES TABLE
-- Monthly invoices to tenants for platform fees
-- ============================================================================
CREATE TABLE IF NOT EXISTS platform_invoices (
  id BIGSERIAL PRIMARY KEY,
  
  -- Tenant Relationship
  tenant_id VARCHAR(50) NOT NULL,
  CONSTRAINT fk_invoice_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT,
  
  -- Invoice Reference
  invoice_number VARCHAR(100) UNIQUE NOT NULL,  -- Our internal number (e.g., INV-2025-11-001)
  invoice_pdf_path TEXT,                        -- Path to generated PDF invoice
  invoice_sent_via VARCHAR(50),                 -- email, manual, etc.
  
  -- Billing Period
  billing_month INT NOT NULL CHECK (billing_month BETWEEN 1 AND 12),
  billing_year INT NOT NULL CHECK (billing_year >= 2025),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Summary Amounts
  booking_count INT NOT NULL DEFAULT 0,
  total_booking_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  platform_fee_rate DECIMAL(5,2) NOT NULL,      -- Percentage used (e.g., 20.00)
  platform_fee_total DECIMAL(10,2) NOT NULL,    -- Total fees owed
  currency VARCHAR(3) DEFAULT 'AUD',
  
  -- Adjustments (credits, discounts, etc.)
  adjustment_amount DECIMAL(10,2) DEFAULT 0,
  adjustment_reason TEXT,
  
  -- Final Amount
  total_amount DECIMAL(10,2) NOT NULL,  -- platform_fee_total + adjustment_amount
  
  -- Payment Tracking
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  CONSTRAINT valid_invoice_status CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'void', 'partially_paid')),
  
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  amount_paid DECIMAL(10,2),
  
  -- Payment Method
  payment_method VARCHAR(50),  -- bank_transfer, cash, cheque, etc.
  payment_reference VARCHAR(255),  -- Bank reference, cheque number, etc.
  bank_transaction_id VARCHAR(255),
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  voided_at TIMESTAMPTZ,
  
  -- Metadata
  notes TEXT,
  metadata JSONB,
  
  -- Constraints
  CONSTRAINT unique_billing_period UNIQUE (tenant_id, billing_year, billing_month),
  CONSTRAINT valid_period CHECK (period_end >= period_start),
  CONSTRAINT valid_due_date CHECK (due_date >= invoice_date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_invoices_tenant ON platform_invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_period ON platform_invoices(billing_year, billing_month);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON platform_invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON platform_invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON platform_invoices(invoice_number);

-- Composite index for tenant billing history
CREATE INDEX IF NOT EXISTS idx_invoices_tenant_period ON platform_invoices(tenant_id, billing_year DESC, billing_month DESC);

-- ============================================================================
-- 15. INVOICE LINE ITEMS TABLE
-- Detailed breakdown of bookings included in each invoice
-- ============================================================================
CREATE TABLE IF NOT EXISTS invoice_line_items (
  id BIGSERIAL PRIMARY KEY,
  
  -- Invoice Relationship
  invoice_id BIGINT NOT NULL,
  CONSTRAINT fk_line_invoice FOREIGN KEY (invoice_id) REFERENCES platform_invoices(id) ON DELETE CASCADE,
  
  -- Booking Relationship
  booking_id BIGINT NOT NULL,
  CONSTRAINT fk_line_booking FOREIGN KEY (booking_id) REFERENCES simplybook_bookings(id) ON DELETE RESTRICT,
  
  -- Line Item Details (denormalized for invoice stability)
  booking_reference VARCHAR(255) NOT NULL,  -- SimplyBook booking code
  session_date DATE NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  client_name VARCHAR(255),  -- Optional for privacy
  
  -- Amounts
  booking_amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_booking_per_invoice UNIQUE (invoice_id, booking_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_line_items_invoice ON invoice_line_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_line_items_booking ON invoice_line_items(booking_id);
CREATE INDEX IF NOT EXISTS idx_line_items_session_date ON invoice_line_items(session_date);

-- ============================================================================
-- 16. SYNC LOGS TABLE
-- Audit trail for all sync events (webhooks, API calls, billing jobs)
-- ============================================================================
CREATE TABLE IF NOT EXISTS sync_logs (
  id BIGSERIAL PRIMARY KEY,
  
  -- Tenant (optional - system-level logs may not have tenant)
  tenant_id VARCHAR(50),
  CONSTRAINT fk_sync_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL,
  
  -- Event Classification
  event_type VARCHAR(50) NOT NULL,
  -- Examples: webhook_received, booking_created, booking_updated, booking_cancelled,
  --           invoice_generated, payment_received, sync_error, api_call
  
  event_source VARCHAR(50) NOT NULL,  -- simplybook, stripe, system, api, cron
  
  -- Status
  status VARCHAR(20) NOT NULL,  -- processing, success, error, warning
  CONSTRAINT valid_sync_status CHECK (status IN ('processing', 'success', 'error', 'warning')),
  
  -- Event Details
  details JSONB,           -- Full event payload/details
  error_message TEXT,      -- Error details if failed
  stack_trace TEXT,        -- Stack trace for debugging
  
  -- Metrics
  records_affected INT DEFAULT 0,
  processing_time_ms INT,  -- How long it took to process
  
  -- Context
  request_id VARCHAR(100),  -- For tracing related events
  user_agent TEXT,
  ip_address_hash VARCHAR(64),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadata
  metadata JSONB
);

-- Indexes for log queries
CREATE INDEX IF NOT EXISTS idx_sync_logs_tenant ON sync_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_type ON sync_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_sync_logs_source ON sync_logs(event_source);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created ON sync_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_request_id ON sync_logs(request_id);

-- Composite index for error monitoring
CREATE INDEX IF NOT EXISTS idx_sync_logs_errors ON sync_logs(status, event_type, created_at DESC) WHERE status = 'error';

-- ============================================================================
-- 17. PAYMENT RECONCILIATION TABLE
-- Track deposit payments from clients (via HNRY PayID)
-- ============================================================================
CREATE TABLE IF NOT EXISTS payment_reconciliation (
  id BIGSERIAL PRIMARY KEY,
  
  -- Tenant
  tenant_id VARCHAR(50) NOT NULL,
  CONSTRAINT fk_recon_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT,
  
  -- Booking Reference
  booking_id BIGINT,
  CONSTRAINT fk_recon_booking FOREIGN KEY (booking_id) REFERENCES simplybook_bookings(id) ON DELETE SET NULL,
  
  -- Payment Details
  payment_type VARCHAR(50) NOT NULL,  -- deposit, cash, refund
  CONSTRAINT valid_payment_type CHECK (payment_type IN ('deposit', 'cash', 'refund', 'adjustment')),
  
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'AUD',
  
  -- Source
  payment_source VARCHAR(50),  -- hnry_payid, cash, bank_transfer
  payment_reference VARCHAR(255),  -- Transaction reference from HNRY/bank
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending',
  CONSTRAINT valid_recon_status CHECK (status IN ('pending', 'matched', 'unmatched', 'disputed')),
  
  -- Reconciliation
  matched_at TIMESTAMPTZ,
  matched_by VARCHAR(100),  -- User who matched the payment
  
  -- Timestamps
  payment_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Notes
  notes TEXT,
  metadata JSONB
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_recon_tenant ON payment_reconciliation(tenant_id);
CREATE INDEX IF NOT EXISTS idx_recon_booking ON payment_reconciliation(booking_id);
CREATE INDEX IF NOT EXISTS idx_recon_status ON payment_reconciliation(status);
CREATE INDEX IF NOT EXISTS idx_recon_payment_date ON payment_reconciliation(payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_recon_type ON payment_reconciliation(payment_type);

-- ============================================================================
-- 18. NOTIFICATION QUEUE TABLE
-- Queue for outgoing notifications (emails, SMS, webhooks)
-- ============================================================================
CREATE TABLE IF NOT EXISTS notification_queue (
  id BIGSERIAL PRIMARY KEY,
  
  -- Tenant
  tenant_id VARCHAR(50),
  CONSTRAINT fk_notif_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Notification Details
  notification_type VARCHAR(50) NOT NULL,  -- email, sms, webhook, push
  CONSTRAINT valid_notif_type CHECK (notification_type IN ('email', 'sms', 'webhook', 'push')),
  
  recipient VARCHAR(255) NOT NULL,  -- Email, phone, or webhook URL
  subject VARCHAR(255),
  message TEXT,
  
  -- Template
  template_name VARCHAR(100),
  template_data JSONB,
  
  -- Priority & Scheduling
  priority INT DEFAULT 5,  -- 1 (highest) to 10 (lowest)
  scheduled_for TIMESTAMPTZ DEFAULT NOW(),
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending',
  CONSTRAINT valid_notif_status CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'cancelled')),
  
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3,
  last_attempt_at TIMESTAMPTZ,
  error_message TEXT,
  
  -- External Reference
  external_id VARCHAR(255),  -- SendGrid message ID, etc.
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB
);

-- Indexes for queue processing
CREATE INDEX IF NOT EXISTS idx_notif_status ON notification_queue(status);
CREATE INDEX IF NOT EXISTS idx_notif_scheduled ON notification_queue(scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_notif_priority ON notification_queue(priority, scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_notif_type ON notification_queue(notification_type);
CREATE INDEX IF NOT EXISTS idx_notif_tenant ON notification_queue(tenant_id);

-- ============================================================================
-- 19. HELPER FUNCTIONS FOR BILLING
-- ============================================================================

-- Generate invoice number (INV-YYYY-MM-###)
CREATE OR REPLACE FUNCTION generate_invoice_number(p_tenant_id VARCHAR)
RETURNS VARCHAR(100) AS $$
DECLARE
  v_year VARCHAR(4);
  v_month VARCHAR(2);
  v_seq INT;
  v_invoice_number VARCHAR(100);
BEGIN
  v_year := TO_CHAR(CURRENT_DATE, 'YYYY');
  v_month := TO_CHAR(CURRENT_DATE, 'MM');
  
  -- Get next sequence number for this month
  v_seq := (
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM '[0-9]+$') AS INT)), 0) + 1
    FROM platform_invoices
    WHERE invoice_number LIKE 'INV-' || v_year || '-' || v_month || '-%'
  );
  
  v_invoice_number := 'INV-' || v_year || '-' || v_month || '-' || LPAD(v_seq::TEXT, 3, '0');
  
  RETURN v_invoice_number;
END;
$$ LANGUAGE plpgsql;

-- Calculate booking hash for immutability verification
CREATE OR REPLACE FUNCTION calculate_booking_hash(
  p_booking_id VARCHAR,
  p_total_amount DECIMAL,
  p_platform_fee DECIMAL,
  p_timestamp TIMESTAMPTZ
)
RETURNS VARCHAR(64) AS $$
BEGIN
  RETURN encode(
    digest(
      p_booking_id || '|' || 
      p_total_amount::TEXT || '|' || 
      p_platform_fee::TEXT || '|' || 
      p_timestamp::TEXT,
      'sha256'
    ),
    'hex'
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 20. TRIGGERS FOR BILLING AUTOMATION
-- ============================================================================

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER trigger_simplybook_bookings_updated_at
BEFORE UPDATE ON simplybook_bookings
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_platform_invoices_updated_at
BEFORE UPDATE ON platform_invoices
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_payment_recon_updated_at
BEFORE UPDATE ON payment_reconciliation
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_tenants_updated_at
BEFORE UPDATE ON tenants
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Prevent modification of locked booking financial fields
CREATE OR REPLACE FUNCTION prevent_locked_booking_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_locked = TRUE THEN
    -- Allow only non-financial field updates
    IF NEW.total_amount <> OLD.total_amount OR
       NEW.deposit_amount <> OLD.deposit_amount OR
       NEW.cash_amount <> OLD.cash_amount OR
       NEW.platform_fee <> OLD.platform_fee OR
       NEW.data_hash <> OLD.data_hash THEN
      RAISE EXCEPTION 'Cannot modify financial fields of locked booking';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_locked_changes
BEFORE UPDATE ON simplybook_bookings
FOR EACH ROW
EXECUTE FUNCTION prevent_locked_booking_changes();

-- Auto-calculate invoice total amount
CREATE OR REPLACE FUNCTION calculate_invoice_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_amount = NEW.platform_fee_total + COALESCE(NEW.adjustment_amount, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_invoice_total
BEFORE INSERT OR UPDATE ON platform_invoices
FOR EACH ROW
EXECUTE FUNCTION calculate_invoice_total();

-- ============================================================================
-- 21. VIEWS FOR REPORTING
-- ============================================================================

-- Monthly booking summary per tenant
CREATE OR REPLACE VIEW v_monthly_booking_summary AS
SELECT 
  tenant_id,
  DATE_TRUNC('month', session_datetime) AS month,
  COUNT(*) AS booking_count,
  SUM(total_amount) AS total_revenue,
  SUM(deposit_amount) AS total_deposits,
  SUM(cash_amount) AS total_cash,
  SUM(platform_fee) AS total_platform_fees,
  COUNT(*) FILTER (WHERE status = 'confirmed') AS confirmed_count,
  COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled_count,
  COUNT(*) FILTER (WHERE deposit_received = TRUE) AS deposits_received_count
FROM simplybook_bookings
WHERE status IN ('confirmed', 'completed')
GROUP BY tenant_id, DATE_TRUNC('month', session_datetime);

-- Outstanding invoices view
CREATE OR REPLACE VIEW v_outstanding_invoices AS
SELECT 
  pi.*,
  t.business_name,
  t.email AS tenant_email,
  CURRENT_DATE - pi.due_date AS days_overdue
FROM platform_invoices pi
JOIN tenants t ON pi.tenant_id = t.id
WHERE pi.status IN ('sent', 'overdue')
  AND pi.paid_at IS NULL
ORDER BY pi.due_date;

-- Unmatched payments view
CREATE OR REPLACE VIEW v_unmatched_payments AS
SELECT 
  pr.*,
  t.business_name,
  sb.simplybook_booking_code,
  sb.client_name,
  sb.session_datetime
FROM payment_reconciliation pr
JOIN tenants t ON pr.tenant_id = t.id
LEFT JOIN simplybook_bookings sb ON pr.booking_id = sb.id
WHERE pr.status = 'unmatched'
ORDER BY pr.payment_date DESC;

-- ============================================================================
-- Schema version for migrations tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS schema_version (
  version INT PRIMARY KEY,
  description VARCHAR(255),
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schema_version (version, description)
VALUES 
  (1, 'Initial schema: user_sessions, bookings, conversions, email_logs'),
  (2, 'Billing tracker: tenants, simplybook_bookings, platform_invoices, sync_logs')
ON CONFLICT (version) DO NOTHING;

-- ============================================================================
-- SEED DATA FOR CLAIRE
-- ============================================================================

-- Insert Claire as default tenant
INSERT INTO tenants (
  id, 
  business_name, 
  display_name, 
  email, 
  phone,
  primary_domain,
  simplybook_company,
  platform_fee_percentage,
  status
) VALUES (
  'claire',
  'Claire Hamilton Photography',
  'Claire Hamilton',
  'claire@clairehamilton.net',
  NULL,
  'clairehamilton.net',
  'clairehamilton',
  20.00,
  'active'
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
