# Complete Workflow Testing Guide

## Browser Console Errors - Normal Behavior

The following errors in the browser console are **NORMAL** and **DO NOT** affect functionality:

```
net::ERR_ABORTED https://accounts.google.com/_/common/diagnostics/...
net::ERR_BLOCKED_BY_ORB https://lh3.googleusercontent.com/...
```

These are:
- **CORS warnings** from Google's authentication system
- **ORB (Origin Resource Blocking)** warnings for profile images
- **Diagnostic requests** that browsers block for security
- **Common in all Google OAuth applications**

## Step-by-Step Testing Process

### 1. Verify Application is Running
✅ **Server Status**: http://localhost:3000 should be accessible
✅ **Authentication**: Sign in with Google should work
✅ **Dashboard**: Should load after authentication

### 2. Test Make.com Workflow Integration

#### Import the Workflow:
1. Go to Make.com dashboard
2. Click "Create a new scenario"
3. Select "Import Blueprint"
4. Upload `make-workflow-updated.json`

#### Configure Connections:
1. **Gmail Connection**: Connect your Gmail account
2. **OpenAI Connection**: Add your OpenAI API key
3. **Google Calendar**: Connect your Google Calendar
4. **Google Sheets**: Connect to your Google Sheets

#### Update Webhook URL:
1. In the HTTP module (last step)
2. Set URL to: `http://localhost:3000/api/workflow-status`
3. Method: POST
4. Headers: Content-Type: application/json

### 3. Test Workflow Endpoints

#### Test Workflow Status Endpoint:
```bash
curl -X POST http://localhost:3000/api/workflow-status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "emailsProcessed": 5,
    "timestamp": "2024-01-15 10:30:00",
    "lastEmailId": "test123"
  }'
```

#### Expected Response:
```json
{
  "success": true,
  "message": "Workflow status updated successfully"
}
```

### 4. Test Email Processing Flow

#### Trigger Workflow:
```bash
curl -X POST http://localhost:3000/api/trigger-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "action": "process_emails",
    "userEmail": "your-email@gmail.com"
  }'
```

### 5. Verify Make.com Workflow Execution

1. **Activate** the scenario in Make.com
2. **Send a test email** to your Gmail
3. **Check execution logs** in Make.com
4. **Verify Google Sheets** gets updated
5. **Check Google Calendar** for high-priority events

### 6. Monitor Application Logs

Watch the development server console for:
- ✅ Successful webhook receipts
- ✅ Database updates
- ✅ API responses
- ❌ Any actual errors (not browser console warnings)

## Troubleshooting Common Issues

### Issue: "Webhook not found" Error
**Solution**: Ensure Make.com webhook URL matches exactly:
`http://localhost:3000/api/workflow-status`

### Issue: Gmail Connection Fails
**Solution**: 
1. Check Gmail API is enabled in Google Cloud Console
2. Verify OAuth scopes include Gmail access
3. Ensure Gmail account has necessary permissions

### Issue: OpenAI API Errors
**Solution**:
1. Verify OpenAI API key is valid
2. Check API usage limits
3. Ensure correct model (gpt-3.5-turbo) is specified

### Issue: Google Sheets Not Updating
**Solution**:
1. Verify spreadsheet ID is correct
2. Check Google Sheets API permissions
3. Ensure service account has edit access

## Success Indicators

✅ **Application loads** without blocking errors
✅ **Google authentication** works (ignore console warnings)
✅ **Dashboard displays** user information
✅ **Webhook endpoint** responds to POST requests
✅ **Make.com scenario** executes successfully
✅ **Google Sheets** receives new rows
✅ **Google Calendar** creates events for high-priority emails

## Performance Monitoring

- **Response times** should be under 2 seconds
- **Memory usage** should remain stable
- **Database connections** should not leak
- **API rate limits** should be respected

---

**Note**: Browser console warnings about Google resources are normal security features and do not indicate problems with your application functionality.