import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { eventId } = req.query;
  const id = Array.isArray(eventId) ? eventId[0] : eventId;

  if (!id) {
    return res.status(400).json({ error: "Event ID is required." });
  }

  if (req.method === "PUT") {
    try {
      const updatedEvent = await prisma.pendingEvent.update({
        where: { id },
        data: req.body,
      });
      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error("API Error updating event:", error);
      res.status(500).json({ error: "Failed to update event." });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.pendingEvent.delete({ where: { id } });
      res.status(204).end();
    } catch (error) {
      console.error("API Error deleting event:", error);
      res.status(500).json({ error: "Failed to delete event." });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
