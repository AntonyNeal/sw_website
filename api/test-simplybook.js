/**
 * SimplyBook.me API Connection Test
 * Run this to verify API credentials and connection
 */

require('dotenv').config();
const simplybookService = require('./services/simplybook.service');

async function testConnection() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 SIMPLYBOOK.ME API CONNECTION TEST');
  console.log('='.repeat(60) + '\n');

  console.log('📋 Configuration:');
  console.log('   Company:', process.env.SIMPLYBOOK_COMPANY || '❌ NOT SET');
  console.log(
    '   API Key:',
    process.env.SIMPLYBOOK_API_KEY
      ? '✅ ' + process.env.SIMPLYBOOK_API_KEY.substring(0, 20) + '...'
      : '❌ NOT SET'
  );
  console.log(
    '   Secret Key:',
    process.env.SIMPLYBOOK_SECRET_KEY ? '✅ Set (hidden)' : '❌ NOT SET'
  );
  console.log('   JSON-RPC URL:', process.env.SIMPLYBOOK_JSON_RPC_URL || '❌ NOT SET');
  console.log('   REST API URL:', process.env.SIMPLYBOOK_REST_API_URL || '❌ NOT SET');
  console.log();

  // Check if required variables are set
  if (
    !process.env.SIMPLYBOOK_API_KEY ||
    !process.env.SIMPLYBOOK_SECRET_KEY ||
    !process.env.SIMPLYBOOK_COMPANY
  ) {
    console.error('❌ Missing required environment variables!');
    console.error('   Please copy .env.example to .env and fill in the values.\n');
    process.exit(1);
  }

  try {
    // Test 1: Authentication
    console.log('1️⃣ Testing Authentication...');
    console.log('   Requesting access token from SimplyBook.me...');
    const token = await simplybookService.getToken();
    console.log('   ✅ SUCCESS! Token obtained:', token.substring(0, 30) + '...');
    console.log();

    // Test 2: Company Info
    console.log('2️⃣ Testing Company Information Retrieval...');
    const company = await simplybookService.getCompanyInfo();
    console.log('   ✅ SUCCESS! Company info retrieved:');
    console.log('   ', JSON.stringify(company, null, 2));
    console.log();

    // Test 3: Services
    console.log('3️⃣ Testing Services List...');
    const services = await simplybookService.getServices();
    console.log('   ✅ SUCCESS! Found', Object.keys(services).length, 'service(s):');

    if (Object.keys(services).length > 0) {
      Object.values(services).forEach((service, index) => {
        console.log(
          `   ${index + 1}. ${service.name} (${service.duration} min) - $${service.price || 'N/A'}`
        );
      });
    } else {
      console.log('   ⚠️  No services found. Add services in SimplyBook.me dashboard.');
    }
    console.log();

    // Test 4: Providers
    console.log('4️⃣ Testing Providers List...');
    const providers = await simplybookService.getProviders();
    console.log('   ✅ SUCCESS! Found', Object.keys(providers).length, 'provider(s):');

    if (Object.keys(providers).length > 0) {
      Object.values(providers).forEach((provider, index) => {
        console.log(`   ${index + 1}. ${provider.name} - ${provider.description || 'N/A'}`);
      });
    } else {
      console.log('   ⚠️  No providers found. Add staff in SimplyBook.me dashboard.');
    }
    console.log();

    // Test 5: Get bookings for today
    console.log('5️⃣ Testing Bookings Retrieval...');
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    console.log(`   Fetching bookings from ${today} to ${tomorrow}...`);
    const bookings = await simplybookService.getBookings(today, tomorrow);
    console.log('   ✅ SUCCESS! Found', bookings.length, 'booking(s) for today/tomorrow');

    if (bookings.length > 0) {
      bookings.forEach((booking, index) => {
        console.log(`   ${index + 1}. Booking #${booking.id} - ${booking.start_date_time}`);
      });
    } else {
      console.log('   ℹ️  No bookings scheduled for today/tomorrow');
    }
    console.log();

    // Summary
    console.log('='.repeat(60));
    console.log('🎉 ALL TESTS PASSED!');
    console.log('='.repeat(60));
    console.log();
    console.log('✅ Authentication working');
    console.log('✅ Company info accessible');
    console.log('✅ Services API working');
    console.log('✅ Providers API working');
    console.log('✅ Bookings API working');
    console.log();
    console.log('🚀 SimplyBook.me integration is ready to use!');
    console.log();

    console.log('📋 Next Steps:');
    console.log('   1. Add webhook URL to SimplyBook.me dashboard:');
    console.log('      https://api.clairehamilton.com.au/api/v1/webhooks/simplybook');
    console.log('   2. Test webhook by creating a booking');
    console.log('   3. Implement booking form in frontend');
    console.log('   4. Add email notifications');
    console.log();
  } catch (error) {
    console.error('\n❌ TEST FAILED!\n');
    console.error('Error:', error.message);
    console.error('\nFull error details:');
    console.error(error);
    console.log();

    console.log('🔍 Troubleshooting:');
    console.log('   1. Verify API credentials in .env file');
    console.log('   2. Check API is enabled in SimplyBook.me dashboard (Settings → API)');
    console.log('   3. Verify company name matches your SimplyBook subdomain');
    console.log('   4. Try generating new API keys in SimplyBook.me');
    console.log('   5. Check network connectivity');
    console.log();

    process.exit(1);
  }
}

// Run the test
testConnection();
