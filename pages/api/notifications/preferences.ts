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
      include: { notificationPreferences: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.method === 'GET') {
      // Return notification preferences
      return res.status(200).json({
        preferences: user.notificationPreferences || {
          emailNotifications: true,
          whatsappNotifications: false,
          eventReminders: true,
          weeklyDigest: true,
          instantAlerts: false
        }
      });
    }

    if (req.method === 'PUT') {
      const {
        emailNotifications,
        whatsappNotifications,
        eventReminders,
        weeklyDigest,
        instantAlerts,
        whatsappNumber
      } = req.body;

      // Update or create notification preferences
      const updatedPreferences = await prisma.notificationPreferences.upsert({
        where: { userId: user.id },
        update: {
          emailNotifications: emailNotifications ?? true,
          whatsappNotifications: whatsappNotifications ?? false,
          eventReminders: eventReminders ?? true,
          weeklyDigest: weeklyDigest ?? true,
          instantAlerts: instantAlerts ?? false,
          whatsappNumber: whatsappNumber || null
        },
        create: {
          userId: user.id,
          emailNotifications: emailNotifications ?? true,
          whatsappNotifications: whatsappNotifications ?? false,
          eventReminders: eventReminders ?? true,
          weeklyDigest: weeklyDigest ?? true,
          instantAlerts: instantAlerts ?? false,
          whatsappNumber: whatsappNumber || null
        }
      });

      // Log the user action
      await prisma.userLog.create({
        data: {
          userId: user.id,
          action: 'update_notification_preferences',
          service: 'notifications',
          status: 'success',
          details: 'Notification preferences updated successfully'
        }
      });

      return res.status(200).json({
        message: 'Notification preferences updated successfully',
        preferences: updatedPreferences
      });
    }

    if (req.method === 'POST' && req.query.action === 'test') {
      // Test notification endpoint
      const { type } = req.body; // 'email' or 'whatsapp'
      
      if (type === 'email') {
        // Here you would integrate with your email service
        // For now, we'll just log it
        await prisma.userLog.create({
          data: {
            userId: user.id,
            action: 'test_email_notification',
            service: 'email',
            status: 'success',
            details: `Test email sent to ${user.email}`
          }
        });
        
        return res.status(200).json({
          message: 'Test email notification sent successfully'
        });
      }
      
      if (type === 'whatsapp') {
        const preferences = user.notificationPreferences;
        if (!preferences?.whatsappNumber) {
          return res.status(400).json({
            error: 'WhatsApp number not configured'
          });
        }
        
        // Here you would integrate with WhatsApp API
        // For now, we'll just log it
        await prisma.userLog.create({
          data: {
            userId: user.id,
            action: 'test_whatsapp_notification',
            service: 'whatsapp',
            status: 'success',
            details: `Test WhatsApp message sent to ${preferences.whatsappNumber}`
          }
        });
        
        return res.status(200).json({
          message: 'Test WhatsApp notification sent successfully'
        });
      }
      
      return res.status(400).json({ error: 'Invalid notification type' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling notification preferences:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      error: 'Internal server error',
      message: errorMessage
    });
  }
}