# Vercel Deployment Guide for BusyParents App

## Prerequisites
- Vercel account (free tier is sufficient)
- GitHub repository with your code
- N8N workflows already configured

## Step 1: Prepare Your Repository

1. Ensure all your code is committed to a GitHub repository
2. Make sure the `.env.production` file is NOT committed (it's in .gitignore)
3. The `vercel.json` configuration file is already created

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

## Step 3: Configure Environment Variables

In your Vercel project dashboard, go to Settings > Environment Variables and add these:

### Required Environment Variables:

```
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=29f4aec9b4910c4b267378732e6a5af0f86300ee01a25ef5b5efa2580501fc1c
GOOGLE_CLIENT_ID=98761758378-7h0nc6sbk6gotpipu3s2tnfquakt0nb1.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
DATABASE_URL=file:./prisma/dev.db
GOOGLE_SHEETS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB\nUxPiHRgpSiEI1cxcO8ShcjfGJwCP+VwSd6Q5rM7jYQlvjYnFA/GKwHrKHDgeGrX9\nk/x2Bn2w/jVDKQw0Q5VVHtZ5BiQmdHAcAON4+bUWZQeRTxbwaqXuHMdJFBU5o6aY\nKxXTKuIHHI4M+ImmXUBZESjQk4JOgFn5S7NiWQYAqSJVsQ4ouAzjPFrNC8DF2rQV\nzqBYwmcmS22pAR4u1zcRw8aAeHx8R/m2LnFBehT0ndmrIgMUnsQBSjWnN3Eiu1vC\ns0XuP6P5Mmp0DdNiUdGlF3REONdVXqDvuFd5sy2L2Dy9SuD+dQnBvTuSehVmj3bL\n9daLdJd9AgMBAAECggEBALc2lQGY5f3ryslHxSouXtjBexGEwHwjNs6xsx7Aq4od\nZeUOecLLnYqRXloqxZ2Z4ieY+i2YWUAiwohgfLqMrN7gpVapinlayPgHi9xEQylZ\nQ+iFoBcNF3cjxIrJRQjzrQnXnxeOpEKGHgJTNVAFVMtcQ+uHKmvyiIE413zTJFfJ\nJ1XbgKzn+kVwAYmwtmM5Gc8KyJBsQBBYLb1GSCwS+2h7+oLkiqHqHZUcyygYpK/T\n/nwjVBB+aSYOc9h5zeMZGTmL09kkbY3wnqwKcOzPNBWw5c3AqKXuVwxQwWnLTacu\nBggTnXBo2eMZbYaKwjRoowlFHRkPtS3GVHzRQdjddqECgYEA2W5OuuOIFJpRVPK7\nkQdBajxvRvqBaAYNaUKLwHVKg4zFtEOiF9Hs1jUSgnhBiPDfJ5ruMomPnVlqPMrS\nGNuTFZNGoCHdA6hWPtqFZ2yOBhHrhKP6gmNVqMjvo09GHgfqmWxVoEcrHT2k/cVx\nvovoZBVjLmPh5p1ad+2s4wVVFpkCgYEA3hqyFgppqy4TReDOi9UjwbRfxHrjQqZJ\nv7zOANyEjEuJwqwBakgIjgEnFnkYpBn2nNVEaAHdvySRJbxGzZANzxnls4FUQdQz\nvLlMpMpqNBgsjNg4MpNHjgmhLleNOQOGg+SqZ+2VfQjVQnkLiJ1pttS5wLb6GZJL\nXtdXMoGSOgUCgYB9ot4TtS7BSz8DN9P4NtjzCxq2PKHqBwVE2h6QjuPiSPmS+2xO\nr0Ru1Ijmwjz1XHdZ3VmCzAaTI2Ek1jKuKZUXanAiPn7hwQN4Lw5rZA5sRrdjHdnc\nXRuIb9Ga6V3fQFhGpQhqVtNtfZ4iTZOJFibVfANfcRGg+31TKOufBgKBgQDem6EY\nHRkP2nwGiHQYQnRHXgBrjzMktNwEi1zcmyxnQekX5xQnlmAiVtej4BGpzNBzf9DD\ndc/rdpIJ6jzI4p/I0O6PkcMrNeVcEJEFdFlgl8IkEzyD+c6aTrI9xO9aAiMmzS0l\nkYvoHgtGWdVHRUhSBleI9Z/S2sGdI0JlMJpBrQKBgEfzQiYpiBZKzlHkh4C5wYLa\nGGzjx1hqJqZXKtjgbhQBhS5L4pYqpiC2ZrDvZqhI+4QQUhT7+hI+fXSszVBpVhLn\nXbaYTzAE+fXuLWDFtK5E3Wm7jmL4WS/Mb1VdvOXfuFuH+Ue9k4N8A8zU5pUMpvJl\nXtdXMoGSOgU\n-----END PRIVATE KEY-----\n
GOOGLE_SHEETS_CLIENT_EMAIL=busy-parents-sheets-service@mytestoauth-470505.iam.gserviceaccount.com
GOOGLE_SHEETS_SPREADSHEET_ID=1OpM8Yp-Bz3c4tLm-Ajt1jEkipM71VTGeqPunr01V4P8
```

### N8N Integration Variables:

```
N8N_USER_REGISTRATION_WEBHOOK=https://milafinance.app.n8n.cloud/webhook/user-registration
N8N_EMAIL_PROCESSING_WEBHOOK=https://milafinance.app.n8n.cloud/webhook/email-processing
N8N_CALENDAR_EVENT_WEBHOOK=https://milafinance.app.n8n.cloud/webhook/calendar-event
NEXT_PUBLIC_N8N_BASE_URL=https://milafinance.app.n8n.cloud
NEXT_PUBLIC_N8N_EMAIL_PROCESSING_WEBHOOK_URL=https://milafinance.app.n8n.cloud/webhook/email-processing
NEXT_PUBLIC_N8N_WORKFLOW_PROCESSING_WEBHOOK_URL=https://milafinance.app.n8n.cloud/webhook/workflow-processing
NEXT_PUBLIC_N8N_FRONTEND_URL=https://milafinance.app.n8n.cloud
NEXT_PUBLIC_N8N_WORKFLOW_1_WEBHOOK_URL=https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj
NEXT_PUBLIC_N8N_WORKFLOW_2_WEBHOOK_URL=https://milafinance.app.n8n.cloud/webhook/dQEwT1mMujeN8JAk
N8N_WEBHOOK_BASE_URL=https://milafinance.app.n8n.cloud
N8N_EMAIL_PROCESSING_WEBHOOK=https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj
N8N_CALENDAR_WEBHOOK=https://milafinance.app.n8n.cloud/webhook/dQEwT1mMujeN8JAk
N8N_REMINDER_WEBHOOK=https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj
N8N_USER_LOGIN_WEBHOOK=https://milafinance.app.n8n.cloud/webhook/aYt6JINH3lcFv8Xj
```

### Google Sheets Configuration:

```
GOOGLE_SHEETS_PEOPLE_DATA_SHEET=People Data
GOOGLE_SHEETS_EMAIL_LOG_SHEET=Email Log
GOOGLE_SHEETS_USER_SOURCE_SHEET=Sheet1
GOOGLE_SHEETS_DATABASE_NAME=AI Assistant Data Base
GOOGLE_SHEETS_USER_SPREADSHEET_NAME=BusyParentsSpreadSheet
GOOGLE_SHEETS_USER_DATA_SHEET=Sheet1
GOOGLE_SHEETS_AI_ASSISTANT_DB_ID=1OpM8Yp-Bz3c4tLm-Ajt1jEkipM71VTGeqPunr01V4P8
GOOGLE_SHEETS_BUSY_PARENTS_SHEET_ID=1OpM8Yp-Bz3c4tLm-Ajt1jEkipM71VTGeqPunr01V4P8
```

### Production Settings:

```
NODE_ENV=production
LOG_LEVEL=info
```

## Step 4: Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services > Credentials
3. Edit your OAuth 2.0 Client ID
4. Add your Vercel domain to Authorized JavaScript origins:
   - `https://your-vercel-domain.vercel.app`
5. Add to Authorized redirect URIs:
   - `https://your-vercel-domain.vercel.app/api/auth/callback/google`

## Step 5: Update NEXTAUTH_URL

After deployment, update the `NEXTAUTH_URL` environment variable in Vercel with your actual domain:
- `https://your-actual-vercel-domain.vercel.app`

## Step 6: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be live at the provided Vercel URL

## Step 7: Test the Integration

1. Visit your deployed app
2. Test user authentication
3. Test N8N workflow triggers
4. Verify Google Sheets integration

## Troubleshooting

- Check Vercel function logs for any errors
- Ensure all environment variables are set correctly
- Verify N8N webhooks are accessible
- Check Google OAuth redirect URIs are correct

## Custom Domain (Optional)

To use a custom domain:
1. Go to your Vercel project settings
2. Navigate to Domains
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` and Google OAuth settings with the new domain

## Notes

- The app is configured to work with N8N cloud instance at `milafinance.app.n8n.cloud`
- Google Sheets integration is pre-configured
- SQLite database will be included in the deployment
- All sensitive credentials are properly configured via environment variables

Your BusyParents app is now ready for production deployment on Vercel with full N8N integration!