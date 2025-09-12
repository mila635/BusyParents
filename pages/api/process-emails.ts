import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { email, subject, body } = req.body

  if (!email || !subject || !body) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  try {
    const response = await fetch(
      process.env.MAKE_EMAIL_PROCESSING_WEBHOOK_URL!,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          subject,
          body,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Email webhook failed:", response.status, errorText)
      return res.status(400).json({ error: "Webhook failed" })
    }

    console.log("✅ Email processing webhook sent successfully")
    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("❌ Failed to call email webhook:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

