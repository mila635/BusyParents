// // // This file simulates a live API endpoint to get pending events.
// // // In a real application, this would fetch data from your database.

// // import type { NextApiRequest, NextApiResponse } from 'next';

// // // Dummy data to simulate pending events from a database
// // let DUMMY_PENDING_EVENTS = [
// //   {
// //     id: 'event_001',
// //     title: 'School Play Auditions',
// //     description: 'Auditions for the annual school play. All students are welcome to participate.',
// //     startDate: new Date('2025-09-15T10:00:00').toISOString(),
// //     endDate: new Date('2025-09-15T12:00:00').toISOString(),
// //     location: 'School Auditorium',
// //     source: 'Gmail',
// //     confidenceScore: 0.95,
// //     extractedFrom: 'email_123',
// //     createdAt: new Date('2025-09-04T10:00:00').toISOString(),
// //   },
// //   {
// //     id: 'event_002',
// //     title: 'Parent-Teacher Conference',
// //     description: 'Schedule a time to meet with your child\'s teachers to discuss their progress.',
// //     startDate: new Date('2025-10-01T08:00:00').toISOString(),
// //     endDate: new Date('2025-10-01T17:00:00').toISOString(),
// //     location: 'Online via Google Meet',
// //     source: 'Gmail',
// //     confidenceScore: 0.88,
// //     extractedFrom: 'email_124',
// //     createdAt: new Date('2025-09-04T10:05:00').toISOString(),
// //   },
// // ];

// // export default function handler(req: NextApiRequest, res: NextApiResponse) {
// //   if (req.method === 'GET') {
// //     // Return the pending events list
// //     res.status(200).json(DUMMY_PENDING_EVENTS);
// //   } else {
// //     res.setHeader('Allow', ['GET']);
// //     res.status(405).end(`Method ${req.method} Not Allowed`);
// //   }
// // }


// import type { NextApiRequest, NextApiResponse } from 'next';
// import { getEvents } from '../../../lib/shared-state';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'GET') {
//     try {
//       const pendingEvents = await getEvents();
//       res.status(200).json(pendingEvents);
//     } catch (error) {
//       console.error('API Error fetching pending events:', error);
//       res.status(500).json({ error: 'Failed to fetch pending events' });
//     }
//   } else {
//     res.setHeader('Allow', ['GET']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }