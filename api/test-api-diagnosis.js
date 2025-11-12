/**
 * Diagnostic Test - Try Different SimplyBook API Approaches
 *
 * This tests various methods to see what works with Claire's API key
 */

require('dotenv').config();
const axios = require('axios');

const COMPANY = process.env.SIMPLYBOOK_COMPANY || 'clairehamilton';
const API_KEY = process.env.SIMPLYBOOK_API_KEY;

console.log('\n🔬 SIMPLYBOOK API DIAGNOSTIC TEST\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

async function testMethod(methodName, params = [], description = '') {
  console.log(`\n📝 Testing: ${methodName}`);
  if (description) console.log(`   ℹ️  ${description}`);

  try {
    // First get token
    const loginResponse = await axios.post('https://user-api.simplybook.me/login', {
      jsonrpc: '2.0',
      method: 'getToken',
      params: [COMPANY, API_KEY],
      id: 1,
    });

    if (loginResponse.data.error) {
      console.log(`   ❌ Login failed: ${loginResponse.data.error.message}`);
      return false;
    }

    const token = loginResponse.data.result;
    console.log(`   ✅ Token: ${token.substring(0, 20)}...`);

    // Try the method
    const response = await axios.post('https://user-api.simplybook.me/', {
      jsonrpc: '2.0',
      method: methodName,
      params: [token, ...params],
      id: 2,
    });

    if (response.data.error) {
      console.log(`   ❌ Error: ${response.data.error.message}`);
      console.log(`   📊 Error code: ${response.data.error.code}`);
      return false;
    }

    console.log(`   ✅ SUCCESS!`);
    console.log(`   📦 Result type: ${typeof response.data.result}`);

    if (Array.isArray(response.data.result)) {
      console.log(`   📦 Array length: ${response.data.result.length}`);
    } else if (typeof response.data.result === 'object' && response.data.result !== null) {
      console.log(`   📦 Object keys: ${Object.keys(response.data.result).length}`);
      // Show first few keys
      const keys = Object.keys(response.data.result).slice(0, 3);
      if (keys.length > 0) {
        console.log(`   📋 Sample keys: ${keys.join(', ')}`);
      }
    } else {
      console.log(`   📦 Value: ${JSON.stringify(response.data.result).substring(0, 100)}`);
    }

    return true;
  } catch (error) {
    console.log(`   ❌ Network/Request Error: ${error.message}`);
    return false;
  }
}

async function runDiagnostics() {
  console.log('Testing various API methods to find what works...\n');

  const tests = [
    // Public booking methods (should work without admin)
    { method: 'getEventList', params: [], description: 'Get list of services' },
    { method: 'getUnitList', params: [], description: 'Get list of providers/staff' },
    { method: 'getLocationList', params: [], description: 'Get list of locations' },
    { method: 'getCompanyParam', params: ['company_name'], description: 'Get company parameter' },
    { method: 'getCompanyParam', params: ['timezone'], description: 'Get timezone setting' },
    { method: 'getCompanyParam', params: ['phone'], description: 'Get company phone' },

    // Admin methods (might not work)
    { method: 'getCompanyInfo', params: [], description: 'Get full company info (admin)' },
    { method: 'getBookings', params: [], description: 'Get bookings list (admin)' },
  ];

  const results = {
    success: [],
    failed: [],
  };

  for (const test of tests) {
    const success = await testMethod(test.method, test.params, test.description);
    if (success) {
      results.success.push(test.method);
    } else {
      results.failed.push(test.method);
    }
    // Small delay between tests
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Summary
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📊 DIAGNOSTIC SUMMARY\n');

  console.log(`✅ Working Methods (${results.success.length}):`);
  if (results.success.length > 0) {
    results.success.forEach((m) => console.log(`   • ${m}`));
  } else {
    console.log('   (none)');
  }

  console.log(`\n❌ Failed Methods (${results.failed.length}):`);
  if (results.failed.length > 0) {
    results.failed.forEach((m) => console.log(`   • ${m}`));
  } else {
    console.log('   (none)');
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (results.success.length > 0) {
    console.log('🎉 GOOD NEWS: Some methods work!');
    console.log('We can build the booking system using the working methods.\n');
  } else {
    console.log(
      '⚠️  No methods worked - API permissions need to be enabled by SimplyBook support.\n'
    );
  }
}

runDiagnostics()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n💥 Unexpected error:', error);
    process.exit(1);
  });
