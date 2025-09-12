/**
 * Local Testing Script for Workflow Functionality
 * 
 * This script helps you test the workflow system locally without needing
 * to go through the full authentication flow.
 * 
 * Usage:
 *   node test-workflow.js
 * 
 * Make sure to set up your environment variables first:
 *   - NEXTAUTH_SECRET
 *   - GOOGLE_CLIENT_ID
 *   - GOOGLE_CLIENT_SECRET
 *   - MAKE_WEBHOOK_URL
 *   - DATABASE_URL
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  testActions: [
    'process_emails',
    'create_calendar_event',
    'send_notification'
  ],
  mockSession: {
    user: {
      email: 'test@example.com',
      name: 'Test User'
    },
    userId: 'test_user_123',
    accessToken: 'mock_access_token',
    role: 'PARENT',
    isActive: true
  }
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function testServerConnection() {
  log('\n🔍 Testing server connection...', 'blue');
  
  try {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/health`);
    if (response.status === 200) {
      log('✅ Server is running and accessible', 'green');
      return true;
    } else {
      log(`❌ Server responded with status: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Cannot connect to server: ${error.message}`, 'red');
    log('💡 Make sure your Next.js server is running with: npm run dev', 'yellow');
    return false;
  }
}

async function testWorkflowTrigger(action) {
  log(`\n🚀 Testing workflow trigger for action: ${action}`, 'blue');
  
  const payload = {
    action: action,
    data: {
      userId: TEST_CONFIG.mockSession.userId,
      userEmail: TEST_CONFIG.mockSession.user.email,
      timestamp: new Date().toISOString(),
      testMode: true
    }
  };

  try {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/trigger-workflow`, {
      method: 'POST',
      headers: {
        'Cookie': 'next-auth.session-token=mock_session_token',
        'Content-Type': 'application/json'
      },
      body: payload
    });

    if (response.status === 200) {
      log(`✅ Workflow triggered successfully for ${action}`, 'green');
      log(`📊 Response: ${JSON.stringify(response.data, null, 2)}`, 'cyan');
      return true;
    } else {
      log(`❌ Workflow trigger failed for ${action}. Status: ${response.status}`, 'red');
      log(`📊 Response: ${JSON.stringify(response.data, null, 2)}`, 'cyan');
      return false;
    }
  } catch (error) {
    log(`❌ Error triggering workflow for ${action}: ${error.message}`, 'red');
    return false;
  }
}

async function testEnvironmentVariables() {
  log('\n🔧 Checking environment variables...', 'blue');
  
  const requiredVars = [
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID', 
    'GOOGLE_CLIENT_SECRET',
    'MAKE_WEBHOOK_URL'
  ];

  let allPresent = true;
  
  for (const varName of requiredVars) {
    if (process.env[varName]) {
      log(`✅ ${varName} is set`, 'green');
    } else {
      log(`❌ ${varName} is missing`, 'red');
      allPresent = false;
    }
  }

  if (!allPresent) {
    log('\n💡 Please create a .env.local file with the required variables:', 'yellow');
    log('NEXTAUTH_SECRET=your_secret_here', 'yellow');
    log('GOOGLE_CLIENT_ID=your_google_client_id', 'yellow');
    log('GOOGLE_CLIENT_SECRET=your_google_client_secret', 'yellow');
    log('MAKE_WEBHOOK_URL=your_make_webhook_url', 'yellow');
  }

  return allPresent;
}

async function testMakeWebhook() {
  log('\n🌐 Testing Make.com webhook connection...', 'blue');
  
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;
  if (!webhookUrl) {
    log('❌ MAKE_WEBHOOK_URL not configured', 'red');
    return false;
  }

  const testPayload = {
    event: 'test_connection',
    timestamp: new Date().toISOString(),
    source: 'local_test_script',
    data: {
      message: 'Testing webhook connection from local environment'
    }
  };

  try {
    const response = await makeRequest(webhookUrl, {
      method: 'POST',
      body: testPayload
    });

    if (response.status >= 200 && response.status < 300) {
      log('✅ Make.com webhook is accessible', 'green');
      return true;
    } else {
      log(`❌ Make.com webhook responded with status: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Cannot reach Make.com webhook: ${error.message}`, 'red');
    return false;
  }
}

async function runFullTest() {
  log('🧪 Starting Workflow System Test Suite', 'magenta');
  log('=' .repeat(50), 'magenta');

  const results = {
    envVars: await testEnvironmentVariables(),
    serverConnection: await testServerConnection(),
    makeWebhook: await testMakeWebhook(),
    workflowTriggers: []
  };

  if (results.serverConnection) {
    for (const action of TEST_CONFIG.testActions) {
      const success = await testWorkflowTrigger(action);
      results.workflowTriggers.push({ action, success });
    }
  }

  // Summary
  log('\n📋 Test Results Summary', 'magenta');
  log('=' .repeat(30), 'magenta');
  
  log(`Environment Variables: ${results.envVars ? '✅ PASS' : '❌ FAIL'}`, results.envVars ? 'green' : 'red');
  log(`Server Connection: ${results.serverConnection ? '✅ PASS' : '❌ FAIL'}`, results.serverConnection ? 'green' : 'red');
  log(`Make.com Webhook: ${results.makeWebhook ? '✅ PASS' : '❌ FAIL'}`, results.makeWebhook ? 'green' : 'red');
  
  const successfulTriggers = results.workflowTriggers.filter(t => t.success).length;
  const totalTriggers = results.workflowTriggers.length;
  log(`Workflow Triggers: ${successfulTriggers}/${totalTriggers} passed`, successfulTriggers === totalTriggers ? 'green' : 'red');

  const overallSuccess = results.envVars && results.serverConnection && results.makeWebhook && 
                        successfulTriggers === totalTriggers;
  
  log(`\n🎯 Overall Result: ${overallSuccess ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`, 
      overallSuccess ? 'green' : 'red');

  if (!overallSuccess) {
    log('\n💡 Next Steps:', 'yellow');
    if (!results.envVars) log('  1. Set up environment variables in .env.local', 'yellow');
    if (!results.serverConnection) log('  2. Start your Next.js server with: npm run dev', 'yellow');
    if (!results.makeWebhook) log('  3. Check your Make.com webhook URL configuration', 'yellow');
    if (successfulTriggers < totalTriggers) log('  4. Check server logs for workflow trigger errors', 'yellow');
  }
}

// Run the test suite
if (require.main === module) {
  runFullTest().catch(error => {
    log(`\n💥 Test suite crashed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = {
  testServerConnection,
  testWorkflowTrigger,
  testEnvironmentVariables,
  testMakeWebhook,
  runFullTest
};