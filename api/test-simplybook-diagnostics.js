/**
 * Diagnostic script for SimplyBook API issues
 */

require('dotenv').config();
const simplebookService = require('./services/simplybook.service');

async function runDiagnostics() {
  console.log('🔍 SimplyBook API Diagnostics\n');
  console.log('='.repeat(60));

  try {
    // 1. Get all services
    console.log('\n1️⃣  Fetching Services...');
    const services = await simplebookService.getServices();
    console.log(`✅ Found ${Object.keys(services).length} services:`);
    Object.values(services).slice(0, 5).forEach(s => {
      console.log(`   - ${s.name} (ID: ${s.id}) - ${s.duration} min`);
    });

    // 2. Get providers
    console.log('\n2️⃣  Fetching Providers...');
    const providers = await simplebookService.getProviders();
    console.log(`✅ Found ${Object.keys(providers).length} providers:`);
    Object.values(providers).slice(0, 5).forEach(p => {
      console.log(`   - ${p.name} (ID: ${p.id})`);
    });

    // 3. Get locations
    console.log('\n3️⃣  Fetching Locations...');
    const locations = await simplebookService.getLocations();
    console.log(`✅ Found ${locations.length} locations:`);
    locations.forEach(l => {
      console.log(`   - ${l.city} (Provider ID: ${l.id})`);
    });

    // 4. Test availability with different parameters
    console.log('\n4️⃣  Testing Availability...');
    const testService = Object.values(services)[0];
    const testProvider = Object.values(providers)[0];
    
    // Try different dates
    const dates = [
      '2025-11-15', // Friday
      '2025-11-16', // Saturday
      '2025-11-18', // Monday
      '2025-11-20', // Wednesday
      '2025-12-01', // Future date
    ];

    for (const date of dates) {
      try {
        console.log(`\n   Testing ${date} with service ${testService.id}...`);
        const slots = await simplebookService.getAvailability(
          testService.id,
          date,
          testProvider.id
        );
        
        if (slots && Object.keys(slots).length > 0) {
          const slotCount = Object.values(slots).flat().length;
          console.log(`   ✅ ${date}: Found ${slotCount} time slots`);
          
          // Show first few slots
          const firstSlots = Object.values(slots).flat().slice(0, 3);
          if (firstSlots.length > 0) {
            console.log(`      Sample slots: ${firstSlots.join(', ')}`);
          }
        } else {
          console.log(`   ⚠️  ${date}: No slots available`);
        }
      } catch (error) {
        console.log(`   ❌ ${date}: ${error.message}`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 5. Get company info
    console.log('\n5️⃣  Company Information...');
    const companyInfo = await simplebookService.getCompanyInfo();
    console.log(`✅ Company: ${companyInfo.company}`);
    console.log(`   Timezone: ${companyInfo.timezone || 'Not specified'}`);
    console.log(`   Country: ${companyInfo.country || 'Not specified'}`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ Diagnostics completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error during diagnostics:', error.message);
    console.error(error.stack);
  }
}

runDiagnostics()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
