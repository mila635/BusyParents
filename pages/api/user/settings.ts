import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email! },
      include: { settings: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.method === 'GET') {
      // Return user settings
      return res.status(200).json({
        settings: user.settings || {
          emailProcessingEnabled: true,
          calendarSyncEnabled: true,
          reminderEnabled: true,
          timezone: 'UTC'
        }
      });
    }

    if (req.method === 'PUT') {
      const {
        emailProcessingEnabled,
        calendarSyncEnabled,
        reminderEnabled,
        timezone
      } = req.body;

      // Update or create user settings
      const updatedSettings = await prisma.userSettings.upsert({
        where: { userId: user.id },
        update: {
          emailProcessingEnabled: emailProcessingEnabled ?? true,
          calendarSyncEnabled: calendarSyncEnabled ?? true,
          reminderEnabled: reminderEnabled ?? true,
          timezone: timezone ?? 'UTC'
        },
        create: {
          userId: user.id,
          emailProcessingEnabled: emailProcessingEnabled ?? true,
          calendarSyncEnabled: calendarSyncEnabled ?? true,
          reminderEnabled: reminderEnabled ?? true,
          timezone: timezone ?? 'UTC'
        }
      });

      // Log the user action
      await prisma.userLog.create({
        data: {
          userId: user.id,
          action: 'update_settings',
          service: 'user_settings',
          status: 'success',
          details: 'User settings updated successfully'
        }
      });

      return res.status(200).json({
        message: 'Settings updated successfully',
        settings: updatedSettings
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling user settings:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      error: 'Internal server error',
      message: errorMessage
    });
  }
}