// // // A single in-memory data store to manage pending events.
// // // This is a simple solution for demonstration and can be replaced with a database later.

// // import { promises as fs } from 'fs';
// // import path from 'path';

// // const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'pending-events.json');

// // // Ensure the data directory exists
// // const ensureDataDirectory = async () => {
// //   const dataDir = path.dirname(DATA_FILE_PATH);
// //   try {
// //     await fs.mkdir(dataDir, { recursive: true });
// //   } catch (error) {
// //     console.error('Error ensuring data directory exists:', error);
// //   }
// // };

// // // Interface for pending events
// // export interface PendingEvent {
// //   id: string
// //   title: string
// //   description: string
// //   startDate: string
// //   endDate: string
// //   location?: string
// //   source: string
// //   confidenceScore: number
// //   extractedFrom: string
// //   createdAt: string
// // }

// // export const getEvents = async (): Promise<PendingEvent[]> => {
// //   try {
// //     await ensureDataDirectory();
// //     const fileContents = await fs.readFile(DATA_FILE_PATH, 'utf-8');
// //     return JSON.parse(fileContents);
// //   } catch (error: any) {
// //     if (error.code === 'ENOENT') {
// //       return []; // File does not exist, so the list is empty
// //     }
// //     console.error('Error reading pending events file:', error);
// //     return [];
// //   }
// // };

// // export const saveEvents = async (events: PendingEvent[]): Promise<void> => {
// //   await ensureDataDirectory();
// //   await fs.writeFile(DATA_FILE_PATH, JSON.stringify(events, null, 2), 'utf-8');
// // };





// // // A single in-memory data store to manage pending events.
// // // This is a simple solution for demonstration and can be replaced with a database later.

// // import { promises as fs } from 'fs';
// // import path from 'path';

// // const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'pending-events.json');

// // // Ensure the data directory exists
// // const ensureDataDirectory = async () => {
// //   const dataDir = path.dirname(DATA_FILE_PATH);
// //   try {
// //     await fs.mkdir(dataDir, { recursive: true });
// //   } catch (error) {
// //     console.error('Error ensuring data directory exists:', error);
// //   }
// // };

// // // Interface for pending events
// // export interface PendingEvent {
// //   id: string
// //   title: string
// //   description: string
// //   startDate: string
// //   endDate: string
// //   location?: string
// //   source: string
// //   confidenceScore: number
// //   extractedFrom: string
// //   createdAt: string
// // }

// // export const getEvents = async (): Promise<PendingEvent[]> => {
// //   try {
// //     await ensureDataDirectory();
// //     const fileContents = await fs.readFile(DATA_FILE_PATH, 'utf-8');
// //     return JSON.parse(fileContents);
// //   } catch (error: any) {
// //     if (error.code === 'ENOENT') {
// //       return []; // File does not exist, so the list is empty
// //     }
// //     console.error('Error reading pending events file:', error);
// //     return [];
// //   }
// // };

// // export const saveEvents = async (events: PendingEvent[]): Promise<void> => {
// //   await ensureDataDirectory();
// //   await fs.writeFile(DATA_FILE_PATH, JSON.stringify(events, null, 2), 'utf-8');
// // };

// // // This is the missing function. It gets existing events, adds the new one, and saves the list.
// // export const addPendingEvent = async (event: PendingEvent): Promise<void> => {
// //   const events = await getEvents();
// //   events.push(event);
// //   await saveEvents(events);
// // };


// import { v4 as uuidv4 } from 'uuid';

// // Interface for pending events
// export interface PendingEvent {
//   id: string;
//   title: string;
//   description: string;
//   date: string;
//   time: string;
//   location?: string;
//   confidence: number;
//   source: string; // email subject or source
//   originalEmail: string;
// }

// // Simple in-memory storage for pending events
// // In a production app, this would be replaced with a database like Firestore,
// // as in-memory storage resets on every server restart.
// let pendingEvents: PendingEvent[] = [];

// export async function getEvents(): Promise<PendingEvent[]> {
//   // Simulate a delay for a database fetch
//   return pendingEvents;
// }

// export async function addPendingEvent(event: Omit<PendingEvent, 'id'>): Promise<PendingEvent> {
//   const newEvent: PendingEvent = {
//     ...event,
//     id: uuidv4(),
//   };
//   pendingEvents.push(newEvent);
//   return newEvent;
// }

// export async function updateEvent(eventId: string, updatedData: Partial<PendingEvent>): Promise<PendingEvent | null> {
//   const eventIndex = pendingEvents.findIndex(event => event.id === eventId);
//   if (eventIndex === -1) {
//     return null;
//   }
//   const updatedEvent = { ...pendingEvents[eventIndex], ...updatedData };
//   pendingEvents[eventIndex] = updatedEvent;
//   return updatedEvent;
// }

// export async function deleteEvent(eventId: string): Promise<boolean> {
//   const initialLength = pendingEvents.length;
//   pendingEvents = pendingEvents.filter(event => event.id !== eventId);
//   return pendingEvents.length < initialLength;
// }


// pages/api/events/[eventId]/reject.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { eventId } = req.query;

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (!eventId || typeof eventId !== "string") {
    return res.status(400).json({ error: "Invalid eventId" });
  }

  try {
    const updatedEvent = await prisma.pendingEvent.update({
      where: { id: eventId },
      data: {
        status: "rejected",
      },
    });

    res.status(200).json({ message: "Event rejected", event: updatedEvent });
  } catch (error) {
    console.error("Reject event error:", error);
    res.status(500).json({ error: "Failed to reject event" });
  }
}
