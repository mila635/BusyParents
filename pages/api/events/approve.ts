import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    // Find or create the user
    let user = await prisma.user.findUnique({
      where: { email: session.user?.email! }
    });

    if (!user) {
      // Create user if they don't exist
      user = await prisma.user.create({
        data: {
          email: session.user?.email!,
          name: session.user?.name || null,
          image: session.user?.image || null,
          provider: 'google',
          role: 'PARENT',
          isActive: true,
          lastLoginAt: new Date()
        }
      });
      console.log('✅ Created new user during event approval:', user.email);
    }

    // Find and update the pending event
    const pendingEvent = await prisma.pendingEvent.findFirst({
      where: {
        id: eventId,
        userId: user.id,
        status: 'PENDING'
      }
    });

    if (!pendingEvent) {
      return res.status(404).json({ error: 'Pending event not found' });
    }

    // Update the event status to APPROVED
    const updatedEvent = await prisma.pendingEvent.update({
      where: { id: eventId },
      data: { status: 'APPROVED' }
    });

    // Create a calendar event
    const calendarEvent = await prisma.calendarEvent.create({
      data: {
        userId: user.id,
        title: pendingEvent.title,
        description: pendingEvent.description,
        startTime: pendingEvent.date,
        endTime: new Date(pendingEvent.date.getTime() + 60 * 60 * 1000), // 1 hour duration
        location: pendingEvent.location,
        source: pendingEvent.source
      }
    });

    // Log the user action
    await prisma.userLog.create({
      data: {
        userId: user.id,
        action: 'approve_event',
        service: 'calendar',
        status: 'success',
        details: `Approved event: ${pendingEvent.title}`
      }
    });

    return res.status(200).json({
      message: 'Event approved successfully',
      pendingEvent: updatedEvent,
      calendarEvent
    });
  } catch (error) {
    console.error('Error approving event:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      error: 'Internal server error',
      message: errorMessage
    });
  }
}