import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { eventId } = req.query;
  const id = Array.isArray(eventId) ? eventId[0] : eventId;
  const { status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: "Missing 'id' or 'status'." });
  }

  const validStatuses = ["approved", "rejected", "pending"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  try {
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
