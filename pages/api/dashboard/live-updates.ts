import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Store active connections
const connections = new Map<string, NextApiResponse>()

/**
 * Server-Sent Events endpoint for real-time dashboard updates
 * 
 * This endpoint establishes a persistent connection to push real-time
 * analytics updates to the dashboard.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const userEmail = session.user.email
    console.log('📡 Setting up SSE connection for user:', userEmail)

    // Set up Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    })

    // Store connection
    connections.set(userEmail, res)

    // Send initial connection confirmation
    res.write(`data: ${JSON.stringify({
      type: 'connection',
      message: 'Connected to live updates',
      timestamp: new Date().toISOString()
    })}\n\n`)

    // Send current stats immediately
    try {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { id: true }
      })

      if (user) {
        const [emailsProcessed, eventsCreated, calendarEvents, recentTriggers] = await Promise.all([
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
          }),
          prisma.workflowTrigger.findMany({
            where: { userEmail },
            orderBy: { timestamp: 'desc' },
            take: 5,
            select: {
              id: true,
              action: true,
              status: true,
              timestamp: true,
              scenarioName: true
            }
          })
        ])

        const currentStats = {
          emailsProcessed,
          eventsCreated: eventsCreated + calendarEvents,
          timeSaved: Math.round((eventsCreated + calendarEvents) * 5 / 60 * 10) / 10,
          recentActivity: recentTriggers
        }

        res.write(`data: ${JSON.stringify({
          type: 'stats_update',
          data: currentStats,
          timestamp: new Date().toISOString()
        })}\n\n`)
      }
    } catch (statsError) {
      console.error('Error fetching initial stats:', statsError)
    }

    // Set up periodic updates (every 30 seconds)
    const updateInterval = setInterval(async () => {
      try {
        if (res.destroyed || res.writableEnded) {
          clearInterval(updateInterval)
          connections.delete(userEmail)
          return
        }

        const user = await prisma.user.findUnique({
          where: { email: userEmail },
          select: { id: true }
        })

        if (user) {
          const [emailsProcessed, eventsCreated, calendarEvents, recentTriggers] = await Promise.all([
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
            }),
            prisma.workflowTrigger.findMany({
              where: { 
                userEmail,
                timestamp: {
                  gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
                }
              },
              orderBy: { timestamp: 'desc' },
              take: 10,
              select: {
                id: true,
                action: true,
                status: true,
                timestamp: true,
                scenarioName: true,
                additionalData: true
              }
            })
          ])

          const stats = {
            emailsProcessed,
            eventsCreated: eventsCreated + calendarEvents,
            timeSaved: Math.round((eventsCreated + calendarEvents) * 5 / 60 * 10) / 10,
            recentActivity: recentTriggers
          }

          res.write(`data: ${JSON.stringify({
            type: 'stats_update',
            data: stats,
            timestamp: new Date().toISOString()
          })}\n\n`)
        }
      } catch (error) {
        console.error('Error in periodic update:', error)
      }
    }, 30000) // Update every 30 seconds

    // Handle client disconnect
    req.on('close', () => {
      console.log('📡 SSE connection closed for user:', userEmail)
      clearInterval(updateInterval)
      connections.delete(userEmail)
    })

    req.on('end', () => {
      console.log('📡 SSE connection ended for user:', userEmail)
      clearInterval(updateInterval)
      connections.delete(userEmail)
    })

  } catch (error) {
    console.error('❌ Error setting up SSE connection:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// Export function to broadcast updates to all connected clients
export function broadcastUpdate(userEmail: string, data: any) {
  const connection = connections.get(userEmail)
  if (connection && !connection.destroyed && !connection.writableEnded) {
    try {
      connection.write(`data: ${JSON.stringify({
        type: 'realtime_update',
        data,
        timestamp: new Date().toISOString()
      })}\n\n`)
      console.log('📡 Broadcasted update to user:', userEmail)
    } catch (error) {
      console.error('Error broadcasting update:', error)
      connections.delete(userEmail)
    }
  }
}

// Export function to broadcast to all connections
export function broadcastToAll(data: any) {
  connections.forEach((connection, userEmail) => {
    if (!connection.destroyed && !connection.writableEnded) {
      try {
        connection.write(`data: ${JSON.stringify({
          type: 'global_update',
          data,
          timestamp: new Date().toISOString()
        })}\n\n`)
      } catch (error) {
        console.error('Error broadcasting to user:', userEmail, error)
        connections.delete(userEmail)
      }
    }
  })
}