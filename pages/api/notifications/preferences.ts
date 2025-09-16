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
      const preferences = user.notificationPreferences || {
        emailNotifications: true,
        whatsappNotifications: false,
        whatsappNumber: '',
        reminderDuration: 30
      };

      return res.status(200).json({
        emailAlerts: preferences.emailNotifications,
        whatsappAlerts: preferences.whatsappNotifications,
        emailAddress: session.user?.email || '',
        whatsappNumber: preferences.whatsappNumber || '',
        reminderTiming: preferences.reminderDuration || 30
      });
    }

    if (req.method === 'POST') {
      const { action } = req.query;
      
      // Handle test notifications
      if (action === 'test') {
        const { type, number } = req.body;
        
        if (type === 'whatsapp') {
          if (!number) {
            return res.status(400).json({ error: 'WhatsApp number is required' });
          }
          
          // Here you would integrate with WhatsApp API
          // For now, we'll simulate a successful test
          console.log(`Test WhatsApp message would be sent to: ${number}`);
          
          return res.status(200).json({ 
            success: true, 
            message: 'Test WhatsApp message sent successfully!' 
          });
        }
        
        if (type === 'email') {
          // Here you would integrate with email service
          // For now, we'll simulate a successful test
          console.log(`Test email would be sent to: ${session.user?.email}`);
          
          return res.status(200).json({ 
            success: true, 
            message: 'Test email sent successfully!' 
          });
        }
        
        return res.status(400).json({ error: 'Invalid test type' });
      }
      
      // Handle saving preferences
      const {
        emailAlerts,
        whatsappAlerts,
        emailAddress,
        whatsappNumber,
        reminderTiming
      } = req.body;

      // Update or create notification preferences
      const updatedPreferences = await prisma.notificationPreferences.upsert({
        where: { userId: user.id },
        update: {
          emailNotifications: emailAlerts ?? true,
          whatsappNotifications: whatsappAlerts ?? false,
          whatsappNumber: whatsappNumber || null,
          reminderDuration: reminderTiming ?? 30,
          eventReminders: true,
          weeklyDigest: true,
          instantAlerts: false
        },
        create: {
          userId: user.id,
          emailNotifications: emailAlerts ?? true,
          whatsappNotifications: whatsappAlerts ?? false,
          whatsappNumber: whatsappNumber || null,
          reminderDuration: reminderTiming ?? 30,
          eventReminders: true,
          weeklyDigest: true,
          instantAlerts: false
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
        success: true,
        message: 'Notification preferences saved successfully',
        preferences: updatedPreferences
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling notification preferences:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      error: 'Internal server error',
      message: errorMessage
    });
  } finally {
    await prisma.$disconnect();
  }
}