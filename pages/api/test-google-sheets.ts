import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { testGoogleSheetsConnection } from '../../utils/googleSheets'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const session = await getSession({ req })
    
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // Test Google Sheets connection
    const testResult = await testGoogleSheetsConnection()

    if (testResult.success) {
      return res.status(200).json({ 
        success: true, 
        message: testResult.message,
        headers: testResult.headers,
        configStatus: {
          spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID ? 'SET' : 'NOT SET',
          privateKey: process.env.GOOGLE_SHEETS_PRIVATE_KEY ? 'SET' : 'NOT SET',
          clientEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL ? 'SET' : 'NOT SET'
        }
      })
    } else {
      return res.status(500).json({ 
        success: false, 
        error: testResult.error,
        configStatus: {
          spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID ? 'SET' : 'NOT SET',
          privateKey: process.env.GOOGLE_SHEETS_PRIVATE_KEY ? 'SET' : 'NOT SET',
          clientEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL ? 'SET' : 'NOT SET'
        }
      })
    }

  } catch (error) {
    console.error('Test Google Sheets error:', error)
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      configStatus: {
        spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID ? 'SET' : 'NOT SET',
        privateKey: process.env.GOOGLE_SHEETS_PRIVATE_KEY ? 'SET' : 'NOT SET',
        clientEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL ? 'SET' : 'NOT SET'
      }
    })
  }
}
