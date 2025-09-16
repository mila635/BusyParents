import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session || !session.accessToken) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Check if Gmail API access is available
    const gmailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!gmailResponse.ok) {
      return res.status(400).json({ 
        error: 'Gmail connection failed',
        details: 'Unable to access Gmail API'
      })
    }

    const profile = await gmailResponse.json()
    
    // Log successful connection
    console.log('Gmail connected successfully for:', session.user?.email)
    
    // Trigger N8N webhook for Gmail connection
    if (process.env.N8N_GMAIL_WEBHOOK) {
      try {
        await fetch(process.env.N8N_GMAIL_WEBHOOK, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'gmail_connected',
            user: {
              email: session.user?.email,
              name: session.user?.name
            },
            gmail_profile: profile,
            timestamp: new Date().toISOString()
          })
        })
      } catch (webhookError) {
        console.error('N8N Gmail webhook error:', webhookError)
      }
    }

    res.status(200).json({ 
      success: true, 
      message: 'Gmail connected successfully',
      profile: {
        emailAddress: profile.emailAddress,
        messagesTotal: profile.messagesTotal,
        threadsTotal: profile.threadsTotal
      }
    })
  } catch (error) {
    console.error('Gmail connection error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}