# 📋 Make.com Step-by-Step Setup Guide

## 🎯 **EXACT STEPS TO FIX "MODULE NOT FOUND" ERRORS**

Based on your screenshot showing module errors, here's the exact process:

---

## 🔧 **STEP 1: Fix Gmail Module Issues**

### **Method A: Find the Correct Gmail Module**

1. **Delete Current Gmail Modules**:
   - Right-click on each gray "Module Not Found" Gmail module
   - Select "Delete"

2. **Add New Gmail Module**:
   - Click the "+" button where you want to add Gmail
   - In the search box, type exactly: `Gmail`
   - Look for these exact module names:
     - ✅ `Gmail` → `Watch Emails`
     - ✅ `Gmail` → `Search for Emails`
     - ✅ `Google Gmail` → `Watch Emails`
     - ✅ `Email` → `Watch Emails` (generic email module)

3. **If Gmail Modules Still Not Found**:
   - Try searching: `Google`
   - Look for: `Google Workspace` → `Gmail`
   - Or use: `Email` → `Watch Emails` (IMAP method)

### **Method B: Use HTTP Module for Gmail (Guaranteed to Work)**

1. **Add HTTP Module**:
   - Click "+" → Search `HTTP`
   - Select: `HTTP` → `Make a Request`

2. **Configure Gmail API Call**:
   ```
   URL: https://gmail.googleapis.com/gmail/v1/users/me/messages
   Method: GET
   Headers:
     Authorization: Bearer {{connection.accessToken}}
   Query Parameters:
     q: is:unread
     maxResults: 10
   ```

3. **Create Google Connection**:
   - Click "Create a connection"
   - Choose "Google" (generic)
   - Sign in with your Gmail account
   - Grant all permissions

---

## 🤖 **STEP 2: Fix OpenAI Module Issues**

### **Method A: Find Correct OpenAI Module**

1. **Delete Current OpenAI Module**:
   - Right-click gray "Module Not Found" OpenAI module
   - Select "Delete"

2. **Search for OpenAI Variations**:
   - Try these exact searches:
     - ✅ `OpenAI`
     - ✅ `ChatGPT`
     - ✅ `GPT`
     - ✅ `OpenAI API`
     - ✅ `AI`

3. **Look for These Module Names**:
   - `OpenAI` → `Create a Chat Completion`
   - `OpenAI` → `Create a Completion`
   - `ChatGPT` → `Chat`
   - `AI` → `Generate Text`

### **Method B: Use HTTP Module for OpenAI (Guaranteed to Work)**

1. **Add HTTP Module**:
   - Click "+" → Search `HTTP`
   - Select: `HTTP` → `Make a Request`

2. **Configure OpenAI API Call**:
   ```
   URL: https://api.openai.com/v1/chat/completions
   Method: POST
   Headers:
     Authorization: Bearer sk-YOUR_OPENAI_API_KEY
     Content-Type: application/json
   Body (JSON):
   {
     "model": "gpt-3.5-turbo",
     "messages": [
       {
         "role": "system",
         "content": "You are an AI assistant for busy parents. Analyze emails and respond in JSON format only: {\"category\": \"urgent/important/routine\", \"priority\": \"high/medium/low\", \"create_event\": true/false, \"title\": \"event title\", \"date\": \"YYYY-MM-DD\", \"summary\": \"brief summary\"}"
       },
       {
         "role": "user",
         "content": "Email Subject: {{1.subject}}\nFrom: {{1.from}}\nBody: {{1.body}}\nAnalyze this email."
       }
     ],
     "max_tokens": 500,
     "temperature": 0.3
   }
   ```

3. **Get OpenAI API Key**:
   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Copy the key (starts with `sk-`)
   - Paste in the Authorization header

---

## 📅 **STEP 3: Add Google Calendar Module**

1. **Add Module**:
   - Click "+" → Search `Google Calendar`
   - Select: `Google Calendar` → `Create an Event`

2. **Connect Google Calendar**:
   - Click "Create a connection"
   - Sign in with Google account
   - Grant calendar permissions

3. **Configure Event Creation**:
   ```
   Calendar: Primary
   Summary: {{2.choices[0].message.content.title}}
   Description: Auto-created from email: {{1.subject}}
   Start Date/Time: {{2.choices[0].message.content.date}}T14:00:00
   End Date/Time: {{2.choices[0].message.content.date}}T15:00:00
   Time Zone: Your timezone
   ```

---

## 📊 **STEP 4: Add Google Sheets Module**

1. **Create Spreadsheet First**:
   - Go to Google Sheets
   - Create new spreadsheet: "Busy Parents Email Log"
   - Add headers in Row 1:
     - A1: Date
     - B1: From
     - C1: Subject
     - D1: Category
     - E1: Priority
     - F1: Event Created
     - G1: Email ID

2. **Add Module**:
   - Click "+" → Search `Google Sheets`
   - Select: `Google Sheets` → `Add a Row`

3. **Configure Sheets Logging**:
   ```
   Spreadsheet: Busy Parents Email Log
   Sheet: Sheet1
   Values:
     - {{formatDate(now; 'YYYY-MM-DD HH:mm:ss')}}
     - {{1.from}}
     - {{1.subject}}
     - {{2.choices[0].message.content.category}}
     - {{2.choices[0].message.content.priority}}
     - {{if(2.choices[0].message.content.create_event; 'Yes'; 'No')}}
     - {{1.id}}
   ```

---

## 🔗 **STEP 5: Add Webhook Module**

1. **Add HTTP Module**:
   - Click "+" → Search `HTTP`
   - Select: `HTTP` → `Make a Request`

2. **Configure Webhook**:
   ```
   URL: http://localhost:3000/api/webhook/make-status
   Method: POST
   Headers:
     Content-Type: application/json
   Body (JSON):
   {
     "status": "completed",
     "emailsProcessed": 1,
     "timestamp": "{{formatDate(now; 'ISO')}}",
     "lastEmailId": "{{1.id}}",
     "scenarioName": "email_processing",
     "executionId": "{{execution.id}}",
     "details": {
       "email": {
         "from": "{{1.from}}",
         "subject": "{{1.subject}}"
       },
       "analysis": {{2.choices[0].message.content}}
     }
   }
   ```

---

## 🔄 **STEP 6: Add Router (Conditional Logic)**

1. **Add Router Module**:
   - Click "+" between OpenAI and Calendar
   - Search `Router`
   - Select: `Flow Control` → `Router`

2. **Configure Routes**:
   
   **Route 1 (High Priority - Create Event)**:
   ```
   Condition: {{2.choices[0].message.content.create_event}} = true
   ```
   Connect to: Google Calendar → Google Sheets → Webhook
   
   **Route 2 (Low Priority - Log Only)**:
   ```
   Condition: {{2.choices[0].message.content.create_event}} = false
   ```
   Connect to: Google Sheets → Webhook

---

## 🧪 **STEP 7: Test Each Module**

### **Test Gmail Module**:
1. Right-click Gmail module → "Run this module only"
2. Check if emails are retrieved
3. Verify email data structure

### **Test OpenAI Module**:
1. Right-click OpenAI module → "Run this module only"
2. Check if JSON response is valid
3. Verify all required fields are present

### **Test Calendar Module**:
1. Right-click Calendar module → "Run this module only"
2. Check if event is created in Google Calendar
3. Verify event details are correct

### **Test Sheets Module**:
1. Right-click Sheets module → "Run this module only"
2. Check if row is added to spreadsheet
3. Verify all data is logged correctly

### **Test Webhook Module**:
1. Make sure your local server is running: `npm run dev`
2. Right-click Webhook module → "Run this module only"
3. Check terminal for webhook received message

---

## 🚨 **COMMON ERRORS & FIXES**

### **"Module Not Found" Error**:
- **Cause**: Module name changed or not available in your region
- **Fix**: Use HTTP modules with direct API calls

### **"Connection Failed" Error**:
- **Cause**: Invalid API keys or permissions
- **Fix**: Regenerate API keys, check scopes

### **"Invalid JSON" Error**:
- **Cause**: OpenAI response not properly formatted
- **Fix**: Add JSON parsing: `{{parseJSON(response.data.choices[0].message.content)}}`

### **"Calendar Event Not Created" Error**:
- **Cause**: Date format issues
- **Fix**: Use ISO format: `{{formatDate(date; 'YYYY-MM-DDTHH:mm:ss')}}`

### **"Sheets Row Not Added" Error**:
- **Cause**: Spreadsheet permissions or ID issues
- **Fix**: Share spreadsheet with Make.com service account

---

## ✅ **FINAL VERIFICATION CHECKLIST**

- [ ] All gray "Module Not Found" modules replaced
- [ ] Gmail connection established and tested
- [ ] OpenAI API key working and returning JSON
- [ ] Google Calendar events being created
- [ ] Google Sheets logging data correctly
- [ ] Webhook sending data to local app
- [ ] Router directing traffic based on priority
- [ ] End-to-end test completed successfully

---

## 🎯 **QUICK START COMMANDS**

**Start your local server:**
```bash
cd C:\Users\laptop\Downloads\Busy__Parents\BusyParents
npm run dev
```

**Test webhook endpoint:**
```bash
curl -X POST http://localhost:3000/api/webhook/make-status \
-H "Content-Type: application/json" \
-d '{"status":"test","emailsProcessed":1}'
```

**Check database logs:**
```bash
node verify-dashboard-data.js
```

**🚀 Follow these exact steps and your Make.com workflow will be fully functional!**