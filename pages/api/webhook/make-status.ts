import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Input validation schema for Make.com webhook
const webhookSchema = z.object({
  status: z.enum(['triggered', 'in_progress', 'completed', 'error']),
  emailsProcessed: z.number().optional(),
  timestamp: z.string(),
  lastEmailId: z.string().optional(),
  scenarioName: z.string().optional(),
  executionId: z.string().optional(),
  errorMessage: z.string().optional(),
  userEmail: z.string().email().optional()
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed', 
      allowedMethods: ['POST'] 
    })
  }

  try {
    console.log('Make.com webhook received:', req.body)
    
    // Validate input
    const validationResult = webhookSchema.safeParse(req.body)
    
    if (!validationResult.success) {
      console.error('Webhook validation failed:', validationResult.error)
      return res.status(400).json({ 
        error: 'Invalid webhook data', 
        details: validationResult.error.issues 
      })
    }

    const data = validationResult.data
    
    // Log the webhook data to database
    const workflowLog = await prisma.workflowTrigger.create({
      data: {
        action: 'webhook_status_update',
        scenarioName: data.scenarioName || 'make_workflow',
        userEmail: data.userEmail || 'system@busyparents.app',
        status: data.status,
        executionId: data.executionId || `webhook_${Date.now()}`,
        additionalData: JSON.stringify({
          emailsProcessed: data.emailsProcessed,
          lastEmailId: data.lastEmailId,
          errorMessage: data.errorMessage,
          receivedAt: new Date().toISOString()
        }),
        timestamp: new Date(data.timestamp),
        ...(data.status === 'completed' && { completedAt: new Date() }),
        ...(data.status === 'error' && { errorAt: new Date() })
      }
    })

    console.log('Webhook logged successfully:', workflowLog.id)
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Webhook received and logged successfully',
      logId: workflowLog.id,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Webhook processing error:', error)
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to process webhook'
    })
  } finally {
    await prisma.$disconnect()
  }
}

// Export config to handle larger payloads if needed
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}