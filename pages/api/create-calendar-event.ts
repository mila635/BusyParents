import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteEvent } from '@/lib/shared-state';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id, title, description, date, time, location } = req.body;
    
    if (!id || !title || !date) {
      return res.status(400).json({ error: 'Missing required event fields.' });
    }

    try {
      // Simulate calling the Google Calendar API
      console.log(`Simulating event creation for: ${title}`);
      // In a real scenario, you would use a library to create the event here
      const calendarEvent = {
        summary: title,
        description: description,
        start: {
          dateTime: `${date}T${time}:00Z`,
          timeZone: 'UTC', // or user's time zone
        },
        end: {
          dateTime: `${date}T${time}:00Z`,
          timeZone: 'UTC',
        },
        location: location,
      };

      // After successful calendar creation, delete the pending event from our state
      await deleteEvent(id);
      
      res.status(200).json({ 
        message: 'Event successfully created and removed from pending list.', 
        calendarEvent 
      });
    } catch (error) {
      console.error('API Error creating calendar event:', error);
      res.status(500).json({ error: 'Failed to create calendar event.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
