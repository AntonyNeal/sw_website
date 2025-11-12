/**
 * SimplyBook.me API Integration Audit
 * Comprehensive health check and validation
 */

require('dotenv').config();
const simplybookService = require('./services/simplybook.service');
const fs = require('fs');
const path = require('path');

// Audit results
const audit = {
  timestamp: new Date().toISOString(),
  overall: 'PENDING',
  checks: [],
  warnings: [],
  errors: [],
  recommendations: [],
};

function addCheck(category, name, status, details = '') {
  audit.checks.push({ category, name, status, details });
  console.log(`${status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️' : '❌'} ${name}`);
  if (details) console.log(`   ${details}`);
}

function addWarning(message) {
  audit.warnings.push(message);
  console.log(`⚠️  WARNING: ${message}`);
}

function addError(message) {
  audit.errors.push(message);
  console.log(`❌ ERROR: ${message}`);
}

function addRecommendation(message) {
  audit.recommendations.push(message);
}

console.log('\n' + '='.repeat(70));
console.log('🔍 SIMPLYBOOK.ME API INTEGRATION AUDIT');
console.log('='.repeat(70) + '\n');

async function auditEnvironmentVariables() {
  console.log('📋 1. ENVIRONMENT VARIABLES CHECK\n');

  const requiredVars = [
    { name: 'SIMPLYBOOK_API_KEY', secret: false },
    { name: 'SIMPLYBOOK_SECRET_KEY', secret: true },
    { name: 'SIMPLYBOOK_COMPANY', secret: false },
    { name: 'SIMPLYBOOK_JSON_RPC_URL', secret: false },
    { name: 'SIMPLYBOOK_REST_API_URL', secret: false },
  ];

  for (const varInfo of requiredVars) {
    const value = process.env[varInfo.name];
    if (value) {
      const display = varInfo.secret ? '✓ Set (hidden)' : value;
      addCheck('Environment', varInfo.name, 'PASS', display);
    } else {
      addCheck('Environment', varInfo.name, 'FAIL', 'Not set');
      addError(`${varInfo.name} is missing`);
    }
  }

  // Check optional vars
  const optionalVars = ['SIMPLYBOOK_WEBHOOK_URL'];
  for (const varName of optionalVars) {
    const value = process.env[varName];
    if (value) {
      addCheck('Environment', varName, 'PASS', value);
    } else {
      addCheck('Environment', varName, 'WARN', 'Not configured');
      addWarning(`${varName} not set - webhooks may not work`);
    }
  }

  console.log();
}

async function auditFileStructure() {
  console.log('📁 2. FILE STRUCTURE CHECK\n');

  const requiredFiles = [
    { path: 'services/simplybook.service.js', description: 'Main API service' },
    { path: 'controllers/webhook.controller.js', description: 'Webhook handler' },
    { path: 'routes/webhook.routes.js', description: 'Webhook routes' },
  ];

  for (const file of requiredFiles) {
    const fullPath = path.join(__dirname, file.path);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      addCheck('Files', file.description, 'PASS', `${(stats.size / 1024).toFixed(1)}KB`);
    } else {
      addCheck('Files', file.description, 'FAIL', 'File not found');
      addError(`Missing file: ${file.path}`);
    }
  }

  console.log();
}

async function auditServiceIntegration() {
  console.log('🔧 3. SERVICE INTEGRATION CHECK\n');

  // Check if service is properly instantiated
  try {
    const hasApiKey = !!simplybookService.apiKey;
    const hasSecretKey = !!simplybookService.secretKey;
    const hasCompany = !!simplybookService.company;

    addCheck('Service', 'Service instantiation', hasApiKey && hasSecretKey ? 'PASS' : 'FAIL');
    addCheck('Service', 'API Key configured', hasApiKey ? 'PASS' : 'FAIL');
    addCheck('Service', 'Secret Key configured', hasSecretKey ? 'PASS' : 'FAIL');
    addCheck(
      'Service',
      'Company identifier',
      hasCompany ? 'PASS' : 'FAIL',
      simplybookService.company
    );

    // Check methods exist
    const requiredMethods = [
      'getToken',
      'callApi',
      'getServices',
      'getProviders',
      'getAvailability',
      'createBooking',
      'cancelBooking',
      'getBooking',
      'getCompanyInfo',
      'verifyWebhookSignature',
    ];

    let methodsExist = true;
    for (const method of requiredMethods) {
      if (typeof simplybookService[method] !== 'function') {
        addCheck('Service', `Method: ${method}`, 'FAIL', 'Method not found');
        methodsExist = false;
      }
    }

    if (methodsExist) {
      addCheck('Service', 'All required methods', 'PASS', `${requiredMethods.length} methods`);
    }
  } catch (error) {
    addCheck('Service', 'Service integration', 'FAIL', error.message);
    addError(`Service integration error: ${error.message}`);
  }

  console.log();
}

async function auditApiConnection() {
  console.log('🌐 4. API CONNECTION TEST\n');

  try {
    // Test 1: Authentication
    console.log('   Testing authentication...');
    const token = await simplybookService.getToken();

    if (token) {
      addCheck('API', 'Authentication', 'PASS', `Token: ${token.substring(0, 20)}...`);
    } else {
      addCheck('API', 'Authentication', 'FAIL', 'No token returned');
      addError('Failed to obtain authentication token');
      return; // Can't continue without token
    }

    // Test 2: Company Info
    console.log('   Fetching company info...');
    try {
      const company = await simplybookService.getCompanyInfo();
      addCheck('API', 'Get Company Info', 'PASS', company?.name || 'Retrieved');
    } catch (error) {
      addCheck('API', 'Get Company Info', 'FAIL', error.message);
      addWarning(`Company info retrieval failed: ${error.message}`);
    }

    // Test 3: Services
    console.log('   Fetching services...');
    try {
      const services = await simplybookService.getServices();
      const serviceCount = Object.keys(services || {}).length;
      if (serviceCount > 0) {
        addCheck('API', 'Get Services', 'PASS', `${serviceCount} service(s) found`);
      } else {
        addCheck('API', 'Get Services', 'WARN', 'No services configured');
        addWarning('No services found - add services in SimplyBook.me dashboard');
      }
    } catch (error) {
      addCheck('API', 'Get Services', 'FAIL', error.message);
      addError(`Services retrieval failed: ${error.message}`);
    }

    // Test 4: Providers
    console.log('   Fetching providers...');
    try {
      const providers = await simplybookService.getProviders();
      const providerCount = Object.keys(providers || {}).length;
      if (providerCount > 0) {
        addCheck('API', 'Get Providers', 'PASS', `${providerCount} provider(s) found`);
      } else {
        addCheck('API', 'Get Providers', 'WARN', 'No providers configured');
        addWarning('No providers found - add staff in SimplyBook.me dashboard');
      }
    } catch (error) {
      addCheck('API', 'Get Providers', 'FAIL', error.message);
      addError(`Providers retrieval failed: ${error.message}`);
    }

    // Test 5: Token caching
    console.log('   Testing token caching...');
    const cachedToken = await simplybookService.getToken();
    if (cachedToken === token) {
      addCheck('API', 'Token caching', 'PASS', 'Using cached token');
    } else {
      addCheck('API', 'Token caching', 'WARN', 'Token not cached properly');
      addWarning('Token caching may not be working correctly');
    }
  } catch (error) {
    addCheck('API', 'API Connection', 'FAIL', error.message);
    addError(`API connection failed: ${error.message}`);
  }

  console.log();
}

async function auditWebhookSetup() {
  console.log('🪝 5. WEBHOOK CONFIGURATION CHECK\n');

  // Check webhook controller
  try {
    const webhookController = require('./controllers/webhook.controller');
    addCheck('Webhook', 'Controller loaded', 'PASS');

    if (typeof webhookController.handleSimplybookWebhook === 'function') {
      addCheck('Webhook', 'Handler function', 'PASS');
    } else {
      addCheck('Webhook', 'Handler function', 'FAIL');
      addError('Webhook handler function not found');
    }

    if (typeof webhookController.testWebhook === 'function') {
      addCheck('Webhook', 'Test endpoint', 'PASS');
    } else {
      addCheck('Webhook', 'Test endpoint', 'WARN');
      addWarning('Webhook test endpoint not found');
    }
  } catch (error) {
    addCheck('Webhook', 'Controller', 'FAIL', error.message);
    addError(`Webhook controller error: ${error.message}`);
  }

  // Check routes
  try {
    const webhookRoutes = require('./routes/webhook.routes');
    addCheck('Webhook', 'Routes loaded', 'PASS');
  } catch (error) {
    addCheck('Webhook', 'Routes', 'FAIL', error.message);
    addError(`Webhook routes error: ${error.message}`);
  }

  // Check webhook URL configuration
  const webhookUrl = process.env.SIMPLYBOOK_WEBHOOK_URL;
  if (webhookUrl) {
    if (webhookUrl.includes('localhost')) {
      addCheck('Webhook', 'Webhook URL', 'WARN', 'Using localhost - not production-ready');
      addWarning('Webhook URL points to localhost - update for production');
    } else if (webhookUrl.startsWith('https://')) {
      addCheck('Webhook', 'Webhook URL', 'PASS', webhookUrl);
    } else {
      addCheck('Webhook', 'Webhook URL', 'WARN', 'Not using HTTPS');
      addWarning('Webhook URL should use HTTPS');
    }
  }

  console.log();
}

async function auditSecurity() {
  console.log('🔒 6. SECURITY CHECK\n');

  // Check if secret key is exposed
  const secretKey = process.env.SIMPLYBOOK_SECRET_KEY;
  if (secretKey && secretKey.length > 20) {
    addCheck('Security', 'Secret key length', 'PASS', 'Adequate length');
  } else if (secretKey) {
    addCheck('Security', 'Secret key length', 'WARN', 'Short key - may be insecure');
    addWarning('Secret key seems short - verify it is correct');
  }

  // Check webhook signature verification
  try {
    const testPayload = { test: 'data' };
    const testSignature = 'test-signature';
    const result = simplybookService.verifyWebhookSignature(testPayload, testSignature);
    addCheck('Security', 'Signature verification', 'PASS', 'Function available');
  } catch (error) {
    addCheck('Security', 'Signature verification', 'FAIL', error.message);
    addError('Webhook signature verification not working');
  }

  // Check NODE_ENV
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === 'production') {
    addCheck('Security', 'Environment mode', 'PASS', 'Production mode');
  } else {
    addCheck('Security', 'Environment mode', 'WARN', `${nodeEnv || 'undefined'} mode`);
    addWarning('Not in production mode - ensure proper security for production');
  }

  console.log();
}

async function auditErrorHandling() {
  console.log('⚠️  7. ERROR HANDLING CHECK\n');

  // Test error handling with invalid data
  try {
    // Try to get a non-existent booking
    await simplybookService.getBooking('INVALID-ID-999999');
    addCheck('Error Handling', 'API error handling', 'WARN', 'No error thrown for invalid ID');
  } catch (error) {
    addCheck('Error Handling', 'API error handling', 'PASS', 'Errors properly caught');
  }

  // Check if all async functions have try-catch
  const serviceFile = fs.readFileSync(
    path.join(__dirname, 'services/simplybook.service.js'),
    'utf8'
  );
  const asyncFunctions = (serviceFile.match(/async\s+\w+/g) || []).length;
  const tryCatchBlocks = (serviceFile.match(/try\s*{/g) || []).length;

  if (tryCatchBlocks >= asyncFunctions - 2) {
    // Allow some helper functions
    addCheck('Error Handling', 'Try-catch coverage', 'PASS', `${tryCatchBlocks} blocks found`);
  } else {
    addCheck('Error Handling', 'Try-catch coverage', 'WARN', 'Some functions lack error handling');
    addWarning('Some async functions may not have proper error handling');
  }

  console.log();
}

async function generateRecommendations() {
  console.log('💡 8. RECOMMENDATIONS\n');

  // Based on findings, generate recommendations
  if (audit.errors.length === 0) {
    addRecommendation('✅ Core integration is working correctly');
  }

  if (audit.warnings.some((w) => w.includes('services'))) {
    addRecommendation('Add services in SimplyBook.me dashboard: Settings → Services');
  }

  if (audit.warnings.some((w) => w.includes('providers'))) {
    addRecommendation('Add staff members in SimplyBook.me dashboard: Settings → Staff');
  }

  if (
    !process.env.SIMPLYBOOK_WEBHOOK_URL ||
    process.env.SIMPLYBOOK_WEBHOOK_URL.includes('localhost')
  ) {
    addRecommendation(
      'Update SIMPLYBOOK_WEBHOOK_URL to production URL: https://api.clairehamilton.com.au/api/v1/webhooks/simplybook'
    );
    addRecommendation('Configure webhook URL in SimplyBook.me: Settings → API → Callback URL');
  }

  if (process.env.NODE_ENV !== 'production') {
    addRecommendation('Set NODE_ENV=production for production deployment');
    addRecommendation('Enable webhook signature verification in production');
  }

  addRecommendation('Test webhook by creating a booking in SimplyBook.me');
  addRecommendation('Monitor webhook logs for incoming events');
  addRecommendation('Set up database integration for storing bookings');
  addRecommendation('Configure email notifications (SendGrid)');
  addRecommendation('Add error monitoring (e.g., Sentry) for production');

  audit.recommendations.forEach((rec) => console.log(`   ${rec}`));
  console.log();
}

async function generateSummary() {
  console.log('='.repeat(70));
  console.log('📊 AUDIT SUMMARY');
  console.log('='.repeat(70) + '\n');

  const totalChecks = audit.checks.length;
  const passedChecks = audit.checks.filter((c) => c.status === 'PASS').length;
  const warnChecks = audit.checks.filter((c) => c.status === 'WARN').length;
  const failedChecks = audit.checks.filter((c) => c.status === 'FAIL').length;

  console.log(`Total Checks: ${totalChecks}`);
  console.log(`✅ Passed: ${passedChecks}`);
  console.log(`⚠️  Warnings: ${warnChecks}`);
  console.log(`❌ Failed: ${failedChecks}`);
  console.log();

  console.log(`🚨 Errors: ${audit.errors.length}`);
  console.log(`⚠️  Warnings: ${audit.warnings.length}`);
  console.log(`💡 Recommendations: ${audit.recommendations.length}`);
  console.log();

  // Determine overall health
  if (failedChecks === 0 && audit.errors.length === 0) {
    audit.overall = 'HEALTHY';
    console.log('🎉 OVERALL STATUS: ✅ HEALTHY');
    console.log('    SimplyBook.me integration is working correctly!');
  } else if (failedChecks <= 2 && audit.errors.length <= 2) {
    audit.overall = 'DEGRADED';
    console.log('⚠️  OVERALL STATUS: ⚠️  DEGRADED');
    console.log('    Integration has minor issues that should be addressed');
  } else {
    audit.overall = 'UNHEALTHY';
    console.log('❌ OVERALL STATUS: ❌ UNHEALTHY');
    console.log('    Critical issues detected - integration may not work properly');
  }

  console.log();

  // Save audit report
  const reportPath = path.join(__dirname, '../simplybook-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(audit, null, 2));
  console.log(`📄 Full report saved to: ${reportPath}`);
  console.log();

  return audit.overall === 'HEALTHY' ? 0 : 1;
}

async function runAudit() {
  try {
    await auditEnvironmentVariables();
    await auditFileStructure();
    await auditServiceIntegration();
    await auditApiConnection();
    await auditWebhookSetup();
    await auditSecurity();
    await auditErrorHandling();
    await generateRecommendations();
    const exitCode = await generateSummary();

    process.exit(exitCode);
  } catch (error) {
    console.error('\n❌ AUDIT FAILED WITH CRITICAL ERROR:\n');
    console.error(error);
    process.exit(1);
  }
}

// Run the audit
runAudit();
