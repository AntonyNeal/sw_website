require('dotenv').config({ path: '.env' });
const simplebookService = require('./services/simplybook.service');

console.log('\n🧪 TESTING PRODUCTION SIMPLYBOOK SERVICE\n');
console.log('━'.repeat(60));

async function testService() {
  try {
    const service = simplebookService;

    // Test 1: Get Services
    console.log('\n📝 Test 1: Getting services (getEventList)...');
    const services = await service.getServices();
    console.log(`✅ Retrieved services:`, typeof services);
    console.log('   Data:', JSON.stringify(services, null, 2).substring(0, 500));
    
    if (Array.isArray(services)) {
      console.log(`   Found ${services.length} services`);
      services.forEach(s => {
        console.log(`   • ${s.name} (${s.duration} min)`);
      });
    } else if (typeof services === 'object' && services !== null) {
      console.log(`   Found ${Object.keys(services).length} services (object format)`);
      Object.entries(services).forEach(([id, s]) => {
        console.log(`   • [${id}] ${s.name} (${s.duration} min)`);
      });
    }

    // Test 2: Get Company Info
    console.log('\n📝 Test 2: Getting company info...');
    const companyInfo = await service.getCompanyInfo();
    console.log(`✅ Company: ${companyInfo.company}`);
    console.log(`   Email: ${companyInfo.email}`);
    console.log(`   Phone: ${companyInfo.phone}`);
    console.log(`   City: ${companyInfo.city}`);
    console.log(`   Timezone: ${companyInfo.timezone}`);

    // Test 3: Get Available Time Slots (needs valid service and date)
    console.log('\n📝 Test 3: Getting available time slots...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    
    const firstServiceId = Array.isArray(services) ? services[0].id : Object.keys(services)[0];
    console.log(`   Testing with service ID ${firstServiceId} on ${dateStr}`);
    
    try {
      const slots = await service.getAvailableTimeSlots(firstServiceId, dateStr);
      console.log(`✅ Found ${slots.length} available time slots`);
      if (slots.length > 0) {
        console.log(`   First 3 slots: ${slots.slice(0, 3).join(', ')}`);
      }
    } catch (err) {
      console.log(`⚠️  Time slots test: ${err.message}`);
    }    // Test 4: Get Intake Form Fields
    console.log('\n📝 Test 4: Getting intake form fields...');
    try {
      const fields = await service.getIntakeFormFields(firstServiceId);
      console.log(`✅ Found ${fields.length} intake form fields`);
      fields.forEach((f) => {
        console.log(`   • ${f.name} (${f.type}) - Required: ${f.required}`);
      });
    } catch (err) {
      console.log(`⚠️  Intake form test: ${err.message}`);
    }

    console.log('\n' + '━'.repeat(60));
    console.log('🎉 ALL CORE TESTS PASSED!');
    console.log('━'.repeat(60) + '\n');
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error('\nStack:', error.stack);
    process.exit(1);
  }
}

testService();
