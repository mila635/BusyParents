// Simple in-memory job queue for background processing
// In production, use Redis or a proper job queue like Bull

interface Job {
  id: string
  type: string
  data: any
  priority: number
  createdAt: Date
  retries: number
  maxRetries: number
}

class JobQueue {
  private queue: Job[] = []
  private processing = false
  private handlers: Map<string, (data: any) => Promise<void>> = new Map()

  constructor() {
    this.processQueue()
  }

  addJob(type: string, data: any, priority: number = 0, maxRetries: number = 3): string {
    const job: Job = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      data,
      priority,
      createdAt: new Date(),
      retries: 0,
      maxRetries
    }

    this.queue.push(job)
    this.queue.sort((a, b) => b.priority - a.priority) // Higher priority first

    return job.id
  }

  registerHandler(type: string, handler: (data: any) => Promise<void>) {
    this.handlers.set(type, handler)
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) {
      setTimeout(() => this.processQueue(), 1000)
      return
    }

    this.processing = true
    const job = this.queue.shift()

    if (job) {
      try {
        const handler = this.handlers.get(job.type)
        if (handler) {
          await handler(job.data)
          console.log(`✅ Job ${job.id} (${job.type}) completed successfully`)
        } else {
          console.warn(`⚠️ No handler found for job type: ${job.type}`)
        }
      } catch (error) {
        console.error(`❌ Job ${job.id} (${job.type}) failed:`, error)
        
        if (job.retries < job.maxRetries) {
          job.retries++
          this.queue.unshift(job) // Add back to front of queue
          console.log(`🔄 Retrying job ${job.id} (${job.type}) - attempt ${job.retries}/${job.maxRetries}`)
        } else {
          console.error(`💀 Job ${job.id} (${job.type}) failed after ${job.maxRetries} retries`)
        }
      }
    }

    this.processing = false
    setTimeout(() => this.processQueue(), 100) // Process next job
  }

  getQueueLength(): number {
    return this.queue.length
  }

  getQueueStatus(): { length: number; processing: boolean } {
    return {
      length: this.queue.length,
      processing: this.processing
    }
  }
}

// Create global job queue instance
export const jobQueue = new JobQueue()

// Register job handlers
jobQueue.registerHandler('log_user_action', async (data) => {
  // Log user action to console (temporarily disabled database logging)
  console.log('📝 User action logged:', {
    userEmail: data.userEmail,
    action: data.action,
    service: data.service,
    status: data.status,
    details: data.details,
    errorMessage: data.errorMessage,
    timestamp: data.timestamp
  })
  
  // TODO: Re-enable database logging when database is set up
  // try {
  //   const { prisma } = await import('./database')
  //   
  //   // Find user by email
  //   const user = await prisma.user.findUnique({
  //     where: { email: data.userEmail }
  //   })

  //   if (user) {
  //     await prisma.userLog.create({
  //       data: {
  //         userId: user.id,
  //         action: data.action,
  //         service: data.service,
  //         status: data.status,
  //         details: data.details,
  //         errorMessage: data.errorMessage
  //       }
  //     })
  //     console.log('📝 User action logged to database:', data.action)
  //   } else {
  //     console.warn('⚠️ User not found for logging:', data.userEmail)
  //   }
  // } catch (error) {
  //   console.error('❌ Failed to log user action to database:', error)
  //   // Don't throw error to prevent job queue from failing
  // }
})

jobQueue.registerHandler('send_webhook', async (data) => {
  // Send webhook asynchronously
  try {
    const response = await fetch(data.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.payload)
    })
    
    if (!response.ok) {
      throw new Error(`Webhook failed with status ${response.status}`)
    }
    
    console.log('✅ Webhook sent successfully:', data.url)
  } catch (error) {
    console.error('❌ Webhook failed:', error)
    throw error // This will trigger retry
  }
})

jobQueue.registerHandler('process_emails', async (data) => {
  // Process emails in background
  console.log('📧 Processing emails for user:', data.userEmail)
  // TODO: Implement email processing logic
})

export { JobQueue }
