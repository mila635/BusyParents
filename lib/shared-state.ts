// // A single in-memory data store to manage pending events.
// // This is a simple solution for demonstration and can be replaced with a database later.

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

// // Interface for pending events
// export interface PendingEvent {
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

// export const getEvents = async (): Promise<PendingEvent[]> => {
//   try {
//     await ensureDataDirectory();
//     const fileContents = await fs.readFile(DATA_FILE_PATH, 'utf-8');
//     return JSON.parse(fileContents);
//   } catch (error: any) {
//     if (error.code === 'ENOENT') {
//       return []; // File does not exist, so the list is empty
//     }
//     console.error('Error reading pending events file:', error);
//     return [];
//   }
// };

// export const saveEvents = async (events: PendingEvent[]): Promise<void> => {
//   await ensureDataDirectory();
//   await fs.writeFile(DATA_FILE_PATH, JSON.stringify(events, null, 2), 'utf-8');
// };





// A single in-memory data store to manage pending events.
// This is a simple solution for demonstration and can be replaced with a database later.

import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'pending-events.json');

// Ensure the data directory exists
const ensureDataDirectory = async () => {
  const dataDir = path.dirname(DATA_FILE_PATH);
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    console.error('Error ensuring data directory exists:', error);
  }
};

// Interface for pending events
export interface PendingEvent {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location?: string
  source: string
  confidenceScore: number
  extractedFrom: string
  createdAt: string
}

export const getEvents = async (): Promise<PendingEvent[]> => {
  try {
    await ensureDataDirectory();
    const fileContents = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(fileContents);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return []; // File does not exist, so the list is empty
    }
    console.error('Error reading pending events file:', error);
    return [];
  }
};

export const saveEvents = async (events: PendingEvent[]): Promise<void> => {
  await ensureDataDirectory();
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(events, null, 2), 'utf-8');
};

// This is the missing function. It gets existing events, adds the new one, and saves the list.
export const addPendingEvent = async (event: PendingEvent): Promise<void> => {
  const events = await getEvents();
  events.push(event);
  await saveEvents(events);
};
