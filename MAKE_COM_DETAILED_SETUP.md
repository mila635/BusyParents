# 📧 Make.com Detailed Setup Guide - Busy Parents Workflow

## 🚨 IMPORTANT: Module Names and Exact Configuration

Based on your screenshot showing "Module Not Found" errors, here's the exact setup for each module:

---

## 📧 **MODULE 1: Gmail - Watch Emails**

### **Exact Module Name:**
- **App**: `Gmail`
- **Module**: `Watch Emails` (or `Watch for New Emails`)
- **Alternative**: If not found, use `Search for Emails` with a schedule

### **Configuration:**
```json
{
  "connection": "Your Gmail Connection",
  "folder": "INBOX",
  "criteria": {
    "from": "",
    "to": "",
    "subject": "",
    "query": "is:unread",
    "maxResults": 10
  },
  "markAsRead": false,
  "processAttachments": false
}
```

### **Setup Steps:**
1. **Add Module**: Search for "Gmail" in Make.com
2. **Select**: "Watch Emails" or "Watch for New Emails"
3. **Connect Gmail**: 
   - Click "Create a connection"
   - Sign in with your Gmail account
   - Grant all permissions (Read, Modify, Send)
4. **Configure Settings**:
   - **Folder**: Select "INBOX"
   - **Criteria**: Leave empty or use "is:unread"
   - **Max Results**: 10
   - **Mark as Read**: No

---

## 🔍 **MODULE 2: Gmail - Search Emails (Alternative)**

### **If Watch Emails doesn't work, use this:**

### **Exact Module Name:**
- **App**: `Gmail`
- **Module**: `Search for Emails`

### **Configuration:**
```json
{
  "connection": "Your Gmail Connection",
  "query": "is:unread newer_than:1h",
  "maxResults": 10,
  "format": "full"
}
```

### **Setup Steps:**
1. **Add Module**: Gmail → "Search for Emails"
2. **Query**: `is:unread newer_than:1h`
3. **Max Results**: 10
4. **Format**: Full

---

## 🤖 **MODULE 3: OpenAI - Create a Chat Completion**

### **Exact Module Name:**
- **App**: `OpenAI`
- **Module**: `Create a Chat Completion`
- **Alternative Names**: `Chat Completions`, `GPT Chat`, `Create Completion`

### **Configuration:**
```json
{
  "connection": "Your OpenAI Connection",
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "You are an AI assistant for busy parents. Analyze emails and categorize them as: 'urgent', 'important', 'routine', or 'spam'. Also determine if a calendar event should be created. Respond in JSON format with: {\"category\": \"urgent/important/routine/spam\", \"priority\": \"high/medium/low\", \"create_event\": true/false, \"suggested_title\": \"event title\", \"suggested_date\": \"YYYY-MM-DD\", \"summary\": \"brief summary\"}"
    },
    {
      "role": "user",
      "content": "Email Subject: {{1.subject}}\n\nEmail Body: {{1.textPlain}}\n\nFrom: {{1.from.email}}\n\nAnalyze this email and provide categorization."
    }
  ],
  "max_tokens": 500,
  "temperature": 0.3
}
```

### **Setup Steps:**
1. **Add Module**: Search for "OpenAI"
2. **Select**: "Create a Chat Completion" or "Chat Completions"
3. **Create Connection**:
   - **API Key**: Your OpenAI API key (starts with sk-)
   - **Organization ID**: Leave empty (optional)
4. **Configure**:
   - **Model**: `gpt-3.5-turbo` or `gpt-4`
   - **Messages**: Copy the exact messages from above
   - **Max Tokens**: 500
   - **Temperature**: 0.3

---

## 📅 **MODULE 4: Google Calendar - Create an Event**

### **Exact Module Name:**
- **App**: `Google Calendar`
- **Module**: `Create an Event`

### **Configuration:**
```json
{
  "connection": "Your Google Calendar Connection",
  "calendarId": "primary",
  "summary": "{{3.choices[].message.content.suggested_title}}",
  "description": "Auto-created from email: {{1.subject}}\n\nOriginal email from: {{1.from.email}}\n\nEmail content: {{1.textPlain}}",
  "start": {
    "dateTime": "{{3.choices[].message.content.suggested_date}}T14:00:00",
    "timeZone": "America/New_York"
  },
  "end": {
    "dateTime": "{{3.choices[].message.content.suggested_date}}T15:00:00",
    "timeZone": "America/New_York"
  }
}
```

### **Setup Steps:**
1. **Add Module**: Google Calendar → "Create an Event"
2. **Connect Google Calendar**:
   - Sign in with your Google account
   - Grant calendar permissions
3. **Configure**:
   - **Calendar**: Select "Primary" or your preferred calendar
   - **Summary**: Map from OpenAI response
   - **Description**: Include email details
   - **Start/End Time**: Set appropriate times

---

## 📊 **MODULE 5: Google Sheets - Add a Row**

### **Exact Module Name:**
- **App**: `Google Sheets`
- **Module**: `Add a Row`

### **Configuration:**
```json
{
  "connection": "Your Google Sheets Connection",
  "spreadsheetId": "YOUR_SPREADSHEET_ID",
  "sheetName": "Email_Log",
  "values": [
    "{{formatDate(now; 'YYYY-MM-DD HH:mm:ss')}}",
    "{{1.from.email}}",
    "{{1.subject}}",
    "{{3.choices[].message.content.category}}",
    "{{3.choices[].message.content.priority}}",
    "{{if(3.choices[].message.content.create_event; 'Yes'; 'No')}}",
    "{{1.id}}"
  ]
}
```

### **Setup Steps:**
1. **Create Spreadsheet**: 
   - Go to Google Sheets
   - Create new spreadsheet named "Busy Parents Email Log"
   - Add headers: Date, From, Subject, Category, Priority, Event Created, Email ID
2. **Add Module**: Google Sheets → "Add a Row"
3. **Connect Google Sheets**
4. **Configure**:
   - **Spreadsheet**: Select your created spreadsheet
   - **Sheet**: "Sheet1" or "Email_Log"
   - **Values**: Map the data as shown above

---

## 🔗 **MODULE 6: HTTP - Make a Request (Webhook)**

### **Exact Module Name:**
- **App**: `HTTP`
- **Module**: `Make a Request`

### **Configuration:**
```json
{
  "url": "http://localhost:3000/api/webhook/make-status",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "status": "completed",
    "emailsProcessed": 1,
    "timestamp": "{{formatDate(now; 'YYYY-MM-DDTHH:mm:ss.sssZ')}}",
    "lastEmailId": "{{1.id}}",
    "scenarioName": "email_processing",
    "executionId": "{{execution.id}}",
    "userEmail": "{{1.to[].email}}",
    "details": {
      "email": {
        "from": "{{1.from.email}}",
        "subject": "{{1.subject}}",
        "priority": "{{3.choices[].message.content.priority}}"
      },
      "aiAnalysis": {
        "category": "{{3.choices[].message.content.category}}",
        "action_required": "{{3.choices[].message.content.create_event}}"
      }
    }
  }
}
```

### **Setup Steps:**
1. **Add Module**: HTTP → "Make a Request"
2. **Configure**:
   - **URL**: `http://localhost:3000/api/webhook/make-status`
   - **Method**: POST
   - **Headers**: Content-Type: application/json
   - **Body**: Copy the JSON structure above

---

## 🔧 **TROUBLESHOOTING MODULE NOT FOUND ISSUES:**

### **If Gmail modules are not found:**
1. **Check App Name**: Search for "Gmail" (not "Google Gmail")
2. **Alternative Names**: Try "Google Mail", "G Suite Gmail"
3. **Legacy Modules**: Look for "Gmail (Legacy)" if available
4. **Permissions**: Ensure your Make.com account has Gmail app access

### **If OpenAI module is not found:**
1. **Check App Name**: Search for "OpenAI" (exact spelling)
2. **Alternative Names**: Try "ChatGPT", "GPT", "OpenAI API"
3. **Version**: Look for "OpenAI (GPT-3)" or "OpenAI (GPT-4)"
4. **Custom Module**: If not available, use HTTP module to call OpenAI API directly

### **HTTP Alternative for OpenAI:**
```json
{
  "url": "https://api.openai.com/v1/chat/completions",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer YOUR_OPENAI_API_KEY",
    "Content-Type": "application/json"
  },
  "body": {
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "system",
        "content": "You are an AI assistant for busy parents..."
      },
      {
        "role": "user",
        "content": "Email Subject: {{1.subject}}..."
      }
    ],
    "max_tokens": 500,
    "temperature": 0.3
  }
}
```

---

## 🎯 **FINAL WORKFLOW STRUCTURE:**

1. **Gmail Watch/Search** → 2. **OpenAI Analysis** → 3. **Router** (based on priority)
   - **High Priority Branch**: → 4a. **Google Calendar** → 5a. **Google Sheets** → 6a. **Webhook**
   - **Low Priority Branch**: → 5b. **Google Sheets** → 6b. **Webhook**

---

## ✅ **TESTING CHECKLIST:**

- [ ] Gmail connection established and working
- [ ] OpenAI API key valid and responding
- [ ] Google Calendar events being created
- [ ] Google Sheets logging data
- [ ] Webhook sending status to your app
- [ ] All modules connected without errors

---

**🚀 This detailed configuration should resolve all "Module Not Found" errors and get your workflow running!**