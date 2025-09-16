import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session || !session.accessToken) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const connections = {
      gmail: { connected: false, status: 'disconnected', error: null },
      calendar: { connected: false, status: 'disconnected', error: null },
      reminder: { connected: false, status: 'disconnected', error: null }
    }

    // Check Gmail connection
    try {
      const gmailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (gmailResponse.ok) {
        connections.gmail = { connected: true, status: 'connected', error: null }
      } else {
        connections.gmail = { 
          connected: false, 
          status: 'error', 
          error: `HTTP ${gmailResponse.status}` 
        }
      }
    } catch (error) {
      connections.gmail = { 
        connected: false, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }

    // Check Calendar connection
    try {
      const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary', {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (calendarResponse.ok) {
        connections.calendar = { connected: true, status: 'connected', error: null }
      } else {
        connections.calendar = { 
          connected: false, 
          status: 'error', 
          error: `HTTP ${calendarResponse.status}` 
        }
      }
    } catch (error) {
      connections.calendar = { 
        connected: false, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }

    // For reminder service, assume it's always available if user is authenticated
    connections.reminder = { connected: true, status: 'connected', error: null }

    // Log connection check
    console.log('Connection status checked for:', session.user?.email, connections)

    res.status(200).json({ 
      success: true,
      connections,
      user: {
        email: session.user?.email,
        name: session.user?.name
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Connection check error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}