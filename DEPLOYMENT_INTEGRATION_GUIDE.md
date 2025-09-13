# 🚀 Deployment & N8N Integration Guide

## Overview

This guide explains how to deploy the BusyParents application to Vercel and integrate it with your N8N instance at `https://milafinance.app.n8n.cloud`.

## 🔧 Pre-Deployment Setup

### 1. Google OAuth Configuration

Your Google OAuth is configured with:
- **Client ID**: `98761758378-7h0nc6sbk6gotpipu3s2tnfquakt0nb1.apps.googleusercontent.com`
- **Client Secret**: `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`
- **N8N Redirect URI**: `https://milafinance.app.n8n.cloud/webhook/google-signin`

### 2. OAuth Flow Architecture

The integration uses a dual OAuth flow:

```
User → Google OAuth → N8N Webhook → Process Data → App Callback → Dashboard
```

**Flow Details:**
1. User clicks "Sign in with Google"
2. Google redirects to N8N webhook: `https://milafinance.app.n8n.cloud/webhook/google-signin`
3. N8N processes the OAuth code and extracts user data
4. N8N forwards processed data to app: `/api/auth/n8n-callback`
5. App creates user session and redirects to dashboard

## 🌐 Vercel Deployment

### Step 1: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Step 2: Configure Environment Variables

In Vercel Dashboard, add these environment variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=29f4aec9b4910c4b267378732e6a5af0f86300ee01a25ef5b5efa2580501fc1c

# Google OAuth
GOOGLE_CLIENT_ID=98761758378-7h0nc6sbk6gotpipu3s2tnfquakt0nb1.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# Database
DATABASE_URL=file:./prisma/dev.db

# N8N Webhooks
N8N_WEBHOOK_BASE_URL=https://milafinance.app.n8n.cloud
N8N_EMAIL_PROCESSING_WEBHOOK=https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj
N8N_CALENDAR_WEBHOOK=https://milafinance.app.n8n.cloud/webhook/dQEwT1mMujeN8JAk
N8N_USER_LOGIN_WEBHOOK=https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj

# Frontend N8N URLs
NEXT_PUBLIC_N8N_BASE_URL=https://milafinance.app.n8n.cloud
NEXT_PUBLIC_N8N_WORKFLOW_1_WEBHOOK_URL=https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj
NEXT_PUBLIC_N8N_WORKFLOW_2_WEBHOOK_URL=https://milafinance.app.n8n.cloud/webhook/dQEwT1mMujeN8JAk

# Google Sheets
GOOGLE_SHEETS_SPREADSHEET_ID=1OpM8Yp-Bz3c4tLm-Ajt1jEkipM71VTGeqPunr01V4P8
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB\nUxPiHRgpSiEI1cxcO8ShcjfGJwCP+VwSd6Q5rM7jYQlvjYnFA/GKwHrKHDgeGrX9\nk/x2Bn2w/jVDKQw0Q5VVHtZ5BiQmdHAcAON4+bUWZQeRTxbwaqXuHMdJFBU5o6aY\nKxXTKuIHHI4M+ImmXUBZESjQk4JOgFn5S7NiWQYAqSJVsQ4ouAzjPFrNC8DF2rQV\nzqBYwmcmS22pAR4u1zcRw8aAeHx8R/m2LnFBehT0ndmrIgMUnsQBSjWnN3Eiu1vC\ns0XuP6P5Mmp0DdNiUdGlF3REONdVXqDvuFd5sy2L2Dy9SuD+dQnBvTuSehVmj3bL\n9daLdJd9AgMBAAECggEBALc2lQGY5f3ryslHxSouXtjBexGEwHwjNs6xsx7Aq4od\nZeUOecLLnYqRXloqxZ2Z4ieY+i2YWUAiwohgfLqMrN7gpVapinlayPgHi9xEQylZ\nQ+iFoBcNF3cjxIrJRQjzrQnXnxeOpEKGHgJTNVAFVMtcQ+uHKmvyiIE413zTJFfJ\nJ1XbgKzn+kVwAYmwtmM5Gc8KyJBsQBBYLb1GSCwS+2h7+oLkiqHqHZUcyygYpK/T\n/nwjVBB+aSYOc9h5zeMZGTmL09kkbY3wnqwKcOzPNBWw5c3AqKXuVwxQwWnLTacu\nBggTnXBo2eMZbYaKwjRoowlFHRkPtS3GVHzRQdjddqECgYEA2W5OuuOIFJpRVPK7\nkQdBajxvRvqBaAYNaUKLwHVKg4zFtEOiF9Hs1jUSgnhBiPDfJ5ruMomPnVlqPMrS\nGNuTFZNGoCHdA6hWPtqFZ2yOBhHrhKP6gmNVqMjvo09GHgfqmWxVoEcrHT2k/cVx\nvovoZBVjLmPh5p1ad+2s4wVVFpkCgYEA3hqyFgppqy4TReDOi9UjwbRfxHrjQqZJ\nv7zOANyEjEuJwqwBakgIjgEnFnkYpBn2nNVEaAHdvySRJbxGzZANzxnls4FUQdQz\nvLlMpMpqNBgsjNg4MpNHjgmhLleNOQOGg+SqZ+2VfQjVQnkLiJ1pttS5wLb6GZJL\nXtdXMoGSOgUCgYB9ot4TtS7BSz8DN9P4NtjzCxq2PKHqBwVE2h6QjuPiSPmS+2xO\nr0Ru1Ijmwjz1XHdZ3VmCzAaTI2Ek1jKuKZUXanAiPn7hwQN4Lw5rZA5sRrdjHdnc\nXRuIb9Ga6V3fQFhGpQhqVtNtfZ4iTZOJFibVfANfcRGg+31TKOufBgKBgQDem6EY\nHRkP2nwGiHQYQnRHXgBrjzMktNwEi1zcmyxnQekX5xQnlmAiVtej4BGpzNBzf9DD\ndc/rdpIJ6jzI4p/I0O6PkcMrNeVcEJEFdFlgl8IkEzyD+c6aTrI9xO9aAiMmzS0l\nkYvoHgtGWdVHRUhSBleI9Z/S2sGdI0JlMJpBrQKBgEfzQiYpiBZKzlHkh4C5wYLa\nGGzjx1hqJqZXKtjgbhQBhS5L4pYqpiC2ZrDvZqhI+4QQUhT7+hI+fXSszVBpVhLn\nXbaYTzAE+fXuLWDFtK5E3Wm7jmL4WS/Mb1VdvOXfuFuH+Ue9k4N8A8zU5pUMpvJl\nXtdXMoGSOgU\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL=busy-parents-sheets-service@mytestoauth-470505.iam.gserviceaccount.com
```

## 🔗 N8N Workflow Configuration

### Required N8N Workflows

You need to create these workflows in your N8N instance:

#### 1. Google OAuth Handler Workflow
**Webhook URL**: `https://milafinance.app.n8n.cloud/webhook/google-signin`

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "google-signin",
        "httpMethod": "GET",
        "responseMode": "responseNode"
      }
    },
    {
      "name": "Extract OAuth Code",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "const code = $node.Webhook.json.query.code;\nconst state = $node.Webhook.json.query.state;\n\nreturn [{\n  code,\n  state,\n  client_id: '98761758378-7h0nc6sbk6gotpipu3s2tnfquakt0nb1.apps.googleusercontent.com',\n  client_secret: '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',\n  redirect_uri: 'https://milafinance.app.n8n.cloud/webhook/google-signin',\n  grant_type: 'authorization_code'\n}];"
      }
    },
    {
      "name": "Exchange Code for Token",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://oauth2.googleapis.com/token",
        "method": "POST",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/x-www-form-urlencoded"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "code",
              "value": "={{$node['Extract OAuth Code'].json.code}}"
            },
            {
              "name": "client_id",
              "value": "={{$node['Extract OAuth Code'].json.client_id}}"
            },
            {
              "name": "client_secret",
              "value": "={{$node['Extract OAuth Code'].json.client_secret}}"
            },
            {
              "name": "redirect_uri",
              "value": "={{$node['Extract OAuth Code'].json.redirect_uri}}"
            },
            {
              "name": "grant_type",
              "value": "authorization_code"
            }
          ]
        }
      }
    },
    {
      "name": "Get User Info",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://www.googleapis.com/oauth2/v2/userinfo",
        "method": "GET",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer {{$node['Exchange Code for Token'].json.access_token}}"
            }
          ]
        }
      }
    },
    {
      "name": "Send to App",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://your-app-name.vercel.app/api/auth/n8n-callback",
        "method": "POST",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "jsonParameters": {
          "parameters": [
            {
              "name": "access_token",
              "value": "={{$node['Exchange Code for Token'].json.access_token}}"
            },
            {
              "name": "refresh_token",
              "value": "={{$node['Exchange Code for Token'].json.refresh_token}}"
            },
            {
              "name": "expires_in",
              "value": "={{$node['Exchange Code for Token'].json.expires_in}}"
            },
            {
              "name": "scope",
              "value": "={{$node['Exchange Code for Token'].json.scope}}"
            },
            {
              "name": "user_info",
              "value": "={{$node['Get User Info'].json}}"
            }
          ]
        }
      }
    },
    {
      "name": "Redirect to App",
      "type": "n8n-nodes-base.respondToWebhook",
      "parameters": {
        "responseCode": 302,
        "responseHeaders": {
          "entries": [
            {
              "name": "Location",
              "value": "https://your-app-name.vercel.app/dashboard?n8n_auth=success"
            }
          ]
        }
      }
    }
  ]
}
```

#### 2. Email Processing Workflow
**Webhook URL**: `https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj`

This workflow should:
1. Receive user data from the app
2. Use the access token to read Gmail
3. Process emails for calendar events
4. Save data to Google Sheets
5. Return results to the app

#### 3. Calendar Management Workflow
**Webhook URL**: `https://milafinance.app.n8n.cloud/webhook/dQEwT1mMujeN8JAk`

This workflow should:
1. Receive calendar event data
2. Create events in Google Calendar
3. Update Google Sheets
4. Send confirmation back to app

## 🧪 Testing the Integration

### 1. Test OAuth Flow

1. Deploy your app to Vercel
2. Update the N8N workflow with your Vercel URL
3. Visit your app and click "Sign in with Google"
4. Verify the flow: Google → N8N → App → Dashboard

### 2. Test Webhook Endpoints

```bash
# Test email processing
curl -X POST https://your-app.vercel.app/api/trigger-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "action": "email-sync",
    "additionalData": {"test": true}
  }'

# Test N8N webhook directly
curl -X POST https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj \
  -H "Content-Type: application/json" \
  -d '{
    "action": "test",
    "user": {"email": "test@example.com"}
  }'
```

## 🔍 Troubleshooting

### Common Issues

1. **OAuth Redirect Mismatch**
   - Ensure N8N webhook URL matches Google OAuth settings
   - Check that N8N workflow is active

2. **Environment Variables**
   - Verify all environment variables are set in Vercel
   - Check that URLs don't have trailing slashes

3. **N8N Workflow Errors**
   - Check N8N execution logs
   - Verify webhook paths match environment variables
   - Test individual nodes in N8N

4. **Database Issues**
   - Ensure Prisma schema is up to date
   - Check database connection in production

### Debug Steps

1. **Check Vercel Logs**
   ```bash
   vercel logs your-app-name
   ```

2. **Monitor N8N Executions**
   - Go to N8N dashboard
   - Check "Executions" tab
   - Review failed executions

3. **Test API Endpoints**
   ```bash
   # Test health endpoint
   curl https://your-app.vercel.app/api/health
   
   # Test auth status
   curl https://your-app.vercel.app/api/auth/session
   ```

## 📋 Deployment Checklist

- [ ] Update `.env.production` with correct Vercel URL
- [ ] Set all environment variables in Vercel dashboard
- [ ] Create N8N OAuth handler workflow
- [ ] Create N8N email processing workflow
- [ ] Create N8N calendar workflow
- [ ] Test OAuth flow end-to-end
- [ ] Test webhook integrations
- [ ] Verify Google Sheets integration
- [ ] Test error handling
- [ ] Monitor production logs

## 🚀 Go Live

Once everything is tested:

1. **Final Deployment**
   ```bash
   vercel --prod
   ```

2. **Update N8N Workflows**
   - Replace all localhost URLs with your Vercel URL
   - Activate all workflows

3. **Test Production**
   - Sign in with Google
   - Trigger email processing
   - Create calendar events
   - Verify data in Google Sheets

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review N8N execution history
3. Verify environment variables
4. Test individual API endpoints
5. Check Google OAuth configuration

Your app is now ready for production with full N8N integration! 🎉