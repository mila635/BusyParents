import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './[...nextauth]'
import { encode } from 'next-auth/jwt'
import { prisma } from '../../../lib/database'

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

    // Store user data in database
    let dbUser
    try {
      dbUser = await prisma.user.upsert({
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
    } catch (dbError) {
      console.error('Database error in N8N callback:', dbError)
      return res.status(500).json({ 
        error: 'Database error',
        message: 'Failed to store user data'
      })
    }

    // Create NextAuth JWT token for proper session management
    const token = {
      sub: dbUser.id,
      email: user_info.email,
      name: user_info.name,
      picture: user_info.picture || null,
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: expires_in ? Math.floor(Date.now() / 1000) + expires_in : null,
      scope: scope,
      userId: dbUser.id,
      role: dbUser.role,
      isActive: dbUser.isActive,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
    }

    try {
      // Encode JWT token using NextAuth's method
      const encodedToken = await encode({
        token,
        secret: process.env.NEXTAUTH_SECRET!,
        maxAge: 30 * 24 * 60 * 60 // 30 days
      })

      // Set the session cookie
      const cookieName = process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token'
      
      const cookieOptions = [
        `${cookieName}=${encodedToken}`,
        'Path=/',
        'HttpOnly',
        'SameSite=Lax',
        `Max-Age=${30 * 24 * 60 * 60}`, // 30 days
        ...(process.env.NODE_ENV === 'production' ? ['Secure'] : [])
      ].join('; ')

      res.setHeader('Set-Cookie', cookieOptions)

      console.log('✅ N8N callback: Session created for user:', user_info.email)

      // Return success with redirect URL
      return res.status(200).json({
        success: true,
        message: 'OAuth callback processed successfully',
        user: {
          email: user_info.email,
          name: user_info.name,
          image: user_info.picture || null
        },
        redirectUrl: `${process.env.NEXTAUTH_URL}/dashboard?auth=n8n_success`
      })

    } catch (tokenError) {
      console.error('Error creating session token:', tokenError)
      return res.status(500).json({ 
        error: 'Session creation failed',
        message: 'Failed to create user session'
      })
    }

  } catch (error) {
    console.error('N8N OAuth callback error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}