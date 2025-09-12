import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Calculate statistics for this user
    const [emailsProcessed, eventsCreated, calendarEvents] = await Promise.all([
      // Count processed emails (workflow triggers)
      prisma.workflowTrigger.count({
        where: { userEmail: session.user.email }
      }),
      
      // Count pending events created
      prisma.pendingEvent.count({
        where: { userId: user.id }
      }),
      
      // Count calendar events created
      prisma.calendarEvent.count({
        where: { userId: user.id }
      })
    ])

    // Calculate time saved (estimate: 5 minutes per event created)
    const timeSaved = Math.round((eventsCreated + calendarEvents) * 5 / 60 * 10) / 10 // Convert to hours, round to 1 decimal

    const stats = {
      emailsProcessed,
      eventsCreated: eventsCreated + calendarEvents, // Total events (pending + calendar)
      timeSaved
    }

    return res.status(200).json(stats)
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return res.status(500).json({ error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
}