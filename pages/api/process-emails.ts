// import type { NextApiRequest, NextApiResponse } from 'next'
// import { getSession } from 'next-auth/react'
// import { logToGoogleSheets } from '../../utils/googleSheets'

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' })
//   }

//   let session: any = null
  
//   try {
//     session = await getSession({ req })
    
//     if (!session) {
//       return res.status(401).json({ message: 'Unauthorized' })
//     }

//     if (!session.accessToken) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'No access token available. Please sign in again.' 
//       })
//     }

//     // Log email processing attempt
//     await logToGoogleSheets({
//       timestamp: new Date().toISOString(),
//       userEmail: session.user?.email || 'unknown',
//       action: 'Email Processing Trigger',
//       service: 'Make.com',
//       status: 'pending',
//       details: 'Triggering email processing workflow'
//     })

//     // Trigger Make.com email processing workflow
//     const emailWebhookUrl = 'https://hook.eu2.make.com/5fmpca1ttbvulfu8c5gf6kxjbgc6r2h4'
//     const response = await fetch(emailWebhookUrl, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         event: 'process_user_emails',
//         userId: session.user?.id,
//         userEmail: session.user?.email,
//         accessToken: session.accessToken,
//         refreshToken: session.refreshToken,
//         scope: session.scope,
//         timestamp: new Date().toISOString()
//       })
//     })

//     if (response.ok) {
//       // Log successful trigger
//       await logToGoogleSheets({
//         timestamp: new Date().toISOString(),
//         userEmail: session.user?.email || 'unknown',
//         action: 'Email Processing Trigger',
//         service: 'Make.com',
//         status: 'success',
//         details: 'Email processing workflow triggered successfully'
//       })

//       return res.status(200).json({ 
//         success: true, 
//         message: 'Email processing started successfully!',
//         data: {
//           workflowTriggered: true,
//           timestamp: new Date().toISOString()
//         }
//       })
//     } else {
//       throw new Error(`Make.com webhook returned status ${response.status}`)
//     }

//   } catch (error) {
//     console.error('Email processing error:', error)
    
//     // Log failed trigger
//     await logToGoogleSheets({
//       timestamp: new Date().toISOString(),
//       userEmail: session?.user?.email || 'unknown',
//       action: 'Email Processing Trigger',
//       service: 'Make.com',
//       status: 'failed',
//       details: 'Failed to trigger email processing workflow',
//       errorMessage: error instanceof Error ? error.message : 'Unknown error'
//     })
    
//     return res.status(500).json({ 
//       success: false, 
//       message: 'Failed to start email processing. Please try again.' 
//     })
//   }
// }






// import type { NextApiRequest, NextApiResponse } from 'next';
// import { prisma } from '../../lib/database';
// import { v4 as uuidv4 } from 'uuid';

// // This is a placeholder function for your AI event extraction logic.
// // In a real scenario, this would use an LLM or other service to parse the email body.
// const extractEventFromEmail = (emailBody: string, emailSubject: string): any[] => {
//   // Your AI logic would go here. For now, we'll return a simple mock event.
//   // This will be triggered by your automation and will add an event to the DB.
//   if (emailBody.includes('auditions')) {
//     return [{
//       title: emailSubject,
//       description: 'Auditions for the annual school play. All students are welcome to participate.',
//       startDate: new Date('2025-09-15T10:00:00').toISOString(),
//       endDate: new Date('2025-09-15T12:00:00').toISOString(),
//       location: 'School Auditorium',
//       source: 'Gmail',
//       confidenceScore: 0.95,
//       extractedFrom: 'email_abc',
//       status: 'pending',
//     }];
//   }
//   return [];
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const { subject, body, receivedAt, userEmail } = req.body;

//   if (!subject || !body || !receivedAt || !userEmail) {
//     return res.status(400).json({ error: 'Missing required email data' });
//   }

//   try {
//     // 1. Find the user based on the email
//     const user = await prisma.user.findUnique({
//       where: { email: userEmail },
//     });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // 2. Process the email to extract events
//     const extractedEvents = extractEventFromEmail(body, subject);

//     if (extractedEvents.length > 0) {
//       // 3. Save the extracted events to the database
//       const createdEvents = await prisma.$transaction(
//         extractedEvents.map(event =>
//           prisma.pendingEvent.create({
//             data: {
//               ...event,
//               userId: user.id,
//             },
//           })
//         )
//       );

//       return res.status(200).json({
//         message: 'Events processed and saved for user',
//         events: createdEvents,
//       });
//     }

//     return res.status(200).json({ message: 'No events found in email' });

//   } catch (error) {
//     console.error('Error processing email:', error);
//     return res.status(500).json({ error: 'Failed to process email' });
//   }
// }





// import type { NextApiRequest, NextApiResponse } from 'next'
// import { getSession } from 'next-auth/react'
// import { logToGoogleSheets } from '../../utils/googleSheets'
// import { prisma } from '../../lib/database'
// import { v4 as uuidv4 } from 'uuid'

// // This is a placeholder function for your AI event extraction logic.
// // In a real scenario, this would use an LLM or other service to parse the email body.
// const extractEventFromEmail = (emailBody: string, emailSubject: string): any[] => {
//   // Your AI logic would go here. For now, we'll return a simple mock event.
//   // This will be triggered by your automation and will add an event to the DB.
//   if (emailBody.includes('auditions')) {
//     return [{
//       title: emailSubject,
//       description: 'Auditions for the annual school play. All students are welcome to participate.',
//       startDate: new Date('2025-09-15T10:00:00').toISOString(),
//       endDate: new Date('2025-09-15T12:00:00').toISOString(),
//       location: 'School Auditorium',
//       source: 'Gmail',
//       confidenceScore: 0.95,
//       extractedFrom: 'email_abc',
//       status: 'pending',
//     }];
//   }
//   return [];
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' })
//   }

//   let session: any = null
  
//   try {
//     // This part of the code is commented out as it is not needed if the logic to
//     // process and save to the database is done directly from the webhook.
//     // If you intend to use this handler as a direct API call from your frontend
//     // you will need to uncomment this block.

//     /*
//     session = await getSession({ req })
    
//     if (!session) {
//       return res.status(401).json({ message: 'Unauthorized' })
//     }

//     if (!session.accessToken) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'No access token available. Please sign in again.' 
//       })
//     }
//     */

//     // The data for the webhook is sent from Make.com, not your frontend.
//     // We get the data directly from the request body sent by the webhook.
//     const { subject, body, receivedAt, userEmail } = req.body;

//     if (!subject || !body || !receivedAt || !userEmail) {
//       return res.status(400).json({ error: 'Missing required email data from webhook.' });
//     }

//     // 1. Find the user based on the email
//     const user = await prisma.user.findUnique({
//       where: { email: userEmail },
//     });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found.' });
//     }

//     // 2. Process the email to extract events
//     const extractedEvents = extractEventFromEmail(body, subject);

//     if (extractedEvents.length > 0) {
//       // 3. Save the extracted events to the database
//       const createdEvents = await prisma.$transaction(
//         extractedEvents.map(event =>
//           prisma.pendingEvent.create({
//             data: {
//               ...event,
//               userId: user.id,
//             },
//           })
//         )
//       );

//       return res.status(200).json({
//         message: 'Events processed and saved for user',
//         events: createdEvents,
//       });
//     }

//     return res.status(200).json({ message: 'No events found in email' });

//   } catch (error) {
//     console.error('Error processing email:', error);
    
//     // The webhook response is a critical part of the workflow.
//     // Ensure you always return a response to the webhook.
//     return res.status(500).json({ error: 'Failed to process email' });
//   }
// }


import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { logToGoogleSheets } from '../../utils/googleSheets'
import { prisma } from '../../lib/database'

// The 'uuidv4' import is not used in this file and has been removed to resolve the error.
// import { v4 as uuidv4 } from 'uuid'

// This is a placeholder function for your AI event extraction logic.
// In a real scenario, this would use an LLM or other service to parse the email body.
const extractEventFromEmail = (emailBody: string, emailSubject: string): any[] => {
  // Your AI logic would go here. For now, we'll return a simple mock event.
  // This will be triggered by your automation and will add an event to the DB.
  if (emailBody.includes('auditions')) {
    return [{
      title: emailSubject,
      description: 'Auditions for the annual school play. All students are welcome to participate.',
      startDate: new Date('2025-09-15T10:00:00').toISOString(),
      endDate: new Date('2025-09-15T12:00:00').toISOString(),
      location: 'School Auditorium',
      source: 'Gmail',
      confidenceScore: 0.95,
      extractedFrom: 'email_abc',
      status: 'pending',
    }];
  }
  return [];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  let session: any = null
  
  try {
    // This part of the code is commented out as it is not needed if the logic to
    // process and save to the database is done directly from the webhook.
    // If you intend to use this handler as a direct API call from your frontend
    // you will need to uncomment this block.

    /*
    session = await getSession({ req })
    
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (!session.accessToken) {
      return res.status(400).json({ 
        success: false,
        message: 'No access token available. Please sign in again.' 
      })
    }
    */

    // The data for the webhook is sent from Make.com, not your frontend.
    // We get the data directly from the request body sent by the webhook.
    const { subject, body, receivedAt, userEmail } = req.body;

    if (!subject || !body || !receivedAt || !userEmail) {
      return res.status(400).json({ error: 'Missing required email data from webhook.' });
    }

    // 1. Find the user based on the email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // 2. Process the email to extract events
    const extractedEvents = extractEventFromEmail(body, subject);

    if (extractedEvents.length > 0) {
      // 3. Save the extracted events to the database
      const createdEvents = await prisma.$transaction(
        extractedEvents.map(event =>
          prisma.pendingEvent.create({
            data: {
              ...event,
              userId: user.id,
            },
          })
        )
      );

      return res.status(200).json({
        message: 'Events processed and saved for user',
        events: createdEvents,
      });
    }

    return res.status(200).json({ message: 'No events found in email' });

  } catch (error) {
    console.error('Error processing email:', error);
    
    // The webhook response is a critical part of the workflow.
    // Ensure you always return a response to the webhook.
    return res.status(500).json({ error: 'Failed to process email' });
  }
}
