import { NextApiRequest, NextApiResponse } from 'next'

interface TestResult {
  name: string
  status: string
  error?: string
  response?: any
}

/**
 * Test N8N Integration Endpoint
 * 
 * This endpoint tests the connection to your N8N instance and verifies
 * that all webhook URLs are accessible.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const results = {
    timestamp: new Date().toISOString(),
    environment: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      N8N_BASE_URL: process.env.N8N_WEBHOOK_BASE_URL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing'
    },
    webhooks: {
      email_processing: process.env.N8N_EMAIL_PROCESSING_WEBHOOK,
      calendar: process.env.N8N_CALENDAR_WEBHOOK,
      user_login: process.env.N8N_USER_LOGIN_WEBHOOK
    },
    oauth: {
      google_oauth_url: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=98761758378-7h0nc6sbk6gotpipu3s2tnfquakt0nb1.apps.googleusercontent.com&redirect_uri=https://milafinance.app.n8n.cloud/webhook/google-signin&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/gmail.readonly%20https://www.googleapis.com/auth/calendar',
      n8n_redirect_uri: 'https://milafinance.app.n8n.cloud/webhook/google-signin',
      app_callback_uri: `${process.env.NEXTAUTH_URL}/api/auth/n8n-callback`
    },
    tests: [] as TestResult[]
  }

  // Test N8N webhook connectivity
  const webhookTests = [
    {
      name: 'Email Processing Webhook',
      url: process.env.N8N_EMAIL_PROCESSING_WEBHOOK,
      method: 'POST'
    },
    {
      name: 'Calendar Webhook', 
      url: process.env.N8N_CALENDAR_WEBHOOK,
      method: 'POST'
    },
    {
      name: 'User Login Webhook',
      url: process.env.N8N_USER_LOGIN_WEBHOOK,
      method: 'POST'
    }
  ]

  for (const test of webhookTests) {
    if (!test.url) {
      results.tests.push({
        name: test.name,
        status: 'SKIPPED',
        error: 'URL not configured'
      })
      continue
    }

    try {
      const response = await fetch(test.url, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'BusyParents-Test/1.0'
        },
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          source: 'integration-test'
        })
      })

      results.tests.push({
        name: test.name,
        status: response.ok ? 'SUCCESS' : 'FAILED',
        statusCode: response.status,
        url: test.url
      })
    } catch (error) {
      results.tests.push({
        name: test.name,
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error',
        url: test.url
      })
    }
  }

  // Test database connection
  try {
    const { PrismaClient } = require('@prisma/client')
    const prisma = new PrismaClient()
    
    await prisma.$connect()
    await prisma.user.count()
    await prisma.$disconnect()
    
    results.tests.push({
      name: 'Database Connection',
      status: 'SUCCESS'
    })
  } catch (error) {
    results.tests.push({
      name: 'Database Connection',
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Calculate overall status
  const hasErrors = results.tests.some(test => test.status === 'ERROR' || test.status === 'FAILED')
  const overallStatus = hasErrors ? 'ISSUES_DETECTED' : 'ALL_SYSTEMS_GO'

  return res.status(200).json({
    status: overallStatus,
    ready_for_deployment: !hasErrors,
    ...results
  })
}