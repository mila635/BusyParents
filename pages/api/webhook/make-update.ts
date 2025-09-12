import { NextApiRequest, NextApiResponse } from 'next';
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
    const {
      timestamp,
      emailId,
      emailSubject,
      emailFrom,
      aiAnalysis,
      calendarEvent,
      sheetsLog,
      workflowStatus,
      userId,
      makeScenarioId,
      makeExecutionId
    } = req.body;

    // Log the workflow execution to database
    const workflowLog = await prisma.workflowTrigger.create({
      data: {
        action: 'make_webhook_update',
        scenarioName: makeScenarioId || 'unknown',
        userEmail: emailFrom || 'unknown@example.com',
        userId: userId || null,
        status: workflowStatus || 'in_progress',
        executionId: makeExecutionId || null,
        additionalData: JSON.stringify({
          emailId: emailId || 'unknown',
          emailSubject: emailSubject || 'No Subject',
          emailFrom: emailFrom || 'Unknown Sender',
          aiAnalysis: aiAnalysis || {},
          calendarEvent: calendarEvent || {},
          sheetsLog: sheetsLog || {},
          timestamp: timestamp
        }),
        timestamp: new Date(timestamp)
      }
    });

    console.log('📧 Make.com Webhook Received:', {
      emailSubject,
      emailFrom,
      isCalendarEvent: aiAnalysis?.isCalendarEvent,
      calendarCreated: calendarEvent?.created,
      sheetsLogged: sheetsLog?.logged,
      workflowStatus,
      userId
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Workflow update received and logged',
      workflowLogId: workflowLog.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Make.com webhook error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process webhook',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    await prisma.$disconnect();
  }
}