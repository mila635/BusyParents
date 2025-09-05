import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function ErrorPage() {
  const router = useRouter()
  const { error } = router.query

  useEffect(() => {
    // Redirect to signin page after 5 seconds
    const timer = setTimeout(() => {
      router.push('/auth/signin')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'OAuthSignin':
        return 'There was an error during the sign-in process. Please try again.'
      case 'OAuthCallback':
        return 'There was an error during the callback process. Please try again.'
      case 'OAuthCreateAccount':
        return 'There was an error creating your account. Please try again.'
      case 'EmailCreateAccount':
        return 'There was an error creating your account with email. Please try again.'
      case 'Callback':
        return 'There was an error during the callback process. Please try again.'
      case 'OAuthAccountNotLinked':
        return 'This account is already associated with another sign-in method.'
      case 'EmailSignin':
        return 'There was an error sending the sign-in email. Please try again.'
      case 'CredentialsSignin':
        return 'Invalid credentials. Please check your email and password.'
      case 'SessionRequired':
        return 'Please sign in to access this page.'
      default:
        return 'An unexpected error occurred. Please try again.'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h1>
          <p className="text-gray-600 mb-6">
            {error ? getErrorMessage(error as string) : 'An error occurred during authentication.'}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/auth/signin')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Home
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Redirecting to sign-in page in 5 seconds...
          </p>
        </div>
      </div>
    </div>
  )
}
