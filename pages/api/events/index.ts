// import type { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/lib/database";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "GET") {
//     try {
//       const pendingEvents = await prisma.pendingEvent.findMany();
//       res.status(200).json(pendingEvents);
//     } catch (error) {
//       console.error("API Error fetching pending events:", error);
//       res.status(500).json({ error: "Failed to fetch pending events" });
//     }
//   } else {
//     res.setHeader("Allow", ["GET"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }


import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const events = await prisma.pendingEvent.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(events);
  } catch (error) {
    console.error("API Error fetching pending events:", error);
    res.status(500).json({ error: "Failed to fetch pending events" });
  }
}
