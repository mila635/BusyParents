// import { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/lib/database";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

//   const { id, status } = req.body;

//   try {
//     const updated = await prisma.pendingEvent.update({
//       where: { id },
//       data: { status },
//     });
//     res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update event status" });
//   }
// }


import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure the request method is POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Destructure the ID and status from the request body
  const { id, status } = req.body;

  // Validate that the ID and status are provided
  if (!id || !status) {
    return res.status(400).json({ error: "Missing 'id' or 'status' in request body." });
  }

  // Validate the provided status to ensure it's a known value.
  const validStatuses = ['approved', 'rejected', 'pending'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value. Must be 'approved', 'rejected', or 'pending'." });
  }

  try {
    // Find the event to ensure it exists before attempting to update.
    const eventToUpdate = await prisma.pendingEvent.findUnique({
      where: { id },
    });

    if (!eventToUpdate) {
      return res.status(404).json({ error: "Event not found." });
    }

    // Update the event's status in the database using Prisma.
    const updatedEvent = await prisma.pendingEvent.update({
      where: { id },
      data: { status },
    });

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Failed to update event status:", error);
    res.status(500).json({ error: "Failed to update event status." });
  }
}
