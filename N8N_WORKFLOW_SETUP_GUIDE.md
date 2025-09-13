# 🔧 N8N Workflow Setup Guide

## Current Status

Based on testing your N8N instance:
- ✅ **Google OAuth Handler** - Already working at `https://milafinance.app.n8n.cloud/webhook/google-signin`
- ❌ **Email Processing** - Needs to be created at `https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj`
- ❌ **Calendar Management** - Needs to be created at `https://milafinance.app.n8n.cloud/webhook/dQEwT1mMujeN8JAk`

## 🚀 How to Create N8N Workflows

### Step 1: Access Your N8N Instance

1. Go to your N8N dashboard: `https://milafinance.app.n8n.cloud`
2. Log in with your credentials
3. Click "+ Add workflow" to create a new workflow

### Step 2: Create Email Processing Workflow

#### Workflow Configuration:
- **Name**: `BusyParents Email Processing`
- **Webhook Path**: `aYt6JINH3lcFv8Xj`
- **Method**: `POST`

#### Nodes to Add:

**1. Webhook Node (Trigger)**
```json
{
  "name": "Email Processing Webhook",
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "path": "aYt6JINH3lcFv8Xj",
    "httpMethod": "POST",
    "responseMode": "responseNode"
  }
}
```

**2. Function Node - Extract User Data**
```javascript
// Extract user information from the webhook payload
const payload = $node["Email Processing Webhook"].json;

return [{
  user_id: payload.user_id || payload.user?.id,
  user_email: payload.user_email || payload.user?.email,
  user_name: payload.user_name || payload.user?.name,
  access_token: payload.access_token || payload.user?.accessToken,
  action: payload.action || 'email-sync',
  timestamp: new Date().toISOString()
}];
```

**3. Gmail Node - Read Emails**
```json
{
  "name": "Read Gmail",
  "type": "n8n-nodes-base.gmail",
  "parameters": {
    "operation": "getAll",
    "returnAll": false,
    "limit": 50,
    "filters": {
      "q": "is:unread"
    }
  },
  "credentials": {
    "gmailOAuth2": {
      "id": "your-gmail-credential-id",
      "name": "Gmail OAuth2 account"
    }
  }
}
```

**4. Function Node - Process Emails**
```javascript
// Process emails and extract calendar events
const emails = $node["Read Gmail"].json;
const events = [];

for (const email of emails) {
  const subject = email.subject || '';
  const body = email.textPlain || email.textHtml || '';
  
  // Simple event detection (you can enhance this logic)
  if (subject.toLowerCase().includes('meeting') || 
      subject.toLowerCase().includes('appointment') ||
      body.toLowerCase().includes('calendar') ||
      body.toLowerCase().includes('schedule')) {
    
    events.push({
      email_id: email.id,
      subject: subject,
      sender: email.from,
      date_received: email.date,
      body_snippet: body.substring(0, 200),
      potential_event: true,
      processed_at: new Date().toISOString()
    });
  }
}

return events.map(event => ({ json: event }));
```

**5. Google Sheets Node - Save Data**
```json
{
  "name": "Save to Google Sheets",
  "type": "n8n-nodes-base.googleSheets",
  "parameters": {
    "operation": "append",
    "sheetId": "1OpM8Yp-Bz3c4tLm-Ajt1jEkipM71VTGeqPunr01V4P8",
    "range": "EmailEvents!A:H",
    "options": {
      "valueInputOption": "USER_ENTERED"
    }
  },
  "credentials": {
    "googleSheetsOAuth2": {
      "id": "your-sheets-credential-id",
      "name": "Google Sheets OAuth2 account"
    }
  }
}
```

**6. HTTP Request Node - Notify App**
```json
{
  "name": "Notify BusyParents App",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "url": "https://your-app.vercel.app/api/webhook/email-processed",
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
          "name": "status",
          "value": "completed"
        },
        {
          "name": "events_found",
          "value": "={{$node['Process Emails'].json.length}}"
        },
        {
          "name": "user_email",
          "value": "={{$node['Extract User Data'].json.user_email}}"
        }
      ]
    }
  }
}
```

**7. Respond to Webhook Node**
```json
{
  "name": "Respond to Webhook",
  "type": "n8n-nodes-base.respondToWebhook",
  "parameters": {
    "responseCode": 200,
    "responseBody": {
      "success": true,
      "message": "Email processing completed",
      "events_processed": "={{$node['Process Emails'].json.length}}",
      "timestamp": "={{new Date().toISOString()}}"
    }
  }
}
```

### Step 3: Create Calendar Management Workflow

#### Workflow Configuration:
- **Name**: `BusyParents Calendar Management`
- **Webhook Path**: `dQEwT1mMujeN8JAk`
- **Method**: `POST`

#### Nodes to Add:

**1. Webhook Node (Trigger)**
```json
{
  "name": "Calendar Webhook",
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "path": "dQEwT1mMujeN8JAk",
    "httpMethod": "POST",
    "responseMode": "responseNode"
  }
}
```

**2. Function Node - Extract Event Data**
```javascript
// Extract calendar event data from webhook payload
const payload = $node["Calendar Webhook"].json;

return [{
  title: payload.title || payload.summary,
  description: payload.description || '',
  start_time: payload.start_time || payload.startTime,
  end_time: payload.end_time || payload.endTime,
  location: payload.location || '',
  attendees: payload.attendees || [],
  user_email: payload.user_email || payload.user?.email,
  timezone: payload.timezone || 'America/New_York',
  created_at: new Date().toISOString()
}];
```

**3. Google Calendar Node - Create Event**
```json
{
  "name": "Create Calendar Event",
  "type": "n8n-nodes-base.googleCalendar",
  "parameters": {
    "operation": "create",
    "calendarId": "primary",
    "title": "={{$node['Extract Event Data'].json.title}}",
    "description": "={{$node['Extract Event Data'].json.description}}",
    "start": "={{$node['Extract Event Data'].json.start_time}}",
    "end": "={{$node['Extract Event Data'].json.end_time}}",
    "location": "={{$node['Extract Event Data'].json.location}}"
  },
  "credentials": {
    "googleCalendarOAuth2": {
      "id": "your-calendar-credential-id",
      "name": "Google Calendar OAuth2 account"
    }
  }
}
```

**4. Google Sheets Node - Log Event**
```json
{
  "name": "Log to Google Sheets",
  "type": "n8n-nodes-base.googleSheets",
  "parameters": {
    "operation": "append",
    "sheetId": "1OpM8Yp-Bz3c4tLm-Ajt1jEkipM71VTGeqPunr01V4P8",
    "range": "CalendarEvents!A:I",
    "options": {
      "valueInputOption": "USER_ENTERED"
    }
  }
}
```

**5. Respond to Webhook Node**
```json
{
  "name": "Respond to Webhook",
  "type": "n8n-nodes-base.respondToWebhook",
  "parameters": {
    "responseCode": 200,
    "responseBody": {
      "success": true,
      "message": "Calendar event created successfully",
      "event_id": "={{$node['Create Calendar Event'].json.id}}",
      "event_title": "={{$node['Extract Event Data'].json.title}}",
      "timestamp": "={{new Date().toISOString()}}"
    }
  }
}
```

## 🔧 Setup Instructions

### For Each Workflow:

1. **Create New Workflow**
   - Click "+ Add workflow" in N8N
   - Give it a descriptive name

2. **Add Nodes**
   - Drag and drop nodes from the left panel
   - Configure each node with the parameters above
   - Connect nodes in sequence

3. **Set Up Credentials**
   - Go to Settings → Credentials
   - Add Google OAuth2 credentials for:
     - Gmail
     - Google Calendar
     - Google Sheets
   - Use your existing Google OAuth credentials:
     - Client ID: `98761758378-7h0nc6sbk6gotpipu3s2tnfquakt0nb1.apps.googleusercontent.com`
     - Client Secret: `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`

4. **Test the Workflow**
   - Click "Test workflow" button
   - Send a test payload to verify it works

5. **Activate the Workflow**
   - Toggle the "Active" switch in the top-right
   - This makes the webhook URL live

## 🧪 Testing Your Workflows

### Test Email Processing:
```bash
curl -X POST https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj \
  -H "Content-Type: application/json" \
  -d '{
    "action": "email-sync",
    "user_email": "test@example.com",
    "user_name": "Test User",
    "access_token": "test_token"
  }'
```

### Test Calendar Management:
```bash
curl -X POST https://milafinance.app.n8n.cloud/webhook/dQEwT1mMujeN8JAk \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Meeting",
    "description": "Test calendar event",
    "start_time": "2024-01-20T10:00:00Z",
    "end_time": "2024-01-20T11:00:00Z",
    "user_email": "test@example.com"
  }'
```

## 🔍 Troubleshooting

### Common Issues:

1. **404 Webhook Not Found**
   - Ensure workflow is saved and activated
   - Check webhook path matches exactly
   - Verify HTTP method (GET/POST)

2. **Authentication Errors**
   - Re-authenticate Google OAuth credentials
   - Check scopes include required permissions
   - Verify credentials are assigned to correct nodes

3. **Execution Errors**
   - Check N8N execution logs
   - Verify node connections
   - Test individual nodes

### Debug Steps:

1. **Check Executions**
   - Go to "Executions" tab in N8N
   - Review failed executions
   - Check error messages

2. **Test Individual Nodes**
   - Use "Execute Node" button
   - Verify data flow between nodes
   - Check node outputs

3. **Verify Credentials**
   - Test credential connections
   - Re-authenticate if needed
   - Check permission scopes

## ✅ Verification

Once you've created both workflows:

1. **Test from your app**: Visit `http://localhost:3002/api/test-n8n-integration`
2. **Check N8N executions**: All webhooks should return success
3. **Test OAuth flow**: Sign in through your app
4. **Verify data flow**: Check Google Sheets for logged data

Your N8N integration will be fully functional once these workflows are created and activated! 🎉