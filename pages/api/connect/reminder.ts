import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
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
        action: 'Reminder Connect',
        service: 'Smart Reminders',
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
        action: 'Reminder Connect',
        service: 'Smart Reminders',
        status: 'failed',
        details: 'No access token available',
        errorMessage: 'Please sign in again'
      })
      
      return res.status(400).json({ 
        success: false,
        message: 'No access token available. Please sign in again.' 
      })
    }

    // Smart Reminders are always available as an internal feature
    // Log successful connection
    await logToGoogleSheets({
      timestamp: new Date().toISOString(),
      userEmail: session.user?.email || 'unknown',
      action: 'Reminder Connect',
      service: 'Smart Reminders',
      status: 'success',
      details: 'Smart Reminders activated - internal feature enabled'
    })

    return res.status(200).json({ 
      success: true, 
      message: 'Smart Reminders connected successfully! You can now receive intelligent notifications.',
      data: {
        feature: 'Smart Reminders',
        status: 'activated',
        description: 'Internal notification system enabled'
      }
    })

  } catch (error) {
    console.error('Reminder connection error:', error)
    
    // Log unexpected error
    await logToGoogleSheets({
      timestamp: new Date().toISOString(),
      userEmail: 'unknown',
      action: 'Reminder Connect',
      service: 'Smart Reminders',
      status: 'failed',
      details: 'Unexpected error in handler',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    })
    
    return res.status(500).json({ 
      success: false, 
      message: 'An unexpected error occurred while connecting Smart Reminders' 
    })
  }
}
