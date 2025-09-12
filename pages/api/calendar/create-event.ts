import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';

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

    const { eventId, calendarId } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    // Find the user and pending event
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email! }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const pendingEvent = await prisma.pendingEvent.findUnique({
      where: { id: eventId }
    });

    if (!pendingEvent) {
      return res.status(404).json({ error: 'Pending event not found' });
    }

    if (pendingEvent.status !== 'PENDING') {
      return res.status(400).json({ error: 'Event is not in pending status' });
    }

    // Check if we have access token
    if (!session.accessToken) {
      return res.status(400).json({ 
        error: 'No access token available. Please sign in again.' 
      });
    }

    // Initialize Google Calendar API
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: session.accessToken });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Prepare event data for Google Calendar
    const calendarEvent = {
      summary: pendingEvent.title,
      description: pendingEvent.description,
      start: {
        dateTime: pendingEvent.date.toISOString(),
        timeZone: 'UTC'
      },
      end: {
        dateTime: new Date(pendingEvent.date.getTime() + 60 * 60 * 1000).toISOString(), // Add 1 hour
        timeZone: 'UTC'
      },
      location: pendingEvent.location || undefined,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 } // 30 minutes before
        ]
      }
    };

    // Create event in Google Calendar
    const calendarResponse = await calendar.events.insert({
      calendarId: calendarId || 'primary',
      requestBody: calendarEvent
    });

    if (!calendarResponse.data.id) {
      throw new Error('Failed to create calendar event');
    }

    // Create calendar event record in database
    const createdEvent = await prisma.calendarEvent.create({
      data: {
        userId: user.id,
        title: pendingEvent.title,
        description: pendingEvent.description,
        startTime: pendingEvent.date,
        endTime: new Date(pendingEvent.date.getTime() + 60 * 60 * 1000), // Add 1 hour
        location: pendingEvent.location,
        googleEventId: calendarResponse.data.id,
        source: pendingEvent.source
      }
    });

    // Update pending event status to APPROVED
    await prisma.pendingEvent.update({
      where: { id: eventId },
      data: { status: 'APPROVED' }
    });

    // Log the user action
    await prisma.userLog.create({
      data: {
        userId: user.id,
        action: 'create_calendar_event',
        service: 'google_calendar',
        status: 'success',
        details: `Created calendar event: ${pendingEvent.title} (Event ID: ${createdEvent.id}, Google Event ID: ${calendarResponse.data.id}, Pending Event ID: ${eventId})`
      }
    });

    return res.status(200).json({
      message: 'Calendar event created successfully',
      event: createdEvent,
      googleEvent: {
        id: calendarResponse.data.id,
        htmlLink: calendarResponse.data.htmlLink
      }
    });

  } catch (error) {
    console.error('Error creating calendar event:', error);
    
    // Log the error
    try {
      const session = await getServerSession(req, res, authOptions);
      if (session?.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email }
        });
        if (user) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          await prisma.userLog.create({
            data: {
              userId: user.id,
              action: 'create_calendar_event',
              service: 'google_calendar',
              status: 'failed',
              details: `Failed to create calendar event: ${errorMessage}`,
              errorMessage: errorMessage
            }
          });
        }
      }
    } catch (logError) {
      console.error('Error logging failed calendar event creation:', logError);
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      error: 'Internal server error',
      message: errorMessage
    });
  }
}