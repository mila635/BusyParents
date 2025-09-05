import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Check if environment variables are configured
    const gmailUrl = process.env.MAKE_GMAIL_WEBHOOK_URL
    const calendarUrl = process.env.MAKE_CALENDAR_WEBHOOK_URL
    const reminderUrl = process.env.MAKE_REMINDER_WEBHOOK_URL

    const configStatus = {
      gmail: {
        configured: !!(gmailUrl && gmailUrl !== 'https://hook.eu1.make.com/your-gmail-webhook-url'),
        url: gmailUrl,
        note: 'Using Google Gmail API directly - no webhook needed'
      },
      calendar: {
        configured: !!(calendarUrl && calendarUrl !== 'https://hook.eu1.make.com/your-calendar-webhook-url'),
        url: calendarUrl,
        note: 'Using Google Calendar API directly - no webhook needed'
      },
      reminder: {
        configured: !!(reminderUrl && reminderUrl !== 'https://hook.eu1.make.com/your-reminder-webhook-url'),
        url: reminderUrl,
        note: 'Smart Reminders work without external webhooks'
      }
    }

    return res.status(200).json({
      success: true,
      message: 'API is working! All services now use Google APIs directly.',
      timestamp: new Date().toISOString(),
      configStatus,
      note: 'The buttons should now work without external webhook configuration!'
    })
  } catch (error) {
    console.error('Test connection error:', error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred while testing the connection'
    })
  }
}
