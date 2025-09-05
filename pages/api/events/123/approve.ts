// // This file simulates an API endpoint for approving an event.

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
  
//   if (req.method === 'POST') {
//     // Filter out the approved event
//     const eventToApprove = DUMMY_PENDING_EVENTS.find(event => event.id === eventId);
//     DUMMY_PENDING_EVENTS = DUMMY_PENDING_EVENTS.filter(event => event.id !== eventId);
    
//     if (!eventToApprove) {
//       return res.status(404).json({ error: 'Event not found' });
//     }

//     // Simulate creation of the event in Google Calendar
//     console.log(`Event ${eventId} approved and added to calendar.`);
    
//     res.status(200).json({ message: 'Event approved successfully', event: eventToApprove });
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

import type { NextApiRequest, NextApiResponse } from 'next';
import { getEvents, saveEvents } from '../../../../lib/shared-state';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { eventId } = req.query;

  if (req.method === 'POST') {
    try {
      const events = await getEvents();
      const eventToApprove = events.find(event => event.id === eventId);
      
      if (!eventToApprove) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const updatedEvents = events.filter(event => event.id !== eventId);
      await saveEvents(updatedEvents);
      
      res.status(200).json({ message: 'Event approved successfully', event: eventToApprove });
    } catch (error) {
      console.error('API Error approving event:', error);
      res.status(500).json({ error: 'Failed to approve event' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}