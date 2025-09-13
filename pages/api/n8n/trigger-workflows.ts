import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
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

    const { action, workflowType = 'both' } = req.body

    // Get N8N webhook URLs from environment
    const N8N_WORKFLOW_1_URL = process.env.NEXT_PUBLIC_N8N_WORKFLOW_1_WEBHOOK_URL
    const N8N_WORKFLOW_2_URL = process.env.NEXT_PUBLIC_N8N_WORKFLOW_2_WEBHOOK_URL

    if (!N8N_WORKFLOW_1_URL && !N8N_WORKFLOW_2_URL) {
      return res.status(400).json({ error: 'N8N webhooks not configured' })
    }

    // Prepare payload for N8N workflows
    const userPayload = {
      action: action || 'manual_trigger',
      user: {
        id: session.user?.email, // Using email as ID since id property doesn't exist
        email: session.user?.email,
        name: session.user?.name,
        image: session.user?.image
      },
      accessToken: session.accessToken,
      timestamp: new Date().toISOString(),
      source: 'api_trigger'
    }

    const results = []
    const promises = []

    // Trigger N8N Workflow 1 if configured and requested
    if (N8N_WORKFLOW_1_URL && (workflowType === 'both' || workflowType === 'workflow1')) {
      promises.push(
        fetch(N8N_WORKFLOW_1_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Source': 'BusyParents-API'
          },
          body: JSON.stringify(userPayload),
          signal: AbortSignal.timeout(10000) // 10 second timeout
        }).then(response => ({
          workflow: 'workflow1',
          success: response.ok,
          status: response.status,
          url: N8N_WORKFLOW_1_URL
        })).catch(error => ({
          workflow: 'workflow1',
          success: false,
          error: error.message,
          url: N8N_WORKFLOW_1_URL
        }))
      )
    }

    // Trigger N8N Workflow 2 if configured and requested
    if (N8N_WORKFLOW_2_URL && (workflowType === 'both' || workflowType === 'workflow2')) {
      promises.push(
        fetch(N8N_WORKFLOW_2_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Source': 'BusyParents-API'
          },
          body: JSON.stringify(userPayload),
          signal: AbortSignal.timeout(10000) // 10 second timeout
        }).then(response => ({
          workflow: 'workflow2',
          success: response.ok,
          status: response.status,
          url: N8N_WORKFLOW_2_URL
        })).catch(error => ({
          workflow: 'workflow2',
          success: false,
          error: error.message,
          url: N8N_WORKFLOW_2_URL
        }))
      )
    }

    if (promises.length === 0) {
      return res.status(400).json({ error: 'No workflows configured or requested' })
    }

    // Wait for all webhook calls to complete
    const workflowResults = await Promise.all(promises)

    // Log the workflow trigger attempt
    try {
      await prisma.workflowTrigger.create({
        data: {
          userEmail: session.user?.email || 'unknown',
          action: 'N8N Workflow Trigger',
          status: 'attempted',
          additionalData: JSON.stringify({
            details: action || 'manual_trigger',
            workflowResults,
            timestamp: new Date().toISOString()
          })
        }
      })
    } catch (logError) {
      console.warn('Failed to log workflow trigger:', logError)
    }

    // Check if any workflows succeeded
    const successfulWorkflows = workflowResults.filter(result => result.success)
    const failedWorkflows = workflowResults.filter(result => !result.success)

    return res.status(200).json({
      success: successfulWorkflows.length > 0,
      message: `Triggered ${successfulWorkflows.length} of ${workflowResults.length} workflows successfully`,
      results: workflowResults,
      summary: {
        total: workflowResults.length,
        successful: successfulWorkflows.length,
        failed: failedWorkflows.length
      }
    })

  } catch (error) {
    console.error('N8N workflow trigger error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}