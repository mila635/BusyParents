import type { NextApiRequest, NextApiResponse } from 'next';
import { addPendingEvent } from '../../lib/shared-state';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const newEvent = {
      id: uuidv4(), // Generate a unique ID
      title: 'New Test Event',
      description: 'This is a test event to check the live dashboard functionality.',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      location: 'Test Location',
      source: 'Test',
      confidenceScore: 0.75,
      extractedFrom: 'test_data',
      createdAt: new Date().toISOString(),
    };

    try {
      await addPendingEvent(newEvent);
      res.status(200).json({ message: 'Test event added successfully' });
    } catch (error) {
      console.error('API Error adding test event:', error);
      res.status(500).json({ error: 'Failed to add test event' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}