import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { withRateLimit } from '../../../lib/rateLimit'
// import { prisma } from '../../../lib/database' // Temporarily disabled

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get authenticated session
    const session = await getSession({ req })
    
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Get user from database (temporarily disabled)
    // const user = await prisma.user.findUnique({
    //   where: { email: session.user.email },
    //   include: {
    //     settings: true,
    //     tokens: {
    //       select: {
    //         scope: true,
    //         expiresAt: true
    //       }
    //     }
    //   }
    // })

    // if (!user) {
    //   return res.status(404).json({ error: 'User not found' })
    // }

    // Temporary user data for development
    const user = {
      id: `temp_${session.user.email!.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      provider: 'google',
      createdAt: new Date(),
      lastLoginAt: new Date(),
      settings: {
        emailProcessingEnabled: true,
        calendarSyncEnabled: true,
        reminderEnabled: true,
        timezone: 'UTC'
      },
      tokens: {
        scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar',
        expiresAt: new Date(Date.now() + 3600000) // 1 hour from now
      }
    }

    if (req.method === 'GET') {
      // Return user profile (excluding sensitive data)
      return res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        provider: user.provider,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        settings: user.settings,
        hasValidToken: user.tokens?.expiresAt ? user.tokens.expiresAt > new Date() : false,
        scopes: user.tokens?.scope?.split(' ') || []
      })
    }

    if (req.method === 'PUT') {
      // Update user profile
      const { name, timezone } = req.body

      // Validate input
      if (name && typeof name !== 'string') {
        return res.status(400).json({ error: 'Invalid name format' })
      }

      if (timezone && typeof timezone !== 'string') {
        return res.status(400).json({ error: 'Invalid timezone format' })
      }

             // Update user (temporarily disabled - database not set up)
       // const updatedUser = await prisma.user.update({
       //   where: { id: user.id },
       //   data: {
       //     name: name || undefined,
       //     settings: {
       //       upsert: {
       //         create: {
       //           timezone: timezone || 'UTC'
       //         },
       //         update: {
       //           timezone: timezone || undefined
       //         }
       //       }
       //     }
       //   },
       //   include: {
       //     settings: true
       //   }
       // })

       // Temporary update for development
       const updatedUser = {
         ...user,
         name: name || user.name,
         settings: {
           ...user.settings,
           timezone: timezone || user.settings.timezone
         }
       }

      return res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          image: updatedUser.image,
          settings: updatedUser.settings
        }
      })
    }

  } catch (error) {
    console.error('User profile API error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : 'Something went wrong'
    })
  }
}

export default withRateLimit(handler, 'api')
