// pages/api/webhooks/make-handler.js
// Enhanced webhook handler for Make.com responses

import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Verify webhook signature if you set one up in Make.com
    const signature = req.headers['x-make-signature']
    if (process.env.VERIFY_MAKE_SIGNATURE === 'true' && !verifySignature(req.body, signature)) {
      console.error('Invalid Make.com webhook signature')
      return res.status(401).json({ error: 'Invalid signature' })
    }

    const { status, data, error, executionId, scenarioName, userEmail } = req.body

    console.log('Make.com webhook received:', {
      status,
      executionId,
      scenarioName,
      timestamp: new Date().toISOString()
    })

    // Log the webhook event
    await logWebhookEvent({
      executionId,
      scenarioName,
      status,
      userEmail,
      data: JSON.stringify(data || {}),
      error: error ? JSON.stringify(error) : null
    })

    if (status === 'success') {
      // Handle successful execution
      console.log('Make.com execution successful:', data)
      
      // Store results in database
      await storeExecutionResult(executionId, data, scenarioName, userEmail)
      
      // Process specific scenario results
      if (scenarioName === 'Email Processing' && data?.events) {
        // Store extracted events
        await storeExtractedEvents(data.events, userEmail)
      }
      
      return res.status(200).json({ 
        received: true, 
        message: 'Success handled',
        executionId
      })
      
    } else if (status === 'error') {
      // Handle execution errors
      console.error('Make.com execution error:', error)
      
      // Log errors to database
      await logExecutionError(executionId, error, scenarioName, userEmail)
      
      return res.status(200).json({ 
        received: true, 
        message: 'Error logged',
        executionId 
      })
      
    } else if (status === 'in_progress') {
      // Handle in-progress status
      console.log('Make.com execution in progress:', executionId)
      
      return res.status(200).json({ 
        received: true, 
        message: 'Status updated to in_progress',
        executionId
      })
    } else {
      // Handle other statuses
      console.log('Make.com execution status:', status)
      
      return res.status(200).json({ 
        received: true, 
        message: 'Status updated',
        executionId
      })
    }

  } catch (error) {
    console.error('Webhook handler error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
}

// Signature verification function
function verifySignature(payload, signature) {
  // Implement signature verification logic based on Make.com documentation
  // This is a placeholder - implement actual verification in production
  if (!signature) return false
  
  // Example implementation (replace with actual verification logic)
  const crypto = require('crypto')
  const secret = process.env.MAKE_WEBHOOK_SECRET
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSignature)
  )
}

// Database operations
async function logWebhookEvent(eventData) {
  try {
    await prisma.webhookEvent.create({
      data: {
        executionId: eventData.executionId,
        scenarioName: eventData.scenarioName || 'Unknown',
        status: eventData.status,
        userEmail: eventData.userEmail,
        data: eventData.data,
        error: eventData.error,
        timestamp: new Date()
      }
    })
  } catch (error) {
    console.error('Failed to log webhook event:', error)
  }
}

async function storeExecutionResult(executionId, data, scenarioName, userEmail) {
  try {
    // Store successful execution results in your database
    await prisma.executionResult.create({
      data: {
        executionId,
        scenarioName: scenarioName || 'Unknown',
        userEmail,
        result: JSON.stringify(data),
        timestamp: new Date()
      }
    })
    console.log('Execution result stored:', { executionId })
  } catch (error) {
    console.error('Failed to store execution result:', error)
  }
}

async function storeExtractedEvents(events, userEmail) {
  try {
    // Store extracted events for user approval
    for (const event of events) {
      await prisma.pendingEvent.create({
        data: {
          title: event.title,
          description: event.description || '',
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          location: event.location || '',
          source: event.source || 'email',
          confidenceScore: event.confidenceScore || 0,
          extractedFrom: event.extractedFrom || '',
          userEmail
        }
      })
    }
    console.log(`${events.length} events stored for user approval`)
  } catch (error) {
    console.error('Failed to store extracted events:', error)
  }
}

async function logExecutionError(executionId, error, scenarioName, userEmail) {
  try {
    // Log execution errors in your database
    await prisma.executionError.create({
      data: {
        executionId,
        scenarioName: scenarioName || 'Unknown',
        userEmail,
        error: JSON.stringify(error),
        timestamp: new Date()
      }
    })
    console.log('Execution error logged:', { executionId })
  } catch (dbError) {
    console.error('Failed to log execution error:', dbError)
  }
}