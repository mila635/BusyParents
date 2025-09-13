import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/database';

/**
 * N8N Workflow 1: User Registration Webhook Handler
 * 
 * This endpoint exactly matches the N8N Workflow 1 structure:
 * 1. Webhook (this endpoint) receives Google OAuth code
 * 2. HTTP Request node: POST to https://oauth2.googleapis.com/token (exchange code for tokens)
 * 3. HTTP Request1 node: GET to https://www.googleapis.com/oauth2/v2/userinfo (get user profile)
 * 4. Code node: Process and format user data
 * 5. Append row in sheet node: Save to 'AI Assistant Data Base' -> 'People Data' sheet
 * 
 * Request body from frontend:
 * {
 *   "code": "google_oauth_authorization_code",
 *   "state": "optional_state_parameter"
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
    const { code, state } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Prepare payload for N8N Workflow 1 - User Registration
    // This matches the exact structure expected by the N8N workflow
    const n8nPayload = {
      // Authorization code from Google OAuth callback
      code,
      // OAuth configuration for token exchange
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
      grant_type: 'authorization_code',
      // Additional metadata
      state,
      timestamp: new Date().toISOString(),
      // Google Sheets configuration for data storage
      spreadsheet_id: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      sheet_name: 'People Data' // As specified in N8N workflow
    };

    console.log('🚀 Triggering N8N Workflow 1 - User Registration:', {
      ...n8nPayload,
      client_secret: '[REDACTED]'
    });

    // Send to N8N webhook for Workflow 1
    const n8nResponse = await fetch(process.env.N8N_USER_REGISTRATION_WEBHOOK!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(n8nPayload)
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('❌ N8N user registration webhook failed:', {
        status: n8nResponse.status,
        statusText: n8nResponse.statusText,
        error: errorText
      });
      
      throw new Error(`N8N webhook failed: ${n8nResponse.status} ${n8nResponse.statusText}`);
    }

    const n8nResult = await n8nResponse.json();
    console.log('✅ N8N user registration workflow triggered successfully:', n8nResult);

    // Log the workflow trigger in database
    await prisma.workflowTrigger.create({
      data: {
        action: 'user-registration',
        scenarioName: 'N8N User Registration Workflow',
        userEmail: 'pending', // Will be updated by N8N workflow
        status: 'triggered',
        platform: 'web',
        workflowType: 'n8n',
        executionId: n8nResult.executionId || undefined,
        additionalData: JSON.stringify({
          hasCode: !!code,
          state,
          timestamp: new Date().toISOString()
        })
      }
    });

    return res.status(200).json({
      success: true,
      message: 'User registration workflow triggered successfully',
      executionId: n8nResult.executionId,
      data: n8nResult
    });

  } catch (error) {
    console.error('❌ N8N user registration error:', error);
    
    // Log error to database
    try {
      await prisma.workflowError.create({
        data: {
          action: 'user-registration',
          scenarioName: 'N8N User Registration Workflow',
          userEmail: 'unknown',
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