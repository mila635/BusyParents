// // This file simulates an API endpoint for updating an event.

// import type { NextApiRequest, NextApiResponse } from 'next';

// // Dummy data store (to be moved to a shared file in a real app)
// let DUMMY_PENDING_EVENTS = [
//   {
//     id: 'event_001',
//     title: 'School Play Auditions',
//     description: 'Auditions for the annual school play. All students are welcome to participate.',
//     startDate: new Date('2025-09-15T10:00:00').toISOString(),
//     endDate: new Date('2025-09-15T12:00:00').toISOString(),
//     location: 'School Auditorium',
//     source: 'Gmail',
//     confidenceScore: 0.95,
//     extractedFrom: 'email_123',
//     createdAt: new Date('2025-09-04T10:00:00').toISOString(),
//   },
//   {
//     id: 'event_002',
//     title: 'Parent-Teacher Conference',
//     description: 'Schedule a time to meet with your child\'s teachers to discuss their progress.',
//     startDate: new Date('2025-10-01T08:00:00').toISOString(),
//     endDate: new Date('2025-10-01T17:00:00').toISOString(),
//     location: 'Online via Google Meet',
//     source: 'Gmail',
//     confidenceScore: 0.88,
//     extractedFrom: 'email_124',
//     createdAt: new Date('2025-09-04T10:05:00').toISOString(),
//   },
// ];

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { eventId } = req.query;

//   if (req.method === 'PUT') {
//     const updatedData = req.body;
//     const eventIndex = DUMMY_PENDING_EVENTS.findIndex(event => event.id === eventId);
    
//     if (eventIndex === -1) {
//       return res.status(404).json({ error: 'Event not found' });
//     }

//     const updatedEvent = { ...DUMMY_PENDING_EVENTS[eventIndex], ...updatedData };
//     DUMMY_PENDING_EVENTS[eventIndex] = updatedEvent;

//     res.status(200).json(updatedEvent);
//   } else {
//     res.setHeader('Allow', ['PUT']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

import type { NextApiRequest, NextApiResponse } from 'next';
import { getEvents, saveEvents } from '../../../lib/shared-state';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { eventId } = req.query;
  const updatedData = req.body;

  if (req.method === 'PUT') {
    try {
      const events = await getEvents();
      const eventIndex = events.findIndex(event => event.id === eventId);
      
      if (eventIndex === -1) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const updatedEvent = { ...events[eventIndex], ...updatedData };
      events[eventIndex] = updatedEvent;
      await saveEvents(events);

      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error('API Error updating event:', error);
      res.status(500).json({ error: 'Failed to update event' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}