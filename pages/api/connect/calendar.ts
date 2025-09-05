import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import axios from 'axios'
import { logToGoogleSheets } from '../../../utils/googleSheets'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const session = await getSession({ req })
    
    if (!session) {
      // Log unauthorized attempt
      await logToGoogleSheets({
        timestamp: new Date().toISOString(),
        userEmail: 'unknown',
        action: 'Calendar Connect',
        service: 'Google Calendar',
        status: 'failed',
        details: 'No session found',
        errorMessage: 'Unauthorized access attempt'
      })
      
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // Check if we have access token
    if (!session.accessToken) {
      // Log missing token
      await logToGoogleSheets({
        timestamp: new Date().toISOString(),
        userEmail: session.user?.email || 'unknown',
        action: 'Calendar Connect',
        service: 'Google Calendar',
        status: 'failed',
        details: 'No access token available',
        errorMessage: 'Please sign in again'
      })
      
      return res.status(400).json({ 
        success: false,
        message: 'No access token available. Please sign in again.' 
      })
    }

    // Test Google Calendar API access by getting user's calendar list
    try {
      const calendarResponse = await axios.get('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      })

      if (calendarResponse.status === 200) {
        const calendars = calendarResponse.data.items || []
        const primaryCalendar = calendars.find((cal: any) => cal.primary) || calendars[0]
        
        // Log successful connection
        await logToGoogleSheets({
          timestamp: new Date().toISOString(),
          userEmail: session.user?.email || 'unknown',
          action: 'Calendar Connect',
          service: 'Google Calendar',
          status: 'success',
          details: `Connected to ${primaryCalendar?.summary || 'Unknown Calendar'}, Total calendars: ${calendars.length}`
        })
        
        return res.status(200).json({ 
          success: true, 
          message: 'Google Calendar connected successfully! You can now create events automatically.',
          data: {
            totalCalendars: calendars.length,
            primaryCalendar: primaryCalendar?.summary || 'Unknown',
            calendarIds: calendars.map((cal: any) => cal.id)
          }
        })
      } else {
        throw new Error(`Calendar API returned status ${calendarResponse.status}`)
      }
    } catch (calendarError) {
      console.error('Calendar API error:', calendarError)
      
      let errorMessage = 'Unknown error'
      let statusCode = 500
      
      if (axios.isAxiosError(calendarError)) {
        if (calendarError.response?.status === 401) {
          errorMessage = 'Calendar access denied. Please check your permissions and try again.'
          statusCode = 401
        } else if (calendarError.response?.status === 403) {
          errorMessage = 'Calendar access forbidden. Please check your OAuth scopes.'
          statusCode = 403
        } else if (calendarError.code === 'ECONNABORTED') {
          errorMessage = 'Calendar API request timed out. Please try again.'
          statusCode = 408
        } else {
          errorMessage = `Calendar API error: ${calendarError.message}`
        }
      } else {
        errorMessage = 'Failed to connect to Google Calendar. Please try again.'
      }
      
      // Log failed connection
      await logToGoogleSheets({
        timestamp: new Date().toISOString(),
        userEmail: session.user?.email || 'unknown',
        action: 'Calendar Connect',
        service: 'Google Calendar',
        status: 'failed',
        details: `API call failed with status ${statusCode}`,
        errorMessage: errorMessage
      })
      
      return res.status(statusCode).json({ 
        success: false,
        message: errorMessage
      })
    }

  } catch (error) {
    console.error('Calendar connection error:', error)
    
    // Log unexpected error
    await logToGoogleSheets({
      timestamp: new Date().toISOString(),
      userEmail: 'unknown',
      action: 'Calendar Connect',
      service: 'Google Calendar',
      status: 'failed',
      details: 'Unexpected error in handler',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    })
    
    return res.status(500).json({ 
      success: false, 
      message: 'An unexpected error occurred while connecting Google Calendar' 
    })
  }
}
