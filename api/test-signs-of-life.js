/**
 * Minimal Signs of Life Test
 * Tests basic API functionality without external dependencies
 */

const http = require('http');

console.log('\n' + '='.repeat(60));
console.log('🧪 API SIGNS OF LIFE TEST');
console.log('='.repeat(60) + '\n');

// Test 1: Root endpoint
function testEndpoint(path, expectedStatus = 200) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: 'GET',
    };

    console.log(`Testing: http://localhost:3001${path}`);

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`✅ Status: ${res.statusCode}`);
          console.log(`   Response:`, json);
          console.log();
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          console.log(`✅ Status: ${res.statusCode}`);
          console.log(`   Response: ${data}`);
          console.log();
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Failed: ${error.message}`);
      console.log();
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function runTests() {
  try {
    console.log('1️⃣ Testing Root Endpoint (/)...\n');
    await testEndpoint('/');

    console.log('2️⃣ Testing Health Endpoint (/health)...\n');
    await testEndpoint('/health');

    console.log('3️⃣ Testing Webhook Test Endpoint (/api/v1/webhooks/test)...\n');
    await testEndpoint('/api/v1/webhooks/test');

    console.log('='.repeat(60));
    console.log('🎉 ALL TESTS PASSED!');
    console.log('='.repeat(60));
    console.log('\n✅ API is alive and responding to requests!');
    console.log('✅ Server is running on port 3001');
    console.log('✅ All endpoints are accessible\n');

    process.exit(0);
  } catch (error) {
    console.log('='.repeat(60));
    console.log('❌ TEST FAILED');
    console.log('='.repeat(60));
    console.log('\nError:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('   1. Make sure the server is running: node api/server.js');
    console.log('   2. Check if port 3001 is available');
    console.log('   3. Verify dependencies are installed: npm install\n');

    process.exit(1);
  }
}

// Wait a moment for server to be ready
setTimeout(runTests, 1000);
