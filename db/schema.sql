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
-- Schema version for migrations tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS schema_version (
  version INT PRIMARY KEY,
  description VARCHAR(255),
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schema_version (version, description)
VALUES (1, 'Initial schema: user_sessions, bookings, conversions, email_logs')
ON CONFLICT (version) DO NOTHING;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
