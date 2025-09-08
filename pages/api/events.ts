import type { NextApiRequest, NextApiResponse } from 'next';
import { updateEvent, deleteEvent } from '@/lib/shared-state';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { eventId } = req.query;
  const id = Array.isArray(eventId) ? eventId[0] : eventId;

  if (!id) {
    return res.status(400).json({ error: 'Event ID is required.' });
  }

  if (req.method === 'PUT') {
    const updatedData = req.body;
    try {
      const updatedEvent = await updateEvent(id, updatedData);
      if (updatedEvent) {
        res.status(200).json(updatedEvent);
      } else {
        res.status(404).json({ error: 'Event not found.' });
      }
    } catch (error) {
      console.error('API Error updating event:', error);
      res.status(500).json({ error: 'Failed to update event.' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const success = await deleteEvent(id);
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Event not found.' });
      }
    } catch (error) {
      console.error('API Error deleting event:', error);
      res.status(500).json({ error: 'Failed to delete event.' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
