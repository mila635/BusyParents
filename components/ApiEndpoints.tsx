import React, { useState } from 'react'
import { CheckCircleIcon, XCircleIcon, PlayIcon } from '@heroicons/react/24/outline'

interface Endpoint {
  name: string
  path: string
  method: string
  description: string
  category: string
  requiresAuth: boolean
  status: 'working' | 'auth-required' | 'not-found' | 'untested'
}

const endpoints: Endpoint[] = [
  {
    name: 'Health Check',
    path: '/api/health',
    method: 'GET',
    description: 'System health and configuration status',
    category: 'System',
    requiresAuth: false,
    status: 'working'
  },
  {
    name: 'N8N Integration Test',
    path: '/api/test-n8n-integration',
    method: 'GET',
    description: 'Comprehensive N8N integration status and webhook tests',
    category: 'Integration',
    requiresAuth: false,
    status: 'working'
  },
  {
    name: 'Environment Test',
    path: '/api/test-env',
    method: 'GET',
    description: 'Environment variables and configuration check',
    category: 'System',
    requiresAuth: false,
    status: 'working'
  },
  {
    name: 'Trigger Workflow',
    path: '/api/trigger-workflow',
    method: 'POST',
    description: 'Trigger N8N workflows with custom actions',
    category: 'N8N',
    requiresAuth: true,
    status: 'auth-required'
  },
  {
    name: 'Workflow Status',
    path: '/api/workflow-status',
    method: 'GET/POST',
    description: 'Check workflow execution status',
    category: 'N8N',
    requiresAuth: true,
    status: 'working'
  },
  {
    name: 'Pending Events',
    path: '/api/events/pending',
    method: 'GET',
    description: 'Get pending calendar events',
    category: 'Events',
    requiresAuth: true,
    status: 'auth-required'
  },
  {
    name: 'Live Updates',
    path: '/api/dashboard/live-updates',
    method: 'GET',
    description: 'Server-sent events for real-time dashboard updates',
    category: 'Dashboard',
    requiresAuth: true,
    status: 'auth-required'
  },
  {
    name: 'Statistics',
    path: '/api/stats',
    method: 'GET',
    description: 'Application usage statistics and analytics',
    category: 'Analytics',
    requiresAuth: true,
    status: 'working'
  },
  {
    name: 'Make.com Callback',
    path: '/api/webhook/make-callback',
    method: 'POST',
    description: 'Webhook endpoint for Make.com integrations',
    category: 'Webhooks',
    requiresAuth: false,
    status: 'untested'
  },
  {
    name: 'N8N Analytics',
    path: '/api/webhooks/n8n-analytics',
    method: 'POST',
    description: 'Analytics webhook for N8N workflow tracking',
    category: 'Webhooks',
    requiresAuth: false,
    status: 'untested'
  }
]

const categories = ['All', 'System', 'Integration', 'N8N', 'Events', 'Dashboard', 'Analytics', 'Webhooks']

export default function ApiEndpoints() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [testing, setTesting] = useState<Record<string, boolean>>({})

  const filteredEndpoints = selectedCategory === 'All' 
    ? endpoints 
    : endpoints.filter(endpoint => endpoint.category === selectedCategory)

  const testEndpoint = async (endpoint: Endpoint) => {
    if (endpoint.requiresAuth && endpoint.status === 'auth-required') {
      alert('This endpoint requires authentication. Please sign in first.')
      return
    }

    setTesting(prev => ({ ...prev, [endpoint.path]: true }))
    
    try {
      const response = await fetch(endpoint.path, {
        method: endpoint.method.split('/')[0], // Take first method if multiple
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const result: {
        status: number
        statusText: string
        ok: boolean
        timestamp: string
        data?: any
      } = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        timestamp: new Date().toISOString()
      }
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        try {
          result.data = await response.json()
        } catch {
          result.data = 'Invalid JSON response'
        }
      } else {
        result.data = 'Non-JSON response'
      }
      
      setTestResults(prev => ({ ...prev, [endpoint.path]: result }))
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [endpoint.path]: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      }))
    } finally {
      setTesting(prev => ({ ...prev, [endpoint.path]: false }))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'working':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Working
          </span>
        )
      case 'auth-required':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            🔒 Auth Required
          </span>
        )
      case 'not-found':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="w-3 h-3 mr-1" />
            Not Found
          </span>
        )
      case 'untested':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Untested
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">API Endpoints</h3>
        <div className="text-sm text-gray-500">
          {filteredEndpoints.length} endpoint{filteredEndpoints.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Endpoints List */}
      <div className="space-y-4">
        {filteredEndpoints.map((endpoint, index) => {
          const testResult = testResults[endpoint.path]
          const isTestingEndpoint = testing[endpoint.path]
          
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{endpoint.name}</h4>
                    {getStatusBadge(endpoint.status)}
                  </div>
                  <div className="flex items-center space-x-4 mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-gray-100 text-gray-800">
                      {endpoint.method}
                    </span>
                    <code className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {endpoint.path}
                    </code>
                  </div>
                  <p className="text-sm text-gray-600">{endpoint.description}</p>
                  
                  {testResult && (
                    <div className="mt-3 p-3 bg-gray-50 rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-700">Test Result:</span>
                        <span className="text-xs text-gray-500">
                          {new Date(testResult.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      {testResult.error ? (
                        <div className="text-xs text-red-600">
                          Error: {testResult.error}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className={`text-xs font-medium ${
                            testResult.ok ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {testResult.status} {testResult.statusText}
                          </div>
                          {testResult.data && (
                            <details className="text-xs">
                              <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                                Response Data
                              </summary>
                              <pre className="mt-1 p-2 bg-white border rounded text-xs overflow-x-auto">
                                {typeof testResult.data === 'string' 
                                  ? testResult.data 
                                  : JSON.stringify(testResult.data, null, 2)
                                }
                              </pre>
                            </details>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="ml-4">
                  <button
                    onClick={() => testEndpoint(endpoint)}
                    disabled={isTestingEndpoint}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isTestingEndpoint ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-1"></div>
                    ) : (
                      <PlayIcon className="w-3 h-3 mr-1" />
                    )}
                    {isTestingEndpoint ? 'Testing...' : 'Test'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}