#!/usr/bin/env node

/**
 * N8N Workflow Testing Script
 * Run this after setting up your N8N workflows to verify they're working
 */

const https = require('https');
const http = require('http');

// Test configurations
const tests = [
  {
    name: 'Google OAuth Handler',
    url: 'https://milafinance.app.n8n.cloud/webhook/google-signin',
    method: 'GET',
    expectedStatus: 200,
    description: 'Should return workflow started message'
  },
  {
    name: 'Email Processing Webhook',
    url: 'https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj',
    method: 'POST',
    data: {
      action: 'email-sync',
      user_email: 'test@example.com',
      user_name: 'Test User',
      access_token: 'test_token_123'
    },
    expectedStatus: 200,
    description: 'Should process email sync request'
  },
  {
    name: 'Calendar Management Webhook',
    url: 'https://milafinance.app.n8n.cloud/webhook/dQEwT1mMujeN8JAk',
    method: 'POST',
    data: {
      title: 'Test Meeting',
      description: 'Automated test calendar event',
      start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
      location: 'Virtual Meeting',
      user_email: 'test@example.com'
    },
    expectedStatus: 200,
    description: 'Should create calendar event'
  }
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
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

function makeRequest(test) {
  return new Promise((resolve) => {
    const url = new URL(test.url);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: test.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'BusyParents-N8N-Tester/1.0'
      }
    };

    if (test.data) {
      const postData = JSON.stringify(test.data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const startTime = Date.now();
    
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        let parsedData;
        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          parsedData = data;
        }
        
        resolve({
          status: res.statusCode,
          data: parsedData,
          responseTime,
          headers: res.headers
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        error: error.message,
        status: 0,
        responseTime: Date.now() - startTime
      });
    });
    
    if (test.data) {
      req.write(JSON.stringify(test.data));
    }
    
    req.end();
  });
}

async function runTests() {
  log('🧪 Testing N8N Workflows for BusyParents App', 'cyan');
  log('=' .repeat(50), 'cyan');
  
  const results = [];
  
  for (const test of tests) {
    log(`\n📋 Testing: ${test.name}`, 'bright');
    log(`   URL: ${test.url}`, 'blue');
    log(`   Method: ${test.method}`, 'blue');
    log(`   Description: ${test.description}`, 'blue');
    
    if (test.data) {
      log(`   Payload: ${JSON.stringify(test.data, null, 2)}`, 'magenta');
    }
    
    log('   Testing...', 'yellow');
    
    try {
      const result = await makeRequest(test);
      
      if (result.error) {
        log(`   ❌ Error: ${result.error}`, 'red');
        results.push({ ...test, success: false, error: result.error });
      } else {
        const success = result.status === test.expectedStatus;
        const statusColor = success ? 'green' : 'red';
        const statusIcon = success ? '✅' : '❌';
        
        log(`   ${statusIcon} Status: ${result.status} (Expected: ${test.expectedStatus})`, statusColor);
        log(`   ⏱️  Response Time: ${result.responseTime}ms`, 'cyan');
        
        if (typeof result.data === 'object') {
          log(`   📄 Response: ${JSON.stringify(result.data, null, 2)}`, 'magenta');
        } else {
          log(`   📄 Response: ${result.data.substring(0, 200)}${result.data.length > 200 ? '...' : ''}`, 'magenta');
        }
        
        results.push({ 
          ...test, 
          success, 
          status: result.status, 
          responseTime: result.responseTime,
          response: result.data
        });
      }
    } catch (error) {
      log(`   ❌ Unexpected Error: ${error.message}`, 'red');
      results.push({ ...test, success: false, error: error.message });
    }
  }
  
  // Summary
  log('\n' + '=' .repeat(50), 'cyan');
  log('📊 Test Summary', 'bright');
  log('=' .repeat(50), 'cyan');
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  log(`\n✅ Passed: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
  
  if (passed < total) {
    log('\n❌ Failed Tests:', 'red');
    results.filter(r => !r.success).forEach(test => {
      log(`   • ${test.name}: ${test.error || `Status ${test.status} (Expected ${test.expectedStatus})`}`, 'red');
    });
  }
  
  log('\n🔧 Next Steps:', 'bright');
  if (passed === total) {
    log('   🎉 All workflows are working! Your N8N integration is ready.', 'green');
    log('   🚀 You can now deploy your app to Vercel.', 'green');
  } else {
    log('   📝 Review the N8N_WORKFLOW_SETUP_GUIDE.md for setup instructions.', 'yellow');
    log('   🔍 Check your N8N dashboard for workflow status and errors.', 'yellow');
    log('   🔑 Verify your Google OAuth credentials are properly configured.', 'yellow');
  }
  
  log('\n📱 Test your app integration:', 'bright');
  log('   http://localhost:3002/api/test-n8n-integration', 'blue');
}

// Run the tests
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, makeRequest };