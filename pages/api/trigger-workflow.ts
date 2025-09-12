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
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { action, additionalData } = req.body

    if (!action) {
      return res.status(400).json({ error: 'Action is required' })
    }

    // Get the appropriate webhook URL and scenario name based on the action
    const { webhookUrl, scenarioName } = getWebhookInfo(action)

    if (!webhookUrl) {
      return res.status(400).json({ error: 'Invalid action or webhook not configured' })
    }

    // Log the workflow trigger attempt
    await logWorkflowTrigger({
      action,
      userEmail: session.user?.email,
      scenarioName,
      additionalData
    })

    // Construct the payload to send to Make.com
    const payload = {
      action,
      user: {
        email: session.user?.email,
        name: session.user?.name,
      },
      // Include the access token for Gmail API access
      accessToken: session.accessToken,
      timestamp: new Date().toISOString(),
      // Include any additional data passed from the client
      ...additionalData && { additionalData }
    }

    // Send the request to Make.com
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Source': 'BusyParents-App',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Make.com webhook error:', errorText)
      
      // Log the error
      await logWorkflowError({
        action,
        userEmail: session.user?.email,
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
      userEmail: session.user?.email,
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
function getWebhookInfo(action: string): { webhookUrl: string | null, scenarioName: string } {
  switch (action) {
    case 'sync_emails':
      return {
        webhookUrl: process.env.MAKE_SYNC_WEBHOOK_URL || null,
        scenarioName: 'Email Sync'
      }
    case 'process_gmail':
      return {
        webhookUrl: process.env.MAKE_GMAIL_WEBHOOK_URL || null,
        scenarioName: 'Gmail Processing'
      }
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
    case 'process_emails':
      return {
        webhookUrl: process.env.MAKE_EMAIL_PROCESSING_WEBHOOK_URL || null,
        scenarioName: 'Email Processing'
      }
    default:
      return {
        webhookUrl: process.env.MAKE_EMAIL_PROCESSING_WEBHOOK_URL || process.env.MAKE_WEBHOOK_URL || null,
        scenarioName: 'Email Processing'
      }
  }
}

// Database logging functions
async function logWorkflowTrigger({ action, userEmail, scenarioName, additionalData = null }: {
  action: string;
  userEmail: string | null | undefined;
  scenarioName: string;
  additionalData?: any;
}) {
  try {
    await prisma.workflowTrigger.create({
      data: {
        action,
        userEmail: userEmail || 'unknown',
        scenarioName,
        status: 'initiated',
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
