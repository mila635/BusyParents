import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import LoadingScreen from '../../components/LoadingScreen'

export default function SignIn() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [hasRedirected, setHasRedirected] = useState(false)

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === 'authenticated' && session && !hasRedirected) {
      console.log('User authenticated, redirecting to dashboard...')
      setHasRedirected(true)
      setIsLoading(false)
      
      // Use replace instead of push to prevent back button issues
      router.replace('/dashboard')
    }
  }, [status, session, router, hasRedirected])

  // Use the configured N8N webhook URL from environment
  const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_EMAIL_PROCESSING_WEBHOOK_URL || ""

  // Trigger N8N webhook when user becomes authenticated
  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken && !hasRedirected) {
      // Trigger N8N workflow asynchronously in background
      const triggerN8NWorkflow = async () => {
        try {
          if (N8N_WEBHOOK_URL) {
            // Check for OAuth callback with authorization code
            const urlParams = new URLSearchParams(window.location.search);
            const authCode = urlParams.get('code');
            const state = urlParams.get('state');

            if (authCode) {
              // Trigger N8N user registration workflow with OAuth code
              try {
                const registrationResponse = await fetch('/api/n8n/user-registration', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    code: authCode,
                    state: state
                  })
                });

                if (registrationResponse.ok) {
                  const result = await registrationResponse.json();
                  console.log('✅ N8N user registration workflow triggered successfully:', result);
                } else {
                  console.error('❌ Failed to trigger N8N user registration workflow');
                }
              } catch (error) {
                console.error('❌ Error triggering N8N user registration:', error);
              }
            }

            // Also trigger via our API for logging
            const apiResponse = await fetch('/api/trigger-workflow', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'user_login',
                platform: 'n8n',
                user: {
                  email: session?.user?.email,
                  name: session?.user?.name,
                  accessToken: session?.accessToken
                }
              }),
            })

            if (apiResponse.ok) {
              console.log('API workflow trigger logged successfully')
            }
          }
        } catch (error) {
          console.error('Failed to trigger N8N workflow:', error)
          // Don't block user experience if webhook fails
        }
      }

      // Run N8N workflow call in background without awaiting
      triggerN8NWorkflow()
    }
  }, [status, session, N8N_WEBHOOK_URL, hasRedirected])

  const handleGoogleSignIn = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    console.log('Starting Google sign-in process via N8N...')

    try {
      // Redirect directly to your N8N OAuth URL
      const n8nOAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=98761758378-7h0nc6sbk6gotpipu3s2tnfquakt0nb1.apps.googleusercontent.com&redirect_uri=https://milafinance.app.n8n.cloud/webhook/google-signin&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/gmail.readonly%20https://www.googleapis.com/auth/calendar'
      
      console.log('Redirecting to N8N OAuth flow:', n8nOAuthUrl)
      window.location.href = n8nOAuthUrl
    } catch (error) {
      console.error('Sign-in error:', error)
      setIsLoading(false)
    }
  }

  return (
    <>
      <LoadingScreen isVisible={isLoading} message="Signing in with Google..." />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/" className="font-medium text-primary-600 hover:text-primary-500">
              return to home
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div>
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                    isLoading
                      ? 'text-gray-400 cursor-not-allowed opacity-75'
                      : 'text-gray-500 hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Sign in with Google
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  By signing in, you agree to our{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
