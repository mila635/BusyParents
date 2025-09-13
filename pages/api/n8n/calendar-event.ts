import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/database';

/**
 * N8N Workflow 2: HTTP Request3 Node Handler - Google Calendar Event Creation
 * 
 * This endpoint is specifically called by the HTTP Request3 node in N8N Workflow 2.
 * It receives formatted event data and creates Google Calendar events via the Google Calendar API.
 * 
 * N8N Workflow 2 sequence leading to this endpoint:
 * 1. Basic LLM Chain1 node: Extracts event details (event, date, time, location, notes) from email
 * 2. Code1 node: Formats date/time into machine-readable format for Google Calendar API
 * 3. HTTP Request3 node: POST request to this endpoint with formatted event data
 * 4. This endpoint: Creates Google Calendar event and logs to 'Email Log' sheet
 * 
 * Request body from N8N HTTP Request3 node:
 * {
 *   "user_id": "google_user_id",
 *   "access_token": "google_access_token",
 *   "gmail_refresh_token": "google_refresh_token",
 *   "summary": "Event title from LLM extraction",
 *   "description": "Event description and notes",
 *   "location": "Event location",
 *   "start": { "dateTime": "2024-01-15T10:00:00Z", "timeZone": "UTC" },
 *   "end": { "dateTime": "2024-01-15T11:00:00Z", "timeZone": "UTC" },
 *   "email_id": "gmail_message_id",
 *   "email_subject": "original_email_subject"
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
      userEmail,
      accessToken,
      calendarId = 'primary',
      eventDetails,
      emailData,
      // Additional N8N workflow context
      workflowExecutionId,
      nodeExecutionId
    } = req.body;

    // Validate required fields from N8N workflow
    if (!userEmail || !accessToken || !eventDetails) {
      return res.status(400).json({ 
        error: 'Missing required fields: userEmail, accessToken, and eventDetails are required' 
      });
    }

    const {
      event: summary,
      date,
      time,
      location,
      notes: description
    } = eventDetails;

    // Format date and time for Google Calendar API (matching Code1 node logic)
    const startDateTime = time ? `${date}T${time}:00` : `${date}T09:00:00`;
    const endDateTime = time ? `${date}T${time.split(':')[0]}:${String(parseInt(time.split(':')[1]) + 60).padStart(2, '0')}:00` : `${date}T10:00:00`;

    // Create Google Calendar event (matching HTTP Request3 node)
    const calendarEvent = {
      summary,
      description,
      location,
      start: {
        dateTime: startDateTime,
        timeZone: 'America/New_York' // Default timezone
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'America/New_York'
      }
    };

    console.log('📅 Creating Google Calendar event:', {
      userEmail,
      summary,
      startDateTime,
      endDateTime,
      location
    });

    // Call Google Calendar API
    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(calendarEvent)
      }
    );

    if (!calendarResponse.ok) {
      const errorData = await calendarResponse.text();
      console.error('❌ Google Calendar API error:', errorData);
      
      // Log error to database
      await prisma.workflowTrigger.create({
        data: {
          action: 'calendar_event_error',
          userEmail,
          status: 'error',
          additionalData: JSON.stringify({ 
            error: `Calendar API Error: ${errorData}`,
            eventDetails, 
            calendarEvent 
          })
        }
      });
      
      return res.status(500).json({ 
        error: 'Failed to create calendar event',
        details: errorData
      });
    }

    const createdEvent = await calendarResponse.json();
    
    console.log('✅ Calendar event created successfully:', {
      eventId: createdEvent.id,
      htmlLink: createdEvent.htmlLink
    });

    // Log successful event creation to database
    await prisma.calendarEvent.create({
      data: {
        userId: '', // We need to get this from session or request
        googleEventId: createdEvent.id,
        title: summary,
        description: description || '',
        startTime: new Date(startDateTime),
        endTime: new Date(endDateTime),
        location: location || '',
        source: 'n8n_workflow'
      }
    });

    // Log workflow trigger
    await prisma.workflowTrigger.create({
      data: {
        action: 'calendar_event_created',
        userEmail,
        status: 'success',
        additionalData: JSON.stringify({
          eventId: createdEvent.id,
          htmlLink: createdEvent.htmlLink,
          summary,
          eventDetails,
          emailData
        })
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Calendar event created successfully',
      event: {
        id: createdEvent.id,
        summary,
        startDateTime,
        endDateTime,
        location,
        htmlLink: createdEvent.htmlLink
      }
    });

  } catch (error) {
    console.error('❌ Calendar event creation error:', error);
    
    // Log error to database
    try {
      await prisma.workflowTrigger.create({
        data: {
          action: 'calendar_event_error',
          userEmail: req.body.userEmail || 'unknown',
          status: 'error',
          additionalData: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error',
            requestBody: req.body
          })
        }
      });
    } catch (dbError) {
      console.error('❌ Database logging error:', dbError);
    }
    
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}