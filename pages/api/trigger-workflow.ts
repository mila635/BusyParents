import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // IMPORTANT: Replace this placeholder with the actual webhook URL from your Make.com scenario.
    // To ensure security, you should store this URL as an environment variable (e.g., process.env.MAKE_WEBHOOK_URL)
    // and never hardcode it directly in your application.
    const makeWebhookUrl = 'https://us2.make.com/api/v2/hooks/1234567890abcdefg'; // PLACEHOLDER URL

    if (makeWebhookUrl === 'YOUR_MAKE_WEBHOOK_URL_HERE') {
      return res.status(500).json({ error: 'Webhook URL is not configured. Please update the trigger-workflow.ts file with your actual URL.' });
    }

    try {
      const response = await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: "Triggering a new email scan." }), // Send a simple payload
      });

      if (response.ok) {
        res.status(200).json({ message: 'Make.com workflow triggered successfully.' });
      } else {
        const errorData = await response.json();
        res.status(response.status).json({ error: 'Failed to trigger Make.com workflow.', details: errorData });
      }
    } catch (error) {
      console.error('API Error triggering workflow:', error);
      res.status(500).json({ error: 'Failed to trigger workflow.', details: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
