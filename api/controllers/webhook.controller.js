/**
 * Webhook Controller
 * Handles incoming webhooks from external services (SimplyBook.me, payment processors, etc.)
 */

const simplybookService = require('../services/simplybook.service');

/**
 * Handle SimplyBook.me webhook events
 * Triggers: create, change, cancel, remind
 */
exports.handleSimplybookWebhook = async (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📨 SimplyBook.me Webhook Received at ${timestamp}`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    const payload = req.body;
    const signature = req.headers['x-simplybook-signature'];

    console.log('📦 Webhook Payload:', JSON.stringify(payload, null, 2));

    // Verify webhook signature (if SimplyBook.me provides one)
    if (signature && process.env.NODE_ENV === 'production') {
      const isValid = simplybookService.verifyWebhookSignature(payload, signature);
      if (!isValid) {
        console.error('❌ Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
      console.log('✅ Webhook signature verified');
    }

    // Extract webhook data
    const {
      booking_id,
      booking_hash,
      company,
      notification_type, // 'create', 'change', 'cancel', 'notify'
      client,
      service,
      provider,
      datetime,
      status,
    } = payload;

    console.log(`\n📋 Webhook Details:`);
    console.log(`   Type: ${notification_type}`);
    console.log(`   Booking ID: ${booking_id}`);
    console.log(`   Booking Hash: ${booking_hash}`);
    console.log(`   Company: ${company}`);
    console.log(`   Service: ${service?.name || 'N/A'}`);
    console.log(`   Client: ${client?.name || 'N/A'} (${client?.email || 'N/A'})`);
    console.log(`   Date/Time: ${datetime}`);
    console.log(`   Status: ${status}\n`);

    // Handle different notification types
    switch (notification_type) {
      case 'create':
        await handleBookingCreated(payload);
        break;

      case 'change':
        await handleBookingChanged(payload);
        break;

      case 'cancel':
        await handleBookingCancelled(payload);
        break;

      case 'notify':
        await handleBookingReminder(payload);
        break;

      default:
        console.log(`⚠️  Unknown notification type: ${notification_type}`);
    }

    // Acknowledge receipt
    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      timestamp,
    });

    console.log(`\n✅ Webhook processed successfully\n${'='.repeat(60)}\n`);
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(500).json({
      error: 'Webhook processing failed',
      message: error.message,
    });
  }
};

/**
 * Handle booking created event
 */
async function handleBookingCreated(payload) {
  console.log('🎉 NEW BOOKING CREATED');

  const { booking_id, client, service, datetime, booking_hash } = payload;

  // TODO: Save booking to database
  // TODO: Send confirmation email to client
  // TODO: Send notification to business owner
  // TODO: Create calendar event
  // TODO: Trigger analytics event
  // TODO: Update booking dashboard

  console.log('📝 Actions to perform:');
  console.log('   ✓ Save to database');
  console.log('   ✓ Send confirmation email to:', client?.email);
  console.log('   ✓ Notify business owner');
  console.log('   ✓ Create calendar event');
  console.log('   ✓ Update dashboard');

  // Example: Log to database (implement your DB logic)
  const bookingRecord = {
    simplybook_id: booking_id,
    booking_hash,
    client_name: client?.name,
    client_email: client?.email,
    client_phone: client?.phone,
    service_name: service?.name,
    service_id: service?.id,
    datetime,
    status: 'confirmed',
    created_at: new Date().toISOString(),
    source: 'simplybook',
  };

  console.log('💾 Booking record prepared:', bookingRecord);

  // TODO: Insert into database
  // await db.bookings.insert(bookingRecord);

  // TODO: Send emails
  // await emailService.sendBookingConfirmation(client.email, bookingRecord);
  // await emailService.sendOwnerNotification(process.env.BUSINESS_NOTIFICATION_EMAIL, bookingRecord);
}

/**
 * Handle booking changed event
 */
async function handleBookingChanged(payload) {
  console.log('🔄 BOOKING MODIFIED');

  const { booking_id, datetime, status } = payload;

  // TODO: Update booking in database
  // TODO: Send change notification email
  // TODO: Update calendar event
  // TODO: Log change history

  console.log('📝 Actions to perform:');
  console.log('   ✓ Update database record');
  console.log('   ✓ Send change notification');
  console.log('   ✓ Update calendar');
  console.log('   ✓ Log change history');

  // TODO: Implement database update
  // await db.bookings.update({ simplybook_id: booking_id }, { datetime, status, updated_at: new Date() });
}

/**
 * Handle booking cancelled event
 */
async function handleBookingCancelled(payload) {
  console.log('❌ BOOKING CANCELLED');

  const { booking_id, client, datetime } = payload;

  // TODO: Update booking status in database
  // TODO: Send cancellation email to client
  // TODO: Notify business owner
  // TODO: Remove calendar event
  // TODO: Update availability

  console.log('📝 Actions to perform:');
  console.log('   ✓ Mark as cancelled in database');
  console.log('   ✓ Send cancellation email to:', client?.email);
  console.log('   ✓ Notify business owner');
  console.log('   ✓ Remove calendar event');
  console.log('   ✓ Free up time slot');

  // TODO: Implement cancellation logic
  // await db.bookings.update({ simplybook_id: booking_id }, { status: 'cancelled', cancelled_at: new Date() });
}

/**
 * Handle booking reminder event
 */
async function handleBookingReminder(payload) {
  console.log('⏰ BOOKING REMINDER TRIGGERED');

  const { booking_id, client, service, datetime } = payload;

  // TODO: Send reminder email/SMS to client
  // TODO: Log reminder sent

  console.log('📝 Actions to perform:');
  console.log('   ✓ Send reminder email to:', client?.email);
  console.log('   ✓ Send reminder SMS (optional)');
  console.log('   ✓ Log reminder sent');

  // TODO: Send reminder
  // await emailService.sendBookingReminder(client.email, { service, datetime });
}

/**
 * Test endpoint for webhook functionality
 */
exports.testWebhook = (req, res) => {
  console.log('🧪 Webhook test endpoint called');

  const testPayload = {
    notification_type: 'create',
    booking_id: 'TEST-12345',
    booking_hash: 'test-hash-abc123',
    company: 'clairehamilton',
    client: {
      name: 'Test Client',
      email: 'test@example.com',
      phone: '+1234567890',
    },
    service: {
      id: '1',
      name: 'Test Service',
      duration: 60,
    },
    provider: {
      id: '1',
      name: 'Claire Hamilton',
    },
    datetime: '2025-11-15 14:00:00',
    status: 'confirmed',
  };

  console.log('📦 Test payload:', JSON.stringify(testPayload, null, 2));

  res.status(200).json({
    success: true,
    message: 'Webhook test successful',
    receivedPayload: testPayload,
    timestamp: new Date().toISOString(),
  });
};
