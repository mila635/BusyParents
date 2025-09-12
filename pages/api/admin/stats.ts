import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
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

    // Verify admin access
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true, isActive: true }
    })

    if (!adminUser || adminUser.role !== 'ADMIN' || !adminUser.isActive) {
      return res.status(403).json({ error: 'Admin access required' })
    }

    // Get current date for recent signups calculation
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    // Fetch statistics
    const [totalUsers, activeUsers, totalEvents, totalWorkflows, recentSignups] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.calendarEvent.count(),
      prisma.workflowTrigger.count(),
      prisma.user.count({ where: { createdAt: { gte: oneWeekAgo } } })
    ])

    const stats = {
      totalUsers,
      activeUsers,
      totalEvents,
      totalWorkflows,
      recentSignups
    }

    return res.status(200).json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return res.status(500).json({ error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
}