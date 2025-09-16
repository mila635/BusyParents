import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Find the user
      const user = await prisma.user.findUnique({
        where: { email: session.user?.email! },
        include: { notificationPreferences: true }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({
        success: true,
        preferences: user.notificationPreferences || {
          emailNotifications: true,
          whatsappNotifications: false,
          eventReminders: true,
          weeklyDigest: true,
          instantAlerts: false,
          whatsappNumber: null,
          reminderDuration: 15
        }
      });
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const {
        emailNotifications,
        whatsappNotifications,
        eventReminders,
        weeklyDigest,
        instantAlerts,
        whatsappNumber,
        reminderDuration
      } = req.body;

      // Find the user
      const user = await prisma.user.findUnique({
        where: { email: session.user?.email! }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update or create notification preferences
      const preferences = await prisma.notificationPreferences.upsert({
        where: { userId: user.id },
        update: {
          emailNotifications: emailNotifications ?? true,
          whatsappNotifications: whatsappNotifications ?? false,
          eventReminders: eventReminders ?? true,
          weeklyDigest: weeklyDigest ?? true,
          instantAlerts: instantAlerts ?? false,
          whatsappNumber: whatsappNumber || null,
          reminderDuration: reminderDuration ?? 15
        },
        create: {
          userId: user.id,
          emailNotifications: emailNotifications ?? true,
          whatsappNotifications: whatsappNotifications ?? false,
          eventReminders: eventReminders ?? true,
          weeklyDigest: weeklyDigest ?? true,
          instantAlerts: instantAlerts ?? false,
          whatsappNumber: whatsappNumber || null,
          reminderDuration: reminderDuration ?? 15
        }
      });

      // Log the user action
      await prisma.userLog.create({
        data: {
          userId: user.id,
          action: 'update_notification_settings',
          service: 'settings',
          status: 'success',
          details: 'Updated notification preferences'
        }
      });

      return res.status(200).json({
        success: true,
        message: 'Notification settings updated successfully',
        preferences
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}