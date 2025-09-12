import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Input validation schema
const querySchema = z.object({
  action: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(10),
  page: z.coerce.number().min(1).default(1),
  status: z.enum(['triggered', 'in_progress', 'success', 'error']).optional(),
  scenarioName: z.string().optional(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow both GET and POST methods
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', allowedMethods: ['GET', 'POST'] })
  }

  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const userEmail = session.user?.email

    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' })
    }
    
    // Parse query parameters (for GET) or body (for POST)
    const queryParams = req.method === 'GET' 
      ? req.query 
      : req.body
    
    // Validate input parameters
    const validationResult = querySchema.safeParse(queryParams)
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid parameters', 
        details: validationResult.error.format() 
      })
    }
    
    const { action, limit, page, status, scenarioName } = validationResult.data
    
    // Check if we're requesting workflow history or just the latest status
    const isHistoryRequest = req.query.history === 'true' || req.body.history === true
    
    if (isHistoryRequest) {
      // Get workflow history with pagination
      const history = await getWorkflowHistory(userEmail, {
        action,
        limit,
        page,
        status,
        scenarioName
      })
      
      return res.status(200).json(history)
    }
    
    // Get the latest workflow status
    let workflowData = null

    // If action is specified, get the most recent trigger for that action
    if (action) {
      workflowData = await getWorkflowTrigger(userEmail, action)
    } else {
      // Otherwise get the most recent trigger for any action
      workflowData = await getLatestWorkflowTrigger(userEmail)
    }

    // If we have a workflow trigger with an executionId, check for execution results
    if (workflowData?.executionId) {
      const executionResult = await getExecutionResult(workflowData.executionId)
      if (executionResult) {
        // Update the status based on execution result
        workflowData.status = 'success'
        const additionalData = workflowData.additionalData ? JSON.parse(workflowData.additionalData) : {};
        additionalData.result = executionResult.result;
        additionalData.completedAt = executionResult.timestamp.toISOString();
        workflowData.additionalData = additionalData;
      }

      // Check for execution errors
      const executionError = await getExecutionError(workflowData.executionId)
      if (executionError) {
        // Update the status based on execution error
        workflowData.status = 'error'
        const additionalData = workflowData.additionalData ? JSON.parse(workflowData.additionalData) : {};
        additionalData.error = executionError.error;
        additionalData.errorAt = executionError.timestamp.toISOString();
        workflowData.additionalData = additionalData;
      }
    }

    return res.status(200).json(workflowData || { status: 'not_found' })
  } catch (error) {
    console.error('Error fetching workflow status:', error)
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      error: 'Internal server error',
      message: errorMessage,
    })
  }
}

async function getWorkflowTrigger(userEmail: string, action: string) {
  const trigger = await prisma.workflowTrigger.findFirst({
    where: {
      userEmail,
      action,
    },
    orderBy: {
      timestamp: 'desc',
    },
  })

  if (!trigger) return null

  return {
    id: trigger.id,
    action: trigger.action,
    status: trigger.status,
    scenarioName: trigger.scenarioName,
    executionId: trigger.executionId,
    timestamp: trigger.timestamp.toISOString(),
    additionalData: trigger.additionalData ? JSON.parse(trigger.additionalData) : null,
  }
}

async function getLatestWorkflowTrigger(userEmail: string) {
  const trigger = await prisma.workflowTrigger.findFirst({
    where: {
      userEmail,
    },
    orderBy: {
      timestamp: 'desc',
    },
  })

  if (!trigger) return null

  return {
    id: trigger.id,
    action: trigger.action,
    status: trigger.status,
    scenarioName: trigger.scenarioName,
    executionId: trigger.executionId,
    timestamp: trigger.timestamp.toISOString(),
    additionalData: trigger.additionalData ? JSON.parse(trigger.additionalData) : null,
  }
}

async function getExecutionResult(executionId: string) {
  return await prisma.executionResult.findFirst({
    where: {
      executionId,
    },
  })
}

async function getExecutionError(executionId: string) {
  return await prisma.executionError.findFirst({
    where: {
      executionId,
    },
  })
}

interface WorkflowHistoryParams {
  action?: string;
  limit: number;
  page: number;
  status?: string;
  scenarioName?: string;
}

async function getWorkflowHistory(userEmail: string, params: WorkflowHistoryParams) {
  const { action, limit, page, status, scenarioName } = params;
  const skip = (page - 1) * limit;
  
  // Build where clause based on provided filters
  const where: any = { userEmail };
  
  if (action) where.action = action;
  if (status) where.status = status;
  if (scenarioName) where.scenarioName = scenarioName;
  
  // Get total count for pagination
  const totalCount = await prisma.workflowTrigger.count({ where });
  
  // Get workflow triggers with pagination
  const triggers = await prisma.workflowTrigger.findMany({
    where,
    orderBy: {
      timestamp: 'desc',
    },
    skip,
    take: limit,
  });
  
  // Process each trigger to include execution results and errors
  const workflowItems = await Promise.all(triggers.map(async (trigger) => {
    const item = {
      id: trigger.id,
      action: trigger.action,
      status: trigger.status,
      scenarioName: trigger.scenarioName,
      executionId: trigger.executionId,
      timestamp: trigger.timestamp.toISOString(),
      additionalData: trigger.additionalData ? JSON.parse(trigger.additionalData) : null,
      result: null,
      error: null,
      completedAt: null,
      errorAt: null,
    };
    
    if (trigger.executionId) {
      // Check for execution results
      const executionResult = await prisma.executionResult.findFirst({
        where: { executionId: trigger.executionId },
      });
      
      if (executionResult) {
        item.status = 'success';
        const additionalData = item.additionalData ? JSON.parse(item.additionalData) : {};
        additionalData.result = executionResult.result;
        additionalData.completedAt = executionResult.timestamp.toISOString();
        item.additionalData = JSON.stringify(additionalData);
      }
      
      // Check for execution errors
      const executionError = await prisma.executionError.findFirst({
        where: { executionId: trigger.executionId },
      });
      
      if (executionError) {
        item.status = 'error';
        const additionalData = item.additionalData ? JSON.parse(item.additionalData) : {};
        additionalData.error = executionError.error;
        additionalData.errorAt = executionError.timestamp.toISOString();
        item.additionalData = JSON.stringify(additionalData);
      }
    }
    
    return item;
  }));
  
  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limit);
  
  return {
    items: workflowItems,
    pagination: {
      page,
      limit,
      totalItems: totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}