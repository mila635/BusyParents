import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Validate the webhook secret to ensure it's coming from Make.com
    const webhookSecret = req.headers['x-webhook-secret']
    if (webhookSecret !== process.env.MAKE_WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { 
      executionId, 
      status, 
      result, 
      error, 
      userEmail, 
      action,
      scenarioName 
    } = req.body

    if (!executionId || !userEmail) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Find the workflow trigger by executionId
    const workflowTrigger = await prisma.workflowTrigger.findFirst({
      where: {
        executionId,
        userEmail
      },
      orderBy: {
        timestamp: 'desc'
      }
    })

    if (!workflowTrigger) {
      // If no trigger found with this executionId, create a new record
      await prisma.workflowTrigger.create({
        data: {
          executionId,
          userEmail,
          action: action || 'unknown',
          scenarioName: scenarioName || 'Unknown Scenario',
          status: status || 'unknown',
          timestamp: new Date(),
          ...(status === 'success' && { completedAt: new Date() }),
          ...(status === 'error' && { errorAt: new Date() }),
        }
      })
    } else {
      // Update the existing workflow trigger
      await prisma.workflowTrigger.update({
        where: {
          id: workflowTrigger.id
        },
        data: {
          status: status || workflowTrigger.status,
          updatedAt: new Date(),
          ...(status === 'success' && { completedAt: new Date() }),
          ...(status === 'error' && { errorAt: new Date() }),
        }
      })
    }

    // If there's a result, store it
    if (result) {
      await prisma.executionResult.create({
        data: {
          executionId,
          userEmail,
          scenarioName: scenarioName || workflowTrigger?.scenarioName || 'Unknown',
          result: typeof result === 'string' ? result : JSON.stringify(result),
          timestamp: new Date()
        }
      })
    }

    // If there's an error, store it
    if (error) {
      await prisma.executionError.create({
        data: {
          executionId,
          userEmail,
          scenarioName: scenarioName || workflowTrigger?.scenarioName || 'Unknown',
          error: typeof error === 'string' ? error : JSON.stringify(error),
          timestamp: new Date()
        }
      })
    }

    return res.status(200).json({ success: true, message: 'Webhook processed successfully' })
  } catch (error) {
    console.error('Error processing webhook:', error)
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: 'Internal server error', message: errorMessage })
  }
}