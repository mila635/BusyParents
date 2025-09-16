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

    // Mock pending events data
    // In a real implementation, this would fetch from a database or external service
    const pendingEvents = [
      {
        id: 'pending-1',
        title: 'Parent-Teacher Conference',
        description: 'Meeting with Ms. Johnson about Sarah\'s progress',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        time: '14:30',
        status: 'pending_approval',
        source: 'email',
        confidence: 0.85,
        extractedFrom: 'school@example.com'
      },
      {
        id: 'pending-2',
        title: 'Soccer Practice',
        description: 'Weekly soccer practice for kids',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        time: '16:00',
        status: 'pending_approval',
        source: 'email',
        confidence: 0.92,
        extractedFrom: 'coach@soccerclub.com'
      },
      {
        id: 'pending-3',
        title: 'Dentist Appointment',
        description: 'Regular checkup for Tommy',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        time: '10:00',
        status: 'pending_approval',
        source: 'email',
        confidence: 0.95,
        extractedFrom: 'appointments@dentalcare.com'
      }
    ]

    // Try to fetch real events from Gmail if available
    let realEvents = []
    try {
      // This would typically query a database or process recent emails
      // For now, we'll return the mock data
      console.log('Fetching pending events for:', session.user?.email)
    } catch (error) {
      console.error('Error fetching real pending events:', error)
    }

    // Log pending events fetch
    console.log('Pending events fetched for:', session.user?.email, `${pendingEvents.length} events`)

    res.status(200).json({ 
      success: true,
      events: pendingEvents,
      count: pendingEvents.length,
      user: {
        email: session.user?.email,
        name: session.user?.name
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Pending events fetch error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}