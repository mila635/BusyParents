# 🔧 Make.com Module Troubleshooting & Alternative Solutions

## 🚨 **CRITICAL: Module Not Found Solutions**

### **Problem**: Gmail "Watch Emails" and "Search Emails" modules not available

---

## 📧 **GMAIL MODULE ALTERNATIVES**

### **Option 1: Gmail API via HTTP Module**

**Module**: HTTP → Make a Request

**Configuration for Email Watching:**
```json
{
  "url": "https://gmail.googleapis.com/gmail/v1/users/me/messages",
  "method": "GET",
  "headers": {
    "Authorization": "Bearer {{connection.accessToken}}",
    "Content-Type": "application/json"
  },
  "query": {
    "q": "is:unread",
    "maxResults": "10"
  }
}
```

**Setup Steps:**
1. **Create Google Connection**:
   - Go to Make.com connections
   - Add "Google" (generic)
   - Authorize with Gmail scope: `https://www.googleapis.com/auth/gmail.readonly`

2. **Get Email Details** (Second HTTP call):
```json
{
  "url": "https://gmail.googleapis.com/gmail/v1/users/me/messages/{{messageId}}",
  "method": "GET",
  "headers": {
    "Authorization": "Bearer {{connection.accessToken}}"
  },
  "query": {
    "format": "full"
  }
}
```

### **Option 2: IMAP via Email Module**

**Module**: Email → Watch Emails

**Configuration:**
```json
{
  "host": "imap.gmail.com",
  "port": 993,
  "secure": true,
  "username": "your-email@gmail.com",
  "password": "your-app-password",
  "folder": "INBOX",
  "criteria": {
    "unseen": true
  },
  "maxEmails": 10
}
```

**Gmail App Password Setup:**
1. Go to Google Account settings
2. Security → 2-Step Verification
3. App passwords → Generate password
4. Use this password in Make.com

---

## 🤖 **OPENAI MODULE ALTERNATIVES**

### **Option 1: HTTP Module for OpenAI API**

**Module**: HTTP → Make a Request

**Configuration:**
```json
{
  "url": "https://api.openai.com/v1/chat/completions",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer sk-your-openai-api-key",
    "Content-Type": "application/json"
  },
  "body": {
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "system",
        "content": "You are an AI assistant for busy parents. Analyze emails and categorize them as: 'urgent', 'important', 'routine', or 'spam'. Also determine if a calendar event should be created. Respond ONLY in valid JSON format: {\"category\": \"urgent\", \"priority\": \"high\", \"create_event\": true, \"suggested_title\": \"Meeting with teacher\", \"suggested_date\": \"2024-01-15\", \"summary\": \"School meeting about child's progress\"}"
      },
      {
        "role": "user",
        "content": "Email Subject: {{emailSubject}}\n\nEmail Body: {{emailBody}}\n\nFrom: {{emailFrom}}\n\nAnalyze this email."
      }
    ],
    "max_tokens": 500,
    "temperature": 0.3
  }
}
```

### **Option 2: Alternative AI Services**

**If OpenAI is not available, use:**

1. **Anthropic Claude** (if available):
```json
{
  "url": "https://api.anthropic.com/v1/messages",
  "method": "POST",
  "headers": {
    "x-api-key": "your-anthropic-key",
    "Content-Type": "application/json",
    "anthropic-version": "2023-06-01"
  },
  "body": {
    "model": "claude-3-sonnet-20240229",
    "max_tokens": 500,
    "messages": [
      {
        "role": "user",
        "content": "Analyze this email and respond in JSON format..."
      }
    ]
  }
}
```

2. **Google Gemini** (if available):
```json
{
  "url": "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json"
  },
  "query": {
    "key": "your-google-api-key"
  },
  "body": {
    "contents": [
      {
        "parts": [
          {
            "text": "Analyze this email and respond in JSON format..."
          }
        ]
      }
    ]
  }
}
```

---

## 📊 **COMPLETE WORKFLOW WITH HTTP MODULES ONLY**

### **Module 1: Gmail via HTTP**
```json
{
  "name": "Get Gmail Messages",
  "module": "HTTP - Make a Request",
  "config": {
    "url": "https://gmail.googleapis.com/gmail/v1/users/me/messages",
    "method": "GET",
    "headers": {
      "Authorization": "Bearer {{google.accessToken}}"
    },
    "query": {
      "q": "is:unread newer_than:1h",
      "maxResults": "5"
    }
  }
}
```

### **Module 2: Get Email Details**
```json
{
  "name": "Get Email Content",
  "module": "HTTP - Make a Request",
  "config": {
    "url": "https://gmail.googleapis.com/gmail/v1/users/me/messages/{{1.messages[].id}}",
    "method": "GET",
    "headers": {
      "Authorization": "Bearer {{google.accessToken}}"
    },
    "query": {
      "format": "full"
    }
  }
}
```

### **Module 3: OpenAI Analysis via HTTP**
```json
{
  "name": "AI Email Analysis",
  "module": "HTTP - Make a Request",
  "config": {
    "url": "https://api.openai.com/v1/chat/completions",
    "method": "POST",
    "headers": {
      "Authorization": "Bearer {{openai.apiKey}}",
      "Content-Type": "application/json"
    },
    "body": {
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "system",
          "content": "Analyze emails for busy parents. Return JSON: {\"category\": \"urgent/important/routine\", \"priority\": \"high/medium/low\", \"create_event\": true/false, \"title\": \"event title\", \"date\": \"YYYY-MM-DD\", \"summary\": \"brief summary\"}"
        },
        {
          "role": "user",
          "content": "Subject: {{2.payload.subject}}\nFrom: {{2.payload.from}}\nBody: {{2.snippet}}\nAnalyze this email."
        }
      ],
      "max_tokens": 300,
      "temperature": 0.2
    }
  }
}
```

### **Module 4: Google Calendar via HTTP**
```json
{
  "name": "Create Calendar Event",
  "module": "HTTP - Make a Request",
  "config": {
    "url": "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    "method": "POST",
    "headers": {
      "Authorization": "Bearer {{google.accessToken}}",
      "Content-Type": "application/json"
    },
    "body": {
      "summary": "{{parseJSON(3.data.choices[0].message.content).title}}",
      "description": "Auto-created from email: {{2.payload.subject}}",
      "start": {
        "dateTime": "{{parseJSON(3.data.choices[0].message.content).date}}T14:00:00",
        "timeZone": "America/New_York"
      },
      "end": {
        "dateTime": "{{parseJSON(3.data.choices[0].message.content).date}}T15:00:00",
        "timeZone": "America/New_York"
      }
    }
  }
}
```

### **Module 5: Google Sheets via HTTP**
```json
{
  "name": "Log to Sheets",
  "module": "HTTP - Make a Request",
  "config": {
    "url": "https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Sheet1:append",
    "method": "POST",
    "headers": {
      "Authorization": "Bearer {{google.accessToken}}",
      "Content-Type": "application/json"
    },
    "query": {
      "valueInputOption": "RAW"
    },
    "body": {
      "values": [
        [
          "{{formatDate(now; 'YYYY-MM-DD HH:mm:ss')}}",
          "{{2.payload.from}}",
          "{{2.payload.subject}}",
          "{{parseJSON(3.data.choices[0].message.content).category}}",
          "{{parseJSON(3.data.choices[0].message.content).priority}}",
          "{{if(parseJSON(3.data.choices[0].message.content).create_event; 'Yes'; 'No')}}"
        ]
      ]
    }
  }
}
```

### **Module 6: Webhook to Your App**
```json
{
  "name": "Update Local App",
  "module": "HTTP - Make a Request",
  "config": {
    "url": "http://localhost:3000/api/webhook/make-status",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": {
      "status": "completed",
      "emailsProcessed": 1,
      "timestamp": "{{formatDate(now; 'ISO')}}",
      "lastEmailId": "{{2.id}}",
      "details": {
        "email": {
          "from": "{{2.payload.from}}",
          "subject": "{{2.payload.subject}}"
        },
        "analysis": "{{3.data.choices[0].message.content}}"
      }
    }
  }
}
```

---

## 🔑 **API KEYS & CONNECTIONS NEEDED**

### **1. Google OAuth Connection**
**Scopes Required:**
- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/calendar`
- `https://www.googleapis.com/auth/spreadsheets`

### **2. OpenAI API Key**
- Get from: https://platform.openai.com/api-keys
- Format: `sk-...`

### **3. Google Sheets Setup**
1. Create spreadsheet: "Busy Parents Email Log"
2. Headers: Date | From | Subject | Category | Priority | Event Created
3. Get Sheet ID from URL

---

## 🧪 **TESTING EACH MODULE**

### **Test Gmail Connection:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
"https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread&maxResults=1"
```

### **Test OpenAI Connection:**
```bash
curl -X POST "https://api.openai.com/v1/chat/completions" \
-H "Authorization: Bearer YOUR_API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "model": "gpt-3.5-turbo",
  "messages": [{"role": "user", "content": "Hello"}],
  "max_tokens": 50
}'
```

### **Test Calendar Connection:**
```bash
curl -X POST "https://www.googleapis.com/calendar/v3/calendars/primary/events" \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "summary": "Test Event",
  "start": {"dateTime": "2024-01-15T14:00:00"},
  "end": {"dateTime": "2024-01-15T15:00:00"}
}'
```

---

## ✅ **FINAL CHECKLIST**

- [ ] Google OAuth connection created with all scopes
- [ ] OpenAI API key obtained and tested
- [ ] Google Sheets created with proper headers
- [ ] All HTTP modules configured with correct URLs
- [ ] JSON parsing functions added where needed
- [ ] Error handling added to each module
- [ ] Webhook endpoint tested locally

**🎯 This approach uses only HTTP modules and should work regardless of which specific app modules are available in Make.com!**