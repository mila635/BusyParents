import type { NextApiRequest, NextApiResponse } from 'next';
import { getEvents } from '@/lib/shared-state';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const pendingEvents = await getEvents();
      res.status(200).json(pendingEvents);
    } catch (error) {
      console.error('API Error fetching pending events:', error);
      res.status(500).json({ error: 'Failed to fetch pending events.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
