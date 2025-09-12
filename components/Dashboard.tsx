import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Navbar from './Navbar'

interface PendingEvent {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location?: string
  source: string
  confidenceScore: number
  extractedData: any
}

interface NotificationSettings {
  emailReminders: boolean
  whatsappReminders: boolean
  reminderTiming: number
}

interface DashboardStats {
  emailsProcessed: number
  eventsCreated: number
  timeSaved: number
}

const logUserAction = async (action: string, details?: any) => {
  try {
    await fetch('/api/log-action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        details,
        timestamp: new Date().toISOString(),
      }),
    })
  } catch (error) {
    console.error('Failed to log user action:', error)
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isTriggeringWorkflow, setIsTriggeringWorkflow] = useState(false)
  const [editingEvent, setEditingEvent] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<PendingEvent>>({})
  const [stats, setStats] = useState<DashboardStats>({
    emailsProcessed: 0,
    eventsCreated: 0,
    timeSaved: 0
  })
  const [connectionStatus, setConnectionStatus] = useState({
    gmail: 'unknown' as 'connected' | 'failed' | 'unknown',
    calendar: 'unknown' as 'connected' | 'failed' | 'unknown',
    reminder: 'unknown' as 'connected' | 'failed' | 'unknown'
  })
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailReminders: true,
    whatsappReminders: false,
    reminderTiming: 15
  })

  useEffect(() => {
    if (session) {
      fetchDashboardData()
      fetchConnectionStatus()
    }
  }, [session])

  const fetchDashboardData = async () => {
    setLoadingEvents(true)
    try {
      const [eventsResponse, statsResponse] = await Promise.all([
        fetch('/api/events/pending'),
        fetch('/api/stats')
      ])
      
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json()
        setPendingEvents(eventsData.events || [])
      }
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setErrorMessage('Failed to load dashboard data')
    } finally {
      setLoadingEvents(false)
    }
  }

  const fetchConnectionStatus = async () => {
    try {
      const response = await fetch('/api/workflow-status')
      if (response.ok) {
        const data = await response.json()
        setConnectionStatus({
          gmail: data.gmail?.connected ? 'connected' : 'failed',
          calendar: data.calendar?.connected ? 'connected' : 'failed',
          reminder: data.reminder?.connected ? 'connected' : 'failed'
        })
      }
    } catch (error) {
      console.error('Error fetching connection status:', error)
    }
  }

  const handleTriggerWorkflow = async () => {
    setIsTriggeringWorkflow(true)
    try {
      const response = await fetch('/api/trigger-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (data.success) {
        setErrorMessage('✅ Workflow triggered successfully! New events will appear shortly.')
        await logUserAction('trigger_workflow', { success: true })
        setTimeout(() => {
          fetchDashboardData()
        }, 3000)
      } else {
        setErrorMessage(`❌ Failed to trigger workflow: ${data.error}`)
        await logUserAction('trigger_workflow', { success: false, error: data.error })
      }
    } catch (error) {
      console.error('Error triggering workflow:', error)
      setErrorMessage('❌ Failed to trigger workflow. Please try again.')
      await logUserAction('trigger_workflow', { success: false, error: 'Network error' })
    } finally {
      setIsTriggeringWorkflow(false)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleApproveEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/approve`, {
        method: 'POST',
      })
      
      if (response.ok) {
        setPendingEvents(prev => prev.filter(event => event.id !== eventId))
        setErrorMessage('✅ Event approved and added to calendar!')
        await logUserAction('approve_event', { eventId })
        
        // Update stats
        setStats(prev => ({
          ...prev,
          eventsCreated: prev.eventsCreated + 1,
          timeSaved: prev.timeSaved + 0.25
        }))
      } else {
        setErrorMessage('❌ Failed to approve event')
      }
    } catch (error) {
      console.error('Error approving event:', error)
      setErrorMessage('❌ Failed to approve event')
    } finally {
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleRejectEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/reject`, {
        method: 'POST',
      })
      
      if (response.ok) {
        setPendingEvents(prev => prev.filter(event => event.id !== eventId))
        setErrorMessage('Event rejected and removed')
        await logUserAction('reject_event', { eventId })
      } else {
        setErrorMessage('❌ Failed to reject event')
      }
    } catch (error) {
      console.error('Error rejecting event:', error)
      setErrorMessage('❌ Failed to reject event')
    } finally {
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleEditEvent = (event: PendingEvent) => {
    setEditingEvent(event.id)
    setEditForm({
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location
    })
  }

  const handleSaveEdit = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })
      
      if (response.ok) {
        const updatedEvent = await response.json()
        setPendingEvents(prev => 
          prev.map(event => 
            event.id === eventId ? { ...event, ...editForm } : event
          )
        )
        setEditingEvent(null)
        setEditForm({})
        setErrorMessage('✅ Event updated successfully!')
        await logUserAction('edit_event', { eventId, changes: editForm })
      } else {
        setErrorMessage('❌ Failed to update event')
      }
    } catch (error) {
      console.error('Error updating event:', error)
      setErrorMessage('❌ Failed to update event')
    } finally {
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleRefreshStatus = async () => {
    await fetchConnectionStatus()
    setErrorMessage('✅ Connection status refreshed')
    setTimeout(() => setErrorMessage(null), 3000)
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800'
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mt-2">
            Let's get your AI assistant set up to help manage your busy schedule.
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">{errorMessage}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setErrorMessage(null)}
                  className="inline-flex text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
