import React, { useState, useEffect } from 'react'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface SystemTest {
  name: string
  status: 'SUCCESS' | 'FAILED' | 'WARNING'
  statusCode?: number
  url?: string
  message?: string
}

interface SystemStatusData {
  status: string
  ready_for_deployment: boolean
  timestamp: string
  environment: {
    NEXTAUTH_URL: string
    N8N_BASE_URL: string
  }
  webhooks: {
    email_processing: string
    calendar_event: string
    user_login: string
  }
  oauth: {
    google_oauth_url: string
    n8n_redirect_uri: string
    app_callback_uri: string
  }
  tests: SystemTest[]
}

export default function SystemStatus() {
  const [systemData, setSystemData] = useState<SystemStatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSystemStatus()
  }, [])

  const fetchSystemStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/test-n8n-integration')
      if (!response.ok) {
        throw new Error('Failed to fetch system status')
      }
      const data = await response.json()
      setSystemData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'FAILED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'WARNING':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
      default:
        return <XCircleIcon className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'text-green-600'
      case 'FAILED':
        return 'text-red-600'
      case 'WARNING':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="flex items-center">
          <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="text-lg font-medium text-red-900">System Status Error</h3>
        </div>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <button
          onClick={fetchSystemStatus}
          className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!systemData) return null

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">System Status</h3>
        <div className="flex items-center">
          {systemData.status === 'ISSUES_DETECTED' ? (
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
          ) : (
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
          )}
          <span className={`text-sm font-medium ${
            systemData.status === 'ISSUES_DETECTED' ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {systemData.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Environment</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div>App URL: {systemData.environment.NEXTAUTH_URL}</div>
            <div>N8N URL: {systemData.environment.N8N_BASE_URL}</div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Deployment Status</h4>
          <div className="flex items-center">
            {systemData.ready_for_deployment ? (
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <XCircleIcon className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${
              systemData.ready_for_deployment ? 'text-green-600' : 'text-red-600'
            }`}>
              {systemData.ready_for_deployment ? 'Ready' : 'Not Ready'}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Component Tests</h4>
        <div className="space-y-2">
          {systemData.tests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center">
                {getStatusIcon(test.status)}
                <span className="ml-2 text-sm font-medium text-gray-900">{test.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${getStatusColor(test.status)}`}>
                  {test.status}
                </span>
                {test.statusCode && (
                  <span className="text-xs text-gray-500">({test.statusCode})</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Last updated: {new Date(systemData.timestamp).toLocaleString()}
        </p>
        <button
          onClick={fetchSystemStatus}
          className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Refresh Status
        </button>
      </div>
    </div>
  )
}