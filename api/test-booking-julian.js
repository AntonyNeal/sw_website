/**
 * Test booking creation for Julian Della Bosca
 * This script attempts to create a test booking using the SimplyBook.me API
 */

require('dotenv').config();
const axios = require('axios');

async function testBooking() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 SIMPLYBOOK.ME TEST BOOKING');
  console.log('='.repeat(60) + '\n');

  const apiKey = process.env.SIMPLYBOOK_API_KEY;
  const company = process.env.SIMPLYBOOK_COMPANY;
  const jsonRpcUrl = process.env.SIMPLYBOOK_JSON_RPC_URL || 'https://user-api.simplybook.net/';

  console.log('📋 Configuration:');
  console.log('   Company:', company);
  console.log('   API Key:', apiKey ? apiKey.substring(0, 20) + '...' : '❌ NOT SET');
  console.log('   JSON-RPC URL:', jsonRpcUrl);
  console.log();

  // First, let's try to get a token using the login API
  console.log('1️⃣ Attempting to authenticate...\n');

  try {
    // Method 1: Try with company and API key
    console.log('   Trying authentication with company + API key...');
    const loginResponse = await axios.post(jsonRpcUrl + 'login', {
      jsonrpc: '2.0',
      method: 'getToken',
      params: [company, apiKey],
      id: 1,
    });

    console.log('   Raw Response:', JSON.stringify(loginResponse.data, null, 2));

    if (loginResponse.data.error) {
      console.error('   ❌ Error:', loginResponse.data.error.message);
      console.log();

      // Try alternative authentication methods
      console.log('2️⃣ Trying alternative authentication...\n');

      // Check if we can get company info without auth
      const publicResponse = await axios.post(jsonRpcUrl, {
        jsonrpc: '2.0',
        method: 'getCompanyInfo',
        params: [company],
        id: 1,
      });

      console.log('   Company Info Response:', JSON.stringify(publicResponse.data, null, 2));
    } else {
      const token = loginResponse.data.result;
      console.log('   ✅ Token obtained:', token.substring(0, 30) + '...\n');

      // Now try to get services
      console.log('2️⃣ Fetching available services...\n');

      const servicesResponse = await axios.post(jsonRpcUrl, {
        jsonrpc: '2.0',
        method: 'getEventList',
        params: [token],
        id: 1,
      });

      console.log('   Services:', JSON.stringify(servicesResponse.data, null, 2));

      if (servicesResponse.data.result) {
        const services = servicesResponse.data.result;
        console.log('   ✅ Found', Object.keys(services).length, 'service(s)');

        // Try to create a test booking
        if (Object.keys(services).length > 0) {
          const firstServiceId = Object.keys(services)[0];
          const firstService = services[firstServiceId];

          console.log('\n3️⃣ Creating test booking...\n');
          console.log('   Service:', firstService.name);
          console.log('   Client: Julian Della Bosca');
          console.log('   Email: julian@example.com');
          console.log();

          // Get available time slots for tomorrow
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const dateStr = tomorrow.toISOString().split('T')[0];

          console.log('   Checking availability for:', dateStr);

          const availabilityResponse = await axios.post(jsonRpcUrl, {
            jsonrpc: '2.0',
            method: 'getStartTimeMatrix',
            params: [token, firstServiceId, dateStr, null, null],
            id: 1,
          });

          console.log('   Availability:', JSON.stringify(availabilityResponse.data, null, 2));
        }
      }
    }
  } catch (error) {
    console.error('\n❌ TEST FAILED!\n');
    console.error('Error:', error.message);

    if (error.response) {
      console.error('\nAPI Response:');
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }

    console.log('\n📝 Notes:');
    console.log('   • The API keys from the screenshot might be for display only');
    console.log('   • You may need to generate new API keys in SimplyBook.me');
    console.log('   • Go to Settings → API → "Generate new keys" button');
    console.log('   • The company name might need to be different');
    console.log('   • Try checking what your actual SimplyBook subdomain is');
    console.log();
  }
}

testBooking();
