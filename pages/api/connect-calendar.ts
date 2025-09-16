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

    // Check if Calendar API access is available
    const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary', {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!calendarResponse.ok) {
      return res.status(400).json({ 
        error: 'Calendar connection failed',
        details: 'Unable to access Google Calendar API'
      })
    }

    const calendar = await calendarResponse.json()
    
    // Log successful connection
    console.log('Calendar connected successfully for:', session.user?.email)
    
    // Trigger N8N webhook for Calendar connection
    if (process.env.N8N_CALENDAR_WEBHOOK) {
      try {
        await fetch(process.env.N8N_CALENDAR_WEBHOOK, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'calendar_connected',
            user: {
              email: session.user?.email,
              name: session.user?.name
            },
            calendar_info: {
              id: calendar.id,
              summary: calendar.summary,
              timeZone: calendar.timeZone
            },
            timestamp: new Date().toISOString()
          })
        })
      } catch (webhookError) {
        console.error('N8N Calendar webhook error:', webhookError)
      }
    }

    res.status(200).json({ 
      success: true, 
      message: 'Calendar connected successfully',
      calendar: {
        id: calendar.id,
        summary: calendar.summary,
        timeZone: calendar.timeZone,
        accessRole: calendar.accessRole
      }
    })
  } catch (error) {
    console.error('Calendar connection error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}