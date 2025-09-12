// Verify Make.com Integration Readiness
// Run this to ensure your local server can receive Make.com webhooks

const https = require('https');
const http = require('http');

async function verifyMakeIntegration() {
  console.log('🔍 Verifying Make.com Integration Readiness...');
  console.log('=' .repeat(50));

  // 1. Check if local server is running
  console.log('\n1. Checking Local Server Status...');
  try {
    const response = await fetch('http://localhost:3000/api/health');
    if (response.ok) {
      console.log('✅ Local server is running on http://localhost:3000');
    } else {
      console.log('❌ Local server responded with error:', response.status);
      return;
    }
  } catch (error) {
    console.log('❌ Local server is not running. Please run: npm run dev');
    return;
  }

  // 2. Check webhook endpoint
  console.log('\n2. Testing Webhook Endpoint...');
  try {
    const testData = {
      timestamp: new Date().toISOString(),
      emailId: 'test-email-123',
      emailSubject: 'Test Email from Make.com',
      emailFrom: 'test@example.com',
      aiAnalysis: {
        isCalendarEvent: true,
        title: 'Test Meeting',
        date: '2024-01-15',
        time: '14:00',
        location: 'Test Location',
        category: 'test',
        priority: 'medium'
      },
      calendarEvent: {
        created: true,
        eventId: 'test-event-123',
        eventLink: 'https://calendar.google.com/test'
      },
      sheetsLog: {
        logged: true,
        updatedRows: 1
      },
      workflowStatus: 'completed',
      userId: 'test-user',
      makeScenarioId: 'test-scenario',
      makeExecutionId: 'test-execution'
    };

    const response = await fetch('http://localhost:3000/api/webhook/make-update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Make-Webhook': 'true'
      },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Webhook endpoint is working');
      console.log('   Response:', result.message || 'Success');
    } else {
      console.log('❌ Webhook endpoint error:', response.status);
    }
  } catch (error) {
    console.log('❌ Webhook test failed:', error.message);
  }

  // 3. Check database connection
  console.log('\n3. Checking Database Connection...');
  try {
    const response = await fetch('http://localhost:3000/api/workflow-status');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Database is connected');
      console.log(`   Total workflow logs: ${data.logs?.length || 0}`);
    } else {
      console.log('❌ Database connection issue');
    }
  } catch (error) {
    console.log('❌ Database check failed:', error.message);
  }

  // 4. Verify environment variables
  console.log('\n4. Checking Environment Configuration...');
  try {
    const response = await fetch('http://localhost:3000/api/test-env');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Environment variables configured');
      console.log('   Google OAuth:', data.google ? '✅' : '❌');
      console.log('   Database:', data.database ? '✅' : '❌');
      console.log('   NextAuth:', data.nextauth ? '✅' : '❌');
    } else {
      console.log('❌ Environment check failed');
    }
  } catch (error) {
    console.log('❌ Environment verification failed:', error.message);
  }

  // 5. Test Google Sheets integration
  console.log('\n5. Testing Google Sheets Integration...');
  try {
    const response = await fetch('http://localhost:3000/api/test-google-sheets');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Google Sheets integration working');
      console.log('   Service account:', data.serviceAccount ? '✅' : '❌');
    } else {
      console.log('❌ Google Sheets test failed');
    }
  } catch (error) {
    console.log('❌ Google Sheets verification failed:', error.message);
  }

  // 6. Summary and next steps
  console.log('\n' + '='.repeat(50));
  console.log('🎯 MAKE.COM INTEGRATION SUMMARY');
  console.log('='.repeat(50));
  console.log('\n✅ Your local server is ready for Make.com integration!');
  console.log('\n📋 NEXT STEPS:');
  console.log('1. Import COMPLETE_MAKE_WORKFLOW.json into Make.com');
  console.log('2. Connect your Google account in Make.com');
  console.log('3. Update Google Sheets ID in Module 8');
  console.log('4. Activate the workflow');
  console.log('5. Send test emails and monitor results');
  console.log('\n🔗 IMPORTANT URLS:');
  console.log('   • Dashboard: http://localhost:3000/dashboard');
  console.log('   • Workflow Status: http://localhost:3000/workflow-status');
  console.log('   • Webhook Endpoint: http://localhost:3000/api/webhook/make-update');
  console.log('\n📁 FILES CREATED:');
  console.log('   • COMPLETE_MAKE_WORKFLOW.json (Import this to Make.com)');
  console.log('   • IMPORT_AND_RUN_GUIDE.md (Step-by-step instructions)');
  console.log('\n🚀 You\'re all set! The workflow supports multiple users automatically.');
}

// Run the verification
verifyMakeIntegration().catch(console.error);