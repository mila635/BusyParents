import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Real-time Analytics API Endpoint
 * 
 * This endpoint receives analytics data from N8N workflows and updates
 * the dashboard statistics in real-time.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      action,
      userEmail,
      executionId,
      status,
      data,
      workflowType = 'n8n',
      scenarioName,
      emailsProcessed = 0,
      eventsCreated = 0,
      errors = []
    } = req.body

    console.log('📊 Real-time analytics data received:', {
      action,
      userEmail,
      status,
      emailsProcessed,
      eventsCreated
    })

    // Validate required fields
    if (!action || !userEmail) {
      return res.status(400).json({ 
        error: 'Missing required fields: action and userEmail are required' 
      })
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: data?.user?.name || userEmail.split('@')[0],
          provider: 'google',
          role: 'PARENT',
          isActive: true
        }
      })
      console.log('✅ New user created:', user.email)
    }

    // Find existing workflow trigger or create new one
    const existingTrigger = await prisma.workflowTrigger.findFirst({
      where: {
        executionId: executionId || `${action}-${Date.now()}`,
        userEmail: userEmail
      }
    });

    const workflowTrigger = existingTrigger 
      ? await prisma.workflowTrigger.update({
          where: { id: existingTrigger.id },
          data: {
            status,
            completedAt: status === 'success' ? new Date() : undefined,
            errorAt: status === 'error' ? new Date() : undefined,
            additionalData: JSON.stringify({
               emailsProcessed,
               eventsCreated,
               data,
               errors,
               timestamp: new Date().toISOString()
             })
           }
         })
       : await prisma.workflowTrigger.create({
           data: {
             action,
             scenarioName: scenarioName || `N8N ${action} Workflow`,
             userEmail,
             userId: user.id,
             status,
             executionId: executionId || `${action}-${Date.now()}`,
             platform: 'n8n',
             workflowType,
             completedAt: status === 'success' ? new Date() : undefined,
             errorAt: status === 'error' ? new Date() : undefined,
             additionalData: JSON.stringify({
               emailsProcessed,
               eventsCreated,
               data,
               errors,
               timestamp: new Date().toISOString()
             })
           }
         });

    // Create pending events if provided
    if (data?.events && Array.isArray(data.events)) {
      for (const event of data.events) {
        try {
          await prisma.pendingEvent.create({
            data: {
              userId: user.id,
              title: event.title || 'Untitled Event',
              date: new Date(event.date || event.startTime),
              description: event.description,
              location: event.location,
              source: 'n8n-workflow',
              extractedFrom: event.extractedFrom || 'N8N Email Processing',
              confidenceScore: event.confidence || 0.8,
              status: 'PENDING'
            }
          })
        } catch (eventError) {
          console.error('Error creating pending event:', eventError)
        }
      }
    }

    // Log errors if any
    if (errors.length > 0) {
      for (const error of errors) {
        await prisma.workflowError.create({
          data: {
            action,
            scenarioName: scenarioName || `N8N ${action} Workflow`,
            userEmail,
            error: typeof error === 'string' ? error : JSON.stringify(error)
          }
        })
      }
    }

    // Update N8N user data for tracking
    const existingN8NUser = await prisma.n8NUserData.findFirst({
      where: { email: userEmail }
    });

    if (existingN8NUser) {
      await prisma.n8NUserData.update({
        where: { id: existingN8NUser.id },
        data: {
          lastSyncedAt: new Date(),
          accessToken: data?.accessToken || undefined
        }
      });
    } else {
      await prisma.n8NUserData.create({
        data: {
          userId: user.id,
          email: userEmail,
          name: user.name,
          accessToken: data?.accessToken || undefined,
          lastSyncedAt: new Date()
        }
      });
    }

    // Calculate updated statistics
    const [totalEmailsProcessed, totalEventsCreated, totalCalendarEvents] = await Promise.all([
      prisma.workflowTrigger.count({
        where: { 
          userEmail,
          status: 'success'
        }
      }),
      prisma.pendingEvent.count({
        where: { userId: user.id }
      }),
      prisma.calendarEvent.count({
        where: { userId: user.id }
      })
    ])

    const updatedStats = {
      emailsProcessed: totalEmailsProcessed,
      eventsCreated: totalEventsCreated + totalCalendarEvents,
      timeSaved: Math.round((totalEventsCreated + totalCalendarEvents) * 5 / 60 * 10) / 10
    }

    console.log('✅ Analytics data processed successfully:', {
      userEmail,
      action,
      status,
      updatedStats
    })

    return res.status(200).json({
      success: true,
      message: 'Analytics data processed successfully',
      workflowTriggerId: workflowTrigger.id,
      stats: updatedStats,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })

  } catch (error) {
    console.error('❌ Error processing analytics data:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  } finally {
    await prisma.$disconnect()
  }
}