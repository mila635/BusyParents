// components/EmailSync.js or wherever your component is
import { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import WorkflowStatus from './WorkflowStatus'
import { FiMail, FiRefreshCw, FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi'

export default function EmailSync() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [lastSyncTime, setLastSyncTime] = useState(null)

  const triggerWorkflow = async () => {
    if (!session) {
      setError('Please sign in first')
      return
    }

    setIsLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/trigger-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Add any additional data you want to send
          timestamp: new Date().toISOString(),
          action: 'sync_emails',
          scenarioName: 'Email Processing Workflow',
          additionalData: {
            syncRequestedAt: new Date().toISOString(),
            userEmail: session?.user?.email,
            syncSource: 'manual'
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          // Token issues - prompt user to sign in again
          setError('Your session has expired. Please sign in again.')
          return
        }
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      setMessage('Workflow triggered successfully!')
      setLastSyncTime(new Date().toISOString())
      console.log('Workflow response:', data)

    } catch (error) {
      console.error('Error triggering workflow:', error)
      setError(`Failed to trigger workflow: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = () => {
    signIn('google', {
      callbackUrl: window.location.href
    })
  }

  if (status === 'loading') {
    return <div className="p-4">Loading...</div>
  }

  if (!session) {
    return (
      <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Email Sync</h2>
        <p className="mb-4 text-gray-600">
          Please sign in with Google to sync your emails.
        </p>
        <button
          onClick={handleSignIn}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign in with Google
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Email Sync</h2>
      
      <div className="mb-4">
        <div className="flex items-center">
          <FiMail className="mr-2 text-blue-500" />
          <p className="text-sm text-gray-600">
            Signed in as: <span className="font-medium">{session.user.email}</span>
          </p>
        </div>
      </div>

      {session.error === "RefreshAccessTokenError" && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <p className="text-sm">
            Your session has expired. Please sign in again to continue.
          </p>
          <button
            onClick={handleSignIn}
            className="mt-2 text-sm flex items-center hover:underline"
          >
            <FiRefreshCw className="mr-1" />
            Sign in again
          </button>
        </div>
      )}
      
      <div className="mt-4 mb-4">
        <h3 className="text-sm font-semibold mb-2 flex items-center">
          <FiClock className="mr-1" />
          Workflow Status
        </h3>
        <WorkflowStatus 
          action="sync_emails" 
          className="mb-2" 
          showRefresh={true}
          showHistory={true}
          limit={5}
        />
      </div>

      <button
        onClick={triggerWorkflow}
        disabled={isLoading || session.error === "RefreshAccessTokenError"}
        className={`w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center ${
          isLoading || session.error === "RefreshAccessTokenError"
            ? 'bg-gray-400 cursor-not-allowed text-gray-700'
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {isLoading ? (
          <>
            <FiRefreshCw className="mr-2 animate-spin" />
            Triggering...
          </>
        ) : (
          <>
            <FiMail className="mr-2" />
            Sync Emails
          </>
        )}
      </button>

      {message && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-start">
          <FiCheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">{message}</p>
            {lastSyncTime && (
              <p className="text-xs mt-1">Last sync: {new Date(lastSyncTime).toLocaleString()}</p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-start">
          <FiAlertCircle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}