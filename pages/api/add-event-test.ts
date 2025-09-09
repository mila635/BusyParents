// import type { NextApiRequest, NextApiResponse } from 'next';
// // import { addPendingEvent } from '../../lib/shared-state';
// import { addPendingEvent } from '@/lib/shared-state';
// import { v4 as uuidv4 } from 'uuid';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const newEvent = {
//       id: uuidv4(), // Generate a unique ID
//       title: 'New Test Event',
//       description: 'This is a test event to check the live dashboard functionality.',
//       startDate: new Date().toISOString(),
//       endDate: new Date().toISOString(),
//       location: 'Test Location',
//       source: 'Test',
//       confidenceScore: 0.75,
//       extractedFrom: 'test_data',
//       createdAt: new Date().toISOString(),
//     };

//     try {
//       await addPendingEvent(newEvent);
//       res.status(200).json({ message: 'Test event added successfully' });
//     } catch (error) {
//       console.error('API Error adding test event:', error);
//       res.status(500).json({ error: 'Failed to add test event' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }





// import type { NextApiRequest, NextApiResponse } from 'next';
// import { addPendingEvent } from '@/lib/shared-state';
// import { v4 as uuidv4 } from 'uuid';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     // The newEvent object now correctly matches the properties expected by the PendingEvent interface.
//     const newEvent = {
//       title: 'New Test Event',
//       description: 'This is a test event to check the live dashboard functionality.',
//       startDate: new Date().toISOString(),
//       endDate: new Date().toISOString(),
//       location: 'Test Location',
//       source: 'Test',
//       confidenceScore: 0.75,
//       extractedFrom: 'test_data',
//       createdAt: new Date().toISOString(),
//     };

//     try {
//       // The addPendingEvent function is now called with a correctly structured object.
//       // The `id` is not passed here, as the utility function generates it.
//       await addPendingEvent(newEvent);
//       res.status(200).json({ message: 'Test event added successfully' });
//     } catch (error) {
//       console.error('API Error adding test event:', error);
//       res.status(500).json({ error: 'Failed to add test event' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }


import type { NextApiRequest, NextApiResponse } from "next";
import { addPendingEvent } from "@/lib/shared-state";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // ✅ Get event details from request body (dynamic, not hardcoded)
      const {
        title,
        description,
        startDate,
        endDate,
        location,
        source,
        confidenceScore,
        extractedFrom,
        createdAt,
        time,
        date,
        confidence,
        originalEmail,
      } = req.body;

      // ✅ Build new event object according to PendingEvent (without id)
      const newEvent = {
        title: title ?? "Untitled Event",
        description: description ?? "",
        startDate: startDate ?? new Date().toISOString(),
        endDate: endDate ?? new Date().toISOString(),
        location: location ?? "Unknown Location",
        source: source ?? "Unknown Source",
        confidenceScore: confidenceScore ?? 0,
        extractedFrom: extractedFrom ?? "system",
        createdAt: createdAt ?? new Date().toISOString(),
        time: time ?? new Date().toLocaleTimeString(),
        date: date ?? new Date().toLocaleDateString(),
        confidence: confidence ?? 0.5,
        originalEmail: originalEmail ?? "No email content available",
      };

      // Save to database / shared state
      await addPendingEvent(newEvent);

      res.status(200).json({ message: "Event added successfully" });
    } catch (error) {
      console.error("API Error adding event:", error);
      res.status(500).json({ error: "Failed to add event" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
