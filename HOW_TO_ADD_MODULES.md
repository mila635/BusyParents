# 📋 How to Add Ready-Made Modules to Make.com

## 🎯 **WHERE TO ADD THE MODULES**

You'll add these modules directly in your Make.com scenario editor. Here's exactly how:

---

## 🚀 **STEP-BY-STEP PROCESS**

### **STEP 1: Access Your Make.com Scenario**

1. **Go to Make.com**: https://www.make.com/en/login
2. **Sign in** to your account
3. **Navigate to**: Scenarios → Your scenario (or create new)
4. **Delete existing broken modules**:
   - Right-click each gray "Module Not Found" module
   - Select "Delete"
   - Clear your entire workflow

---

### **STEP 2: Add Each Module (7 Total)**

#### **🔧 For Each Module, Follow This Process:**

1. **Click the "+" button** where you want to add the module
2. **Search for "HTTP"** in the app search
3. **Select**: "HTTP" → "Make a Request"
4. **Configure using the ready-made settings** from `READY_MADE_MODULES.json`

---

## 📧 **MODULE 1: Gmail Email Fetcher**

### **Where to Add**: Start of your workflow (first module)

### **Configuration Steps**:
1. **Add HTTP Module**: Click "+" → Search "HTTP" → "Make a Request"
2. **Copy these exact settings**:
   ```
   URL: https://gmail.googleapis.com/gmail/v1/users/me/messages
   Method: GET
   ```

3. **Headers Section**:
   - Click "Add item" in Headers
   - **Name**: `Authorization`
   - **Value**: `Bearer {{connection.accessToken}}`
   - Click "Add item" again
   - **Name**: `Content-Type`
   - **Value**: `application/json`

4. **Query Parameters Section**:
   - Click "Add item" in Query Parameters
   - **Name**: `q`
   - **Value**: `is:unread newer_than:2h`
   - Click "Add item" again
   - **Name**: `maxResults`
   - **Value**: `5`

5. **Connection**:
   - Click "Create a connection"
   - Search "Google"
   - Select "Google (Generic)"
   - **Scopes**: Add these three:
     ```
     https://www.googleapis.com/auth/gmail.readonly
     https://www.googleapis.com/auth/calendar
     https://www.googleapis.com/auth/spreadsheets
     ```
   - Authorize with your Google account

---

## 📨 **MODULE 2: Email Details Fetcher**

### **Where to Add**: Connect to Module 1 output

### **Configuration Steps**:
1. **Add HTTP Module**: Click "+" after Module 1
2. **URL**: `https://gmail.googleapis.com/gmail/v1/users/me/messages/{{1.messages[].id}}`
3. **Method**: GET
4. **Headers**: Same as Module 1
5. **Query Parameters**:
   - **Name**: `format`
   - **Value**: `full`
6. **Connection**: Use same Google connection

---

## 🤖 **MODULE 3: OpenAI Analysis**

### **Where to Add**: Connect to Module 2 output

### **Configuration Steps**:
1. **Get OpenAI API Key First**:
   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Copy the key (starts with `sk-`)

2. **Add HTTP Module**: Click "+" after Module 2
3. **URL**: `https://api.openai.com/v1/chat/completions`
4. **Method**: POST
5. **Headers**:
   - **Name**: `Authorization`
   - **Value**: `Bearer sk-YOUR_ACTUAL_API_KEY_HERE`
   - **Name**: `Content-Type`
   - **Value**: `application/json`

6. **Body** (Select "JSON" format):
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

### **Where to Add**: Connect to Module 3 output

### **Configuration Steps**:
1. **Add Router**: Click "+" after Module 3 → Search "Router" → Select "Router"
2. **Route 1 Configuration**:
   - **Name**: "High Priority - Create Event"
   - **Condition**: `{{parseJSON(3.data.choices[0].message.content).create_event}} = true`
3. **Route 2 Configuration**:
   - **Name**: "Low Priority - Log Only"
   - **Condition**: `{{parseJSON(3.data.choices[0].message.content).create_event}} = false`

---

## 📅 **MODULE 5: Google Calendar**

### **Where to Add**: Connect to Router Route 1 (High Priority)

### **Configuration Steps**:
1. **Add HTTP Module**: Click "+" on Route 1 path
2. **URL**: `https://www.googleapis.com/calendar/v3/calendars/primary/events`
3. **Method**: POST
4. **Headers**: Same Authorization as Module 1
5. **Body** (JSON format):
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
6. **Connection**: Use same Google connection

---

## 📊 **MODULE 6: Google Sheets**

### **Where to Add**: Connect to BOTH router routes (after Calendar on Route 1, directly on Route 2)

### **FIRST: Create Your Spreadsheet**
1. **Go to Google Sheets**: https://sheets.google.com
2. **Create new spreadsheet**: "Busy Parents Email Log"
3. **Add headers in Row 1**:
   - A1: `Timestamp`
   - B1: `From`
   - C1: `Subject`
   - D1: `Category`
   - E1: `Priority`
   - F1: `Event Created`
   - G1: `Email ID`
   - H1: `Summary`
4. **Copy Spreadsheet ID**: From URL between `/d/` and `/edit`

### **Configuration Steps**:
1. **Add HTTP Module**: Click "+" after Calendar (Route 1) and directly on Route 2
2. **URL**: `https://sheets.googleapis.com/v4/spreadsheets/YOUR_SPREADSHEET_ID_HERE/values/Sheet1:append`
   - **Replace**: `YOUR_SPREADSHEET_ID_HERE` with your actual ID
3. **Method**: POST
4. **Headers**: Same Authorization as Module 1
5. **Query Parameters**:
   - **Name**: `valueInputOption`, **Value**: `RAW`
   - **Name**: `insertDataOption`, **Value**: `INSERT_ROWS`
6. **Body** (JSON format):
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

## 🔗 **MODULE 7: Webhook**

### **Where to Add**: Connect after Sheets modules on both routes

### **Configuration Steps**:
1. **Ensure Local Server Running**: In your terminal, run `npm run dev`
2. **Add HTTP Module**: Click "+" after Sheets modules
3. **URL**: `http://localhost:3000/api/webhook/make-status`
4. **Method**: POST
5. **Headers**:
   - **Name**: `Content-Type`
   - **Value**: `application/json`
6. **Body** (JSON format):
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

## 🎯 **FINAL WORKFLOW STRUCTURE**

```
[Module 1: Gmail Fetch] 
         ↓
[Module 2: Email Details] 
         ↓
[Module 3: OpenAI Analysis] 
         ↓
[Module 4: Router]
         ↓
    ┌─────────────────┐
    ↓                 ↓
[Route 1: High]   [Route 2: Low]
    ↓                 ↓
[Module 5: Calendar]  ↓
    ↓                 ↓
[Module 6: Sheets] [Module 6: Sheets]
    ↓                 ↓
[Module 7: Webhook] [Module 7: Webhook]
```

---

## ✅ **TESTING YOUR MODULES**

### **Test Each Module Individually**:
1. **Right-click each module** → "Run this module only"
2. **Check the output** for successful execution
3. **Fix any errors** before proceeding to next module

### **Test Complete Workflow**:
1. **Click "Run once"** on the scenario
2. **Monitor execution** in real-time
3. **Check results**:
   - Gmail: Emails fetched
   - OpenAI: JSON response received
   - Calendar: Events created (for high priority)
   - Sheets: Data logged
   - Webhook: Local app updated

---

## 🔧 **REQUIRED REPLACEMENTS**

Before testing, make sure you've replaced:

- ✅ **OpenAI API Key**: In Module 3 Authorization header
- ✅ **Spreadsheet ID**: In Module 6 URL
- ✅ **Timezone**: In Module 5 (change from America/New_York to yours)
- ✅ **Local Server**: Ensure `npm run dev` is running

---

**🚀 Follow this guide step-by-step, and your Make.com workflow will be fully functional with all modules properly connected!**