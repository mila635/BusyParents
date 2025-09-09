import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Navbar from '../components/Navbar'

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isDisconnecting, setIsDisconnecting] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  
  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    aiDataProcessing: true,
    enhancedPrivacy: false
  })

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const handleDisconnect = async (service: string) => {
    setIsDisconnecting(service)
    try {
      // Simulate disconnection
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`${service} disconnected successfully`)
      showNotification('success', `${service} disconnected successfully`)
      // Here you would typically call an API to actually disconnect the service
    } catch (error) {
      console.error(`Error disconnecting ${service}:`, error)
      showNotification('error', `Failed to disconnect ${service}`)
    } finally {
      setIsDisconnecting(null)
    }
  }

  const handleSettingToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
    const newValue = !settings[setting]
    console.log(`${setting} toggled to:`, newValue)
    showNotification('success', `${setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ${newValue ? 'enabled' : 'disabled'}`)
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      // Simulate account deletion
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Account deleted successfully')
      showNotification('success', 'Account deleted successfully')
      // Here you would typically call an API to actually delete the account
      // Then redirect to sign out
      setTimeout(() => router.push('/auth/signin'), 1000)
    } catch (error) {
      console.error('Error deleting account:', error)
      showNotification('error', 'Failed to delete account')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-800' 
            : 'bg-red-100 border border-red-400 text-red-800'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-6">
            {session.user?.image && (
              <img 
                className="h-20 w-20 rounded-full border-4 border-gray-200" 
                src={session.user.image} 
                alt={session.user.name || 'User'} 
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{session.user?.name}</h1>
              <p className="text-gray-600">{session.user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">Member since {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Connected Services */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Connected Services</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your connected accounts and integrations.
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Gmail Connection */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Gmail</h3>
                  <p className="text-sm text-gray-600">Connected for email processing</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Connected
                </span>
                <button
                  onClick={() => handleDisconnect('gmail')}
                  disabled={isDisconnecting === 'gmail'}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isDisconnecting === 'gmail'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {isDisconnecting === 'gmail' ? 'Disconnecting...' : 'Disconnect'}
                </button>
              </div>
            </div>

            {/* Calendar Connection */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Google Calendar</h3>
                  <p className="text-sm text-gray-600">Connected for event creation</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Connected
                </span>
                <button
                  onClick={() => handleDisconnect('calendar')}
                  disabled={isDisconnecting === 'calendar'}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isDisconnecting === 'calendar'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {isDisconnecting === 'calendar' ? 'Disconnecting...' : 'Disconnect'}
                </button>
              </div>
            </div>

            {/* Reminders Connection */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 006.03 3h11.94c.7 0 1.35.37 1.7.97L21 9v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9c0-.26.06-.51.19-.74L4.19 4.19z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Smart Reminders</h3>
                  <p className="text-sm text-gray-600">Connected for notifications</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Connected
                </span>
                <button
                  onClick={() => handleDisconnect('reminders')}
                  disabled={isDisconnecting === 'reminders'}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isDisconnecting === 'reminders'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {isDisconnecting === 'reminders' ? 'Disconnecting...' : 'Disconnect'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your account preferences and settings.
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive updates about your account and events</p>
              </div>
              <button 
                onClick={() => handleSettingToggle('emailNotifications')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                }`} 
                role="switch" 
                aria-checked={settings.emailNotifications}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}></span>
              </button>
            </div>

            {/* Data Processing */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">AI Data Processing</h3>
                <p className="text-sm text-gray-500">Allow AI to process your emails for event extraction</p>
              </div>
              <button 
                onClick={() => handleSettingToggle('aiDataProcessing')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.aiDataProcessing ? 'bg-blue-600' : 'bg-gray-200'
                }`} 
                role="switch" 
                aria-checked={settings.aiDataProcessing}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.aiDataProcessing ? 'translate-x-5' : 'translate-x-0'
                }`}></span>
              </button>
            </div>

            {/* Privacy Settings */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Enhanced Privacy</h3>
                <p className="text-sm text-gray-500">Use enhanced privacy settings for data processing</p>
              </div>
              <button 
                onClick={() => handleSettingToggle('enhancedPrivacy')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.enhancedPrivacy ? 'bg-blue-600' : 'bg-gray-200'
                }`} 
                role="switch" 
                aria-checked={settings.enhancedPrivacy}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.enhancedPrivacy ? 'translate-x-5' : 'translate-x-0'
                }`}></span>
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-red-200">
          <div className="px-6 py-4 border-b border-red-200">
            <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
            <p className="text-sm text-red-600 mt-1">
              Irreversible and destructive actions.
            </p>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Delete Account</h3>
                <p className="text-sm text-gray-500">Permanently delete your account and all associated data</p>
              </div>
              {!showDeleteConfirm ? (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isDeleting 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isDeleting 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            {showDeleteConfirm && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> This action cannot be undone. All your data, including connected services and preferences, will be permanently deleted.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
