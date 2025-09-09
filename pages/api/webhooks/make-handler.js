// pages/api/webhooks/make-handler.js
// Optional: Enhanced webhook handler for Make.com responses

import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Optional: Verify webhook signature if you set one up in Make.com
    // const signature = req.headers['x-make-signature']
    // if (!verifySignature(req.body, signature)) {
    //   return res.status(401).json({ error: 'Invalid signature' })
    // }

    const { status, data, error, executionId } = req.body

    console.log('Make.com webhook received:', {
      status,
      executionId,
      timestamp: new Date().toISOString()
    })

    if (status === 'success') {
      // Handle successful execution
      console.log('Make.com execution successful:', data)
      
      // You can store results in database, send notifications, etc.
      // await storeExecutionResult(executionId, data)
      
      return res.status(200).json({ 
        received: true, 
        message: 'Success handled' 
      })
      
    } else if (status === 'error') {
      // Handle execution errors
      console.error('Make.com execution error:', error)
      
      // You can log errors, send alerts, etc.
      // await logExecutionError(executionId, error)
      
      return res.status(200).json({ 
        received: true, 
        message: 'Error logged' 
      })
      
    } else {
      // Handle other statuses (in_progress, etc.)
      console.log('Make.com execution status:', status)
      
      return res.status(200).json({ 
        received: true, 
        message: 'Status updated' 
      })
    }

  } catch (error) {
    console.error('Webhook handler error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
}

// Optional: Signature verification function
function verifySignature(payload, signature) {
  // Implement signature verification logic if needed
  // This depends on how Make.com sends signatures
  return true // Placeholder
}

// Optional: Database operations
async function storeExecutionResult(executionId, data) {
  // Store successful execution results in your database
  console.log('Storing execution result:', { executionId, data })
}

async function logExecutionError(executionId, error) {
  // Log execution errors in your database or monitoring system
  console.log('Logging execution error:', { executionId, error })
}