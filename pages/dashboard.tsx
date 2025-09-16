import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

// Interface for pending events
interface PendingEvent {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location?: string
  source: string
  confidenceScore: number
  extractedFrom: string
  createdAt: string
}

// Interface for notification settings
interface NotificationSettings {
  emailAlerts: boolean
  whatsappAlerts: boolean
  emailAddress: string
  whatsappNumber: string
  reminderTiming: number
}

// Dashboard stats interface
interface DashboardStats {
  emailsProcessed: number
  eventsCreated: number
  timeSaved: number
}

// Simple function to log user actions to Google Sheets
const logUserAction = async (action: string, service: string, status: string, details?: string) => {
  try {
    await fetch('/api/log-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        service,
        status,
        details
      })
    })
  } catch (error) {
    console.error('Failed to log action:', error)
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<{[key: string]: 'connected' | 'failed' | 'not_connected'}>({
    gmail: 'not_connected',
    calendar: 'not_connected',
    reminder: 'not_connected'
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [hasCheckedStatus, setHasCheckedStatus] = useState(false)
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(false)
  const [isProcessingWorkflow, setIsProcessingWorkflow] = useState(false)
  const [recentActivity, setRecentActivity] = useState<Array<{id: string, type: string, message: string, timestamp: Date}>>([])  
  const [systemStatus, setSystemStatus] = useState<'online' | 'processing' | 'offline'>('online')
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  
  // State for pending events and stats
  const [editingEvent, setEditingEvent] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<PendingEvent>>({})
  const [stats, setStats] = useState<DashboardStats>({ emailsProcessed: 0, eventsCreated: 0, timeSaved: 0 })
  const [isTriggeringWorkflow, setIsTriggeringWorkflow] = useState(false)
  const [isLiveUpdatesConnected, setIsLiveUpdatesConnected] = useState(false)
  
  // State for notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailAlerts: false,
    whatsappAlerts: false,
    emailAddress: session?.user?.email || '',
    whatsappNumber: '',
    reminderTiming: 30
  })
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)
  const [isSavingSettings, setIsSavingSettings] = useState(false)

  // Set up real-time updates using Server-Sent Events
  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.email) {
      console.log('Dashboard: Skipping real-time updates - user not authenticated')
      return
    }

    console.log('🔗 Setting up real-time updates for:', session.user.email)
    const eventSource = new EventSource(`/api/dashboard/live-updates?email=${encodeURIComponent(session.user.email)}`)
    
    eventSource.onopen = () => {
      console.log('✅ Real-time updates connected')
      setIsLiveUpdatesConnected(true)
    }
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('📡 Real-time update received:', data)
        
        if (data.type === 'activity') {
          setRecentActivity(prev => [data, ...prev.slice(0, 9)])
        }
        
        if (data.type === 'stats') {
          setStats(data.stats)
        }
        
        if (data.type === 'events') {
          setPendingEvents(data.events)
        }
      } catch (error) {
        console.error('Error parsing real-time data:', error)
      }
    }
    
    eventSource.onerror = (error) => {
      console.error('❌ Real-time updates error:', error)
      setIsLiveUpdatesConnected(false)
    }

    return () => {
      console.log('🔗 Closing real-time updates connection')
      eventSource.close()
      setIsLiveUpdatesConnected(false)
    }
  }, [status, session?.user?.email])

  // Send test WhatsApp message
  const sendTestWhatsApp = async () => {
    try {
      const response = await fetch('/api/notifications/test-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          whatsappNumber: notificationSettings.whatsappNumber 
        })
      })
      
      if (response.ok) {
        setErrorMessage('✅ Test WhatsApp message sent successfully!')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send test WhatsApp')
      }
    } catch (error) {
      console.error('Error sending test WhatsApp:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      setErrorMessage(`❌ ${errorMessage}`)
    }
    
    setTimeout(() => setErrorMessage(null), 5000)
  }

  // Send test email notification
  const sendTestEmail = async () => {
    try {
      const response = await fetch('/api/notifications/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        setErrorMessage('✅ Test email notification sent successfully!')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send test email')
      }
    } catch (error) {
      console.error('Error sending test email:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      setErrorMessage(`❌ ${errorMessage}`)
    }
    
    setTimeout(() => setErrorMessage(null), 5000)
  }



  // Check connection status
  const checkConnectionStatus = async () => {
    if (hasCheckedStatus) return
    
    try {
      const response = await fetch('/api/check-connections')
      if (response.ok) {
        const data = await response.json()
        setConnectionStatus(data)
      }
    } catch (error) {
      console.error('Error checking connection status:', error)
    } finally {
      setHasCheckedStatus(true)
    }
  }

  // Connect service
  const connectService = async (service: string) => {
    setIsConnecting(service)
    try {
      const response = await fetch(`/api/connect-${service}`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.authUrl) {
          window.open(data.authUrl, '_blank')
        }
        setConnectionStatus(prev => ({ ...prev, [service]: 'connected' }))
        setErrorMessage(`✅ ${service.charAt(0).toUpperCase() + service.slice(1)} connected successfully!`)
      } else {
        throw new Error(`Failed to connect ${service}`)
      }
    } catch (error) {
      console.error(`Error connecting ${service}:`, error)
      setConnectionStatus(prev => ({ ...prev, [service]: 'failed' }))
      setErrorMessage(`❌ Failed to connect ${service}. Please try again.`)
    } finally {
      setIsConnecting(null)
    }
  }

  // Fetch pending events
  const fetchPendingEvents = async () => {
    setIsLoadingEvents(true)
    try {
      const response = await fetch('/api/events/pending')
      if (response.ok) {
        const data = await response.json()
        // API already returns transformed data
        setPendingEvents(data)
      }
    } catch (error) {
      console.error('Error fetching pending events:', error)
    } finally {
      setIsLoadingEvents(false)
    }
  }

  // Approve event
  const approveEvent = async (eventId: string) => {
    try {
      const response = await fetch('/api/events/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ eventId })
      })
      
      if (response.ok) {
        setPendingEvents(prev => prev.filter(event => event.id !== eventId))
        setErrorMessage('✅ Event approved and added to calendar!')
        // Update stats
        setStats(prev => ({ ...prev, eventsCreated: prev.eventsCreated + 1 }))
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to approve event')
      }
    } catch (error) {
      console.error('Error approving event:', error)
      setErrorMessage('❌ Failed to approve event. Please try again.')
    }
  }

  // Reject event
  const rejectEvent = async (eventId: string) => {
    try {
      const response = await fetch('/api/events/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ eventId })
      })
      
      if (response.ok) {
        setPendingEvents(prev => prev.filter(event => event.id !== eventId))
        setErrorMessage('✅ Event rejected successfully.')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to reject event')
      }
    } catch (error) {
      console.error('Error rejecting event:', error)
      setErrorMessage('❌ Failed to reject event. Please try again.')
    }
  }

  // Save notification settings
  const saveNotificationSettings = async () => {
    setIsSavingSettings(true)
    try {
      const response = await fetch('/api/notification-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationSettings)
      })
      
      if (response.ok) {
        setErrorMessage('✅ Notification settings saved successfully!')
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving notification settings:', error)
      setErrorMessage('❌ Failed to save notification settings. Please try again.')
    } finally {
      setIsSavingSettings(false)
    }
    
    setTimeout(() => setErrorMessage(null), 5000)
  }

  // Trigger workflow manually
  const triggerWorkflow = async () => {
    setIsProcessingWorkflow(true)
    setSystemStatus('processing')
    setLastUpdate(new Date())
    
    try {
      const response = await fetch('/api/trigger-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'manual_email_scan',
          platform: 'web'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setErrorMessage('✅ Workflow triggered successfully! Processing emails...')
        
        // Add to recent activity
        const newActivity = {
          id: Date.now().toString(),
          type: 'workflow',
          message: 'Manual workflow triggered',
          timestamp: new Date()
        }
        setRecentActivity(prev => [newActivity, ...prev.slice(0, 4)])
        
        // Refresh pending events after a delay
        setTimeout(() => {
          fetchPendingEvents()
          setSystemStatus('online')
          setLastUpdate(new Date())
        }, 3000)
      } else {
        throw new Error('Failed to trigger workflow')
      }
    } catch (error) {
      console.error('Error triggering workflow:', error)
      setErrorMessage('❌ Failed to trigger workflow. Please try again.')
      setSystemStatus('offline')
      setLastUpdate(new Date())
    } finally {
      setIsProcessingWorkflow(false)
    }
  }

  // Check connections and fetch events on mount
  useEffect(() => {
    checkConnectionStatus()
    fetchPendingEvents()
  }, [])

  // Loading state
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

  // Main component render
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

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

        {/* Real-time Status Banner */}
        <div className={`mb-6 p-4 rounded-lg border ${
          systemStatus === 'online' ? 'bg-green-50 border-green-200' :
          systemStatus === 'processing' ? 'bg-blue-50 border-blue-200' :
          'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                systemStatus === 'online' ? 'bg-green-500' :
                systemStatus === 'processing' ? 'bg-blue-500 animate-pulse' :
                'bg-red-500'
              }`}></div>
              <div>
                <p className={`text-sm font-medium ${
                  systemStatus === 'online' ? 'text-green-800' :
                  systemStatus === 'processing' ? 'text-blue-800' :
                  'text-red-800'
                }`}>
                  {systemStatus === 'online' ? 'System Online' :
                   systemStatus === 'processing' ? 'Processing Emails...' :
                   'System Offline'}
                </p>
                <p className={`text-xs ${
                  systemStatus === 'online' ? 'text-green-600' :
                  systemStatus === 'processing' ? 'text-blue-600' :
                  'text-red-600'
                }`}>
                  {systemStatus === 'online' ? 'All services running normally' :
                   systemStatus === 'processing' ? 'Checking for new events and reminders' :
                   'Some services may be unavailable'}
                </p>
              </div>
            </div>
            <div className={`text-xs ${
              systemStatus === 'online' ? 'text-green-600' :
              systemStatus === 'processing' ? 'text-blue-600' :
              'text-red-600'
            }`}>
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Error/Success Message */}
        {errorMessage && (
          <div className={`mb-6 p-4 rounded-md ${
            errorMessage.includes('✅') 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {errorMessage}
          </div>
        )}

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Emails Processed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.emailsProcessed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Events Created</p>
                <p className="text-2xl font-bold text-gray-900">{stats.eventsCreated}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Time Saved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.timeSaved}h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Connection Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Service Connections</h3>
            <p className="text-sm text-gray-600">Connect your accounts to enable automated email processing</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Gmail Connection */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    connectionStatus.gmail === 'connected' ? 'bg-green-500' :
                    connectionStatus.gmail === 'failed' ? 'bg-red-500' : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">Gmail</p>
                    <p className="text-sm text-gray-600">
                      {connectionStatus.gmail === 'connected' ? 'Connected' :
                       connectionStatus.gmail === 'failed' ? 'Failed' : 'Not Connected'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => connectService('gmail')}
                  disabled={isConnecting === 'gmail' || connectionStatus.gmail === 'connected'}
                  className={`px-3 py-1 text-sm rounded-md ${
                    connectionStatus.gmail === 'connected'
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                  }`}
                >
                  {isConnecting === 'gmail' ? 'Connecting...' :
                   connectionStatus.gmail === 'connected' ? 'Connected' : 'Connect'}
                </button>
              </div>

              {/* Calendar Connection */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    connectionStatus.calendar === 'connected' ? 'bg-green-500' :
                    connectionStatus.calendar === 'failed' ? 'bg-red-500' : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">Calendar</p>
                    <p className="text-sm text-gray-600">
                      {connectionStatus.calendar === 'connected' ? 'Connected' :
                       connectionStatus.calendar === 'failed' ? 'Failed' : 'Not Connected'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => connectService('calendar')}
                  disabled={isConnecting === 'calendar' || connectionStatus.calendar === 'connected'}
                  className={`px-3 py-1 text-sm rounded-md ${
                    connectionStatus.calendar === 'connected'
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                  }`}
                >
                  {isConnecting === 'calendar' ? 'Connecting...' :
                   connectionStatus.calendar === 'connected' ? 'Connected' : 'Connect'}
                </button>
              </div>

              {/* Smart Reminders Connection */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    connectionStatus.reminder === 'connected' ? 'bg-green-500' :
                    connectionStatus.reminder === 'failed' ? 'bg-red-500' : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">Smart Reminders</p>
                    <p className="text-sm text-gray-600">
                      {connectionStatus.reminder === 'connected' ? 'Connected' :
                       connectionStatus.reminder === 'failed' ? 'Failed' : 'Not Connected'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => connectService('reminder')}
                  disabled={isConnecting === 'reminder' || connectionStatus.reminder === 'connected'}
                  className={`px-3 py-1 text-sm rounded-md ${
                    connectionStatus.reminder === 'connected'
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                  }`}
                >
                  {isConnecting === 'reminder' ? 'Connecting...' :
                   connectionStatus.reminder === 'connected' ? 'Connected' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Pending Events</h3>
            <p className="text-sm text-gray-600">Review and approve events extracted from your emails</p>
          </div>
          <div className="p-6">
            {isLoadingEvents ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading events...</span>
              </div>
            ) : pendingEvents.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No pending events</h3>
                <p className="mt-1 text-sm text-gray-500">Events extracted from emails will appear here for review.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Date:</span> {new Date(event.startDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Time:</span> {new Date(event.startDate).toLocaleTimeString()}
                          </p>
                          {event.location && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Location:</span> {event.location}
                            </p>
                          )}
                          {event.description && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Description:</span> {event.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">From email:</span> {event.extractedFrom}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 flex space-x-2">
                        <button
                          onClick={() => approveEvent(event.id)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectEvent(event.id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
                <p className="text-sm text-gray-600">Configure how you receive notifications</p>
              </div>
              <button
                onClick={() => setShowNotificationSettings(!showNotificationSettings)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {showNotificationSettings ? 'Hide Settings' : 'Configure'}
              </button>
            </div>
          </div>
          
          {showNotificationSettings && (
            <div className="p-6">
              <div className="space-y-6">
                {/* Email Notifications */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Email Notifications</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailAlerts}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev,
                          emailAlerts: e.target.checked
                        }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable email alerts</span>
                    </label>
                    
                    {notificationSettings.emailAlerts && (
                      <div className="ml-6 space-y-2">
                        <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={notificationSettings.emailAddress}
                          onChange={(e) => setNotificationSettings(prev => ({
                            ...prev,
                            emailAddress: e.target.value
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter email address"
                        />
                        <label className="block text-sm text-gray-600 mb-1">Reminder Timing (minutes)</label>
                        <input
                          type="number"
                          value={notificationSettings.reminderTiming}
                          onChange={(e) => setNotificationSettings(prev => ({
                            ...prev,
                            reminderTiming: parseInt(e.target.value) || 30
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                          max="1440"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* WhatsApp Notifications */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">WhatsApp Notifications</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.whatsappAlerts}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev,
                          whatsappAlerts: e.target.checked
                        }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable WhatsApp alerts</span>
                    </label>
                    
                    {notificationSettings.whatsappAlerts && (
                      <div className="ml-6">
                        <label className="block text-sm text-gray-600 mb-1">WhatsApp Number</label>
                        <input
                          type="tel"
                          value={notificationSettings.whatsappNumber || ''}
                          onChange={(e) => setNotificationSettings(prev => ({
                            ...prev,
                            whatsappNumber: e.target.value
                          }))}
                          placeholder="+1234567890"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={saveNotificationSettings}
                    disabled={isSavingSettings}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {isSavingSettings ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Workflow Controls & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Workflow Trigger */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Manual Workflow</h3>
              <p className="text-sm text-gray-600">Trigger email processing manually</p>
            </div>
            <div className="p-6">
              <div className="text-center">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Process Emails Now</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Manually trigger the email processing workflow to check for new events and reminders.
                </p>
                <button
                  onClick={triggerWorkflow}
                  disabled={isProcessingWorkflow}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingWorkflow ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Trigger Workflow'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-600">Latest system activities and updates</p>
            </div>
            <div className="p-6">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'workflow' ? 'bg-blue-500' :
                        activity.type === 'event' ? 'bg-green-500' :
                        activity.type === 'error' ? 'bg-red-500' : 'bg-gray-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">
                          {activity.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">How It Works</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Your Accounts</h3>
                <p className="text-gray-600">Link your Gmail and Google Calendar to enable automatic email processing and event creation.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">AI Processes Your Emails</h3>
                <p className="text-gray-600">Our AI automatically scans your emails and extracts event information with high accuracy.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Automatic Event Creation</h3>
                <p className="text-gray-600">Review and approve detected events, then they're automatically added to your calendar.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

