// // // This is a dummy data store to simulate a database
// // let dummyPendingEvents = [
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

// // export async function getPendingEvents() {
// //   // In a real app, this would query your database
// //   return dummyPendingEvents;
// // }

// // export async function approvePendingEvent(id: string) {
// //   const eventToApprove = dummyPendingEvents.find(event => event.id === id);
// //   if (eventToApprove) {
// //     dummyPendingEvents = dummyPendingEvents.filter(event => event.id !== id);
// //     // In a real app, you would save this to your "approved events" table
// //     console.log(`Event ${id} approved`);
// //     return eventToApprove;
// //   }
// //   throw new Error('Event not found');
// // }

// // export async function rejectPendingEvent(id: string) {
// //   const eventToReject = dummyPendingEvents.find(event => event.id === id);
// //   if (eventToReject) {
// //     dummyPendingEvents = dummyPendingEvents.filter(event => event.id !== id);
// //     // In a real app, you might archive or delete this
// //     console.log(`Event ${id} rejected`);
// //     return true;
// //   }
// //   throw new Error('Event not found');
// // }

// // export async function updatePendingEvent(id: string, updatedData: any) {
// //   const eventIndex = dummyPendingEvents.findIndex(event => event.id === id);
// //   if (eventIndex !== -1) {
// //     const updatedEvent = { ...dummyPendingEvents[eventIndex], ...updatedData };
// //     dummyPendingEvents[eventIndex] = updatedEvent;
// //     console.log(`Event ${id} updated`);
// //     return updatedEvent;
// //   }
// //   throw new Error('Event not found');
// // }


// import { promises as fs } from 'fs';
// import path from 'path';

// const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'pending-events.json');

// // Ensure the data directory exists
// const ensureDataDirectory = async () => {
//   const dataDir = path.dirname(DATA_FILE_PATH);
//   try {
//     await fs.mkdir(dataDir, { recursive: true });
//   } catch (error) {
//     console.error('Error ensuring data directory exists:', error);
//   }
// };

// // Dummy event type for reference
// interface PendingEvent {
//   id: string
//   title: string
//   description: string
//   startDate: string
//   endDate: string
//   location?: string
//   source: string
//   confidenceScore: number
//   extractedFrom: string
//   createdAt: string
// }

// // Function to read all pending events from the file
// export async function getPendingEvents() {
//   try {
//     await ensureDataDirectory();
//     const fileContents = await fs.readFile(DATA_FILE_PATH, 'utf-8');
//     return JSON.parse(fileContents);
//   } catch (error: any) {
//     if (error.code === 'ENOENT') {
//       // File doesn't exist, return empty array
//       return [];
//     }
//     console.error('Error reading pending events file:', error);
//     return [];
//   }
// }

// // Function to add a new pending event
// export async function addPendingEvent(event: PendingEvent) {
//   const events = await getPendingEvents();
//   events.push(event);
//   await fs.writeFile(DATA_FILE_PATH, JSON.stringify(events, null, 2));
//   return event;
// }

// // Function to update an existing pending event
// export async function updatePendingEvent(id: string, updatedData: Partial<PendingEvent>) {
//   const events = await getPendingEvents();
//   const eventIndex = events.findIndex((e: PendingEvent) => e.id === id);

//   if (eventIndex === -1) {
//     throw new Error('Event not found');
//   }

//   const updatedEvent = { ...events[eventIndex], ...updatedData };
//   events[eventIndex] = updatedEvent;
//   await fs.writeFile(DATA_FILE_PATH, JSON.stringify(events, null, 2));
//   return updatedEvent;
// }

// // Function to approve and remove an event
// export async function approvePendingEvent(id: string) {
//   const events = await getPendingEvents();
//   const eventToApprove = events.find((e: PendingEvent) => e.id === id);

//   if (!eventToApprove) {
//     throw new Error('Event not found');
//   }
  
//   const updatedEvents = events.filter((e: PendingEvent) => e.id !== id);
//   await fs.writeFile(DATA_FILE_PATH, JSON.stringify(updatedEvents, null, 2));

//   // In a real application, you would also save to the approved events list
//   return eventToApprove;
// }

// // Function to reject and remove an event
// export async function rejectPendingEvent(id: string) {
//   const events = await getPendingEvents();
//   const updatedEvents = events.filter((e: PendingEvent) => e.id !== id);
//   await fs.writeFile(DATA_FILE_PATH, JSON.stringify(updatedEvents, null, 2));
// }

// // You can add your stats logic here as well
// export async function getDashboardStats() {
//   return {
//     emailsProcessed: 0,
//     eventsCreated: 0,
//     timeSaved: 0
//   };
// }