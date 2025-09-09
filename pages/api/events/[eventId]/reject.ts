

import type { NextApiRequest, NextApiResponse } from 'next';
import { getEvents, saveEvents } from '../../../../lib/shared-state';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { eventId } = req.query;

  if (req.method === 'POST') {
    try {
      const events = await getEvents();
      const updatedEvents = events.filter(event => event.id !== eventId);
      await saveEvents(updatedEvents);

      res.status(200).json({ message: 'Event rejected successfully' });
    } catch (error) {
      console.error('API Error rejecting event:', error);
      res.status(500).json({ error: 'Failed to reject event' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}