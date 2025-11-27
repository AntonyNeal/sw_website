/**
 * Test Booking for Miss Dylan (Placeholder)
 * First booking through the API - developer's test
 */

require('dotenv').config();
const axios = require('axios');

const COMPANY = process.env.SIMPLYBOOK_COMPANY || 'miss-dylan';
const API_KEY = process.env.SIMPLYBOOK_API_KEY;
const SECRET_KEY = process.env.SIMPLYBOOK_SECRET_KEY;

console.log('\n💕 CREATING TEST BOOKING FOR MISS DYLAN\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

async function createTestBooking() {
  try {
    // Step 1: Get authentication token
    console.log('🔐 Getting authentication token...');
    const loginResponse = await axios.post('https://user-api.simplybook.me/login', {
      jsonrpc: '2.0',
      method: 'getToken',
      params: [COMPANY, API_KEY],
      id: 1,
    });

    if (loginResponse.data.error) {
      throw new Error(`Login failed: ${loginResponse.data.error.message}`);
    }

    const token = loginResponse.data.result;
    console.log(`✅ Token obtained\n`);

    // Step 2: Get available services
    console.log('📋 Getting available services...');
    const servicesResponse = await axios.post(
      'https://user-api.simplybook.me/',
      {
        jsonrpc: '2.0',
        method: 'getEventList',
        params: [],
        id: 2,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Company-Login': COMPANY,
          'X-Token': token,
        },
      }
    );

    if (servicesResponse.data.error) {
      throw new Error(`Get services failed: ${servicesResponse.data.error.message}`);
    }

    const services = servicesResponse.data.result;
    const firstServiceId = Object.keys(services)[0];
    const firstService = services[firstServiceId];

    console.log(`✅ Selected service: ${firstService.name} (${firstService.duration} min)\n`);

    // Step 3: Get available providers
    console.log('👤 Getting available providers...');
    const providersResponse = await axios.post(
      'https://user-api.simplybook.me/',
      {
        jsonrpc: '2.0',
        method: 'getUnitList',
        params: [],
        id: 3,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Company-Login': COMPANY,
          'X-Token': token,
        },
      }
    );

    if (providersResponse.data.error) {
      throw new Error(`Get providers failed: ${providersResponse.data.error.message}`);
    }

    const providers = providersResponse.data.result;
    const firstProviderId = Object.keys(providers)[0];
    const firstProvider = providers[firstProviderId];

    console.log(`✅ Selected provider: ${firstProvider.name}\n`);

    // Step 4: Get first available date
    console.log('📅 Finding first available date...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startDate = tomorrow.toISOString().split('T')[0];
    const endDate = new Date(tomorrow);
    endDate.setDate(endDate.getDate() + 7);
    const endDateStr = endDate.toISOString().split('T')[0];

    const availabilityResponse = await axios.post(
      'https://user-api.simplybook.me/',
      {
        jsonrpc: '2.0',
        method: 'getStartTimeMatrix',
        params: [startDate, endDateStr, firstServiceId, firstProviderId, 1],
        id: 4,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Company-Login': COMPANY,
          'X-Token': token,
        },
      }
    );

    if (availabilityResponse.data.error) {
      throw new Error(`Get availability failed: ${availabilityResponse.data.error.message}`);
    }

    const availability = availabilityResponse.data.result;
    let bookingDate = null;
    let bookingTime = null;

    // Find first available slot
    for (const [date, times] of Object.entries(availability)) {
      if (times && times.length > 0) {
        bookingDate = date;
        bookingTime = times[0];
        break;
      }
    }

    if (!bookingDate || !bookingTime) {
      throw new Error('No available time slots found in the next 7 days');
    }

    console.log(`✅ Found available slot: ${bookingDate} at ${bookingTime}\n`);

    // Step 5: Create the booking!
    console.log('💕 Creating booking...');
    console.log('   Client: Developer Test');
    console.log('   Message: "Test booking. Please cancel once validated."\n');

    const bookingResponse = await axios.post(
      'https://user-api.simplybook.me/',
      {
        jsonrpc: '2.0',
        method: 'book',
        params: [
          firstServiceId,
          firstProviderId,
          bookingDate,
          bookingTime,
          {
            name: 'Developer Test',
            email: 'dev+test@example.com',
            phone: '+61 400 000 000',
          },
          {
            fields: [],
          },
          1,
          null,
          null,
        ],
        id: 5,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Company-Login': COMPANY,
          'X-Token': token,
        },
      }
    );

    if (bookingResponse.data.error) {
      console.log('\n❌ Booking failed:', bookingResponse.data.error.message);
      console.log('Error code:', bookingResponse.data.error.code);
      return false;
    }

    const booking = bookingResponse.data.result;
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🎉 BOOKING CREATED SUCCESSFULLY!\n');
    console.log('📋 Booking Details:');
    console.log(`   Booking ID: ${booking.bookings[0].id}`);
    console.log(`   Booking Code: ${booking.bookings[0].code}`);
    console.log(`   Service: ${firstService.name}`);
    console.log(`   Provider: ${firstProvider.name}`);
    console.log(`   Date/Time: ${booking.bookings[0].start_date_time}`);
    console.log(
      `   Status: ${booking.bookings[0].is_confirmed === '1' ? 'Confirmed ✅' : 'Pending confirmation ⏳'}`
    );
    console.log('   Client: Developer Test');
    console.log('   Email: dev+test@example.com');
    console.log('\n💌 Message:');
    console.log('   "Test booking. Please cancel once validated."');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Miss Dylan will receive a notification about this booking (staging).');
    console.log('🎊 The API integration is working perfectly!\n');

    return true;
  } catch (error) {
    console.log('\n❌ TEST BOOKING FAILED\n');

    if (error.response) {
      console.log(`HTTP ${error.response.status}: ${error.response.statusText}`);
      console.log(`Response:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(`Error: ${error.message}`);
    }

    return false;
  }
}

// Run the tests
createTestBooking()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });