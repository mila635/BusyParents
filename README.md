# BusyParents - AI-Powered Schedule Management

A Next.js application that helps busy parents manage their schedules by automatically processing emails and creating calendar events using AI.

## Features

- 🔐 **Google OAuth Authentication** - Secure sign-in with Google accounts
- 📧 **Gmail Integration** - Process school emails automatically
- 📅 **Google Calendar Integration** - Create events from emails
- 🔔 **Smart Reminders** - Intelligent notification system
- 📊 **Activity Logging** - Track all user actions in Google Sheets
- 🎯 **Dashboard Overview** - Real-time connection status and statistics

## Prerequisites

- Node.js 16+ and npm
- Google Cloud Platform account
- Google Sheets account

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd BusyParents
npm install
```

### 2. Google Cloud Platform Setup

#### Enable APIs
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - **Google+ API** (for OAuth)
   - **Gmail API**
   - **Google Calendar API**
   - **Google Sheets API**

#### Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
5. Copy the Client ID and Client Secret

#### Create Service Account for Google Sheets
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Name: `BusyParents-Logging`
4. Click "Create and Continue" → "Done"
5. Click on your service account → "Keys" tab
6. "Add Key" → "Create new key" → "JSON"
7. Download the JSON file

### 3. Google Sheets Setup

1. **Create a new Google Sheet** with these headers:
   ```
   Timestamp | User Email | Action | Service | Status | Details | Error Message
   ```

2. **Share the sheet** with your service account email (from the JSON file)
   - Give it "Editor" access

3. **Copy the Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```

### 4. Environment Variables

Create a `.env.local` file in your project root:

```env
# Google OAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Google Sheets API for Logging
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key from JSON file\n-----END PRIVATE KEY-----"
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
```

**Important Notes:**
- Replace `your_google_client_id` and `your_google_client_secret` with your OAuth credentials
- Replace `your_spreadsheet_id_here` with your actual spreadsheet ID
- For `GOOGLE_SHEETS_PRIVATE_KEY`, copy the entire private key from your JSON file, including the quotes and `\n` characters
- Replace `your_service_account_email@project.iam.gserviceaccount.com` with the actual service account email

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## How It Works

### Authentication Flow
1. User signs in with Google OAuth
2. Application requests access to Gmail and Calendar
3. User grants permissions
4. Application stores access tokens securely

### Email Processing
1. Gmail API scans for school-related emails
2. AI processes email content to extract event information
3. Calendar events are automatically created
4. Smart reminders are set up

### Activity Logging
1. All user actions are logged to Google Sheets
2. Real-time tracking of connections, disconnections, and errors
3. Comprehensive audit trail for debugging and analytics

## API Endpoints

- `/api/auth/[...nextauth]` - NextAuth.js authentication
- `/api/connect/gmail` - Connect to Gmail
- `/api/connect/calendar` - Connect to Google Calendar
- `/api/connect/reminder` - Connect to Smart Reminders
- `/api/log-action` - Log user actions to Google Sheets
- `/api/test-google-sheets` - Test Google Sheets connection

## Testing

1. **Test OAuth**: Sign in with your Google account
2. **Test Gmail**: Click "Connect" on Gmail integration
3. **Test Calendar**: Click "Connect" on Calendar integration
4. **Test Logging**: Click "Test Logging" button to verify Google Sheets connection
5. **Check Spreadsheet**: Verify logs are appearing in your Google Sheet

## Troubleshooting

### Common Issues

1. **"Invalid Credentials" Error**
   - Check your Google Cloud Console credentials
   - Verify OAuth redirect URIs are correct

2. **"Missing Environment Variables"**
   - Ensure all required variables are set in `.env.local`
   - Check for typos in variable names

3. **"Google Sheets Connection Failed"**
   - Verify service account JSON key is correct
   - Check spreadsheet sharing permissions
   - Ensure Google Sheets API is enabled

4. **"OAuth Consent Screen Issues"**
   - Add your email as a test user in Google Cloud Console
   - Complete OAuth consent screen setup

### Debug Mode

Enable detailed logging by checking the browser console and server logs for debugging information.

## Production Deployment

1. Update `NEXTAUTH_URL` to your production domain
2. Add production redirect URIs to Google Cloud Console
3. Set up proper environment variables on your hosting platform
4. Ensure HTTPS is enabled for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Google Cloud Console setup
3. Check environment variable configuration
4. Verify API permissions and scopes
