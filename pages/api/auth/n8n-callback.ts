import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './[...nextauth]'

/**
 * N8N OAuth Callback Handler
 * 
 * This endpoint handles the OAuth callback from Google when the redirect URI
 * is set to the N8N webhook URL: https://milafinance.app.n8n.cloud/webhook/google-signin
 * 
 * The flow is:
 * 1. User clicks sign in
 * 2. Google redirects to N8N webhook with authorization code
 * 3. N8N processes the code and forwards user data to this endpoint
 * 4. This endpoint creates/updates user session and redirects to dashboard
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
      access_token, 
      refresh_token, 
      user_info, 
      expires_in,
      scope 
    } = req.body

    if (!access_token || !user_info) {
      return res.status(400).json({ 
        error: 'Missing required OAuth data',
        required: ['access_token', 'user_info']
      })
    }

    // Validate user_info structure
    if (!user_info.email || !user_info.name) {
      return res.status(400).json({ 
        error: 'Invalid user_info structure',
        required: ['email', 'name']
      })
    }

    // Log the N8N callback for debugging
    console.log('N8N OAuth Callback received:', {
      email: user_info.email,
      name: user_info.name,
      hasAccessToken: !!access_token,
      hasRefreshToken: !!refresh_token,
      scope: scope
    })

    // Create a session-like object for the user
    const userSession = {
      user: {
        email: user_info.email,
        name: user_info.name,
        image: user_info.picture || null
      },
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: expires_in ? Math.floor(Date.now() / 1000) + expires_in : null,
      scope: scope
    }

    // Store user data in database for future reference
    try {
      const { PrismaClient } = require('@prisma/client')
      const prisma = new PrismaClient()
      
      await prisma.user.upsert({
        where: { email: user_info.email },
        update: {
          name: user_info.name,
          image: user_info.picture || null,
          updatedAt: new Date()
        },
        create: {
          email: user_info.email,
          name: user_info.name,
          image: user_info.picture || null,
          role: 'PARENT',
          isActive: true
        }
      })

      await prisma.$disconnect()
    } catch (dbError) {
      console.error('Database error in N8N callback:', dbError)
      // Continue without failing - database is not critical for OAuth flow
    }

    // Return success response with redirect URL
    return res.status(200).json({
      success: true,
      message: 'OAuth callback processed successfully',
      user: userSession.user,
      redirectUrl: `${process.env.NEXTAUTH_URL}/dashboard?n8n_auth=success`,
      sessionData: {
        email: user_info.email,
        name: user_info.name,
        accessToken: access_token // This can be used by the frontend to create a session
      }
    })

  } catch (error) {
    console.error('N8N OAuth callback error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}