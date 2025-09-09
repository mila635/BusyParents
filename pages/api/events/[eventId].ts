import type { NextApiRequest, NextApiResponse } from 'next';
import { updateEvent, deleteEvent } from '../../../lib/shared-state';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const eventId = Array.isArray(id) ? id[0] : id;

  if (!eventId) {
    return res.status(400).json({ error: 'Event ID is required.' });
  }

  try {
    if (req.method === 'PUT') {
      const eventData = req.body;
      await updateEvent(eventId, eventData);
      res.status(200).json({ success: true, message: 'Event updated successfully.' });
    } else if (req.method === 'DELETE') {
      await deleteEvent(eventId);
      res.status(200).json({ success: true, message: 'Event deleted successfully.' });
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling event request:', error);
    res.status(500).json({ success: false, error: 'Failed to process event request.' });
  }
}
