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

    // For reminder service, we'll simulate a connection check
    // In a real implementation, this might connect to a specific reminder service
    const reminderSettings = {
      emailReminders: true,
      pushNotifications: true,
      smsReminders: false, // Would require phone number verification
      defaultReminderTime: 15, // minutes before event
      timezone: 'UTC'
    }
    
    // Log successful connection
    console.log('Reminder service connected successfully for:', session.user?.email)
    
    // Trigger N8N webhook for Reminder connection
    if (process.env.N8N_REMINDER_WEBHOOK) {
      try {
        await fetch(process.env.N8N_REMINDER_WEBHOOK, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'reminder_connected',
            user: {
              email: session.user?.email,
              name: session.user?.name
            },
            reminder_settings: reminderSettings,
            timestamp: new Date().toISOString()
          })
        })
      } catch (webhookError) {
        console.error('N8N Reminder webhook error:', webhookError)
      }
    }

    res.status(200).json({ 
      success: true, 
      message: 'Reminder service connected successfully',
      settings: reminderSettings
    })
  } catch (error) {
    console.error('Reminder connection error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}