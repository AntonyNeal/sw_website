/**
 * Test Booking for Claire Hamilton
 * First booking through the API - Julian's test
 */

require('dotenv').config();
const axios = require('axios');

const COMPANY = process.env.SIMPLYBOOK_COMPANY || 'clairehamilton';
const API_KEY = process.env.SIMPLYBOOK_API_KEY;
const SECRET_KEY = process.env.SIMPLYBOOK_SECRET_KEY;

console.log('\n💕 CREATING TEST BOOKING FOR CLAIRE\n');
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
    console.log('   Client: Julian Della Bosca');
    console.log(
      '   Message: "Love, Julian. This is the beginning of a beautiful partnership. xoxo"\n'
    );

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
            name: 'Julian Della Bosca',
            email: 'julian.dellabosca@gmail.com',
            phone: '+61412345678',
          },
          {
            fields: [
              {
                field_id: '1',
                value: 'Julian Della Bosca',
              },
              {
                field_id: '2',
                value: '38',
              },
              {
                field_id: '3',
                value: '61403977680',
              },
              {
                field_id: '4',
                value: 'julian.dellabosca@gmail.com',
              },
              {
                field_id: '5',
                value: 'Canberra',
              },
              {
                field_id: '6',
                value: 'Dark chocolate with sea salt - the sophisticated choice!',
              },
              {
                field_id: '7',
                value: 'I built your website! 😊',
              },
              {
                field_id: '8',
                value:
                  "Hi Claire! I'm Julian, your web developer. I've been working on integrating your SimplyBook API with your website. This is a test booking to make sure everything works perfectly. Love, Julian. This is the beginning of a beautiful partnership. xoxo",
              },
              {
                field_id: '9',
                value:
                  'This is just a test booking for the API integration. Feel free to cancel it! 🎉',
              },
              {
                field_id: '10',
                value: 'Of course! I will pay a deposit to confirm our time together!',
              },
            ],
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

      // Check if it's a validation error
      if (
        bookingResponse.data.error.code === -32602 ||
        bookingResponse.data.error.code === -32070
      ) {
        console.log('\nℹ️  This might require additional fields or have different parameters.');
        console.log('Let me check what fields are required...\n');

        // Get additional fields
        const fieldsResponse = await axios.post(
          'https://user-api.simplybook.me/',
          {
            jsonrpc: '2.0',
            method: 'getAdditionalFields',
            params: [firstServiceId],
            id: 6,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Company-Login': COMPANY,
              'X-Token': token,
            },
          }
        );

        if (!fieldsResponse.data.error) {
          console.log(
            'Required additional fields:',
            JSON.stringify(fieldsResponse.data.result, null, 2)
          );
        }
      }

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
    console.log(`   Client: Julian Della Bosca`);
    console.log(`   Email: julian.dellabosca@gmail.com`);
    console.log('\n💌 Message:');
    console.log('   "Love, Julian. This is the beginning of a beautiful partnership. xoxo"');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Claire will receive a notification about this booking!');
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

createTestBooking()
  .then((success) => {
    if (success) {
      console.log('🚀 Ready to deploy the booking system to production!\n');
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
