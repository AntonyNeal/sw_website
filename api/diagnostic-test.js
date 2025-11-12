require('dotenv').config();
const service = require('./services/simplybook.service.js');

console.log('═══════════════════════════════════════════════════════════');
console.log('  SIMPLYBOOK API DIAGNOSTICS');
console.log('═══════════════════════════════════════════════════════════\n');

async function runDiagnostics() {
  const results = {
    authentication: false,
    providers: false,
    services: false,
    locations: false,
    errors: [],
  };

  // Test 1: Authentication
  console.log('📋 Test 1: Authentication');
  console.log('─────────────────────────────────────────────────────────');
  try {
    const token = await service.getToken();
    if (token) {
      console.log('✅ SUCCESS: Token obtained');
      console.log(`   Token: ${token.substring(0, 20)}...`);
      results.authentication = true;
    } else {
      console.log('❌ FAILED: No token received');
      results.errors.push('Authentication failed - no token');
    }
  } catch (e) {
    console.log('❌ ERROR:', e.message);
    results.errors.push(`Authentication error: ${e.message}`);
  }
  console.log('');

  // Test 2: Providers
  console.log('📋 Test 2: Providers (Tour Locations)');
  console.log('─────────────────────────────────────────────────────────');
  try {
    const providers = await service.getProviders();
    if (providers && providers.length > 0) {
      console.log(`✅ SUCCESS: ${providers.length} providers found`);
      providers.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name} (ID: ${p.id})`);
      });
      results.providers = true;
    } else {
      console.log('⚠️  WARNING: No providers returned');
      results.errors.push('No providers available');
    }
  } catch (e) {
    console.log('❌ ERROR:', e.message);
    results.errors.push(`Providers error: ${e.message}`);
  }
  console.log('');

  // Test 3: Services
  console.log('📋 Test 3: Services');
  console.log('─────────────────────────────────────────────────────────');
  try {
    const services = await service.getServices();
    if (services && services.length > 0) {
      console.log(`✅ SUCCESS: ${services.length} services found`);
      services.slice(0, 5).forEach((s, i) => {
        console.log(`   ${i + 1}. ${s.name} (${s.duration} min, $${s.price})`);
      });
      if (services.length > 5) {
        console.log(`   ... and ${services.length - 5} more`);
      }
      results.services = true;
    } else {
      console.log('⚠️  WARNING: No services returned');
      results.errors.push('No services available');
    }
  } catch (e) {
    console.log('❌ ERROR:', e.message);
    results.errors.push(`Services error: ${e.message}`);
  }
  console.log('');

  // Test 4: Locations (with date parsing)
  console.log('📋 Test 4: Locations (with date parsing)');
  console.log('─────────────────────────────────────────────────────────');
  try {
    const locations = await service.getLocations();
    if (locations && locations.length > 0) {
      console.log(`✅ SUCCESS: ${locations.length} locations found`);
      locations.forEach((loc, i) => {
        console.log(`   ${i + 1}. ${loc.city}, ${loc.country}`);
        if (loc.availableFrom && loc.availableUntil) {
          console.log(
            `      📅 Available: ${loc.availableFrom} to ${loc.availableUntil} (${loc.daysAvailable} days)`
          );
        } else {
          console.log(`      ⚠️  No dates configured`);
        }
      });
      results.locations = true;
    } else {
      console.log('⚠️  WARNING: No locations returned');
      results.errors.push('No locations available');
    }
  } catch (e) {
    console.log('❌ ERROR:', e.message);
    results.errors.push(`Locations error: ${e.message}`);
  }
  console.log('');

  // Summary
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  DIAGNOSTIC SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('Test Results:');
  console.log(`  Authentication:  ${results.authentication ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Providers:       ${results.providers ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Services:        ${results.services ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Locations:       ${results.locations ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');

  const allPassed =
    results.authentication && results.providers && results.services && results.locations;

  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED - API is functioning correctly!');
  } else {
    console.log('⚠️  SOME TESTS FAILED - See errors below:');
    results.errors.forEach((err, i) => {
      console.log(`   ${i + 1}. ${err}`);
    });
  }
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
}

runDiagnostics().catch((e) => {
  console.error('\n💥 CRITICAL ERROR:', e);
  process.exit(1);
});
