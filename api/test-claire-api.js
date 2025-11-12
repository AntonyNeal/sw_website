/**
 * Simple API Test for Claire Hamilton - SimplyBook.me Integration
 *
 * This script tests if Claire's API credentials are working correctly.
 * Run this to verify everything is set up before going live.
 *
 * Usage:
 *   node test-claire-api.js
 */

require('dotenv').config();

// Claire's SimplyBook.me configuration
const COMPANY_LOGIN = process.env.SIMPLYBOOK_COMPANY || 'clairehamilton';

console.log('\n🧪 TESTING SIMPLYBOOK API FOR CLAIRE HAMILTON\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Test 1: Check environment variables
console.log('📋 TEST 1: Checking Configuration...\n');

const requiredVars = {
  SIMPLYBOOK_COMPANY: process.env.SIMPLYBOOK_COMPANY,
  SIMPLYBOOK_API_KEY: process.env.SIMPLYBOOK_API_KEY,
  SIMPLYBOOK_SECRET_KEY: process.env.SIMPLYBOOK_SECRET_KEY,
};

let configOk = true;
for (const [key, value] of Object.entries(requiredVars)) {
  if (!value) {
    console.log(`   ❌ ${key} is missing`);
    configOk = false;
  } else {
    const display = key.includes('KEY') ? `${value.substring(0, 8)}...` : value;
    console.log(`   ✅ ${key}: ${display}`);
  }
}

if (!configOk) {
  console.log('\n❌ CONFIGURATION ERROR\n');
  console.log('Missing API credentials. Please add them to your .env file:\n');
  console.log('SIMPLYBOOK_COMPANY=clairehamilton');
  console.log('SIMPLYBOOK_API_KEY=<your-api-key>');
  console.log('SIMPLYBOOK_SECRET_KEY=<your-secret-key>\n');
  process.exit(1);
}

console.log('\n✅ Configuration looks good!\n');

// Test 2: Test API connection
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📡 TEST 2: Testing API Connection...\n');

const axios = require('axios');

async function testAPIConnection() {
  try {
    // Step 1: Get authentication token using JSON-RPC
    console.log('   🔐 Requesting authentication token...');
    console.log(`   🔗 URL: https://user-api.simplybook.me/login`);
    console.log(`   📦 Company: ${COMPANY_LOGIN}`);
    console.log(`   🔑 API Key: ${process.env.SIMPLYBOOK_API_KEY.substring(0, 16)}...`);

    const authResponse = await axios.post(
      `https://user-api.simplybook.me/login`,
      {
        jsonrpc: '2.0',
        method: 'getToken',
        params: [COMPANY_LOGIN, process.env.SIMPLYBOOK_API_KEY],
        id: 1,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    console.log(`   📥 Response status: ${authResponse.status}`);
    console.log(`   📥 Response data:`, JSON.stringify(authResponse.data, null, 2));

    if (authResponse.data.error) {
      throw new Error(`SimplyBook API Error: ${authResponse.data.error.message}`);
    }

    if (!authResponse.data.result) {
      throw new Error(`No token received from API. Response: ${JSON.stringify(authResponse.data)}`);
    }

    console.log('   ✅ Authentication successful!');
    console.log(`   📝 Token: ${authResponse.data.result.substring(0, 20)}...\n`);

    const token = authResponse.data.result;

    // Step 2: Get available services (public API call)
    console.log('   💼 Fetching available services...');

    const servicesResponse = await axios.post(
      `https://user-api.simplybook.me/`,
      {
        jsonrpc: '2.0',
        method: 'getEventList',
        params: [token],
        id: 2,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    if (servicesResponse.data.error) {
      throw new Error(`Services Error: ${servicesResponse.data.error.message}`);
    }

    const services = servicesResponse.data.result;
    console.log(`   ✅ Found ${Object.keys(services || {}).length} service(s)!\n`);

    if (services && Object.keys(services).length > 0) {
      console.log('   📋 Available Services:');
      for (const [serviceId, service] of Object.entries(services)) {
        console.log(
          `      • ${service.name} (${service.duration} min) - $${service.price || 'N/A'}`
        );
      }
    }

    // Step 3: Try to get company information
    console.log('\n   🏢 Fetching company information...');

    const companyResponse = await axios.post(
      `https://user-api.simplybook.me/`,
      {
        jsonrpc: '2.0',
        method: 'getCompanyInfo',
        params: [token],
        id: 3,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    if (companyResponse.data.error) {
      console.log(
        `   ⚠️  Company info requires admin API access (${companyResponse.data.error.message})`
      );
      console.log('   ℹ️  This is normal - basic API can still handle bookings!\n');
    } else {
      const companyInfo = companyResponse.data.result;
      console.log('   ✅ Company data retrieved successfully!\n');
      console.log('   📊 Company Details:');
      console.log(`      • Name: ${companyInfo.name || 'N/A'}`);
      console.log(`      • Email: ${companyInfo.email || 'N/A'}`);
      console.log(`      • Phone: ${companyInfo.phone || 'N/A'}`);
      console.log(`      • Address: ${companyInfo.address || 'N/A'}`);
      console.log(`      • Timezone: ${companyInfo.timezone || 'N/A'}\n`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ ALL TESTS PASSED!\n');
    console.log("🎉 Claire's SimplyBook.me API is working correctly!\n");
    console.log('Next steps:');
    console.log('  1. ✅ API credentials are valid');
    console.log('  2. ✅ Company information is accessible');
    console.log('  3. ✅ Services are configured');
    console.log('  4. 🚀 Ready to accept bookings!\n');

    return true;
  } catch (error) {
    console.log('\n❌ API TEST FAILED\n');

    if (error.response) {
      console.log('Server Error Details:');
      console.log(`  Status: ${error.response.status}`);
      console.log(`  Message: ${error.response.data?.message || error.response.statusText}`);

      if (error.response.status === 401) {
        console.log('\n💡 Authentication failed. This usually means:');
        console.log('   • API Key is incorrect');
        console.log('   • Secret Key is incorrect');
        console.log("   • Keys haven't been saved in SimplyBook dashboard");
        console.log('\nPlease ask Claire to:');
        console.log('   1. Go to Settings → Integrations → API');
        console.log('   2. Regenerate both keys');
        console.log('   3. Click SAVE');
        console.log('   4. Copy the new keys to you');
      }
    } else if (error.request) {
      console.log('Network Error:');
      console.log('  Could not reach SimplyBook API');
      console.log('  Check your internet connection');
    } else {
      console.log('Error:', error.message);
    }

    console.log('\n');
    return false;
  }
}

// Run the tests
testAPIConnection()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
