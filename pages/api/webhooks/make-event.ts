import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, description, date, time, location, confidence, source, originalEmail, userEmail } = req.body;

    // Validate incoming data
    if (!title || !description || !date || !time || !confidence || !source || !originalEmail || !userEmail) {
      return res.status(400).json({ error: 'Missing required fields from webhook payload.' });
    }

    try {
      // Find the user by email
      const user = await prisma.user.findUnique({
        where: { email: userEmail }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Combine date and time into a DateTime object
      const eventDateTime = new Date(`${date}T${time}`);

      // Create the pending event in the database
      const newEvent = await prisma.pendingEvent.create({
        data: {
          userId: user.id,
          title,
          description,
          date: eventDateTime,
          location,
          confidenceScore: parseFloat(confidence),
          source,
          extractedFrom: originalEmail,
          status: 'PENDING'
        }
      });

      console.log('Event added successfully:', newEvent);
      res.status(200).json({ message: 'Event added successfully.', eventId: newEvent.id });
    } catch (error) {
      console.error('API Error adding webhook event:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: 'Failed to add event.', details: errorMessage });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
