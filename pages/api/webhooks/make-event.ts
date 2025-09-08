import type { NextApiRequest, NextApiResponse } from 'next';
import { addPendingEvent } from '@/lib/shared-state';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, description, date, time, location, confidence, source, originalEmail } = req.body;

    // Validate incoming data
    if (!title || !description || !date || !time || !confidence || !source || !originalEmail) {
      return res.status(400).json({ error: 'Missing required fields from webhook payload.' });
    }

    const newEvent = {
      title,
      description,
      date,
      time,
      location,
      confidence,
      source,
      originalEmail,
    };

    try {
      await addPendingEvent(newEvent);
      res.status(200).json({ message: 'Event added successfully.' });
    } catch (error) {
      console.error('API Error adding webhook event:', error);
      res.status(500).json({ error: 'Failed to add event.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
