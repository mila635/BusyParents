# 🔗 N8n Integration Guide for Busy Parents AI Assistant

This guide provides comprehensive instructions for integrating the Busy Parents AI Assistant with N8n workflows.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication Setup](#authentication-setup)
3. [Available API Endpoints](#available-api-endpoints)
4. [N8n Workflow Configuration](#n8n-workflow-configuration)
5. [Environment Variables](#environment-variables)
6. [Error Handling](#error-handling)
7. [Testing & Debugging](#testing--debugging)

---

## 🎯 Overview

The Busy Parents AI Assistant provides a robust backend API that can be integrated with N8n workflows for automated email processing, calendar management, and task automation.

### Key Features:
- **Email Processing**: Automated parsing of emails for events and tasks
- **Calendar Integration**: Google Calendar event creation and management
- **User Authentication**: NextAuth.js with Google OAuth
- **Database Logging**: Comprehensive workflow tracking
- **Error Handling**: Graceful fallbacks and error reporting

---

## 🔐 Authentication Setup

### 1. NextAuth Configuration

The application uses NextAuth.js with Google OAuth. Ensure your `.env` file contains:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# N8n Webhook URLs
N8N_WEBHOOK_BASE_URL=https://your-n8n-instance.com/webhook
N8N_EMAIL_PROCESSING_WEBHOOK=https://your-n8n-instance.com/webhook/email-processing
N8N_CALENDAR_WEBHOOK=https://your-n8n-instance.com/webhook/calendar
N8N_REMINDER_WEBHOOK=https://your-n8n-instance.com/webhook/reminder
```

### 2. Google API Scopes

Required Google API scopes:
- `openid email profile`
- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/gmail.modify`
- `https://www.googleapis.com/auth/calendar`
- `https://www.googleapis.com/auth/calendar.events`

---

## 🔌 Available API Endpoints

### 1. Workflow Trigger Endpoint

**Endpoint**: `POST /api/trigger-workflow`

**Purpose**: Triggers N8n workflows from the frontend

**Authentication**: Required (NextAuth session)

**Request Body**:
```json
{
  "action": "process_emails",
  "user": {
    "email": "user@example.com",
    "name": "John Doe",
    "accessToken": "google-access-token"
  },
  "additionalData": {
    "emailId": "optional-email-id",
    "customParams": {}
  }
}
```

**Supported Actions**:
- `sync_emails`: Sync Gmail emails
- `process_gmail`: Process Gmail for events
- `create_calendar_event`: Create calendar events
- `set_reminder`: Set reminders
- `process_emails`: General email processing
- `user_signup`: New user registration

**Response**:
```json
{
  "success": true,
  "message": "Workflow triggered successfully",
  "executionId": "workflow-execution-id",
  "webhookUrl": "https://n8n-instance.com/webhook/email-processing"
}
```

### 2. Events API

**Get Pending Events**: `GET /api/events/pending`
**Approve Event**: `POST /api/events/approve`
**Delete Event**: `DELETE /api/events/{eventId}`

### 3. Calendar API

**Create Event**: `POST /api/calendar/create-event`
**List Events**: `GET /api/calendar/events`

### 4. Stats API

**Get Dashboard Stats**: `GET /api/stats`

**Response**:
```json
{
  "emailsProcessed": 25,
  "eventsCreated": 12,
  "timeSaved": 3.5
}
```

---

## ⚙️ N8n Workflow Configuration

### 1. Basic Email Processing Workflow

```json
{
  "name": "Busy Parents Email Processing",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "email-processing",
        "httpMethod": "POST",
        "responseMode": "responseNode"
      }
    },
    {
      "name": "Gmail",
      "type": "n8n-nodes-base.gmail",
      "parameters": {
        "operation": "getAll",
        "returnAll": false,
        "limit": 10,
        "filters": {
          "query": "is:unread"
        }
      }
    },
    {
      "name": "Process Email Content",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// Email processing logic here\nreturn items;"
      }
    },
    {
      "name": "Send to Backend",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:3000/api/events/create",
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        }
      }
    }
  ]
}
```

### 2. Webhook Response Format

N8n webhooks should return:

```json
{
  "success": true,
  "message": "Email processed successfully",
  "data": {
    "eventsFound": 2,
    "eventsCreated": 1,
    "processingTime": "1.2s"
  },
  "executionId": "n8n-execution-id"
}
```

---

## 🌍 Environment Variables

### Required Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# N8n Webhooks
N8N_WEBHOOK_BASE_URL=https://your-n8n-instance.com
N8N_EMAIL_PROCESSING_WEBHOOK=https://your-n8n-instance.com/webhook/email-processing
N8N_CALENDAR_WEBHOOK=https://your-n8n-instance.com/webhook/calendar
N8N_REMINDER_WEBHOOK=https://your-n8n-instance.com/webhook/reminder

# Google Sheets (Optional)
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## ⚠️ Error Handling

### 1. Backend Error Responses

```json
{
  "success": false,
  "error": "Webhook URL not configured",
  "code": "WEBHOOK_NOT_CONFIGURED",
  "details": {
    "action": "process_emails",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Common Error Codes

- `UNAUTHORIZED`: User not authenticated
- `WEBHOOK_NOT_CONFIGURED`: N8n webhook URL missing
- `WORKFLOW_FAILED`: N8n workflow execution failed
- `INVALID_ACTION`: Unsupported workflow action
- `RATE_LIMITED`: Too many requests

### 3. N8n Error Handling

Implement error nodes in your N8n workflows:

```json
{
  "name": "Error Handler",
  "type": "n8n-nodes-base.function",
  "parameters": {
    "functionCode": "if ($node['Gmail'].error) {\n  return [{\n    success: false,\n    error: $node['Gmail'].error.message\n  }];\n}\nreturn items;"
  }
}
```

---

## 🧪 Testing & Debugging

### 1. Test Webhook Connectivity

```bash
# Test N8n webhook
curl -X POST https://your-n8n-instance.com/webhook/email-processing \
  -H "Content-Type: application/json" \
  -d '{
    "action": "test",
    "user": {
      "email": "test@example.com"
    }
  }'
```

### 2. Backend API Testing

```bash
# Test trigger-workflow endpoint
curl -X POST http://localhost:3000/api/trigger-workflow \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -d '{
    "action": "process_emails",
    "user": {
      "email": "user@example.com"
    }
  }'
```

### 3. Database Monitoring

Check workflow execution logs:

```sql
-- View recent workflow triggers
SELECT * FROM WorkflowTrigger 
ORDER BY createdAt DESC 
LIMIT 10;

-- View workflow execution status
SELECT * FROM WorkflowExecution 
WHERE status = 'failed' 
ORDER BY createdAt DESC;
```

### 4. Debug Mode

Enable debug logging in development:

```env
NODE_ENV=development
DEBUG=true
```

---

## 🚀 Quick Start Checklist

- [ ] Set up Google OAuth credentials
- [ ] Configure N8n instance and webhooks
- [ ] Update environment variables
- [ ] Test webhook connectivity
- [ ] Create basic email processing workflow
- [ ] Test end-to-end integration
- [ ] Set up error monitoring
- [ ] Configure database logging

---

## 📞 Support

For integration support:

1. Check the application logs: `npm run dev`
2. Verify N8n webhook responses
3. Test API endpoints individually
4. Review database logs for workflow execution

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Compatible with**: N8n v1.0+, Next.js 14+