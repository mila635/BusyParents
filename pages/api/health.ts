import type { NextApiRequest, NextApiResponse } from 'next'

type HealthResponse = {
  status: string
  timestamp: string
  version: string
  services: {
    database: string
    auth: string
    workflows: string
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: 'unknown',
        auth: 'unknown',
        workflows: 'unknown'
      }
    })
  }

  try {
    // Basic health check
    const healthStatus: HealthResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: process.env.DATABASE_URL ? 'configured' : 'not_configured',
        auth: process.env.NEXTAUTH_SECRET ? 'configured' : 'not_configured',
        workflows: process.env.MAKE_WEBHOOK_URL ? 'configured' : 'not_configured'
      }
    }

    res.status(200).json(healthStatus)
  } catch (error) {
    console.error('Health check failed:', error)
    
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: 'error',
        auth: 'error',
        workflows: 'error'
      }
    })
  }
}