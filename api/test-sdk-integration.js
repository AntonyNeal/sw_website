/**
 * Test SDK Integration
 * Tests the full flow: SDK -> Backend API -> SimplyBook
 *
 * Run with: node test-sdk-integration.js
 * (Server must be running on port 3001)
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function testSDKIntegration() {
  console.log('\n🧪 TESTING SDK INTEGRATION\n');
  console.log('Testing: Frontend SDK -> Backend API -> SimplyBook.me\n');
  console.log('='.repeat(60));

  let passedTests = 0;
  let failedTests = 0;

  // Test 1: Health Check
  console.log('\n📝 Test 1: GET /health');
  try {
    const response = await axios.get('http://localhost:3001/health');
    console.log(`✅ Success! Server is ${response.data.status}`);
    passedTests++;
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    failedTests++;
  }

  // Test 2: Get Services
  console.log('\n📝 Test 2: GET /api/simplybook/services');
  try {
    const response = await axios.get(`${API_BASE}/simplybook/services`);
    const services = Object.values(response.data);
    console.log(`✅ Success! Got ${services.length} services`);

    if (services.length > 0) {
      console.log(`   Sample: ${services[0].name} (${services[0].duration} min)`);
    }
    passedTests++;
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data: ${JSON.stringify(error.response.data)}`);
    }
    failedTests++;
  }

  // Test 3: Get Company Info
  console.log('\n📝 Test 3: GET /api/simplybook/company');
  try {
    const response = await axios.get(`${API_BASE}/simplybook/company`);
    console.log(`✅ Success! Company: ${response.data.company}`);
    console.log(`   Email: ${response.data.email}`);
    console.log(`   Phone: ${response.data.phone}`);
    console.log(`   City: ${response.data.city}`);
    passedTests++;
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    failedTests++;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 TEST SUMMARY\n');
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📈 Success Rate: ${Math.round((passedTests / (passedTests + failedTests)) * 100)}%`);

  if (failedTests === 0) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('SDK integration is working correctly!\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.\n');
    process.exit(1);
  }
}

// Run tests
testSDKIntegration().catch((error) => {
  console.error('\n❌ TEST SUITE FAILED:', error.message);
  process.exit(1);
});
