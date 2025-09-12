# 🚀 Quick Copy-Paste Guide for Make.com

## 📋 **READY TO COPY CONFIGURATIONS**

### **🔑 BEFORE YOU START**

1. **Get OpenAI API Key**: https://platform.openai.com/api-keys
2. **Create Google Sheets**: "Busy Parents Email Log" with headers
3. **Start Local Server**: `npm run dev` in your project folder

---

## 📧 **MODULE 1: Gmail Fetch (HTTP)**

**App**: HTTP → Make a Request

**URL**: 
```
https://gmail.googleapis.com/gmail/v1/users/me/messages
```

**Method**: GET

**Headers**:
```
Authorization: Bearer {{connection.accessToken}}
Content-Type: application/json
```

**Query Parameters**:
```
q: is:unread newer_than:2h
maxResults: 5
```

**Connection**: Google (Generic) with scopes:
```
https://www.googleapis.com/auth/gmail.readonly
https://www.googleapis.com/auth/calendar
https://www.googleapis.com/auth/spreadsheets
```

---

## 📨 **MODULE 2: Email Details (HTTP)**

**App**: HTTP → Make a Request

**URL**: 
```
https://gmail.googleapis.com/gmail/v1/users/me/messages/{{1.messages[].id}}
```

**Method**: GET

**Headers**: Same as Module 1

**Query Parameters**:
```
format: full
```

---

## 🤖 **MODULE 3: OpenAI Analysis (HTTP)**

**App**: HTTP → Make a Request

**URL**: 
```
https://api.openai.com/v1/chat/completions
```

**Method**: POST

**Headers**:
```
Authorization: Bearer sk-YOUR_OPENAI_API_KEY_HERE
Content-Type: application/json
```

**Body** (JSON):
```json
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "You are an AI assistant for busy parents. Analyze emails and respond ONLY in valid JSON format: {\"category\": \"urgent\", \"priority\": \"high\", \"create_event\": true, \"title\": \"Meeting with teacher\", \"date\": \"2024-01-20\", \"summary\": \"School meeting about progress\"}"
    },
    {
      "role": "user",
      "content": "Email Subject: {{get(2.payload.headers; 'Subject')}}\n\nEmail From: {{get(2.payload.headers; 'From')}}\n\nEmail Body: {{2.snippet}}\n\nAnalyze this email and categorize it."
    }
  ],
  "max_tokens": 300,
  "temperature": 0.2
}
```

---

## 🔀 **MODULE 4: Router**

**App**: Router

**Route 1 Condition**:
```
{{parseJSON(3.data.choices[0].message.content).create_event}} = true
```

**Route 2 Condition**:
```
{{parseJSON(3.data.choices[0].message.content).create_event}} = false
```

---

## 📅 **MODULE 5: Google Calendar (HTTP)**

**App**: HTTP → Make a Request

**URL**: 
```
https://www.googleapis.com/calendar/v3/calendars/primary/events
```

**Method**: POST

**Headers**: Same as Module 1

**Body** (JSON):
```json
{
  "summary": "{{parseJSON(3.data.choices[0].message.content).title}}",
  "description": "Auto-created from email: {{get(2.payload.headers; 'Subject')}}\n\nFrom: {{get(2.payload.headers; 'From')}}\n\nOriginal email snippet: {{2.snippet}}",
  "start": {
    "dateTime": "{{parseJSON(3.data.choices[0].message.content).date}}T14:00:00",
    "timeZone": "America/New_York"
  },
  "end": {
    "dateTime": "{{parseJSON(3.data.choices[0].message.content).date}}T15:00:00",
    "timeZone": "America/New_York"
  },
  "reminders": {
    "useDefault": true
  }
}
```

---

## 📊 **MODULE 6: Google Sheets (HTTP)**

**App**: HTTP → Make a Request

**URL**: 
```
https://sheets.googleapis.com/v4/spreadsheets/YOUR_SPREADSHEET_ID_HERE/values/Sheet1:append
```

**Method**: POST

**Headers**: Same as Module 1

**Query Parameters**:
```
valueInputOption: RAW
insertDataOption: INSERT_ROWS
```

**Body** (JSON):
```json
{
  "values": [
    [
      "{{formatDate(now; 'YYYY-MM-DD HH:mm:ss')}}",
      "{{get(2.payload.headers; 'From')}}",
      "{{get(2.payload.headers; 'Subject')}}",
      "{{parseJSON(3.data.choices[0].message.content).category}}",
      "{{parseJSON(3.data.choices[0].message.content).priority}}",
      "{{if(parseJSON(3.data.choices[0].message.content).create_event; 'Yes'; 'No')}}",
      "{{2.id}}",
      "{{parseJSON(3.data.choices[0].message.content).summary}}"
    ]
  ]
}
```

---

## 🔗 **MODULE 7: Webhook (HTTP)**

**App**: HTTP → Make a Request

**URL**: 
```
http://localhost:3000/api/webhook/make-status
```

**Method**: POST

**Headers**:
```
Content-Type: application/json
```

**Body** (JSON):
```json
{
  "status": "completed",
  "emailsProcessed": 1,
  "timestamp": "{{formatDate(now; 'YYYY-MM-DDTHH:mm:ss.sssZ')}}",
  "lastEmailId": "{{2.id}}",
  "scenarioName": "busy_parents_email_processing",
  "executionId": "{{execution.id}}",
  "userEmail": "{{get(2.payload.headers; 'To')}}",
  "details": {
    "email": {
      "from": "{{get(2.payload.headers; 'From')}}",
      "subject": "{{get(2.payload.headers; 'Subject')}}",
      "snippet": "{{2.snippet}}"
    },
    "aiAnalysis": "{{3.data.choices[0].message.content}}",
    "calendarEventCreated": "{{if(parseJSON(3.data.choices[0].message.content).create_event; 'true'; 'false')}}",
    "sheetsLogged": "true"
  }
}
```

---

## 🔧 **REQUIRED REPLACEMENTS**

**Before testing, replace these:**

1. **Module 3**: Replace `sk-YOUR_OPENAI_API_KEY_HERE` with your actual OpenAI API key
2. **Module 6**: Replace `YOUR_SPREADSHEET_ID_HERE` with your Google Sheets ID
3. **Module 5**: Change `America/New_York` to your timezone if needed

---

## 📊 **GOOGLE SHEETS SETUP**

**Spreadsheet Name**: "Busy Parents Email Log"

**Headers (Row 1)**:
```
A1: Timestamp
B1: From
C1: Subject
D1: Category
E1: Priority
F1: Event Created
G1: Email ID
H1: Summary
```

**Get Spreadsheet ID**: Copy from URL between `/d/` and `/edit`

---

## ✅ **CONNECTION SETUP**

**Google Connection**:
- Type: Google (Generic)
- Scopes: 
  ```
  https://www.googleapis.com/auth/gmail.readonly
  https://www.googleapis.com/auth/calendar
  https://www.googleapis.com/auth/spreadsheets
  ```

---

## 🎯 **WORKFLOW CONNECTIONS**

```
Module 1 → Module 2 → Module 3 → Module 4 (Router)
                                      ↓
                              ┌───────────────┐
                              ↓               ↓
                         Route 1          Route 2
                              ↓               ↓
                         Module 5            ↓
                              ↓               ↓
                         Module 6       Module 6
                              ↓               ↓
                         Module 7       Module 7
```

---

## 🧪 **TESTING COMMANDS**

**Start Local Server**:
```bash
cd C:\Users\laptop\Downloads\Busy__Parents\BusyParents
npm run dev
```

**Test Webhook**:
```bash
curl -X POST http://localhost:3000/api/webhook/make-status -H "Content-Type: application/json" -d '{"status":"test"}'
```

**Check Database**:
```bash
node verify-dashboard-data.js
```

---

**🚀 Copy each module configuration exactly as shown above, replace the required values, and your workflow will be ready!**