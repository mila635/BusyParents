// import type { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/lib/database";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     const { userId, title, description, date, status, confidenceScore } = req.body;

//     // Validate required fields
//     if (!userId || !title || !date || !status) {
//       return res.status(400).json({
//         error: "Missing required fields: userId, title, date, or status.",
//       });
//     }

//     try {
//       const newEvent = await prisma.pendingEvent.create({
//         data: {
//           userId,
//           title,
//           description: description || null,
//           date: new Date(date), // Ensure valid Date
//           status,
//           confidenceScore: confidenceScore ?? null,
//           createdAt: new Date(),
//         },
//       });

//       res.status(201).json(newEvent);
//     } catch (error) {
//       console.error("API Error adding event:", error);
//       res.status(500).json({ error: "Failed to add event." });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
