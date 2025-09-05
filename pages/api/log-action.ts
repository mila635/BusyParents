// import type { NextApiRequest, NextApiResponse } from 'next'
// import { getSession } from 'next-auth/react'
// import { logToGoogleSheets } from '../../utils/googleSheets'

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' })
//   }

//   try {
//     const session = await getSession({ req })
    
//     if (!session) {
//       return res.status(401).json({ message: 'Unauthorized' })
//     }

//     const { action, service, status, details } = req.body

//     if (!action || !service || !status) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Missing required fields: action, service, status' 
//       })
//     }

//     // Log the action to Google Sheets
//     const logResult = await logToGoogleSheets({
//       timestamp: new Date().toISOString(),
//       userEmail: session.user?.email || 'unknown',
//       action,
//       service,
//       status,
//       details: details || '',
//       errorMessage: status === 'failed' || status === 'error' ? details : ''
//     })

//     if (logResult.success) {
//       return res.status(200).json({ 
//         success: true, 
//         message: 'Action logged successfully' 
//       })
//     } else {
//       console.error('Failed to log to Google Sheets:', logResult.error)
//       return res.status(500).json({ 
//         success: false, 
//         message: 'Failed to log action' 
//       })
//     }

//   } catch (error) {
//     console.error('Log action error:', error)
//     return res.status(500).json({ 
//       success: false, 
//       message: 'An unexpected error occurred while logging the action' 
//     })
//   }
// }





import { googleSheetsClient } from '../../lib/google-sheets-client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    const { action, service, status, details } = req.body;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!spreadsheetId) {
        return res.status(500).json({ success: false, error: 'Google Sheets not configured - missing spreadsheet ID' });
    }

    try {
        const rowData = [
            new Date().toISOString(),
            action,
            service,
            status,
            details,
        ];

        await googleSheetsClient.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A1',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [rowData],
            },
        });

        res.status(200).json({ success: true, message: 'Log entry added successfully' });
    } catch (error: any) {
        console.error('Error logging to Google Sheets:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to log action',
        });
    }
}
