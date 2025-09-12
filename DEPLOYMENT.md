# Production Deployment Guide

This guide will help you deploy the Busy Parents application to production.

## Prerequisites

- Node.js 18+ installed on production server
- PostgreSQL database (recommended) or SQLite for smaller deployments
- Domain name with SSL certificate
- Google Cloud Console project with OAuth configured

## Step 1: Environment Configuration

1. Copy `.env.production` to `.env.local` on your production server:
   ```bash
   cp .env.production .env.local
   ```

2. Generate a secure NextAuth secret:
   ```bash
   openssl rand -base64 32
   ```

3. Update the following variables in `.env.local`:
   - `NEXTAUTH_URL`: Your production domain (e.g., `https://busyparents.com`)
   - `NEXTAUTH_SECRET`: The generated secret from step 2
   - `DATABASE_URL`: Your production database connection string
   - All Google API credentials with production values

## Step 2: Google Cloud Console Setup

### OAuth 2.0 Configuration
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to "APIs & Services" > "Credentials"
4. Create new OAuth 2.0 Client ID for production:
   - **Application type**: Web application
   - **Authorized JavaScript origins**: `https://your-domain.com`
   - **Authorized redirect URIs**: `https://your-domain.com/api/auth/callback/google`

### API Enablement
Enable the following APIs:
- Google Sheets API
- Google Calendar API
- Gmail API
- Google+ API (for authentication)

### OAuth Consent Screen
1. Configure OAuth consent screen:
   - **User Type**: External (for public use) or Internal (for organization)
   - **App name**: Busy Parents
   - **User support email**: Your support email
   - **Developer contact**: Your contact email
   - **Authorized domains**: Add your production domain

## Step 3: Database Setup

### PostgreSQL (Recommended)
1. Create a PostgreSQL database
2. Update `DATABASE_URL` in `.env.local`:
   ```
   DATABASE_URL="postgresql://username:password@host:port/database"
   ```

### SQLite (Development/Small Scale)
1. Ensure the database file path is writable:
   ```
   DATABASE_URL="file:./prisma/prod.db"
   ```

### Run Migrations
```bash
npx prisma migrate deploy
npx prisma generate
```

## Step 4: Build and Deploy

### Build the Application
```bash
npm install
npm run build
```

### Start Production Server
```bash
npm start
```

### Using PM2 (Recommended)
```bash
npm install -g pm2
pm2 start npm --name "busy-parents" -- start
pm2 save
pm2 startup
```

## Step 5: Reverse Proxy Setup (Nginx)

Create an Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Step 6: Security Considerations

1. **Environment Variables**: Never commit production secrets to version control
2. **Database Security**: Use strong passwords and restrict database access
3. **SSL/TLS**: Always use HTTPS in production
4. **Rate Limiting**: Configure appropriate rate limits
5. **CORS**: Restrict origins to your domain only
6. **Security Headers**: Enable CSP and HSTS

## Step 7: Monitoring and Logging

### Error Tracking (Optional)
1. Set up Sentry for error tracking:
   ```bash
   npm install @sentry/nextjs
   ```
2. Add `SENTRY_DSN` to your environment variables

### Analytics (Optional)
1. Add Google Analytics ID to `GOOGLE_ANALYTICS_ID`

### Health Checks
Create a health check endpoint at `/api/health` for monitoring.

## Step 8: Testing

1. **Authentication Flow**: Test Google OAuth login/logout
2. **API Endpoints**: Verify all API routes work correctly
3. **Database Operations**: Test user creation and data persistence
4. **Google Integrations**: Test Calendar, Sheets, and Gmail APIs
5. **Email Notifications**: Verify email sending works

## Troubleshooting

### Common Issues

1. **OAuth Errors**: Check redirect URIs match exactly
2. **Database Connection**: Verify connection string and network access
3. **API Limits**: Check Google API quotas and billing
4. **CORS Issues**: Ensure allowed origins are configured correctly

### Logs
Check application logs:
```bash
pm2 logs busy-parents
```

### Database Issues
Check database connectivity:
```bash
npx prisma db pull
```

## Backup Strategy

1. **Database Backups**: Set up automated database backups
2. **Environment Variables**: Securely backup environment configuration
3. **Application Code**: Use version control with proper branching strategy

## Updates and Maintenance

1. **Dependencies**: Regularly update npm packages
2. **Security Patches**: Monitor for security updates
3. **Database Migrations**: Test migrations in staging first
4. **API Changes**: Monitor Google API changelog for breaking changes

## Support

For deployment issues:
1. Check the application logs
2. Verify environment variables
3. Test API endpoints individually
4. Check Google Cloud Console for API errors

---

**Note**: Always test your deployment in a staging environment before going live!