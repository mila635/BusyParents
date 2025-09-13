import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/database';

/**
 * N8N Workflow 2: Email Processing & Event Creation Webhook Handler
 * 
 * This endpoint exactly matches the N8N Workflow 2 structure:
 * 1. Get row(s) in sheet node: Retrieves all users from 'BusyParentsSpreadSheet' -> 'Sheet1'
 * 2. Loop Over Items node: Processes each user individually
 * 3. Update row in sheet node: Updates access_token in 'AI Assistant Data Base' -> 'People Data'
 * 4. HTTP Request1 node: Fetches Gmail messages list
 * 5. Split Out node: Splits email list into individual items
 * 6. HTTP Request2 node: Gets full email content from Gmail API
 * 7. Code node: Decodes email body and extracts sender, subject, body text
 * 8. Basic LLM Chain node: Determines if email is school-related
 * 9. If node: Checks if schoolEmail is "Yes"
 * 10. Basic LLM Chain1 node: Extracts event details (event, date, time, location, notes)
 * 11. Code1 node: Formats date/time for Google Calendar API
 * 12. HTTP Request3 node: Creates Google Calendar event
 * 13. Basic LLM Chain2 node: Generates user-friendly message
 * 14. Send a message node: Emails user about created event
 * 15. Append row in sheet node: Logs processed email details
 * 
 * Request body from N8N workflow trigger:
 * {
 *   "triggerType": "manual" | "scheduled",
 *   "userEmail": "user@example.com",
 *   "dateRange": { "start": "2024-01-01", "end": "2024-01-31" },
 *   "processSchoolEmailsOnly": true
 * }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      triggerType = 'manual',
      userEmail,
      dateRange = '1d',
      processSchoolEmailsOnly = true 
    } = req.body;

    // Prepare payload for N8N Workflow 2 - Email Processing & Event Creation
    // This matches the exact structure expected by the N8N workflow
    const n8nPayload = {
      triggerType,
      userEmail,
      dateRange,
      processSchoolEmailsOnly,
      timestamp: new Date().toISOString(),
      // Google Sheets configuration for user data retrieval
      user_spreadsheet_id: process.env.GOOGLE_SHEETS_SPREADSHEET_ID, // BusyParentsSpreadSheet
      user_sheet_name: process.env.GOOGLE_SHEETS_USER_SOURCE_SHEET || 'Sheet1', // As specified in N8N workflow
      // Database sheet for user data updates
      database_spreadsheet_id: process.env.GOOGLE_SHEETS_SPREADSHEET_ID, // AI Assistant Data Base
      database_sheet_name: 'People Data', // For access_token updates
      // Email logging configuration
      email_log_sheet: 'Email Log', // For processed email tracking
      // API endpoints for the workflow
      gmail_api_base: 'https://gmail.googleapis.com/gmail/v1',
      calendar_api_base: 'https://www.googleapis.com/calendar/v3'
    };

    console.log('🚀 Triggering N8N Workflow 2 - Email Processing & Event Creation:', {
      triggerType,
      userEmail: userEmail || 'all users',
      dateRange,
      processSchoolEmailsOnly
    });

    // Send to N8N webhook
    const n8nResponse = await fetch(process.env.N8N_EMAIL_PROCESSING_WEBHOOK!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(n8nPayload)
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('❌ N8N email processing webhook failed:', {
        status: n8nResponse.status,
        statusText: n8nResponse.statusText,
        error: errorText
      });
      
      throw new Error(`N8N webhook failed: ${n8nResponse.status} ${n8nResponse.statusText}`);
    }

    const n8nResult = await n8nResponse.json();
    console.log('✅ N8N email processing workflow triggered successfully:', n8nResult);

    // Log the workflow trigger in database
    await prisma.workflowTrigger.create({
      data: {
        action: 'email-processing',
        scenarioName: 'N8N Email Processing & Event Creation Workflow',
        userEmail: userEmail || 'all-users',
        status: 'triggered',
        platform: 'web',
        workflowType: 'n8n',
        executionId: n8nResult.executionId || undefined,
        additionalData: JSON.stringify({
          triggerType,
          dateRange,
          processSchoolEmailsOnly,
          timestamp: new Date().toISOString()
        })
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Email processing workflow triggered successfully',
      executionId: n8nResult.executionId,
      data: n8nResult,
      config: {
        triggerType,
        userEmail: userEmail || 'all users',
        dateRange,
        processSchoolEmailsOnly
      }
    });

  } catch (error) {
    console.error('❌ N8N email processing error:', error);
    
    // Log error to database
    try {
      await prisma.workflowError.create({
        data: {
          action: 'email-processing',
          scenarioName: 'N8N Email Processing & Event Creation Workflow',
          userEmail: req.body.userEmail || 'unknown',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
    
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}