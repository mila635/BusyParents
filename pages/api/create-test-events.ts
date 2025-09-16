import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // For testing purposes, create a default test user
    let user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          image: null,
          provider: 'google',
          role: 'PARENT',
          isActive: true,
          lastLoginAt: new Date()
        }
      });
    }

    // Create test pending events
    const testEvents = [
      {
        userId: user.id,
        title: 'Parent-Teacher Conference',
        description: 'Meeting with Ms. Johnson about Sarah\'s progress in mathematics',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        location: 'School Conference Room A',
        source: 'email',
        confidenceScore: 0.95,
        extractedFrom: 'school@example.com',
        status: 'PENDING'
      },
      {
        userId: user.id,
        title: 'Soccer Practice',
        description: 'Weekly soccer practice for the youth team',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        location: 'Community Sports Field',
        source: 'email',
        confidenceScore: 0.88,
        extractedFrom: 'coach@soccerclub.com',
        status: 'PENDING'
      },
      {
        userId: user.id,
        title: 'Dentist Appointment',
        description: 'Regular dental checkup for Tommy',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        location: 'Downtown Dental Clinic',
        source: 'email',
        confidenceScore: 0.92,
        extractedFrom: 'appointments@dentalclinic.com',
        status: 'PENDING'
      }
    ];

    const createdEvents = await Promise.all(
      testEvents.map(event => 
        prisma.pendingEvent.create({ data: event })
      )
    );

    return res.status(200).json({
      message: 'Test events created successfully',
      events: createdEvents,
      count: createdEvents.length
    });

  } catch (error) {
    console.error('Error creating test events:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : String(error)
    });
  }
}