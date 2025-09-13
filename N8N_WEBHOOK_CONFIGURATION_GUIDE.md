# N8N Webhook Configuration Guide

## Overview
This guide explains how to properly configure N8N webhooks to work seamlessly with the Busy Parents application. The system is now configured to use N8N exclusively (Make.com triggers are disabled).

## Prerequisites
- N8N instance running at `https://milafinance.app.n8n.cloud`
- Access to N8N workflow editor
- Understanding of webhook concepts

## Current Webhook Configuration

The application is configured with the following N8N webhooks:

### Primary Webhooks
- **Email Processing**: `https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj`
- **Calendar Events**: `https://milafinance.app.n8n.cloud/webhook/dQEwT1mMujeN8JAk`
- **User Login**: `https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj`
- **Reminders**: `https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj`

### Frontend Webhooks
- **Workflow 1**: `https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj`
- **Workflow 2**: `https://milafinance.app.n8n.cloud/webhook/dQEwT1mMujeN8JAk`

## N8N Workflow Setup

### 1. Create Webhook Node

1. **Add Webhook Node**:
   - Drag "Webhook" node to your workflow
   - Set HTTP Method to `POST`
   - Set Path to match your webhook URL (e.g., `aYt6JINH3lcFv8Xj`)
   - Enable "Respond to Webhook" if you need immediate response

2. **Configure Authentication** (Optional):
   - Add "Header Auth" if needed
   - Set custom headers for security

### 2. Expected Payload Structure

The application sends the following payload structure:

```json
{
  "action": "process_emails|create_calendar_event|user_login|set_reminder",
  "user": {
    "email": "user@example.com",
    "name": "User Name"
  },
  "accessToken": "google_oauth_access_token",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "additionalData": {
    "source": "dashboard_login|manual_trigger",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Workflow Triggers

The application automatically triggers workflows in these scenarios:

#### A. User Login/Dashboard Access
- **Trigger**: When user logs in and accesses dashboard
- **Action**: `dashboard_access` or `user_login`
- **Purpose**: Initialize user session and start email processing

#### B. Manual Email Scan
- **Trigger**: When user clicks "Trigger Workflow" button
- **Action**: `manual_email_scan` or `process_emails`
- **Purpose**: Force immediate email processing

#### C. Calendar Event Creation
- **Trigger**: When creating calendar events from emails
- **Action**: `create_calendar_event`
- **Purpose**: Add events to Google Calendar

#### D. Reminder Setting
- **Trigger**: When setting up reminders
- **Action**: `set_reminder`
- **Purpose**: Configure notification reminders

## N8N Workflow Examples

### Email Processing Workflow

```
[Webhook] → [Gmail Node] → [AI Text Parser] → [Calendar Node] → [Response]
```

1. **Webhook Node**: Receives trigger from app
2. **Gmail Node**: 
   - Use `accessToken` from payload
   - Search for recent emails
   - Filter by date/sender
3. **AI Text Parser**: Extract event information
4. **Calendar Node**: Create calendar events
5. **Response Node**: Send success/failure response

### User Login Workflow

```
[Webhook] → [Set Variables] → [Gmail Setup] → [Initial Scan] → [Response]
```

1. **Webhook Node**: Receives login trigger
2. **Set Variables**: Store user info and tokens
3. **Gmail Setup**: Initialize Gmail connection
4. **Initial Scan**: Perform first email scan
5. **Response Node**: Confirm initialization

## Configuration Steps

### Step 1: Create N8N Workflows

1. **Login to N8N**: Access `https://milafinance.app.n8n.cloud`
2. **Create New Workflow**: Click "+ New Workflow"
3. **Add Webhook Node**: Configure with correct path
4. **Build Processing Logic**: Add Gmail, Calendar, and other nodes
5. **Test Webhook**: Use N8N's test feature
6. **Activate Workflow**: Enable the workflow

### Step 2: Configure Webhook Paths

Ensure your N8N webhooks match these paths:
- `/webhook/aYt6JINH3lcFv8Xj` - Primary email processing
- `/webhook/dQEwT1mMujeN8JAk` - Calendar and secondary processing

### Step 3: Test Integration

1. **Start Application**: Run `npm run dev`
2. **Login**: Authenticate with Google
3. **Check Dashboard**: Verify automatic workflow triggering
4. **Manual Test**: Click "Trigger Workflow" button
5. **Monitor N8N**: Check execution logs in N8N interface

## Troubleshooting

### Common Issues

1. **Webhook Not Receiving Data**:
   - Check N8N workflow is activated
   - Verify webhook URL matches environment variables
   - Check N8N instance accessibility

2. **Authentication Errors**:
   - Ensure `accessToken` is properly passed
   - Check Google OAuth scopes
   - Verify token expiration

3. **Workflow Execution Fails**:
   - Check N8N execution logs
   - Verify node configurations
   - Test individual nodes

### Debug Mode

Enable debug logging by:
1. Check browser console for webhook calls
2. Monitor N8N execution history
3. Review application logs for errors

## Security Considerations

1. **Webhook Security**:
   - Use HTTPS only
   - Implement request validation
   - Add custom headers for authentication

2. **Token Handling**:
   - Never log access tokens
   - Implement token refresh logic
   - Use secure token storage

3. **Data Privacy**:
   - Minimize data sent to webhooks
   - Implement data retention policies
   - Follow GDPR compliance

## Monitoring and Maintenance

### Health Checks
- Monitor webhook response times
- Check N8N workflow execution success rates
- Review error logs regularly

### Performance Optimization
- Implement webhook timeouts (5 seconds)
- Use parallel processing for multiple workflows
- Cache frequently accessed data

## Next Steps

1. **Test Current Setup**: Verify all webhooks are working
2. **Customize Workflows**: Adapt N8N workflows to your needs
3. **Monitor Performance**: Track execution times and success rates
4. **Scale as Needed**: Add more workflows for additional features

---

## Quick Reference

### Environment Variables (Already Configured)
```
N8N_EMAIL_PROCESSING_WEBHOOK=https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj
N8N_CALENDAR_WEBHOOK=https://milafinance.app.n8n.cloud/webhook/dQEwT1mMujeN8JAk
N8N_USER_LOGIN_WEBHOOK=https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj
```

### Test Commands
```bash
# Start development server
npm run dev

# Test webhook connectivity
curl -X POST https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj \
  -H "Content-Type: application/json" \
  -d '{"action":"test","user":{"email":"test@example.com"}}'
```

Your N8N integration is now configured and ready for seamless operation! 🚀