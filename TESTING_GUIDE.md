# Workflow Testing Guide

This guide will help you test the workflow functionality locally to ensure everything is working correctly.

## Quick Start

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Run the test script:**
   ```bash
   node test-workflow.js
   ```

## Environment Setup

Before testing, make sure you have a `.env.local` file with the following variables:

```env
NEXTAUTH_SECRET=your_nextauth_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MAKE_WEBHOOK_URL=your_make_webhook_url
DATABASE_URL=your_database_url
```

## What the Test Script Checks

### 1. Environment Variables ✅
- Verifies all required environment variables are set
- Shows which variables are missing

### 2. Server Connection ✅
- Tests if your Next.js server is running
- Checks the health endpoint at `/api/health`

### 3. Make.com Webhook ✅
- Tests connectivity to your Make.com webhook
- Sends a test payload to verify the endpoint is accessible

### 4. Workflow Triggers ✅
- Tests the `/api/trigger-workflow` endpoint
- Tries different workflow actions:
  - `process_emails`
  - `create_calendar_event`
  - `send_notification`

## Manual Testing Steps

### Step 1: Test Authentication
1. Go to `http://localhost:3000/auth/signin`
2. Sign in with Google
3. Verify you're redirected to the dashboard
4. Check browser console for any authentication errors

### Step 2: Test Workflow Trigger API

You can manually test the workflow API using curl or a tool like Postman:

```bash
curl -X POST http://localhost:3000/api/trigger-workflow \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your_session_token" \
  -d '{
    "action": "process_emails",
    "data": {
      "userId": "test_user",
      "userEmail": "test@example.com"
    }
  }'
```

### Step 3: Check Make.com Integration

1. **Test webhook directly:**
   ```bash
   curl -X POST your_make_webhook_url \
     -H "Content-Type: application/json" \
     -d '{
       "event": "test",
       "timestamp": "2024-01-01T00:00:00Z",
       "data": { "test": true }
     }'
   ```

2. **Check Make.com scenario:**
   - Log into your Make.com account
   - Check if the webhook is receiving data
   - Verify the scenario is processing correctly

## Troubleshooting

### Common Issues

#### ❌ Server Connection Failed
- **Solution:** Make sure your Next.js server is running with `npm run dev`
- **Check:** Server should be accessible at `http://localhost:3000`

#### ❌ Environment Variables Missing
- **Solution:** Create or update your `.env.local` file
- **Check:** Make sure the file is in the project root directory

#### ❌ Make.com Webhook Failed
- **Solution:** Verify your webhook URL is correct and active
- **Check:** Test the webhook URL directly in your browser or with curl

#### ❌ Authentication Issues
- **Solution:** Check your Google OAuth credentials
- **Check:** Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct

#### ❌ Workflow Trigger Failed
- **Solution:** Check server logs for detailed error messages
- **Check:** Ensure you're authenticated when making requests

### Debug Mode

To get more detailed logs, set the following in your `.env.local`:

```env
NODE_ENV=development
NEXTAUTH_DEBUG=true
```

## Expected Test Results

### ✅ All Tests Passing
```
🧪 Starting Workflow System Test Suite
==================================================

🔧 Checking environment variables...
✅ NEXTAUTH_SECRET is set
✅ GOOGLE_CLIENT_ID is set
✅ GOOGLE_CLIENT_SECRET is set
✅ MAKE_WEBHOOK_URL is set

🔍 Testing server connection...
✅ Server is running and accessible

🌐 Testing Make.com webhook connection...
✅ Make.com webhook is accessible

🚀 Testing workflow trigger for action: process_emails
✅ Workflow triggered successfully for process_emails

🚀 Testing workflow trigger for action: create_calendar_event
✅ Workflow triggered successfully for create_calendar_event

🚀 Testing workflow trigger for action: send_notification
✅ Workflow triggered successfully for send_notification

📋 Test Results Summary
==============================
Environment Variables: ✅ PASS
Server Connection: ✅ PASS
Make.com Webhook: ✅ PASS
Workflow Triggers: 3/3 passed

🎯 Overall Result: ✅ ALL TESTS PASSED
```

## Production Testing

Before deploying to production:

1. **Test with real Google authentication**
2. **Verify Make.com scenarios work end-to-end**
3. **Test with actual email data**
4. **Check database connections and logging**
5. **Verify error handling and recovery**

## Getting Help

If you encounter issues:

1. Check the server console logs
2. Review the browser developer tools
3. Verify your Make.com scenario configuration
4. Test individual components separately
5. Check the network tab for failed requests

---

**Note:** This testing guide assumes you have a basic Next.js development environment set up. Make sure you have Node.js installed and all dependencies installed with `npm install`.