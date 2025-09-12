import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]'
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

    const { userId } = req.query
    const { role } = req.body

    if (typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid user ID' })
    }

    if (!role || !['PARENT', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role value' })
    }

    // Prevent admin from removing their own admin role if they're the only admin
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, role: true }
    })

    if (targetUser?.email === session.user.email && role === 'PARENT') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN', isActive: true }
      })
      
      if (adminCount <= 1) {
        return res.status(400).json({ 
          error: 'Cannot remove admin role - you are the only active admin' 
        })
      }
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true
      }
    })

    return res.status(200).json(updatedUser)
  } catch (error) {
    console.error('Error updating user role:', error)
    return res.status(500).json({ error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
}