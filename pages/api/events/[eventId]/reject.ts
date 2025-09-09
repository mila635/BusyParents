// import type { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/lib/database";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { eventId } = req.query;

//   if (req.method !== "POST") {
//     res.setHeader("Allow", ["POST"]);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

//   if (!eventId || typeof eventId !== "string") {
//     return res.status(400).json({ error: "Invalid eventId" });
//   }

//   try {
//     // Ensure the event exists
//     const existingEvent = await prisma.pendingEvent.findUnique({
//       where: { id: eventId },
//     });

//     if (!existingEvent) {
//       return res.status(404).json({ error: "Event not found" });
//     }

//     // Update status to "rejected"
//     const updatedEvent = await prisma.pendingEvent.update({
//       where: { id: eventId },
//       data: { status: "rejected" },
//     });

//     res.status(200).json({
//       message: "Event rejected successfully",
//       event: updatedEvent,
//     });
//   } catch (error) {
//     console.error("Reject event error:", error);
//     res.status(500).json({ error: "Failed to reject event" });
//   }
// }
