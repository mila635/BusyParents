import { NextApiRequest, NextApiResponse } from 'next'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  max: number // Max requests per window
  message?: string
}

class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map()

  constructor(private config: RateLimitConfig) {}

  isRateLimited(identifier: string): boolean {
    const now = Date.now()
    const record = this.requests.get(identifier)

    if (!record || now > record.resetTime) {
      // Reset or create new record
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.config.windowMs
      })
      return false
    }

    if (record.count >= this.config.max) {
      return true
    }

    record.count++
    return false
  }

  getRemainingTime(identifier: string): number {
    const record = this.requests.get(identifier)
    if (!record) return 0
    return Math.max(0, record.resetTime - Date.now())
  }
}

// Create rate limiters for different endpoints
const authLimiter = new RateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }) // 5 requests per 15 minutes
const apiLimiter = new RateLimiter({ windowMs: 60 * 1000, max: 100 }) // 100 requests per minute
const webhookLimiter = new RateLimiter({ windowMs: 60 * 1000, max: 10 }) // 10 webhook calls per minute

export function withRateLimit(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  type: 'auth' | 'api' | 'webhook' = 'api'
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const identifier = getClientIdentifier(req)
    const limiter = type === 'auth' ? authLimiter : type === 'webhook' ? webhookLimiter : apiLimiter

    if (limiter.isRateLimited(identifier)) {
      const remainingTime = limiter.getRemainingTime(identifier)
      return res.status(429).json({
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again in ${Math.ceil(remainingTime / 1000)} seconds.`,
        retryAfter: Math.ceil(remainingTime / 1000)
      })
    }

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', type === 'auth' ? 5 : type === 'webhook' ? 10 : 100)
    res.setHeader('X-RateLimit-Remaining', type === 'auth' ? 4 : type === 'webhook' ? 9 : 99)

    return handler(req, res)
  }
}

function getClientIdentifier(req: NextApiRequest): string {
  // Use IP address or user ID if available
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
  const userId = req.headers['x-user-id'] || 'anonymous'
  return `${ip}-${userId}`
}

export { RateLimiter }
