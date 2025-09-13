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
  reminderTiming: number // minutes before event
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
  
  // State for pending events and stats
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [editingEvent, setEditingEvent] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<PendingEvent>>({})
  const [stats, setStats] = useState<DashboardStats>({ emailsProcessed: 0, eventsCreated: 0, timeSaved: 0 })
  const [isTriggeringWorkflow, setIsTriggeringWorkflow] = useState(false)
  
  // State for new features
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailAlerts: false,
    whatsappAlerts: false,
    emailAddress: session?.user?.email || '',
    whatsappNumber: '',
    reminderTiming: 30
  })
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)
  const [isSavingSettings, setIsSavingSettings] = useState(false)

  // Fetch pending events from API
  const fetchPendingEvents = async () => {
    setLoadingEvents(true)
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const events: PendingEvent[] = await response.json()
        setPendingEvents(events)
        logUserAction('Fetch Events', 'Pending Events', 'success', `Loaded ${events.length} pending events`)
      } else {
        throw new Error('Failed to fetch events')
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      setErrorMessage('Failed to load pending events. Please try again.')
      setTimeout(() => setErrorMessage(null), 3000)
      logUserAction('Fetch Events', 'Pending Events', 'failed', 'Failed to load pending events')
    } finally {
      setLoadingEvents(false)
    }
  }

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      if (response.ok) {
        const statsData = await response.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // Fetch notification settings
  const fetchNotificationSettings = async () => {
    try {
      const response = await fetch('/api/notifications/preferences')
      if (response.ok) {
        const settings = await response.json()
        setNotificationSettings(prev => ({ ...prev, ...settings }))
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error)
    }
  }

  // Handle N8N auth success parameter
  useEffect(() => {
    const { auth } = router.query
    if (auth === 'n8n_success') {
      setErrorMessage('Successfully signed in via N8N! Your account is now connected.')
      // Clear the auth parameter from URL
      router.replace('/dashboard', undefined, { shallow: true })
      // Clear success message after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }, [router.query, router])

  // Initial data fetch
  useEffect(() => {
    if (session?.accessToken && !hasCheckedStatus) {
      checkConnectionStatus()
      fetchPendingEvents()
      fetchStats()
      fetchNotificationSettings()
      setHasCheckedStatus(true)
      logUserAction('Dashboard Access', 'Dashboard', 'success', 'User accessed dashboard')
    }
  }, [session, hasCheckedStatus])

  // Handle event approval
  const handleApproveEvent = async (eventId: string) => {
    try {
      const eventToApprove = pendingEvents.find(e => e.id === eventId)
      if (!eventToApprove) return
      
      const response = await fetch('/api/create-calendar-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventToApprove)
      })
      
      if (response.ok) {
        setPendingEvents(prev => prev.filter(event => event.id !== eventId))
        setErrorMessage('✅ Event approved and added to calendar!')
        setTimeout(() => setErrorMessage(null), 3000)
        logUserAction('Approve Event', 'Pending Events', 'success', `Event ${eventId} approved`)
        fetchStats()
      } else {
        throw new Error('Failed to approve event')
      }
    } catch (error) {
      console.error('Error approving event:', error)
      setErrorMessage('❌ Failed to approve event. Please try again.')
      setTimeout(() => setErrorMessage(null), 3000)
      logUserAction('Approve Event', 'Pending Events', 'failed', `Failed to approve event ${eventId}`)
    }
  }

  // Handle event rejection
  const handleRejectEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setPendingEvents(prev => prev.filter(event => event.id !== eventId))
        setErrorMessage('Event rejected successfully!')
        setTimeout(() => setErrorMessage(null), 3000)
        logUserAction('Reject Event', 'Pending Events', 'success', `Event ${eventId} rejected`)
      } else {
        throw new Error('Failed to reject event')
      }
    } catch (error) {
      console.error('Error rejecting event:', error)
      setErrorMessage('Failed to reject event. Please try again.')
      setTimeout(() => setErrorMessage(null), 3000)
      logUserAction('Reject Event', 'Pending Events', 'failed', `Failed to reject event ${eventId}`)
    }
  }

  // Handle event editing
  const handleSaveEvent = async (eventId: string) => {
    try {
      const updatedEvent = { ...pendingEvents.find(e => e.id === eventId), ...editForm }
      
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      })

      if (response.ok) {
        setPendingEvents(prev =>
          prev.map(event =>
            event.id === eventId ? (updatedEvent as PendingEvent) : event
          )
        )
        setEditingEvent(null)
        setEditForm({})
        setErrorMessage('Event updated successfully!')
        setTimeout(() => setErrorMessage(null), 3000)
        logUserAction('Edit Event', 'Pending Events', 'success', `Event ${eventId} updated`)
      }
    } catch (error) {
      console.error('Error saving event:', error)
      setErrorMessage('Failed to save changes. Please try again.')
      setTimeout(() => setErrorMessage(null), 3000)
      logUserAction('Edit Event', 'Pending Events', 'failed', `Failed to update event ${eventId}`)
    }
  }

  const checkConnectionStatus = async () => {
    if (!session?.accessToken) {
      return
    }
    
    try {
      const gmailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
        headers: { 'Authorization': `Bearer ${session?.accessToken}` }
      })
      setConnectionStatus(prev => ({ ...prev, gmail: gmailResponse.ok ? 'connected' : 'not_connected' }))

      const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: { 'Authorization': `Bearer ${session?.accessToken}` }
      })
      setConnectionStatus(prev => ({ ...prev, calendar: calendarResponse.ok ? 'connected' : 'not_connected' }))

      setConnectionStatus(prev => ({ ...prev, reminder: 'connected' }))
      
    } catch (error) {
      console.error('Error checking connection status:', error)
      logUserAction('Status Check', 'Dashboard', 'failed', 'Connection check failed')
    }
  }

  const handleConnect = async (service: string) => {
    setIsConnecting(service)
    setErrorMessage(null)
    logUserAction('Connect Attempt', service.charAt(0).toUpperCase() + service.slice(1), 'pending', 'User clicked connect button')
    signIn('google')
  }

  const handleDisconnect = async (service: string) => {
    logUserAction('Disconnect', service.charAt(0).toUpperCase() + service.slice(1), 'success', 'User manually disconnected service')
    try {
      setConnectionStatus(prev => ({ ...prev, [service]: 'not_connected' }))
      setErrorMessage(`${service.charAt(0).toUpperCase() + service.slice(1)} disconnected successfully!`)
      setTimeout(() => setErrorMessage(null), 3000)
    } catch (error) {
      console.error(`Error disconnecting ${service}:`, error)
    }
  }

  const getButtonText = (service: string) => {
    if (isConnecting === service) return 'Connecting...'
    if (connectionStatus[service] === 'connected') return 'Connected'
    if (connectionStatus[service] === 'failed') return 'Retry'
    return 'Connect'
  }

  const getButtonClass = (service: string) => {
    if (isConnecting === service) {
      return 'bg-gray-300 text-gray-500 cursor-not-allowed'
    }
    if (connectionStatus[service] === 'connected') {
      return 'bg-green-600 hover:bg-green-700 text-white'
    }
    if (connectionStatus[service] === 'failed') {
      return 'bg-red-600 hover:bg-red-700 text-white'
    }
    return 'bg-blue-600 hover:bg-blue-700 text-white'
  }

  const isButtonDisabled = (service: string) => {
    return isConnecting === service
  }

  const handleRefreshStatus = () => {
    logUserAction('Refresh Status', 'Dashboard', 'pending', 'User manually refreshed connection status')
    checkConnectionStatus()
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100'
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`
  }

  // Use local API endpoint for N8N workflow triggers
  const N8N_API_ENDPOINT = '/api/n8n/trigger-workflows'

  // Trigger N8N workflows on dashboard access
  useEffect(() => {
    if (session?.accessToken && hasCheckedStatus) {
      triggerN8NWorkflowsOnLogin()
    }
  }, [session, hasCheckedStatus])

  const triggerN8NWorkflowsOnLogin = async () => {
    try {
      const response = await fetch(N8N_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'dashboard_access',
          workflowType: 'both'
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('N8N workflows triggered successfully:', result.message)
        logUserAction('N8N Workflows', 'Dashboard Access', 'success', result.message)
      } else {
        const error = await response.json()
        console.warn('N8N workflow trigger failed:', error.message)
        logUserAction('N8N Workflows', 'Dashboard Access', 'failed', error.message)
      }
    } catch (error) {
      console.warn('N8N workflows not available - this is normal in development mode')
      logUserAction('N8N Workflows', 'Dashboard Access', 'skipped', 'N8N not configured')
    }
  }

  const handleTriggerWorkflow = async () => {
    setIsTriggeringWorkflow(true)
    try {
      // Trigger N8N workflows via local API endpoint
      const response = await fetch(N8N_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'manual_email_scan',
          workflowType: 'both'
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setErrorMessage(`✅ N8N Workflows triggered! (${result.summary.successful}/${result.summary.total} successful) Check your inbox for new events.`)
        fetchPendingEvents()
        fetchStats()
        logUserAction('Trigger Workflow', 'N8N Integration', 'success', result.message)
      } else {
        const error = await response.json()
        setErrorMessage(`❌ Failed to trigger workflows: ${error.message}`)
        logUserAction('Trigger Workflow', 'N8N Integration', 'failed', 'All workflow triggers failed')
      }
    } catch (error) {
      setErrorMessage('❌ Failed to trigger workflow. Network error.')
      logUserAction('Trigger Workflow', 'N8N Integration', 'failed', 'Network error during workflow trigger')
    } finally {
      setIsTriggeringWorkflow(false)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleSaveNotificationSettings = async () => {
    setIsSavingSettings(true)
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationSettings)
      })
      if (response.ok) {
        setErrorMessage('✅ Notification settings saved successfully!')
        logUserAction('Save Settings', 'Notifications', 'success', 'User updated notification preferences')
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setErrorMessage('❌ Failed to save settings. Please try again.')
      logUserAction('Save Settings', 'Notifications', 'failed', 'Failed to save notification settings')
    } finally {
      setIsSavingSettings(false)
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }

  const handleTestWhatsApp = async () => {
    try {
      const response = await fetch('/api/notifications/preferences?action=test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'whatsapp',
          number: notificationSettings.whatsappNumber
        })
      })
      if (response.ok) {
        setErrorMessage('✅ Test WhatsApp message sent successfully!')
        logUserAction('Test WhatsApp', 'Notifications', 'success', 'User tested WhatsApp notification')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send test WhatsApp')
      }
    } catch (error) {
      console.error('Error sending test WhatsApp:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      setErrorMessage(`❌ ${errorMessage}`)
      logUserAction('Test WhatsApp', 'Notifications', 'failed', 'Failed to send test WhatsApp message')
    }
    setTimeout(() => setErrorMessage(null), 5000)
  }

  const handleTestEmail = async () => {
    try {
      const response = await fetch('/api/notifications/preferences?action=test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'email'
        })
      })
      if (response.ok) {
        setErrorMessage('✅ Test email notification sent successfully!')
        logUserAction('Test Email', 'Notifications', 'success', 'User tested email notification')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send test email')
      }
    } catch (error) {
      console.error('Error sending test email:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      setErrorMessage(`❌ ${errorMessage}`)
      logUserAction('Test Email', 'Notifications', 'failed', 'Failed to send test email notification')
    }
    setTimeout(() => setErrorMessage(null), 5000)
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

        {/* Error/Success Message */}
        {errorMessage && (
          <div className={`mb-6 p-4 rounded-lg border shadow-sm ${
            errorMessage.includes('Successfully') || errorMessage.includes('✅') 
              ? 'border-green-200 bg-green-50' 
              : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {errorMessage.includes('Successfully') || errorMessage.includes('✅') ? (
                  <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm ${
                  errorMessage.includes('Successfully') || errorMessage.includes('✅') 
                    ? 'text-green-700' 
                    : 'text-red-700'
                }`}>{errorMessage}</p>
              </div>
            </div>
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
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Service Connections</h2>
              <button
                onClick={handleRefreshStatus}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Refresh Status
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Gmail Connection */}
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819l6.545 4.91 6.545-4.91h3.819A1.636 1.636 0 0 1 24 5.457z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Gmail</h3>
                <p className="text-sm text-gray-600 mb-4">Connect your Gmail to process emails automatically</p>
                <button
                  onClick={() => connectionStatus.gmail === 'connected' ? handleDisconnect('gmail') : handleConnect('gmail')}
                  disabled={isButtonDisabled('gmail')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${getButtonClass('gmail')}`}
                >
                  {getButtonText('gmail')}
                </button>
              </div>

              {/* Calendar Connection */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Google Calendar</h3>
                <p className="text-sm text-gray-600 mb-4">Sync events directly to your calendar</p>
                <button
                  onClick={() => connectionStatus.calendar === 'connected' ? handleDisconnect('calendar') : handleConnect('calendar')}
                  disabled={isButtonDisabled('calendar')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${getButtonClass('calendar')}`}
                >
                  {getButtonText('calendar')}
                </button>
              </div>

              {/* Smart Reminders */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h8V9H4v2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Smart Reminders</h3>
                <p className="text-sm text-gray-600 mb-4">Get intelligent notifications for your events</p>
                <button
                  onClick={() => setShowNotificationSettings(!showNotificationSettings)}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition-colors"
                >
                  Configure
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        {showNotificationSettings && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Email Alerts</h3>
                    <p className="text-sm text-gray-600">Receive email notifications for new events</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailAlerts}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailAlerts: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">WhatsApp Alerts</h3>
                    <p className="text-sm text-gray-600">Receive WhatsApp notifications for new events</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.whatsappAlerts}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, whatsappAlerts: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {notificationSettings.whatsappAlerts && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Number
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="tel"
                        value={notificationSettings.whatsappNumber}
                        onChange={(e) => setNotificationSettings(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                        placeholder="+1234567890"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleTestWhatsApp}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                      >
                        Test
                      </button>
                    </div>
                  </div>
                )}

                {notificationSettings.emailAlerts && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="email"
                        value={notificationSettings.emailAddress}
                        onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailAddress: e.target.value }))}
                        placeholder="your@email.com"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleTestEmail}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        Test
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reminder Timing (minutes before event)
                  </label>
                  <select
                    value={notificationSettings.reminderTiming}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, reminderTiming: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={1440}>1 day</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  {isSavingSettings ? (
                    <div className="flex items-center text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    <button
                      onClick={handleSaveNotificationSettings}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                    >
                      Save Notification Settings
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Pending Events</h2>
              <button
                onClick={handleTriggerWorkflow}
                disabled={isTriggeringWorkflow}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm font-medium"
              >
                {isTriggeringWorkflow ? 'Processing...' : 'Scan for New Events'}
              </button>
            </div>
          </div>
          <div className="p-6">
            {loadingEvents ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading events...</p>
              </div>
            ) : pendingEvents.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending events</h3>
                <p className="text-gray-600">Your AI assistant will automatically detect events from your emails and show them here for approval.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {editingEvent === event.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editForm.title || event.title}
                              onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Event title"
                            />
                            <textarea
                              value={editForm.description || event.description}
                              onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={3}
                              placeholder="Event description"
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="datetime-local"
                                value={editForm.startDate || event.startDate}
                                onChange={(e) => setEditForm(prev => ({ ...prev, startDate: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <input
                                type="datetime-local"
                                value={editForm.endDate || event.endDate}
                                onChange={(e) => setEditForm(prev => ({ ...prev, endDate: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <input
                              type="text"
                              value={editForm.location || event.location || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Location (optional)"
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSaveEvent(event.id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingEvent(null)
                                  setEditForm({})
                                }}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(event.confidenceScore)}`}>
                                {Math.round(event.confidenceScore * 100)}% confidence
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">{event.description}</p>
                            <div className="text-sm text-gray-500 space-y-1">
                              <p><strong>Start:</strong> {formatDate(event.startDate)}</p>
                              <p><strong>End:</strong> {formatDate(event.endDate)}</p>
                              {event.location && <p><strong>Location:</strong> {event.location}</p>}
                              <p><strong>Source:</strong> {event.source}</p>
                              <p><strong>Extracted from:</strong> {event.extractedFrom}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      {editingEvent !== event.id && (
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => setEditingEvent(event.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleApproveEvent(event.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectEvent(event.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
