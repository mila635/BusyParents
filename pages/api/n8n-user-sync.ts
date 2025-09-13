import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { prisma } from '../../lib/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      name,
      email,
      access_token,
      refresh_token,
      calendar_id,
      phone_number
    } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find existing record or create new one
    const userId = (session.user as any).id || session.userId || '';
    const existingRecord = await prisma.n8NUserData.findFirst({
      where: {
        userId,
        email,
      },
    });

    let n8nUserData;
    if (existingRecord) {
      // Update existing record
      n8nUserData = await prisma.n8NUserData.update({
        where: { id: existingRecord.id },
        data: {
          name,
          accessToken: access_token,
          gmailRefreshToken: refresh_token,
          calendarId: calendar_id,
          phoneNumber: phone_number,
          lastSyncedAt: new Date(),
          updatedAt: new Date()
        }
      });
    } else {
      // Create new record
       n8nUserData = await prisma.n8NUserData.create({
         data: {
           userId,
          name,
          email,
          accessToken: access_token,
          gmailRefreshToken: refresh_token,
          calendarId: calendar_id,
          phoneNumber: phone_number,
          lastSyncedAt: new Date()
        }
      });
    }

    // Log the sync action
    await prisma.workflowTrigger.create({
      data: {
        action: 'n8n-user-sync',
        scenarioName: 'N8N User Data Sync',
        userEmail: session.user.email,
        userId,
        status: 'success',
        platform: 'n8n',
        workflowType: 'n8n',
        additionalData: JSON.stringify({
          syncedFields: Object.keys(req.body),
          timestamp: new Date().toISOString()
        })
      }
    });

    console.log('✅ N8N user data synced successfully for:', email);
    
    return res.status(200).json({ 
      success: true, 
      message: 'User data synced successfully',
      data: n8nUserData
    });

  } catch (error) {
    console.error('❌ N8N user sync error:', error);
    
    // Log the error
    try {
      const session = await getServerSession(req, res, authOptions);
      if (session?.user?.email) {
        await prisma.workflowError.create({
          data: {
            action: 'n8n-user-sync',
            scenarioName: 'N8N User Data Sync',
            userEmail: session.user.email,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        });
      }
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}