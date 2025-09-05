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
        action: 'Gmail Connect',
        service: 'Gmail',
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
        action: 'Gmail Connect',
        service: 'Gmail',
        status: 'failed',
        details: 'No access token available',
        errorMessage: 'Please sign in again'
      })
      
      return res.status(400).json({ 
        success: false,
        message: 'No access token available. Please sign in again.' 
      })
    }

    // Test Gmail API access by getting user's profile
    try {
      const gmailResponse = await axios.get('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      })

      if (gmailResponse.status === 200) {
        // Log successful connection
        await logToGoogleSheets({
          timestamp: new Date().toISOString(),
          userEmail: session.user?.email || 'unknown',
          action: 'Gmail Connect',
          service: 'Gmail',
          status: 'success',
          details: `Connected to ${gmailResponse.data.emailAddress}, Messages: ${gmailResponse.data.messagesTotal}, Threads: ${gmailResponse.data.threadsTotal}`
        })
        
        return res.status(200).json({ 
          success: true, 
          message: 'Gmail connected successfully! You can now process emails automatically.',
          data: {
            emailAddress: gmailResponse.data.emailAddress,
            messagesTotal: gmailResponse.data.messagesTotal,
            threadsTotal: gmailResponse.data.threadsTotal
          }
        })
      } else {
        throw new Error(`Gmail API returned status ${gmailResponse.status}`)
      }
    } catch (gmailError) {
      console.error('Gmail API error:', gmailError)
      
      let errorMessage = 'Unknown error'
      let statusCode = 500
      
      if (axios.isAxiosError(gmailError)) {
        if (gmailError.response?.status === 401) {
          errorMessage = 'Gmail access denied. Please check your permissions and try again.'
          statusCode = 401
        } else if (gmailError.response?.status === 403) {
          errorMessage = 'Gmail access forbidden. Please check your OAuth scopes.'
          statusCode = 403
        } else if (gmailError.code === 'ECONNABORTED') {
          errorMessage = 'Gmail API request timed out. Please try again.'
          statusCode = 408
        } else {
          errorMessage = `Gmail API error: ${gmailError.message}`
        }
      } else {
        errorMessage = 'Failed to connect to Gmail. Please try again.'
      }
      
      // Log failed connection
      await logToGoogleSheets({
        timestamp: new Date().toISOString(),
        userEmail: session.user?.email || 'unknown',
        action: 'Gmail Connect',
        service: 'Gmail',
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
    console.error('Gmail connection error:', error)
    
    // Log unexpected error
    await logToGoogleSheets({
      timestamp: new Date().toISOString(),
      userEmail: 'unknown',
      action: 'Gmail Connect',
      service: 'Gmail',
      status: 'failed',
      details: 'Unexpected error in handler',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    })
    
    return res.status(500).json({ 
      success: false, 
      message: 'An unexpected error occurred while connecting Gmail' 
    })
  }
}
