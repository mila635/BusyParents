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

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email! }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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

    // Update the event status to REJECTED
    const updatedEvent = await prisma.pendingEvent.update({
      where: { id: eventId },
      data: { status: 'REJECTED' }
    });

    // Log the user action
    await prisma.userLog.create({
      data: {
        userId: user.id,
        action: 'reject_event',
        service: 'calendar',
        status: 'success',
        details: `Rejected event: ${pendingEvent.title}`
      }
    });

    return res.status(200).json({
      message: 'Event rejected successfully',
      pendingEvent: updatedEvent
    });
  } catch (error) {
    console.error('Error rejecting event:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      error: 'Internal server error',
      message: errorMessage
    });
  }
}