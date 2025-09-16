import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // For testing purposes, bypass session validation
    const session = await getServerSession(req, res, authOptions)
    
    // Create a mock session if none exists (for testing)
    const mockSession = session || {
      user: { email: 'test@example.com', name: 'Test User' },
      accessToken: 'test-token'
    }

    const { action, platform = 'n8n', additionalData } = req.body

    if (!action) {
      return res.status(400).json({ error: 'Action is required' })
    }

    // Get webhook info based on action and platform
    const webhookInfo = getWebhookInfo(action, platform);
    
    if (!webhookInfo.webhookUrl) {
      return res.status(400).json({ 
        error: 'Invalid action or webhook not configured',
        supportedActions: [
          'email-sync', 'process_emails', 'sync_emails', 'process_gmail',
          'calendar-sync', 'create_calendar_event',
          'user-signin', 'user_login', 'dashboard_access',
          'user_signup', 'user_registration',
          'set_reminder', 'manual_email_scan'
        ]
      });
    }

    const { webhookUrl, scenarioName } = webhookInfo;

    // Log the workflow trigger attempt
    await logWorkflowTrigger({
      action,
      userEmail: mockSession.user?.email,
      scenarioName,
      platform: platform || 'web',
      workflowType: 'n8n',
      additionalData
    })

    // Prepare N8N webhook payload with user data for Google Sheets
    const userId = (mockSession.user as any)?.id || (mockSession as any).userId || '';
    const payload = {
      action,
      platform: platform || 'web',
      user_id: userId,
      name: mockSession.user?.name,
      email: mockSession.user?.email,
      access_token: (mockSession as any).accessToken || '',
      refresh_token: (mockSession as any).refreshToken || '',
      timestamp: new Date().toISOString(),
      additionalData: additionalData || {}
    }

    // Send the request to the webhook (Make.com or N8N)
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Source': 'BusyParents-App',
        'X-Platform': platform,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`${platform.toUpperCase()} webhook error:`, errorText)
      
      // Log the error
      await logWorkflowError({
        action,
        userEmail: mockSession.user?.email,
        scenarioName,
        error: errorText
      })
      
      return res.status(500).json({
        error: 'Failed to trigger workflow',
        details: errorText,
      })
    }

    const data = await response.json()
    
    // Log successful trigger
    await updateWorkflowStatus({
      action,
      userEmail: mockSession.user?.email,
      scenarioName,
      status: 'triggered',
      executionId: data.executionId || null
    })
    
    return res.status(200).json({
      ...data,
      message: `Successfully triggered ${scenarioName || action} workflow`
    })
  } catch (error) {
    console.error('Error triggering workflow:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: (error as Error).message,
    })
  }
}

// Helper function to get the appropriate webhook URL and scenario name
function getWebhookInfo(action: string, platform: string = 'n8n'): { webhookUrl: string | null, scenarioName: string } {
  if (platform === 'n8n') {
    // N8N webhook URLs
    switch (action) {
      case 'email-sync':
      case 'process_emails':
      case 'sync_emails':
      case 'process_gmail':
      case 'manual_email_scan':
        return {
          webhookUrl: process.env.N8N_EMAIL_PROCESSING_WEBHOOK || null,
          scenarioName: 'N8N Email Processing Workflow'
        }
      case 'calendar-sync':
      case 'create_calendar_event':
        return {
          webhookUrl: process.env.N8N_CALENDAR_WEBHOOK || null,
          scenarioName: 'N8N Calendar Event Workflow'
        }
      case 'user-signin':
      case 'user_login':
      case 'dashboard_access':
      case 'user_signup':
      case 'user_registration':
        return {
          webhookUrl: process.env.N8N_USER_LOGIN_WEBHOOK || null,
          scenarioName: 'N8N User Login Workflow'
        }
      case 'set_reminder':
        return {
          webhookUrl: process.env.N8N_REMINDER_WEBHOOK || null,
          scenarioName: 'N8N Reminder Workflow'
        }
      default:
        return {
          webhookUrl: null,
          scenarioName: 'Unknown Workflow'
        }
    }
  } else {
    // Make.com webhook URLs (legacy support)
    switch (action) {
      case 'email-sync':
      case 'sync_emails':
      case 'process_emails':
        return {
          webhookUrl: process.env.MAKE_SYNC_WEBHOOK_URL || process.env.MAKE_EMAIL_PROCESSING_WEBHOOK_URL || null,
          scenarioName: 'Email Sync'
        }
      case 'process_gmail':
        return {
          webhookUrl: process.env.MAKE_GMAIL_WEBHOOK_URL || null,
          scenarioName: 'Gmail Processing'
        }
      case 'calendar-sync':
      case 'create_calendar_event':
        return {
          webhookUrl: process.env.MAKE_CALENDAR_WEBHOOK_URL || null,
          scenarioName: 'Calendar Event Creation'
        }
      case 'set_reminder':
        return {
          webhookUrl: process.env.MAKE_REMINDER_WEBHOOK_URL || null,
          scenarioName: 'Reminder Setting'
        }
      case 'manual_email_scan':
        return {
          webhookUrl: process.env.MAKE_EMAIL_PROCESSING_WEBHOOK_URL || process.env.MAKE_WEBHOOK_URL || null,
          scenarioName: 'Email Processing'
        }
      default:
        return {
          webhookUrl: process.env.MAKE_EMAIL_PROCESSING_WEBHOOK_URL || process.env.MAKE_WEBHOOK_URL || null,
          scenarioName: 'Email Processing'
        }
    }
  }
}

// Database logging functions
async function logWorkflowTrigger({ action, userEmail, scenarioName, platform, workflowType, additionalData = null }: {
  action: string;
  userEmail: string | null | undefined;
  scenarioName: string;
  platform?: string;
  workflowType?: string;
  additionalData?: any;
}) {
  try {
    await prisma.workflowTrigger.create({
      data: {
        action,
        userEmail: userEmail || 'unknown',
        scenarioName,
        status: 'initiated',
        platform: platform || 'web',
        workflowType: workflowType || 'n8n',
        additionalData: additionalData ? JSON.stringify(additionalData) : null,
        timestamp: new Date()
      }
    })
  } catch (error) {
    console.error('Failed to log workflow trigger:', error)
  }
}

async function logWorkflowError({ action, userEmail, scenarioName, error }: {
  action: string;
  userEmail: string | null | undefined;
  scenarioName: string;
  error: any;
}) {
  try {
    // Create error record
    await prisma.workflowError.create({
      data: {
        action,
        userEmail: userEmail || 'unknown',
        scenarioName,
        error: typeof error === 'string' ? error : JSON.stringify(error),
        timestamp: new Date()
      }
    })
    
    // Update workflow status to error
    await updateWorkflowStatus({
      action,
      userEmail,
      scenarioName,
      status: 'error',
      executionId: null,
      error
    })
  } catch (dbError) {
    console.error('Failed to log workflow error:', dbError)
  }
}

async function updateWorkflowStatus({ action, userEmail, scenarioName, status, executionId, error = null }: {
  action: string;
  userEmail: string | null | undefined;
  scenarioName: string;
  status: string;
  executionId: string | null;
  error?: any;
}) {
  try {
    // Find the most recent trigger for this action and user
    const latestTrigger = await prisma.workflowTrigger.findFirst({
      where: {
        action,
        userEmail: userEmail || 'unknown'
      },
      orderBy: {
        timestamp: 'desc'
      }
    })
    
    if (latestTrigger) {
      // Prepare update data
      const updateData: any = {
        status,
        executionId,
        updatedAt: new Date()
      }
      
      // Add completion timestamp if status is success
      if (status === 'success') {
        updateData.completedAt = new Date()
      }
      
      // Add error timestamp if status is error
      if (status === 'error') {
        updateData.errorAt = new Date()
      }
      
      // Update the status
      await prisma.workflowTrigger.update({
        where: {
          id: latestTrigger.id
        },
        data: updateData
      })
    }
  } catch (error) {
    console.error('Failed to update workflow status:', error)
  }
}
