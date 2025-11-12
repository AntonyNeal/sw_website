/**
 * FIXED API Test - Using Correct HTTP Headers
 *
 * SimplyBook public API requires X-Company-Login and X-Token headers
 */

require('dotenv').config();
const axios = require('axios');

const COMPANY = process.env.SIMPLYBOOK_COMPANY || 'clairehamilton';
const API_KEY = process.env.SIMPLYBOOK_API_KEY;

console.log('\n🔧 FIXED SIMPLYBOOK API TEST\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

async function testWithHeaders() {
  try {
    // Step 1: Get token
    console.log('📝 Step 1: Getting authentication token...');
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
    console.log(`✅ Token obtained: ${token.substring(0, 20)}...\n`);

    // Step 2: Call getEventList with CORRECT headers
    console.log('📝 Step 2: Calling getEventList with HTTP headers...');

    const servicesResponse = await axios.post(
      'https://user-api.simplybook.me/',
      {
        jsonrpc: '2.0',
        method: 'getEventList',
        params: [], // NO token in params!
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
      console.log(`❌ Error: ${servicesResponse.data.error.message}`);
      return false;
    }

    console.log('✅ SUCCESS! getEventList worked!\n');

    const services = servicesResponse.data.result;
    console.log(`📊 Found ${Object.keys(services).length} service(s):\n`);

    for (const [id, service] of Object.entries(services)) {
      console.log(`   ${id}. ${service.name}`);
      console.log(`      Duration: ${service.duration} minutes`);
      console.log(`      Price: ${service.price} ${service.currency}`);
      console.log(`      Active: ${service.is_active === '1' ? 'Yes' : 'No'}`);
      console.log('');
    }

    // Step 3: Test getCompanyInfo
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📝 Step 3: Getting company information...\n');

    const companyResponse = await axios.post(
      'https://user-api.simplybook.me/',
      {
        jsonrpc: '2.0',
        method: 'getCompanyInfo',
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

    if (companyResponse.data.error) {
      console.log(`⚠️  getCompanyInfo error: ${companyResponse.data.error.message}\n`);
    } else {
      const info = companyResponse.data.result;
      console.log('✅ Company Info Retrieved!\n');
      console.log(`   Company: ${info.name}`);
      console.log(`   Email: ${info.email}`);
      console.log(`   Phone: ${info.phone}`);
      console.log(`   City: ${info.city}, ${info.country_id}`);
      console.log(`   Timezone: ${info.timezone}`);
      console.log(`   Timeframe: ${info.timeframe} minutes\n`);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎉 API IS WORKING CORRECTLY!\n');
    console.log('The issue was using params instead of HTTP headers.\n');
    console.log('✅ Ready to build the booking system!\n');

    return true;
  } catch (error) {
    console.log('\n❌ TEST FAILED\n');

    if (error.response) {
      console.log(`HTTP ${error.response.status}: ${error.response.statusText}`);
      console.log(`Response:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(`Error: ${error.message}`);
    }

    return false;
  }
}

testWithHeaders()
  .then((success) => process.exit(success ? 0 : 1))
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
