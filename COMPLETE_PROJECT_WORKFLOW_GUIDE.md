# Complete Project Workflow Guide

## 🚀 Project Overview

The **Busy Parents** application is an intelligent email-to-calendar automation system that uses N8N workflows to process emails and create calendar events automatically. Here's how everything works together:

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   N8N Cloud     │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   (Workflows)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  User Interface │    │   Database      │    │  Google APIs    │
│  (Dashboard)    │    │   (SQLite)      │    │  (Gmail/Cal)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📱 Frontend Components & Navigation

### Main Pages Structure:

#### 1. **Landing Page** (`/`)
- **File**: `pages/index.tsx`
- **Purpose**: Welcome page with login button
- **Navigation**: Sign in with Google → Redirects to Dashboard

#### 2. **Authentication Pages** (`/auth/*`)
- **Sign In**: `pages/auth/signin.tsx`
  - Google OAuth integration
  - Automatic N8N workflow triggering on successful login
- **Error Page**: `pages/auth/error.tsx`
- **Verify Request**: `pages/auth/verify-request.tsx`

#### 3. **Dashboard** (`/dashboard`)
- **File**: `pages/dashboard.tsx`
- **Key Features**:
  - **Automatic Workflow Triggering**: Calls N8N on page load
  - **Manual Trigger Button**: Force email processing
  - **Real-time Status Updates**: Shows workflow execution status
  - **User Profile Display**: Shows logged-in user info

#### 4. **Workflow Status** (`/workflow-status`)
- **File**: `pages/workflow-status.tsx`
- **Purpose**: Detailed workflow execution history and logs
- **Features**: Refresh status, view execution details

#### 5. **User Profile** (`/profile`)
- **File**: `pages/profile.tsx`
- **Purpose**: User account management and settings

### Key Frontend Components:

#### Navigation Bar (`components/Navbar.tsx`)
```typescript
// Navigation structure:
- Home → Dashboard
- Workflow Status → /workflow-status
- Profile → /profile
- Sign Out → Logout functionality
```

#### Dashboard Components:
- **EmailSync** (`components/EmailSync.js`): Email processing interface
- **CalendarSync** (`components/CalendarSync.js`): Calendar integration display
- **WorkflowStatus** (`components/WorkflowStatus.tsx`): Real-time status updates
- **WorkflowStatusDashboard** (`components/WorkflowStatusDashboard.js`): Detailed status view

## 🔄 Complete User Flow

### 1. **User Authentication Flow**
```
User visits / → Clicks "Sign in with Google" → Google OAuth → 
Redirects to /dashboard → Automatic N8N trigger → Email processing starts
```

### 2. **Dashboard Workflow**
```
Dashboard loads → triggerN8NWorkflowsOnLogin() executes → 
Sends POST to N8N webhooks → N8N processes emails → 
Results displayed in dashboard
```

### 3. **Manual Trigger Flow**
```
User clicks "Trigger Workflow" → handleTriggerWorkflow() → 
POST to /api/trigger-workflow → N8N webhook called → 
Workflow executes → Status updated in UI
```

## 🔧 Backend API Structure

### Core API Routes:

#### 1. **Authentication** (`/api/auth/*`)
- **NextAuth.js** configuration
- **Google OAuth** provider setup
- **Session management**

#### 2. **Workflow Triggering** (`/api/trigger-workflow.ts`)
```typescript
// Main workflow API endpoint
POST /api/trigger-workflow
{
  "action": "process_emails|dashboard_access|manual_email_scan",
  "platform": "n8n", // Default platform
  "additionalData": { /* user session data */ }
}
```

#### 3. **Workflow Status** (`/api/workflow-status.ts`)
```typescript
// Get workflow execution history
GET /api/workflow-status
// Returns: Array of workflow executions with status
```

#### 4. **Health Check** (`/api/health.ts`)
```typescript
// System health monitoring
GET /api/health
// Returns: System status and connectivity
```

### Database Schema (SQLite + Prisma):

```sql
-- Workflow Triggers Table
WorkflowTrigger {
  id: String (Primary Key)
  userId: String
  action: String
  platform: String
  status: String (pending|running|completed|failed)
  createdAt: DateTime
  completedAt: DateTime?
  errorMessage: String?
}

-- Workflow Errors Table
WorkflowError {
  id: String (Primary Key)
  triggerId: String (Foreign Key)
  errorType: String
  errorMessage: String
  createdAt: DateTime
}
```

## 🔗 N8N Integration Flow

### Webhook Configuration:
- **Primary Email Processing**: `https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj`
- **Calendar Events**: `https://milafinance.app.n8n.cloud/webhook/dQEwT1mMujeN8JAk`

### N8N Workflow Steps:
```
1. Webhook Trigger (receives app payload)
2. Gmail API Node (fetch emails using user's access token)
3. Email Parser (extract event information using AI)
4. Google Calendar API (create calendar events)
5. Database Logger (log execution status)
6. Response Node (send success/failure back to app)
```

## 🧪 Local Testing Guide

### Prerequisites:
1. **Development Server Running**: `npm run dev` (Port 3000)
2. **N8N Instance Active**: `https://milafinance.app.n8n.cloud`
3. **Environment Variables Configured**: N8N webhooks enabled

### Step-by-Step Testing:

#### 1. **Start the Application**
```bash
cd C:\Users\laptop\Downloads\Busy__Parents\BusyParents
npm run dev
```
**Expected Output**:
```
▲ Next.js 14.2.32
- Local: http://localhost:3000
✓ Ready in 2.3s
```

#### 2. **Test Frontend Navigation**

**a) Landing Page Test**:
- Open: `http://localhost:3000`
- **Expected**: Welcome page with "Sign in with Google" button
- **Check**: Page loads without errors

**b) Authentication Test**:
- Click "Sign in with Google"
- **Expected**: Google OAuth popup
- **Check**: Successful authentication redirects to `/dashboard`

**c) Dashboard Test**:
- **Expected**: Dashboard loads with user info
- **Check**: Automatic N8N workflow triggering (check browser console)
- **Look for**: Network requests to N8N webhooks

#### 3. **Test Backend APIs**

**a) Health Check**:
```bash
curl http://localhost:3000/api/health
```
**Expected Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": "connected"
}
```

**b) Workflow Status**:
```bash
curl http://localhost:3000/api/workflow-status
```
**Expected Response**:
```json
[
  {
    "id": "trigger_123",
    "action": "dashboard_access",
    "status": "completed",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### 4. **Test N8N Integration**

**a) Manual Workflow Trigger**:
- In Dashboard, click "Trigger Workflow" button
- **Check Browser Console**: Look for successful POST requests
- **Check N8N**: Monitor execution in N8N interface

**b) Direct Webhook Test**:
```bash
curl -X POST https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj \
  -H "Content-Type: application/json" \
  -d '{
    "action": "test",
    "user": {
      "email": "test@example.com",
      "name": "Test User"
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }'
```
**Expected**: N8N workflow executes successfully

### 5. **Monitor Real-time Workflow**

**Browser Console Monitoring**:
```javascript
// Open browser console (F12) and look for:
console.log('Triggering N8N workflows for user login...');
console.log('N8N workflow triggered successfully');
console.log('Workflow status updated');
```

**Network Tab Monitoring**:
- Open Developer Tools → Network tab
- Look for POST requests to N8N webhooks
- Check response status (200 = success)

## 🔍 Debugging & Troubleshooting

### Common Issues & Solutions:

#### 1. **Frontend Issues**:
- **Page won't load**: Check `npm run dev` is running
- **Authentication fails**: Verify Google OAuth credentials in `.env`
- **Dashboard empty**: Check browser console for JavaScript errors

#### 2. **Backend Issues**:
- **API errors**: Check terminal for Next.js error logs
- **Database issues**: Verify SQLite database exists in `prisma/dev.db`
- **Environment variables**: Run `npm run validate-env` (if available)

#### 3. **N8N Integration Issues**:
- **Webhooks not responding**: Check N8N instance status
- **Workflow fails**: Monitor N8N execution logs
- **Authentication errors**: Verify Google OAuth tokens

### Debug Commands:

```bash
# Check environment variables
node -e "console.log(process.env.N8N_EMAIL_PROCESSING_WEBHOOK)"

# Test database connection
npx prisma studio  # Opens database browser

# Check application logs
npm run dev  # Monitor terminal output
```

## 📊 Success Indicators

### ✅ Everything Working Correctly:

1. **Frontend**:
   - All pages load without errors
   - Navigation works smoothly
   - User authentication successful
   - Dashboard shows user information

2. **Backend**:
   - API endpoints respond correctly
   - Database operations successful
   - Workflow triggers execute

3. **N8N Integration**:
   - Webhooks receive requests
   - Workflows execute successfully
   - Email processing works
   - Calendar events created

4. **End-to-End Flow**:
   - Login → Dashboard → Automatic workflow trigger
   - Manual trigger → N8N execution → Status update
   - Email processing → Calendar event creation

## 🎯 Quick Verification Checklist

- [ ] Development server starts successfully (`npm run dev`)
- [ ] Landing page loads at `http://localhost:3000`
- [ ] Google authentication works
- [ ] Dashboard loads with user info
- [ ] Automatic workflow triggering on login
- [ ] Manual "Trigger Workflow" button works
- [ ] Workflow status page shows execution history
- [ ] N8N webhooks receive requests
- [ ] Browser console shows no critical errors
- [ ] Network tab shows successful API calls

---

## 🚀 Your Project is Ready!

With N8N-only configuration active, your Busy Parents application provides:
- **Seamless user experience** with automatic email processing
- **Real-time workflow execution** with status monitoring
- **Scalable architecture** ready for production deployment
- **Comprehensive logging** for debugging and monitoring

Your local testing environment at `http://localhost:3000` is fully functional and ready for development! 🎉