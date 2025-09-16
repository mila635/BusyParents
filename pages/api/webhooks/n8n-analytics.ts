import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * N8N Analytics Webhook Endpoint
 * 
 * This endpoint receives real-time analytics data from N8N workflows
 * and processes them for dashboard updates.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload = req.body
    console.log('🔗 N8N Analytics webhook received:', {
      timestamp: new Date().toISOString(),
      payload: JSON.stringify(payload, null, 2)
    })

    // Extract data from N8N payload
    const {
      executionId,
      workflowId,
      workflowName,
      status = 'success',
      user,
      analytics,
      events = [],
      errors = [],
      metadata = {}
    } = payload

    const userEmail = user?.email || analytics?.userEmail
    
    if (!userEmail) {
      console.error('❌ No user email provided in webhook payload')
      return res.status(400).json({ 
        error: 'User email is required',
        received: payload
      })
    }

    // Find or create user
    let dbUser = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: userEmail,
          name: user?.name || userEmail.split('@')[0],
          provider: 'google',
          role: 'PARENT',
          isActive: true
        }
      })
      console.log('✅ Created new user from N8N webhook:', dbUser.email)
    }

    // Process analytics data
    const analyticsData = {
      emailsProcessed: analytics?.emailsProcessed || 0,
      eventsDetected: analytics?.eventsDetected || events.length,
      eventsCreated: analytics?.eventsCreated || 0,
      processingTime: analytics?.processingTime || 0,
      confidence: analytics?.confidence || 0.8
    }

    // Create workflow trigger record
    const workflowTrigger = await prisma.workflowTrigger.create({
      data: {
        action: 'n8n-analytics-update',
        scenarioName: workflowName || 'N8N Analytics Workflow',
        userEmail,
        userId: dbUser.id,
        status: status === 'error' ? 'error' : 'success',
        executionId: executionId || `n8n-${Date.now()}`,
        platform: 'n8n',
        workflowType: 'n8n',
        n8nWorkflowId: workflowId,
        completedAt: status !== 'running' ? new Date() : undefined,
        errorAt: status === 'error' ? new Date() : undefined,
        additionalData: JSON.stringify({
          analytics: analyticsData,
          events,
          metadata,
          timestamp: new Date().toISOString()
        })
      }
    })

    // Process detected events
    const createdEvents = []
    for (const event of events) {
      try {
        const pendingEvent = await prisma.pendingEvent.create({
          data: {
            userId: dbUser.id,
            title: event.title || 'Untitled Event',
            date: new Date(event.date || event.startTime || new Date()),
            description: event.description || '',
            location: event.location || '',
            source: 'n8n-webhook',
            extractedFrom: event.extractedFrom || 'N8N Email Analysis',
            confidenceScore: event.confidence || analyticsData.confidence,
            status: 'PENDING'
          }
        })
        createdEvents.push(pendingEvent)
        console.log('✅ Created pending event:', pendingEvent.title)
      } catch (eventError) {
        console.error('❌ Error creating pending event:', eventError)
        errors.push(`Failed to create event: ${event.title}`)
      }
    }

    // Log any errors
    for (const error of errors) {
      await prisma.workflowError.create({
        data: {
          action: 'n8n-analytics-update',
          scenarioName: workflowName || 'N8N Analytics Workflow',
          userEmail,
          error: typeof error === 'string' ? error : JSON.stringify(error)
        }
      })
    }

    // Update N8N user data tracking
    const existingN8NUser = await prisma.n8NUserData.findFirst({
      where: { email: userEmail }
    });

    if (existingN8NUser) {
      await prisma.n8NUserData.update({
        where: { id: existingN8NUser.id },
        data: {
          lastSyncedAt: new Date(),
          accessToken: user?.accessToken || undefined
        }
      });
    } else {
      await prisma.n8NUserData.create({
        data: {
          userId: dbUser.id,
          email: userEmail,
          name: dbUser.name,
          accessToken: user?.accessToken || undefined,
          lastSyncedAt: new Date()
        }
      });
    }

    // Calculate updated statistics for response
    const [totalEmailsProcessed, totalPendingEvents, totalCalendarEvents] = await Promise.all([
      prisma.workflowTrigger.count({
        where: { 
          userEmail,
          status: 'success'
        }
      }),
      prisma.pendingEvent.count({
        where: { userId: dbUser.id }
      }),
      prisma.calendarEvent.count({
        where: { userId: dbUser.id }
      })
    ])

    const updatedStats = {
      emailsProcessed: totalEmailsProcessed,
      eventsCreated: totalPendingEvents + totalCalendarEvents,
      timeSaved: Math.round((totalPendingEvents + totalCalendarEvents) * 5 / 60 * 10) / 10,
      lastUpdate: new Date().toISOString()
    }

    console.log('✅ N8N Analytics webhook processed successfully:', {
      userEmail,
      workflowTriggerId: workflowTrigger.id,
      eventsCreated: createdEvents.length,
      errorsCount: errors.length,
      updatedStats
    })

    // Send response back to N8N
    return res.status(200).json({
      success: true,
      message: 'Analytics data processed successfully',
      data: {
        workflowTriggerId: workflowTrigger.id,
        eventsCreated: createdEvents.length,
        errorsCount: errors.length,
        stats: updatedStats,
        user: {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ N8N Analytics webhook error:', error)
    
    // Log the error to database if possible
    try {
      await prisma.workflowError.create({
        data: {
          action: 'n8n-analytics-webhook',
          scenarioName: 'N8N Analytics Webhook Handler',
          userEmail: req.body?.user?.email || 'unknown',
          error: error instanceof Error ? error.message : 'Unknown webhook error'
        }
      })
    } catch (logError) {
      console.error('Failed to log webhook error:', logError)
    }

    return res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  } finally {
    await prisma.$disconnect()
  }
}