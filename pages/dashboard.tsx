// import { useSession } from 'next-auth/react'
// import { useRouter } from 'next/router'
// import { useState, useEffect } from 'react'
// import Navbar from '../components/Navbar'

// // Simple function to log user actions to Google Sheets
// const logUserAction = async (action: string, service: string, status: string, details?: string) => {
//   try {
//     await fetch('/api/log-action', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         action,
//         service,
//         status,
//         details
//       })
//     })
//   } catch (error) {
//     console.error('Failed to log action:', error)
//   }
// }

// export default function Dashboard() {
//   const { data: session, status } = useSession()
//   const router = useRouter()
//   const [isConnecting, setIsConnecting] = useState<string | null>(null)
//   const [connectionStatus, setConnectionStatus] = useState<{[key: string]: 'connected' | 'failed' | 'not_connected'}>({
//     gmail: 'not_connected',
//     calendar: 'not_connected',
//     reminder: 'not_connected'
//   })
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)
//   const [hasCheckedStatus, setHasCheckedStatus] = useState(false)

//   // Check connection status only once when component mounts
//   useEffect(() => {
//     if (session?.accessToken && !hasCheckedStatus) {
//       console.log('Dashboard: Session access token available, checking connection status...')
//       checkConnectionStatus()
//       setHasCheckedStatus(true)
      
//       // Log dashboard access
//       logUserAction('Dashboard Access', 'Dashboard', 'success', 'User accessed dashboard')
//     }
//   }, [session, hasCheckedStatus])

//   const checkConnectionStatus = async () => {
//     console.log('Dashboard: Starting connection status check...')
    
//     try {
//       // Check Gmail connection
//       try {
//         console.log('Dashboard: Testing Gmail API access...')
//         const gmailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
//           headers: {
//             'Authorization': `Bearer ${session?.accessToken}`,
//             'Content-Type': 'application/json'
//           }
//         })
//         if (gmailResponse.ok) {
//           console.log('Dashboard: Gmail API accessible')
//           setConnectionStatus(prev => ({ ...prev, gmail: 'connected' }))
//           logUserAction('Status Check', 'Gmail', 'success', 'Gmail API accessible')
//         } else {
//           console.log('Dashboard: Gmail API not accessible, status:', gmailResponse.status)
//           setConnectionStatus(prev => ({ ...prev, gmail: 'not_connected' }))
//           logUserAction('Status Check', 'Gmail', 'failed', `Status: ${gmailResponse.status}`)
//         }
//       } catch (error) {
//         console.log('Dashboard: Gmail not accessible:', error)
//         setConnectionStatus(prev => ({ ...prev, gmail: 'not_connected' }))
//         logUserAction('Status Check', 'Gmail', 'failed', 'API call failed')
//       }

//       // Check Calendar connection
//       try {
//         console.log('Dashboard: Testing Calendar API access...')
//         const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
//           headers: {
//             'Authorization': `Bearer ${session?.accessToken}`,
//             'Content-Type': 'application/json'
//           }
//         })
//         if (calendarResponse.ok) {
//           console.log('Dashboard: Calendar API accessible')
//           setConnectionStatus(prev => ({ ...prev, calendar: 'connected' }))
//           logUserAction('Status Check', 'Google Calendar', 'success', 'Calendar API accessible')
//         } else {
//           console.log('Dashboard: Calendar API not accessible, status:', calendarResponse.status)
//           setConnectionStatus(prev => ({ ...prev, calendar: 'not_connected' }))
//           logUserAction('Status Check', 'Google Calendar', 'failed', `Status: ${calendarResponse.status}`)
//         }
//       } catch (error) {
//         console.log('Dashboard: Calendar not accessible:', error)
//         setConnectionStatus(prev => ({ ...prev, calendar: 'not_connected' }))
//         logUserAction('Status Check', 'Google Calendar', 'failed', 'API call failed')
//       }

//       // Smart Reminders are always available
//       console.log('Dashboard: Setting reminders as connected')
//       setConnectionStatus(prev => ({ ...prev, reminder: 'connected' }))
//       logUserAction('Status Check', 'Smart Reminders', 'success', 'Internal feature enabled')
      
//     } catch (error) {
//       console.error('Dashboard: Error checking connection status:', error)
//       logUserAction('Status Check', 'Dashboard', 'failed', 'Connection check failed')
//     } finally {
//       console.log('Dashboard: Connection status check completed')
//     }
//   }

//   if (status === 'loading') {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading your dashboard...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!session) {
//     router.push('/auth/signin')
//     return null
//   }

//   const handleConnect = async (service: string) => {
//     console.log(`Dashboard: Attempting to connect ${service}...`)
//     setIsConnecting(service)
//     setErrorMessage(null)
    
//     // Log connection attempt
//     logUserAction('Connect Attempt', service.charAt(0).toUpperCase() + service.slice(1), 'pending', 'User clicked connect button')
    
//     try {
//       const response = await fetch(`/api/connect/${service}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' }
//       })
      
//       const data = await response.json()
//       console.log(`Dashboard: ${service} connection response:`, data)
      
//       if (response.ok && data.success) {
//         console.log(`${service} connected successfully`)
//         setConnectionStatus(prev => ({ ...prev, [service]: 'connected' }))
//         setErrorMessage(`${service.charAt(0).toUpperCase() + service.slice(1)} connected successfully!`)
//         setTimeout(() => setErrorMessage(null), 5000)
        
//         // Log successful connection
//         logUserAction('Connect Success', service.charAt(0).toUpperCase() + service.slice(1), 'success', 'Service connected successfully')
//       } else {
//         console.error(`Failed to connect ${service}:`, data.message)
//         setConnectionStatus(prev => ({ ...prev, [service]: 'failed' }))
//         setErrorMessage(`Failed to connect ${service}: ${data.message}`)
        
//         // Log failed connection
//         logUserAction('Connect Failed', service.charAt(0).toUpperCase() + service.slice(1), 'failed', data.message)
//       }
//     } catch (error) {
//       console.error(`Error connecting ${service}:`, error)
//       setConnectionStatus(prev => ({ ...prev, [service]: 'failed' }))
//       setErrorMessage(`Error connecting ${service}. Please check your internet connection and try again.`)
      
//       // Log connection error
//       logUserAction('Connect Error', service.charAt(0).toUpperCase() + service.slice(1), 'error', 'Network or unexpected error')
//     } finally {
//       setIsConnecting(null)
//       console.log(`Dashboard: ${service} connection attempt completed`)
//     }
//   }

//   const handleDisconnect = async (service: string) => {
//     console.log(`Dashboard: Disconnecting ${service}...`)
    
//     // Log disconnect action
//     logUserAction('Disconnect', service.charAt(0).toUpperCase() + service.slice(1), 'success', 'User manually disconnected service')
    
//     try {
//       setConnectionStatus(prev => ({ ...prev, [service]: 'not_connected' }))
//       setErrorMessage(`${service.charAt(0).toUpperCase() + service.slice(1)} disconnected successfully!`)
//       setTimeout(() => setErrorMessage(null), 3000)
//       console.log(`Dashboard: ${service} disconnected successfully`)
//     } catch (error) {
//       console.error(`Error disconnecting ${service}:`, error)
//     }
//   }

//   const getButtonText = (service: string) => {
//     if (isConnecting === service) return 'Connecting...'
//     if (connectionStatus[service] === 'connected') return 'Connected'
//     if (connectionStatus[service] === 'failed') return 'Retry'
//     return 'Connect'
//   }

//   const getButtonClass = (service: string) => {
//     if (isConnecting === service) {
//       return 'bg-gray-300 text-gray-500 cursor-not-allowed'
//     }
//     if (connectionStatus[service] === 'connected') {
//       return 'bg-green-600 hover:bg-green-700 text-white'
//     }
//     if (connectionStatus[service] === 'failed') {
//       return 'bg-red-600 hover:bg-red-700 text-white'
//     }
//     return 'bg-blue-600 hover:bg-blue-700 text-white'
//   }

//   const isButtonDisabled = (service: string) => {
//     return isConnecting === service
//   }

//   const handleRefreshStatus = () => {
//     logUserAction('Refresh Status', 'Dashboard', 'pending', 'User manually refreshed connection status')
//     checkConnectionStatus()
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Welcome Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Welcome back, {session.user?.name?.split(' ')[0]}!
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Let's get your AI assistant set up to help manage your busy schedule.
//           </p>
//         </div>

//         {/* Error Message */}
//         {errorMessage && (
//           <div className="mb-6 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-gray-700">{errorMessage}</p>
//               </div>
//               <div className="ml-auto pl-3">
//                 <button
//                   onClick={() => setErrorMessage(null)}
//                   className="inline-flex text-gray-400 hover:text-gray-600"
//                 >
//                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Stats Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Emails Processed</p>
//                 <p className="text-2xl font-semibold text-gray-900">0</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Events Created</p>
//                 <p className="text-2xl font-semibold text-gray-900">0</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Time Saved</p>
//                 <p className="text-2xl font-semibold text-gray-900">0h</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Connection Status Overview */}
//         <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-gray-900">Connection Status</h2>
//             <div className="flex space-x-2">
//               <button
//                 onClick={handleRefreshStatus}
//                 className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
//               >
//                 Refresh Status
//               </button>
//               <button
//                 onClick={async () => {
//                   try {
//                     const response = await fetch('/api/test-google-sheets')
//                     const data = await response.json()
//                     if (data.success) {
//                       setErrorMessage('✅ Google Sheets connection successful! Check your spreadsheet for logs.')
//                     } else {
//                       setErrorMessage(`❌ Google Sheets test failed: ${data.error}`)
//                     }
//                     setTimeout(() => setErrorMessage(null), 5000)
//                   } catch (error) {
//                     setErrorMessage('❌ Failed to test Google Sheets connection')
//                     setTimeout(() => setErrorMessage(null), 5000)
//                   }
//                 }}
//                 className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
//               >
//                 Test Logging
//               </button>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="flex items-center p-3 bg-gray-50 rounded-lg">
//               <div className={`w-3 h-3 rounded-full mr-3 ${
//                 connectionStatus.gmail === 'connected' ? 'bg-green-500' :
//                 connectionStatus.gmail === 'failed' ? 'bg-red-500' : 'bg-gray-400'
//               }`}></div>
//               <span className="text-sm font-medium text-gray-700">Gmail</span>
//               <span className="ml-auto text-xs text-gray-500">
//                 {connectionStatus.gmail === 'connected' ? 'Connected' :
//                  connectionStatus.gmail === 'failed' ? 'Failed' : 'Not Connected'}
//               </span>
//             </div>
            
//             <div className="flex items-center p-3 bg-gray-50 rounded-lg">
//               <div className={`w-3 h-3 rounded-full mr-3 ${
//                 connectionStatus.calendar === 'connected' ? 'bg-green-500' :
//                 connectionStatus.calendar === 'failed' ? 'bg-red-500' : 'bg-gray-400'
//               }`}></div>
//               <span className="text-sm font-medium text-gray-700">Calendar</span>
//               <span className="ml-auto text-xs text-gray-500">
//                 {connectionStatus.calendar === 'connected' ? 'Connected' :
//                  connectionStatus.calendar === 'failed' ? 'Failed' : 'Not Connected'}
//               </span>
//             </div>
            
//             <div className="flex items-center p-3 bg-gray-50 rounded-lg">
//               <div className={`w-3 h-3 rounded-full mr-3 ${
//                 connectionStatus.reminder === 'connected' ? 'bg-green-500' :
//                 connectionStatus.reminder === 'failed' ? 'bg-red-500' : 'bg-gray-400'
//               }`}></div>
//               <span className="text-sm font-medium text-gray-700">Reminders</span>
//               <span className="ml-auto text-xs text-gray-500">
//                 {connectionStatus.reminder === 'connected' ? 'Connected' :
//                  connectionStatus.reminder === 'failed' ? 'Failed' : 'Not Connected'}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Integration Setup */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-900">Connect Your Services</h2>
//             <p className="text-sm text-gray-600 mt-1">
//               Connect your accounts to start automating your schedule management.
//             </p>
//           </div>
          
//           <div className="p-6 space-y-6">
//             {/* Gmail Integration */}
//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center space-x-4">
//                 <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">Gmail</h3>
//                   <p className="text-sm text-gray-600">Connect to process school emails automatically</p>
//                   {connectionStatus.gmail === 'connected' && (
//                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
//                   )}
//                   {connectionStatus.gmail === 'failed' && (
//                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
//                   )}
//                 </div>
//               </div>
//               {connectionStatus.gmail === 'connected' ? (
//                 <button
//                   onClick={() => handleDisconnect('gmail')}
//                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
//                 >
//                   Disconnect
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => handleConnect('gmail')}
//                   disabled={isButtonDisabled('gmail')}
//                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('gmail')}`}
//                 >
//                   {getButtonText('gmail')}
//                 </button>
//               )}
//             </div>

//             {/* Calendar Integration */}
//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center space-x-4">
//                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">Google Calendar</h3>
//                   <p className="text-sm text-gray-600">Automatically create events from emails</p>
//                   {connectionStatus.calendar === 'connected' && (
//                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
//                   )}
//                   {connectionStatus.calendar === 'failed' && (
//                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
//                   )}
//                 </div>
//               </div>
//               {connectionStatus.calendar === 'connected' ? (
//                 <button
//                   onClick={() => handleDisconnect('calendar')}
//                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
//                 >
//                   Disconnect
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => handleConnect('calendar')}
//                   disabled={isButtonDisabled('calendar')}
//                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('calendar')}`}
//                 >
//                   {getButtonText('calendar')}
//                 </button>
//               )}
//             </div>

//             {/* Reminders Integration */}
//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center space-x-4">
//                 <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 006.03 3h11.94c.7 0 1.35.37 1.7.97L21 9v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9c0-.26.06-.51.19-.74L4.19 4.19z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">Smart Reminders</h3>
//                   <p className="text-sm text-gray-600">Get intelligent reminders for important events</p>
//                   {connectionStatus.reminder === 'connected' && (
//                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
//                   )}
//                   {connectionStatus.reminder === 'failed' && (
//                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
//                   )}
//                 </div>
//               </div>
//               {connectionStatus.reminder === 'connected' ? (
//                 <button
//                   onClick={() => handleDisconnect('reminder')}
//                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
//                 >
//                   Disconnect
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => handleConnect('reminder')}
//                   disabled={isButtonDisabled('reminder')}
//                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('reminder')}`}
//                 >
//                   {getButtonText('reminder')}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* How It Works */}
//         <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="text-center">
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <span className="text-blue-600 font-semibold">1</span>
//               </div>
//               <h3 className="font-medium text-gray-900 mb-2">Connect Your Accounts</h3>
//               <p className="text-sm text-gray-600">Link your Gmail and Calendar to get started</p>
//             </div>
//             <div className="text-center">
//               <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <span className="text-purple-600 font-semibold">2</span>
//               </div>
//               <h3 className="font-medium text-gray-900 mb-2">AI Processes Emails</h3>
//               <p className="text-sm text-gray-600">Our AI automatically scans school emails for events</p>
//             </div>
//             <div className="text-center">
//               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <span className="text-green-600 font-semibold">3</span>
//               </div>
//               <h3 className="font-medium text-gray-900 mb-2">Events Created</h3>
//               <p className="text-sm text-gray-600">Calendar events are automatically created with reminders</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



















// import { useSession, signIn } from 'next-auth/react'
// import { useRouter } from 'next/router'
// import { useState, useEffect } from 'react'
// import Navbar from '../components/Navbar'

// // Simple function to log user actions to Google Sheets
// const logUserAction = async (action: string, service: string, status: string, details?: string) => {
//   try {
//     await fetch('/api/log-action', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         action,
//         service,
//         status,
//         details
//       })
//     })
//   } catch (error) {
//     console.error('Failed to log action:', error)
//   }
// }

// export default function Dashboard() {
//   const { data: session, status } = useSession()
//   const router = useRouter()
//   const [isConnecting, setIsConnecting] = useState<string | null>(null)
//   const [connectionStatus, setConnectionStatus] = useState<{[key: string]: 'connected' | 'failed' | 'not_connected'}>({
//     gmail: 'not_connected',
//     calendar: 'not_connected',
//     reminder: 'not_connected'
//   })
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)
//   const [hasCheckedStatus, setHasCheckedStatus] = useState(false)

//   // Check connection status when component mounts and when the session becomes available
//   useEffect(() => {
//     if (session?.accessToken && !hasCheckedStatus) {
//       console.log('Dashboard: Session access token available, checking connection status...')
//       checkConnectionStatus()
//       setHasCheckedStatus(true)
      
//       // Log dashboard access
//       logUserAction('Dashboard Access', 'Dashboard', 'success', 'User accessed dashboard')
//     }
//   }, [session, hasCheckedStatus])

//   const checkConnectionStatus = async () => {
//     if (!session?.accessToken) {
//       console.log('Dashboard: Session access token not available, skipping connection status check.')
//       return
//     }

//     console.log('Dashboard: Starting connection status check...')
    
//     try {
//       // Check Gmail connection
//       try {
//         console.log('Dashboard: Testing Gmail API access...')
//         const gmailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
//           headers: {
//             'Authorization': `Bearer ${session?.accessToken}`,
//             'Content-Type': 'application/json'
//           }
//         })
//         if (gmailResponse.ok) {
//           console.log('Dashboard: Gmail API accessible')
//           setConnectionStatus(prev => ({ ...prev, gmail: 'connected' }))
//           logUserAction('Status Check', 'Gmail', 'success', 'Gmail API accessible')
//         } else {
//           console.log('Dashboard: Gmail API not accessible, status:', gmailResponse.status)
//           setConnectionStatus(prev => ({ ...prev, gmail: 'not_connected' }))
//           logUserAction('Status Check', 'Gmail', 'failed', `Status: ${gmailResponse.status}`)
//         }
//       } catch (error) {
//         console.log('Dashboard: Gmail not accessible:', error)
//         setConnectionStatus(prev => ({ ...prev, gmail: 'not_connected' }))
//         logUserAction('Status Check', 'Gmail', 'failed', 'API call failed')
//       }

//       // Check Calendar connection
//       try {
//         console.log('Dashboard: Testing Calendar API access...')
//         const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
//           headers: {
//             'Authorization': `Bearer ${session?.accessToken}`,
//             'Content-Type': 'application/json'
//           }
//         })
//         if (calendarResponse.ok) {
//           console.log('Dashboard: Calendar API accessible')
//           setConnectionStatus(prev => ({ ...prev, calendar: 'connected' }))
//           logUserAction('Status Check', 'Google Calendar', 'success', 'Calendar API accessible')
//         } else {
//           console.log('Dashboard: Calendar API not accessible, status:', calendarResponse.status)
//           setConnectionStatus(prev => ({ ...prev, calendar: 'not_connected' }))
//           logUserAction('Status Check', 'Google Calendar', 'failed', `Status: ${calendarResponse.status}`)
//         }
//       } catch (error) {
//         console.log('Dashboard: Calendar not accessible:', error)
//         setConnectionStatus(prev => ({ ...prev, calendar: 'not_connected' }))
//         logUserAction('Status Check', 'Google Calendar', 'failed', 'API call failed')
//       }

//       // Smart Reminders are always available
//       console.log('Dashboard: Setting reminders as connected')
//       setConnectionStatus(prev => ({ ...prev, reminder: 'connected' }))
//       logUserAction('Status Check', 'Smart Reminders', 'success', 'Internal feature enabled')
      
//     } catch (error) {
//       console.error('Dashboard: Error checking connection status:', error)
//       logUserAction('Status Check', 'Dashboard', 'failed', 'Connection check failed')
//     } finally {
//       console.log('Dashboard: Connection status check completed')
//     }
//   }

//   if (status === 'loading') {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading your dashboard...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!session) {
//     router.push('/auth/signin')
//     return null
//   }

//   const handleConnect = async (service: string) => {
//     console.log(`Dashboard: Attempting to connect ${service}...`)
//     setIsConnecting(service)
//     setErrorMessage(null)

//     // Log connection attempt
//     logUserAction('Connect Attempt', service.charAt(0).toUpperCase() + service.slice(1), 'pending', 'User clicked connect button')
    
//     // Redirect to the Google sign-in flow to get a new access token
//     signIn('google')
//   }

//   const handleDisconnect = async (service: string) => {
//     console.log(`Dashboard: Disconnecting ${service}...`)
    
//     // Log disconnect action
//     logUserAction('Disconnect', service.charAt(0).toUpperCase() + service.slice(1), 'success', 'User manually disconnected service')
    
//     try {
//       setConnectionStatus(prev => ({ ...prev, [service]: 'not_connected' }))
//       setErrorMessage(`${service.charAt(0).toUpperCase() + service.slice(1)} disconnected successfully!`)
//       setTimeout(() => setErrorMessage(null), 3000)
//       console.log(`Dashboard: ${service} disconnected successfully`)
//     } catch (error) {
//       console.error(`Error disconnecting ${service}:`, error)
//     }
//   }

//   const getButtonText = (service: string) => {
//     if (isConnecting === service) return 'Connecting...'
//     if (connectionStatus[service] === 'connected') return 'Connected'
//     if (connectionStatus[service] === 'failed') return 'Retry'
//     return 'Connect'
//   }

//   const getButtonClass = (service: string) => {
//     if (isConnecting === service) {
//       return 'bg-gray-300 text-gray-500 cursor-not-allowed'
//     }
//     if (connectionStatus[service] === 'connected') {
//       return 'bg-green-600 hover:bg-green-700 text-white'
//     }
//     if (connectionStatus[service] === 'failed') {
//       return 'bg-red-600 hover:bg-red-700 text-white'
//     }
//     return 'bg-blue-600 hover:bg-blue-700 text-white'
//   }

//   const isButtonDisabled = (service: string) => {
//     return isConnecting === service
//   }

//   const handleRefreshStatus = () => {
//     logUserAction('Refresh Status', 'Dashboard', 'pending', 'User manually refreshed connection status')
//     checkConnectionStatus()
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Welcome Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Welcome back, {session.user?.name?.split(' ')[0]}!
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Let's get your AI assistant set up to help manage your busy schedule.
//           </p>
//         </div>

//         {/* Error Message */}
//         {errorMessage && (
//           <div className="mb-6 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-gray-700">{errorMessage}</p>
//               </div>
//               <div className="ml-auto pl-3">
//                 <button
//                   onClick={() => setErrorMessage(null)}
//                   className="inline-flex text-gray-400 hover:text-gray-600"
//                 >
//                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Stats Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Emails Processed</p>
//                 <p className="text-2xl font-semibold text-gray-900">0</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Events Created</p>
//                 <p className="text-2xl font-semibold text-gray-900">0</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Time Saved</p>
//                 <p className="text-2xl font-semibold text-gray-900">0h</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Connection Status Overview */}
//         <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-gray-900">Connection Status</h2>
//             <div className="flex space-x-2">
//               <button
//                 onClick={handleRefreshStatus}
//                 className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
//               >
//                 Refresh Status
//               </button>
//               <button
//                 onClick={async () => {
//                   try {
//                     const response = await fetch('/api/test-google-sheets')
//                     const data = await response.json()
//                     if (data.success) {
//                       setErrorMessage('✅ Google Sheets connection successful! Check your spreadsheet for logs.')
//                     } else {
//                       setErrorMessage(`❌ Google Sheets test failed: ${data.error}`)
//                     }
//                     setTimeout(() => setErrorMessage(null), 5000)
//                   } catch (error) {
//                     setErrorMessage('❌ Failed to test Google Sheets connection')
//                     setTimeout(() => setErrorMessage(null), 5000)
//                   }
//                 }}
//                 className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
//               >
//                 Test Logging
//               </button>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="flex items-center p-3 bg-gray-50 rounded-lg">
//               <div className={`w-3 h-3 rounded-full mr-3 ${
//                 connectionStatus.gmail === 'connected' ? 'bg-green-500' :
//                 connectionStatus.gmail === 'failed' ? 'bg-red-500' : 'bg-gray-400'
//               }`}></div>
//               <span className="text-sm font-medium text-gray-700">Gmail</span>
//               <span className="ml-auto text-xs text-gray-500">
//                 {connectionStatus.gmail === 'connected' ? 'Connected' :
//                  connectionStatus.gmail === 'failed' ? 'Failed' : 'Not Connected'}
//               </span>
//             </div>
            
//             <div className="flex items-center p-3 bg-gray-50 rounded-lg">
//               <div className={`w-3 h-3 rounded-full mr-3 ${
//                 connectionStatus.calendar === 'connected' ? 'bg-green-500' :
//                 connectionStatus.calendar === 'failed' ? 'bg-red-500' : 'bg-gray-400'
//               }`}></div>
//               <span className="text-sm font-medium text-gray-700">Calendar</span>
//               <span className="ml-auto text-xs text-gray-500">
//                 {connectionStatus.calendar === 'connected' ? 'Connected' :
//                  connectionStatus.calendar === 'failed' ? 'Failed' : 'Not Connected'}
//               </span>
//             </div>
            
//             <div className="flex items-center p-3 bg-gray-50 rounded-lg">
//               <div className={`w-3 h-3 rounded-full mr-3 ${
//                 connectionStatus.reminder === 'connected' ? 'bg-green-500' :
//                 connectionStatus.reminder === 'failed' ? 'bg-red-500' : 'bg-gray-400'
//               }`}></div>
//               <span className="text-sm font-medium text-gray-700">Reminders</span>
//               <span className="ml-auto text-xs text-gray-500">
//                 {connectionStatus.reminder === 'connected' ? 'Connected' :
//                  connectionStatus.reminder === 'failed' ? 'Failed' : 'Not Connected'}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Integration Setup */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-900">Connect Your Services</h2>
//             <p className="text-sm text-gray-600 mt-1">
//               Connect your accounts to start automating your schedule management.
//             </p>
//           </div>
          
//           <div className="p-6 space-y-6">
//             {/* Gmail Integration */}
//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center space-x-4">
//                 <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">Gmail</h3>
//                   <p className="text-sm text-gray-600">Connect to process school emails automatically</p>
//                   {connectionStatus.gmail === 'connected' && (
//                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
//                   )}
//                   {connectionStatus.gmail === 'failed' && (
//                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
//                   )}
//                 </div>
//               </div>
//               {connectionStatus.gmail === 'connected' ? (
//                 <button
//                   onClick={() => handleDisconnect('gmail')}
//                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
//                 >
//                   Disconnect
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => handleConnect('gmail')}
//                   disabled={isButtonDisabled('gmail')}
//                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('gmail')}`}
//                 >
//                   {getButtonText('gmail')}
//                 </button>
//               )}
//             </div>

//             {/* Calendar Integration */}
//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center space-x-4">
//                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">Google Calendar</h3>
//                   <p className="text-sm text-gray-600">Automatically create events from emails</p>
//                   {connectionStatus.calendar === 'connected' && (
//                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
//                   )}
//                   {connectionStatus.calendar === 'failed' && (
//                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
//                   )}
//                 </div>
//               </div>
//               {connectionStatus.calendar === 'connected' ? (
//                 <button
//                   onClick={() => handleDisconnect('calendar')}
//                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
//                 >
//                   Disconnect
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => handleConnect('calendar')}
//                   disabled={isButtonDisabled('calendar')}
//                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('calendar')}`}
//                 >
//                   {getButtonText('calendar')}
//                 </button>
//               )}
//             </div>

//             {/* Reminders Integration */}
//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center space-x-4">
//                 <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 006.03 3h11.94c.7 0 1.35.37 1.7.97L21 9v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9c0-.26.06-.51.19-.74L4.19 4.19z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">Smart Reminders</h3>
//                   <p className="text-sm text-gray-600">Get intelligent reminders for important events</p>
//                   {connectionStatus.reminder === 'connected' && (
//                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
//                   )}
//                   {connectionStatus.reminder === 'failed' && (
//                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
//                   )}
//                 </div>
//               </div>
//               {connectionStatus.reminder === 'connected' ? (
//                 <button
//                   onClick={() => handleDisconnect('reminder')}
//                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
//                 >
//                   Disconnect
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => handleConnect('reminder')}
//                   disabled={isButtonDisabled('reminder')}
//                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('reminder')}`}
//                 >
//                   {getButtonText('reminder')}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* How It Works */}
//         <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="text-center">
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <span className="text-blue-600 font-semibold">1</span>
//               </div>
//               <h3 className="font-medium text-gray-900 mb-2">Connect Your Accounts</h3>
//               <p className="text-sm text-gray-600">Link your Gmail and Calendar to get started</p>
//             </div>
//             <div className="text-center">
//               <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <span className="text-purple-600 font-semibold">2</span>
//               </div>
//               <h3 className="font-medium text-gray-900 mb-2">AI Processes Emails</h3>
//               <p className="text-sm text-gray-600">Our AI automatically scans school emails for events</p>
//             </div>
//             <div className="text-center">
//               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <span className="text-green-600 font-semibold">3</span>
//               </div>
//               <h3 className="font-medium text-gray-900 mb-2">Events Created</h3>
//               <p className="text-sm text-gray-600">Calendar events are automatically created with reminders</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }




// import { useSession, signIn } from 'next-auth/react'
// import { useRouter } from 'next/router'
// import { useState, useEffect } from 'react'
// import Navbar from '../components/Navbar'

// // Interface for pending events
// interface PendingEvent {
//   id: string
//   title: string
//   description: string
//   startDate: string
//   endDate: string
//   location?: string
//   source: string
//   confidenceScore: number
//   extractedFrom: string
//   createdAt: string
// }

// // Simple function to log user actions to Google Sheets
// const logUserAction = async (action: string, service: string, status: string, details?: string) => {
//   try {
//     await fetch('/api/log-action', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         action,
//         service,
//         status,
//         details
//       })
//     })
//   } catch (error) {
//     console.error('Failed to log action:', error)
//   }
// }

// export default function Dashboard() {
//   const { data: session, status } = useSession()
//   const router = useRouter()
//   const [isConnecting, setIsConnecting] = useState<string | null>(null)
//   const [connectionStatus, setConnectionStatus] = useState<{[key: string]: 'connected' | 'failed' | 'not_connected'}>({
//     gmail: 'not_connected',
//     calendar: 'not_connected',
//     reminder: 'not_connected'
//   })
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)
//   const [hasCheckedStatus, setHasCheckedStatus] = useState(false)
  
//   // New state for pending events
//   const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([])
//   const [loadingEvents, setLoadingEvents] = useState(false)
//   const [editingEvent, setEditingEvent] = useState<string | null>(null)
//   const [editForm, setEditForm] = useState<Partial<PendingEvent>>({})

//   // Check connection status when component mounts and when the session becomes available
//   useEffect(() => {
//     if (session?.accessToken && !hasCheckedStatus) {
//       console.log('Dashboard: Session access token available, checking connection status...')
//       checkConnectionStatus()
//       fetchPendingEvents()
//       setHasCheckedStatus(true)
      
//       // Log dashboard access
//       logUserAction('Dashboard Access', 'Dashboard', 'success', 'User accessed dashboard')
//     }
//   }, [session, hasCheckedStatus])

//   // Fetch pending events from API
//   const fetchPendingEvents = async () => {
//     setLoadingEvents(true)
//     try {
//       const response = await fetch('/api/pending-events')
//       if (response.ok) {
//         const events = await response.json()
//         setPendingEvents(events)
//         logUserAction('Fetch Events', 'Pending Events', 'success', `Loaded ${events.length} pending events`)
//       }
//     } catch (error) {
//       console.error('Error fetching pending events:', error)
//       logUserAction('Fetch Events', 'Pending Events', 'failed', 'Failed to load pending events')
//     } finally {
//       setLoadingEvents(false)
//     }
//   }

//   // Handle event approval
//   const handleApproveEvent = async (eventId: string) => {
//     try {
//       const response = await fetch(`/api/events/${eventId}/approve`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' }
//       })
      
//       if (response.ok) {
//         setPendingEvents(prev => prev.filter(event => event.id !== eventId))
//         setErrorMessage('Event approved and added to calendar!')
//         setTimeout(() => setErrorMessage(null), 3000)
//         logUserAction('Approve Event', 'Pending Events', 'success', `Event ${eventId} approved`)
//       }
//     } catch (error) {
//       console.error('Error approving event:', error)
//       setErrorMessage('Failed to approve event. Please try again.')
//       setTimeout(() => setErrorMessage(null), 3000)
//       logUserAction('Approve Event', 'Pending Events', 'failed', `Failed to approve event ${eventId}`)
//     }
//   }

//   // Handle event rejection
//   const handleRejectEvent = async (eventId: string) => {
//     try {
//       const response = await fetch(`/api/events/${eventId}/reject`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' }
//       })
      
//       if (response.ok) {
//         setPendingEvents(prev => prev.filter(event => event.id !== eventId))
//         setErrorMessage('Event rejected successfully.')
//         setTimeout(() => setErrorMessage(null), 3000)
//         logUserAction('Reject Event', 'Pending Events', 'success', `Event ${eventId} rejected`)
//       }
//     } catch (error) {
//       console.error('Error rejecting event:', error)
//       setErrorMessage('Failed to reject event. Please try again.')
//       setTimeout(() => setErrorMessage(null), 3000)
//       logUserAction('Reject Event', 'Pending Events', 'failed', `Failed to reject event ${eventId}`)
//     }
//   }

//   // Handle edit event
//   const handleEditEvent = (event: PendingEvent) => {
//     setEditingEvent(event.id)
//     setEditForm(event)
//   }

//   // Save edited event
//   const handleSaveEdit = async (eventId: string) => {
//     try {
//       const response = await fetch(`/api/events/${eventId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(editForm)
//       })
      
//       if (response.ok) {
//         const updatedEvent = await response.json()
//         setPendingEvents(prev => prev.map(event => 
//           event.id === eventId ? updatedEvent : event
//         ))
//         setEditingEvent(null)
//         setEditForm({})
//         setErrorMessage('Event updated successfully!')
//         setTimeout(() => setErrorMessage(null), 3000)
//         logUserAction('Edit Event', 'Pending Events', 'success', `Event ${eventId} updated`)
//       }
//     } catch (error) {
//       console.error('Error saving event:', error)
//       setErrorMessage('Failed to save changes. Please try again.')
//       setTimeout(() => setErrorMessage(null), 3000)
//       logUserAction('Edit Event', 'Pending Events', 'failed', `Failed to update event ${eventId}`)
//     }
//   }

//   const checkConnectionStatus = async () => {
//     if (!session?.accessToken) {
//       console.log('Dashboard: Session access token not available, skipping connection status check.')
//       return
//     }

//     console.log('Dashboard: Starting connection status check...')
    
//     try {
//       // Check Gmail connection
//       try {
//         console.log('Dashboard: Testing Gmail API access...')
//         const gmailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
//           headers: {
//             'Authorization': `Bearer ${session?.accessToken}`,
//             'Content-Type': 'application/json'
//           }
//         })
//         if (gmailResponse.ok) {
//           console.log('Dashboard: Gmail API accessible')
//           setConnectionStatus(prev => ({ ...prev, gmail: 'connected' }))
//           logUserAction('Status Check', 'Gmail', 'success', 'Gmail API accessible')
//         } else {
//           console.log('Dashboard: Gmail API not accessible, status:', gmailResponse.status)
//           setConnectionStatus(prev => ({ ...prev, gmail: 'not_connected' }))
//           logUserAction('Status Check', 'Gmail', 'failed', `Status: ${gmailResponse.status}`)
//         }
//       } catch (error) {
//         console.log('Dashboard: Gmail not accessible:', error)
//         setConnectionStatus(prev => ({ ...prev, gmail: 'not_connected' }))
//         logUserAction('Status Check', 'Gmail', 'failed', 'API call failed')
//       }

//       // Check Calendar connection
//       try {
//         console.log('Dashboard: Testing Calendar API access...')
//         const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
//           headers: {
//             'Authorization': `Bearer ${session?.accessToken}`,
//             'Content-Type': 'application/json'
//           }
//         })
//         if (calendarResponse.ok) {
//           console.log('Dashboard: Calendar API accessible')
//           setConnectionStatus(prev => ({ ...prev, calendar: 'connected' }))
//           logUserAction('Status Check', 'Google Calendar', 'success', 'Calendar API accessible')
//         } else {
//           console.log('Dashboard: Calendar API not accessible, status:', calendarResponse.status)
//           setConnectionStatus(prev => ({ ...prev, calendar: 'not_connected' }))
//           logUserAction('Status Check', 'Google Calendar', 'failed', `Status: ${calendarResponse.status}`)
//         }
//       } catch (error) {
//         console.log('Dashboard: Calendar not accessible:', error)
//         setConnectionStatus(prev => ({ ...prev, calendar: 'not_connected' }))
//         logUserAction('Status Check', 'Google Calendar', 'failed', 'API call failed')
//       }

//       // Smart Reminders are always available
//       console.log('Dashboard: Setting reminders as connected')
//       setConnectionStatus(prev => ({ ...prev, reminder: 'connected' }))
//       logUserAction('Status Check', 'Smart Reminders', 'success', 'Internal feature enabled')
      
//     } catch (error) {
//       console.error('Dashboard: Error checking connection status:', error)
//       logUserAction('Status Check', 'Dashboard', 'failed', 'Connection check failed')
//     } finally {
//       console.log('Dashboard: Connection status check completed')
//     }
//   }

//   if (status === 'loading') {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading your dashboard...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!session) {
//     router.push('/auth/signin')
//     return null
//   }

//   const handleConnect = async (service: string) => {
//     console.log(`Dashboard: Attempting to connect ${service}...`)
//     setIsConnecting(service)
//     setErrorMessage(null)

//     // Log connection attempt
//     logUserAction('Connect Attempt', service.charAt(0).toUpperCase() + service.slice(1), 'pending', 'User clicked connect button')
    
//     // Redirect to the Google sign-in flow to get a new access token
//     signIn('google')
//   }

//   const handleDisconnect = async (service: string) => {
//     console.log(`Dashboard: Disconnecting ${service}...`)
    
//     // Log disconnect action
//     logUserAction('Disconnect', service.charAt(0).toUpperCase() + service.slice(1), 'success', 'User manually disconnected service')
    
//     try {
//       setConnectionStatus(prev => ({ ...prev, [service]: 'not_connected' }))
//       setErrorMessage(`${service.charAt(0).toUpperCase() + service.slice(1)} disconnected successfully!`)
//       setTimeout(() => setErrorMessage(null), 3000)
//       console.log(`Dashboard: ${service} disconnected successfully`)
//     } catch (error) {
//       console.error(`Error disconnecting ${service}:`, error)
//     }
//   }

//   const getButtonText = (service: string) => {
//     if (isConnecting === service) return 'Connecting...'
//     if (connectionStatus[service] === 'connected') return 'Connected'
//     if (connectionStatus[service] === 'failed') return 'Retry'
//     return 'Connect'
//   }

//   const getButtonClass = (service: string) => {
//     if (isConnecting === service) {
//       return 'bg-gray-300 text-gray-500 cursor-not-allowed'
//     }
//     if (connectionStatus[service] === 'connected') {
//       return 'bg-green-600 hover:bg-green-700 text-white'
//     }
//     if (connectionStatus[service] === 'failed') {
//       return 'bg-red-600 hover:bg-red-700 text-white'
//     }
//     return 'bg-blue-600 hover:bg-blue-700 text-white'
//   }

//   const isButtonDisabled = (service: string) => {
//     return isConnecting === service
//   }

//   const handleRefreshStatus = () => {
//     logUserAction('Refresh Status', 'Dashboard', 'pending', 'User manually refreshed connection status')
//     checkConnectionStatus()
//   }

//   const getConfidenceColor = (score: number) => {
//     if (score >= 0.8) return 'text-green-600 bg-green-100'
//     if (score >= 0.6) return 'text-yellow-600 bg-yellow-100'
//     return 'text-red-600 bg-red-100'
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Welcome Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Welcome back, {session.user?.name?.split(' ')[0]}!
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Let's get your AI assistant set up to help manage your busy schedule.
//           </p>
//         </div>

//         {/* Error Message */}
//         {errorMessage && (
//           <div className="mb-6 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-gray-700">{errorMessage}</p>
//               </div>
//               <div className="ml-auto pl-3">
//                 <button
//                   onClick={() => setErrorMessage(null)}
//                   className="inline-flex text-gray-400 hover:text-gray-600"
//                 >
//                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Pending Events Section - NEW */}
//         {pendingEvents.length > 0 && (
//           <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900">Pending Events</h2>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Review and approve events detected by AI from your emails
//                   </p>
//                 </div>
//                 <button
//                   onClick={fetchPendingEvents}
//                   className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
//                 >
//                   Refresh
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6">
//               {loadingEvents ? (
//                 <div className="text-center py-8">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                   <p className="mt-2 text-gray-600">Loading pending events...</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {pendingEvents.map((event) => (
//                     <div key={event.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
//                       {editingEvent === event.id ? (
//                         // Edit Mode
//                         <div className="space-y-4">
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                             <input
//                               type="text"
//                               value={editForm.title || ''}
//                               onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                             <textarea
//                               value={editForm.description || ''}
//                               onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
//                               rows={3}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                           </div>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//                               <input
//                                 type="datetime-local"
//                                 value={editForm.startDate || ''}
//                                 onChange={(e) => setEditForm(prev => ({ ...prev, startDate: e.target.value }))}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               />
//                             </div>
//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//                               <input
//                                 type="datetime-local"
//                                 value={editForm.endDate || ''}
//                                 onChange={(e) => setEditForm(prev => ({ ...prev, endDate: e.target.value }))}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               />
//                             </div>
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//                             <input
//                               type="text"
//                               value={editForm.location || ''}
//                               onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                           </div>
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleSaveEdit(event.id)}
//                               className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
//                             >
//                               Save Changes
//                             </button>
//                             <button
//                               onClick={() => {
//                                 setEditingEvent(null)
//                                 setEditForm({})
//                               }}
//                               className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         // View Mode
//                         <div>
//                           <div className="flex items-start justify-between mb-3">
//                             <div className="flex-1">
//                               <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
//                               <p className="text-gray-600 text-sm mt-1">{event.description}</p>
//                             </div>
//                             <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(event.confidenceScore)}`}>
//                               {Math.round(event.confidenceScore * 100)}% confidence
//                             </span>
//                           </div>
                          
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
//                             <div>
//                               <span className="font-medium">Start:</span> {new Date(event.startDate).toLocaleDateString()} at {new Date(event.startDate).toLocaleTimeString()}
//                             </div>
//                             <div>
//                               <span className="font-medium">End:</span> {new Date(event.endDate).toLocaleDateString()} at {new Date(event.endDate).toLocaleTimeString()}
//                             </div>
//                             {event.location && (
//                               <div>
//                                 <span className="font-medium">Location:</span> {event.location}
//                               </div>
//                             )}
//                             <div>
//                               <span className="font-medium">Source:</span> {event.source}
//                             </div>
//                           </div>
                          
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleApproveEvent(event.id)}
//                               className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm"
//                             >
//                               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                               </svg>
//                               Approve
//                             </button>
//                             <button
//                               onClick={() => handleEditEvent(event)}
//                               className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
//                             >
//                               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                               </svg>
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => handleRejectEvent(event.id)}
//                               className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
//                             >
//                               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                               </svg>
//                               Reject
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Stats Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Emails Processed</p>
//                 <p className="text-2xl font-semibold text-gray-900">0</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Events Created</p>
//                 <p className="text-2xl font-semibold text-gray-900">0</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Time Saved</p>
//                 <p className="text-2xl font-semibold text-gray-900">0h</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Connection Status Overview */}
//         <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-gray-900">Connection Status</h2>
//             <div className="flex space-x-2">
//               <button
//                 onClick={handleRefreshStatus}
//                 className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
//               >
//                 Refresh Status
//               </button>
//               <button
//                 onClick={async () => {
//                   try {
//                     const response = await fetch('/api/test-google-sheets')
//                     const data = await response.json()
//                     if (data.success) {
//                       setErrorMessage('✅ Google Sheets connection successful! Check your spreadsheet for logs.')
//                     } else {
//                       setErrorMessage(`❌ Google Sheets test failed: ${data.error}`)
//                     }
//                     setTimeout(() => setErrorMessage(null), 5000)
//                   } catch (error) {
//                     setErrorMessage('❌ Failed to test Google Sheets connection')
//                     setTimeout(() => setErrorMessage(null), 5000)
//                   }
//                 }}
//                 className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
//               >
//                 Test Logging
//               </button>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="flex items-center p-3 bg-gray-50 rounded-lg">
//               <div className={`w-3 h-3 rounded-full mr-3 ${
//                 connectionStatus.gmail === 'connected' ? 'bg-green-500' :
//                 connectionStatus.gmail === 'failed' ? 'bg-red-500' : 'bg-gray-400'
//               }`}></div>
//               <span className="text-sm font-medium text-gray-700">Gmail</span>
//               <span className="ml-auto text-xs text-gray-500">
//                 {connectionStatus.gmail === 'connected' ? 'Connected' :
//                   connectionStatus.gmail === 'failed' ? 'Failed' : 'Not Connected'}
//               </span>
//             </div>
            
//             <div className="flex items-center p-3 bg-gray-50 rounded-lg">
//               <div className={`w-3 h-3 rounded-full mr-3 ${
//                 connectionStatus.calendar === 'connected' ? 'bg-green-500' :
//                 connectionStatus.calendar === 'failed' ? 'bg-red-500' : 'bg-gray-400'
//               }`}></div>
//               <span className="text-sm font-medium text-gray-700">Calendar</span>
//               <span className="ml-auto text-xs text-gray-500">
//                 {connectionStatus.calendar === 'connected' ? 'Connected' :
//                   connectionStatus.calendar === 'failed' ? 'Failed' : 'Not Connected'}
//               </span>
//             </div>
            
//             <div className="flex items-center p-3 bg-gray-50 rounded-lg">
//               <div className={`w-3 h-3 rounded-full mr-3 ${
//                 connectionStatus.reminder === 'connected' ? 'bg-green-500' :
//                 connectionStatus.reminder === 'failed' ? 'bg-red-500' : 'bg-gray-400'
//               }`}></div>
//               <span className="text-sm font-medium text-gray-700">Reminders</span>
//               <span className="ml-auto text-xs text-gray-500">
//                 {connectionStatus.reminder === 'connected' ? 'Connected' :
//                   connectionStatus.reminder === 'failed' ? 'Failed' : 'Not Connected'}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Integration Setup */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-900">Connect Your Services</h2>
//             <p className="text-sm text-gray-600 mt-1">
//               Connect your accounts to start automating your schedule management.
//             </p>
//           </div>
          
//           <div className="p-6 space-y-6">
//             {/* Gmail Integration */}
//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center space-x-4">
//                 <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">Gmail</h3>
//                   <p className="text-sm text-gray-600">Connect to process school emails automatically</p>
//                   {connectionStatus.gmail === 'connected' && (
//                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
//                   )}
//                   {connectionStatus.gmail === 'failed' && (
//                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
//                   )}
//                 </div>
//               </div>
//               {connectionStatus.gmail === 'connected' ? (
//                 <button
//                   onClick={() => handleDisconnect('gmail')}
//                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
//                 >
//                   Disconnect
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => handleConnect('gmail')}
//                   disabled={isButtonDisabled('gmail')}
//                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('gmail')}`}
//                 >
//                   {getButtonText('gmail')}
//                 </button>
//               )}
//             </div>

//             {/* Calendar Integration */}
//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center space-x-4">
//                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">Google Calendar</h3>
//                   <p className="text-sm text-gray-600">Automatically create events from emails</p>
//                   {connectionStatus.calendar === 'connected' && (
//                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
//                   )}
//                   {connectionStatus.calendar === 'failed' && (
//                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
//                   )}
//                 </div>
//               </div>
//               {connectionStatus.calendar === 'connected' ? (
//                 <button
//                   onClick={() => handleDisconnect('calendar')}
//                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
//                 >
//                   Disconnect
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => handleConnect('calendar')}
//                   disabled={isButtonDisabled('calendar')}
//                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('calendar')}`}
//                 >
//                   {getButtonText('calendar')}
//                 </button>
//               )}
//             </div>

//             {/* Reminders Integration */}
//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center space-x-4">
//                 <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 006.03 3h11.94c.7 0 1.35.37 1.7.97L21 9v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9c0-.26.06-.51.19-.74L4.19 4.19z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">Smart Reminders</h3>
//                   <p className="text-sm text-gray-600">Get intelligent reminders for important events</p>
//                   {connectionStatus.reminder === 'connected' && (
//                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
//                   )}
//                   {connectionStatus.reminder === 'failed' && (
//                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
//                   )}
//                 </div>
//               </div>
//               {connectionStatus.reminder === 'connected' ? (
//                 <button
//                   onClick={() => handleDisconnect('reminder')}
//                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
//                 >
//                   Disconnect
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => handleConnect('reminder')}
//                   disabled={isButtonDisabled('reminder')}
//                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('reminder')}`}
//                 >
//                   {getButtonText('reminder')}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* How It Works */}
//         <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="text-center">
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <span className="text-blue-600 font-semibold">1</span>
//               </div>
//               <h3 className="font-medium text-gray-900 mb-2">Connect Your Accounts</h3>
//               <p className="text-sm text-gray-600">Link your Gmail and Calendar to get started</p>
//             </div>
//             <div className="text-center">
//               <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <span className="text-purple-600 font-semibold">2</span>
//               </div>
//               <h3 className="font-medium text-gray-900 mb-2">AI Processes Emails</h3>
//               <p className="text-sm text-gray-600">Our AI automatically scans school emails for events</p>
//             </div>
//             <div className="text-center">
//               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <span className="text-green-600 font-semibold">3</span>
//               </div>
//               <h3 className="font-medium text-gray-900 mb-2">Events Created</h3>
//               <p className="text-sm text-gray-600">Calendar events are automatically created with reminders</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }










//New Dashboard Code
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

// Dummy data for demonstration purposes
const DUMMY_PENDING_EVENTS: PendingEvent[] = [
  {
    id: 'event_001',
    title: 'School Play Auditions',
    description: 'Auditions for the annual school play. All students are welcome to participate.',
    startDate: new Date('2025-09-15T10:00:00').toISOString(),
    endDate: new Date('2025-09-15T12:00:00').toISOString(),
    location: 'School Auditorium',
    source: 'Gmail',
    confidenceScore: 0.95,
    extractedFrom: 'email_123',
    createdAt: new Date('2025-09-04T10:00:00').toISOString(),
  },
  {
    id: 'event_002',
    title: 'Parent-Teacher Conference',
    description: 'Schedule a time to meet with your child\'s teachers to discuss their progress.',
    startDate: new Date('2025-10-01T08:00:00').toISOString(),
    endDate: new Date('2025-10-01T17:00:00').toISOString(),
    location: 'Online via Google Meet',
    source: 'Gmail',
    confidenceScore: 0.88,
    extractedFrom: 'email_124',
    createdAt: new Date('2025-09-04T10:05:00').toISOString(),
  },
];

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
  
  // State for pending events
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [editingEvent, setEditingEvent] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<PendingEvent>>({})

  // Fetch data on initial load
  useEffect(() => {
    if (session?.accessToken && !hasCheckedStatus) {
      checkConnectionStatus()
      fetchPendingEvents()
      setHasCheckedStatus(true)
      logUserAction('Dashboard Access', 'Dashboard', 'success', 'User accessed dashboard')
    }
  }, [session, hasCheckedStatus])

  // Fetch pending events from a dummy data source for testing
  const fetchPendingEvents = async () => {
    setLoadingEvents(true)
    try {
      // Simulate fetching data from your API
      const events = DUMMY_PENDING_EVENTS;
      setPendingEvents(events)
      logUserAction('Fetch Events', 'Pending Events', 'success', `Loaded ${events.length} pending events`)
    } catch (error) {
      console.error('Error fetching pending events:', error)
      logUserAction('Fetch Events', 'Pending Events', 'failed', 'Failed to load pending events')
    } finally {
      setLoadingEvents(false)
    }
  }

  // Handle event approval
  const handleApproveEvent = async (eventId: string) => {
    try {
      // Simulate API call and state update
      setPendingEvents(prev => prev.filter(event => event.id !== eventId))
      setErrorMessage('Event approved and added to calendar!')
      setTimeout(() => setErrorMessage(null), 3000)
      logUserAction('Approve Event', 'Pending Events', 'success', `Event ${eventId} approved`)
    } catch (error) {
      console.error('Error approving event:', error)
      setErrorMessage('Failed to approve event. Please try again.')
      setTimeout(() => setErrorMessage(null), 3000)
      logUserAction('Approve Event', 'Pending Events', 'failed', `Failed to approve event ${eventId}`)
    }
  }

  // Handle event rejection
  const handleRejectEvent = async (eventId: string) => {
    try {
      // Simulate API call and state update
      setPendingEvents(prev => prev.filter(event => event.id !== eventId))
      setErrorMessage('Event rejected successfully.')
      setTimeout(() => setErrorMessage(null), 3000)
      logUserAction('Reject Event', 'Pending Events', 'success', `Event ${eventId} rejected`)
    } catch (error) {
      console.error('Error rejecting event:', error)
      setErrorMessage('Failed to reject event. Please try again.')
      setTimeout(() => setErrorMessage(null), 3000)
      logUserAction('Reject Event', 'Pending Events', 'failed', `Failed to reject event ${eventId}`)
    }
  }

  // Handle edit event
  const handleEditEvent = (event: PendingEvent) => {
    setEditingEvent(event.id)
    setEditForm(event)
  }

  // Save edited event
  const handleSaveEdit = async (eventId: string) => {
    try {
      // Simulate API call and state update
      const updatedEvent = { ...editForm, id: eventId } as PendingEvent
      setPendingEvents(prev => prev.map(event => 
        event.id === eventId ? updatedEvent : event
      ))
      setEditingEvent(null)
      setEditForm({})
      setErrorMessage('Event updated successfully!')
      setTimeout(() => setErrorMessage(null), 3000)
      logUserAction('Edit Event', 'Pending Events', 'success', `Event ${eventId} updated`)
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
    
    // Simulate connection checks
    setConnectionStatus(prev => ({ ...prev, gmail: 'connected', calendar: 'connected', reminder: 'connected' }))
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

        {/* Pending Events Section - NEW */}
        {pendingEvents.length > 0 && (
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Pending Events</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Review and approve events detected by AI from your emails
                  </p>
                </div>
                <button
                  onClick={fetchPendingEvents}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {loadingEvents ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading pending events...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                      {editingEvent === event.id ? (
                        // Edit Mode
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                              type="text"
                              value={editForm.title || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={editForm.description || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                              <input
                                type="datetime-local"
                                value={editForm.startDate || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, startDate: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                              <input
                                type="datetime-local"
                                value={editForm.endDate || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, endDate: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                              type="text"
                              value={editForm.location || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSaveEdit(event.id)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={() => {
                                setEditingEvent(null)
                                setEditForm({})
                              }}
                              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                              <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(event.confidenceScore)}`}>
                              {Math.round(event.confidenceScore * 100)}% confidence
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                            <div>
                              <span className="font-medium">Start:</span> {new Date(event.startDate).toLocaleDateString()} at {new Date(event.startDate).toLocaleTimeString()}
                            </div>
                            <div>
                              <span className="font-medium">End:</span> {new Date(event.endDate).toLocaleDateString()} at {new Date(event.endDate).toLocaleTimeString()}
                            </div>
                            {event.location && (
                              <div>
                                <span className="font-medium">Location:</span> {event.location}
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Source:</span> {event.source}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveEvent(event.id)}
                              className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Approve
                            </button>
                            <button
                              onClick={() => handleEditEvent(event)}
                              className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleRejectEvent(event.id)}
                              className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Reject
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Emails Processed</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Events Created</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Time Saved</p>
                <p className="text-2xl font-semibold text-gray-900">0h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Status Overview */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Connection Status</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleRefreshStatus}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Refresh Status
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/test-google-sheets')
                    const data = await response.json()
                    if (data.success) {
                      setErrorMessage('✅ Google Sheets connection successful! Check your spreadsheet for logs.')
                    } else {
                      setErrorMessage(`❌ Google Sheets test failed: ${data.error}`)
                    }
                    setTimeout(() => setErrorMessage(null), 5000)
                  } catch (error) {
                    setErrorMessage('❌ Failed to test Google Sheets connection')
                    setTimeout(() => setErrorMessage(null), 5000)
                  }
                }}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                Test Logging
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                connectionStatus.gmail === 'connected' ? 'bg-green-500' :
                connectionStatus.gmail === 'failed' ? 'bg-red-500' : 'bg-gray-400'
              }`}></div>
              <span className="text-sm font-medium text-gray-700">Gmail</span>
              <span className="ml-auto text-xs text-gray-500">
                {connectionStatus.gmail === 'connected' ? 'Connected' :
                  connectionStatus.gmail === 'failed' ? 'Failed' : 'Not Connected'}
              </span>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                connectionStatus.calendar === 'connected' ? 'bg-green-500' :
                connectionStatus.calendar === 'failed' ? 'bg-red-500' : 'bg-gray-400'
              }`}></div>
              <span className="text-sm font-medium text-gray-700">Calendar</span>
              <span className="ml-auto text-xs text-gray-500">
                {connectionStatus.calendar === 'connected' ? 'Connected' :
                  connectionStatus.calendar === 'failed' ? 'Failed' : 'Not Connected'}
              </span>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                connectionStatus.reminder === 'connected' ? 'bg-green-500' :
                connectionStatus.reminder === 'failed' ? 'bg-red-500' : 'bg-gray-400'
              }`}></div>
              <span className="text-sm font-medium text-gray-700">Reminders</span>
              <span className="ml-auto text-xs text-gray-500">
                {connectionStatus.reminder === 'connected' ? 'Connected' :
                  connectionStatus.reminder === 'failed' ? 'Failed' : 'Not Connected'}
              </span>
            </div>
          </div>
        </div>

        {/* Integration Setup */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Connect Your Services</h2>
            <p className="text-sm text-gray-600 mt-1">
              Connect your accounts to start automating your schedule management.
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Gmail Integration */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Gmail</h3>
                  <p className="text-sm text-gray-600">Connect to process school emails automatically</p>
                  {connectionStatus.gmail === 'connected' && (
                    <p className="text-xs text-green-600 mt-1">✓ Connected</p>
                  )}
                  {connectionStatus.gmail === 'failed' && (
                    <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
                  )}
                </div>
              </div>
              {connectionStatus.gmail === 'connected' ? (
                <button
                  onClick={() => handleDisconnect('gmail')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => handleConnect('gmail')}
                  disabled={isButtonDisabled('gmail')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('gmail')}`}
                >
                  {getButtonText('gmail')}
                </button>
              )}
            </div>

            {/* Calendar Integration */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Google Calendar</h3>
                  <p className="text-sm text-gray-600">Automatically create events from emails</p>
                  {connectionStatus.calendar === 'connected' && (
                    <p className="text-xs text-green-600 mt-1">✓ Connected</p>
                  )}
                  {connectionStatus.calendar === 'failed' && (
                    <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
                  )}
                </div>
              </div>
              {connectionStatus.calendar === 'connected' ? (
                <button
                  onClick={() => handleDisconnect('calendar')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => handleConnect('calendar')}
                  disabled={isButtonDisabled('calendar')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('calendar')}`}
                >
                  {getButtonText('calendar')}
                </button>
              )}
            </div>

            {/* Reminders Integration */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 006.03 3h11.94c.7 0 1.35.37 1.7.97L21 9v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9c0-.26.06-.51.19-.74L4.19 4.19z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Smart Reminders</h3>
                  <p className="text-sm text-gray-600">Get intelligent reminders for important events</p>
                  {connectionStatus.reminder === 'connected' && (
                    <p className="text-xs text-green-600 mt-1">✓ Connected</p>
                  )}
                  {connectionStatus.reminder === 'failed' && (
                    <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
                  )}
                </div>
              </div>
              {connectionStatus.reminder === 'connected' ? (
                <button
                  onClick={() => handleDisconnect('reminder')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => handleConnect('reminder')}
                  disabled={isButtonDisabled('reminder')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('reminder')}`}
                >
                  {getButtonText('reminder')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Connect Your Accounts</h3>
              <p className="text-sm text-gray-600">Link your Gmail and Calendar to get started</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-semibold">2</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">AI Processes Emails</h3>
              <p className="text-sm text-gray-600">Our AI automatically scans school emails for events</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-semibold">3</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Events Created</h3>
              <p className="text-sm text-gray-600">Calendar events are automatically created with reminders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


// import { useSession, signIn } from 'next-auth/react'
// import { useRouter } from 'next/router'
// import { useState, useEffect } from 'react'
// import Navbar from '../components/Navbar'

// // Interface for pending events
// interface PendingEvent {
//   id: string
//   title: string
//   description: string
//   startDate: string
//   endDate: string
//   location?: string
//   source: string
//   confidenceScore: number
//   extractedFrom: string
//   createdAt: string
// }

// // Interface for dashboard stats
// interface DashboardStats {
//   emailsProcessed: number;
//   eventsCreated: number;
//   timeSaved: number;
// }

// // Simple function to log user actions to Google Sheets
// const logUserAction = async (action: string, service: string, status: string, details?: string) => {
//   try {
//     await fetch('/api/log-action', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         action,
//         service,
//         status,
//         details
//       })
//     })
//   } catch (error) {
//     console.error('Failed to log action:', error)
//   }
// }

// export default function Dashboard() {
//   const { data: session, status } = useSession()
//   const router = useRouter()
//   const [isConnecting, setIsConnecting] = useState<string | null>(null)
//   const [connectionStatus, setConnectionStatus] = useState<{[key: string]: 'connected' | 'failed' | 'not_connected'}>({
//     gmail: 'not_connected',
//     calendar: 'not_connected',
//     reminder: 'not_connected'
//   })
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)
//   const [hasCheckedStatus, setHasCheckedStatus] = useState(false)
  
//   // State for pending events and stats
//   const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([])
//   const [loadingEvents, setLoadingEvents] = useState(false)
//   const [editingEvent, setEditingEvent] = useState<string | null>(null)
//   const [editForm, setEditForm] = useState<Partial<PendingEvent>>({})
//   const [stats, setStats] = useState<DashboardStats>({ emailsProcessed: 0, eventsCreated: 0, timeSaved: 0 });

//   // Fetch data on initial load
//   useEffect(() => {
//     if (session?.accessToken && !hasCheckedStatus) {
//       checkConnectionStatus()
//       fetchDashboardData()
//       setHasCheckedStatus(true)
//       logUserAction('Dashboard Access', 'Dashboard', 'success', 'User accessed dashboard')
//     }
//   }, [session, hasCheckedStatus])

//   // Combined data fetch function
//   const fetchDashboardData = async () => {
//     setLoadingEvents(true)
//     try {
//       // Fetch pending events
//       const eventsResponse = await fetch('/api/pending-events')
//       if (eventsResponse.ok) {
//         const events = await eventsResponse.json()
//         setPendingEvents(events)
//         logUserAction('Fetch Events', 'Pending Events', 'success', `Loaded ${events.length} pending events`)
//       }

//       // Fetch dashboard stats
//       const statsResponse = await fetch('/api/stats')
//       if (statsResponse.ok) {
//         const newStats = await statsResponse.json()
//         setStats(newStats)
//         logUserAction('Fetch Stats', 'Dashboard', 'success', 'Loaded dashboard stats')
//       }

//     } catch (error) {
//       console.error('Error fetching dashboard data:', error)
//       logUserAction('Fetch Data', 'Dashboard', 'failed', 'Failed to load dashboard data')
//     } finally {
//       setLoadingEvents(false)
//     }
//   }

//   // Handle event approval
//   const handleApproveEvent = async (eventId: string) => {
//     try {
//       const response = await fetch(`/api/events/${eventId}/approve`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' }
//       })
      
//       if (response.ok) {
//         setPendingEvents(prev => prev.filter(event => event.id !== eventId))
//         setErrorMessage('Event approved and added to calendar!')
//         setTimeout(() => setErrorMessage(null), 3000)
//         logUserAction('Approve Event', 'Pending Events', 'success', `Event ${eventId} approved`)
//         fetchDashboardData(); // Refresh data to update stats
//       }
//     } catch (error) {
//       console.error('Error approving event:', error)
//       setErrorMessage('Failed to approve event. Please try again.')
//       setTimeout(() => setErrorMessage(null), 3000)
//       logUserAction('Approve Event', 'Pending Events', 'failed', `Failed to approve event ${eventId}`)
//     }
//   }

//   // Handle event rejection
//   const handleRejectEvent = async (eventId: string) => {
//     try {
//       const response = await fetch(`/api/events/${eventId}/reject`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' }
//       })
      
//       if (response.ok) {
//         setPendingEvents(prev => prev.filter(event => event.id !== eventId))
//         setErrorMessage('Event rejected successfully.')
//         setTimeout(() => setErrorMessage(null), 3000)
//         logUserAction('Reject Event', 'Pending Events', 'success', `Event ${eventId} rejected`)
//       }
//     } catch (error) {
//       console.error('Error rejecting event:', error)
//       setErrorMessage('Failed to reject event. Please try again.')
//       setTimeout(() => setErrorMessage(null), 3000)
//       logUserAction('Reject Event', 'Pending Events', 'failed', `Failed to reject event ${eventId}`)
//     }
//   }

//   // Handle edit event
//   const handleEditEvent = (event: PendingEvent) => {
//     setEditingEvent(event.id)
//     setEditForm(event)
//   }

//   // Save edited event
//   const handleSaveEdit = async (eventId: string) => {
//     try {
//       const response = await fetch(`/api/events/${eventId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(editForm)
//       })
      
//       if (response.ok) {
//         const updatedEvent = await response.json()
//         setPendingEvents(prev => prev.map(event => 
//           event.id === eventId ? updatedEvent : event
//         ))
//         setEditingEvent(null)
//         setEditForm({})
//         setErrorMessage('Event updated successfully!')
//         setTimeout(() => setErrorMessage(null), 3000)
//         logUserAction('Edit Event', 'Pending Events', 'success', `Event ${eventId} updated`)
//       }
//     } catch (error) {
//       console.error('Error saving event:', error)
//       setErrorMessage('Failed to save changes. Please try again.')
//       setTimeout(() => setErrorMessage(null), 3000)
//       logUserAction('Edit Event', 'Pending Events', 'failed', `Failed to update event ${eventId}`)
//     }
//   }

//   const checkConnectionStatus = async () => {
//     if (!session?.accessToken) {
//       return
//     }
    
//     // Simulate API calls to check connection status
//     try {
//       const gmailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
//         headers: { 'Authorization': `Bearer ${session?.accessToken}` }
//       });
//       setConnectionStatus(prev => ({ ...prev, gmail: gmailResponse.ok ? 'connected' : 'not_connected' }));

//       const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
//         headers: { 'Authorization': `Bearer ${session?.accessToken}` }
//       });
//       setConnectionStatus(prev => ({ ...prev, calendar: calendarResponse.ok ? 'connected' : 'not_connected' }));

//       // Smart Reminders are always available
//       setConnectionStatus(prev => ({ ...prev, reminder: 'connected' }));
      
//     } catch (error) {
//       console.error('Dashboard: Error checking connection status:', error)
//       setConnectionStatus(prev => ({ ...prev, gmail: 'not_connected', calendar: 'not_connected' }));
//     }
//   }

//   if (status === 'loading') {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading your dashboard...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!session) {
//     router.push('/auth/signin')
//     return null
//   }

//   const handleConnect = async (service: string) => {
//     setIsConnecting(service)
//     setErrorMessage(null)
//     logUserAction('Connect Attempt', service.charAt(0).toUpperCase() + service.slice(1), 'pending', 'User clicked connect button')
//     signIn('google')
//   }

//   const handleDisconnect = async (service: string) => {
//     logUserAction('Disconnect', service.charAt(0).toUpperCase() + service.slice(1), 'success', 'User manually disconnected service')
//     try {
//       setConnectionStatus(prev => ({ ...prev, [service]: 'not_connected' }))
//       setErrorMessage(`${service.charAt(0).toUpperCase() + service.slice(1)} disconnected successfully!`)
//       setTimeout(() => setErrorMessage(null), 3000)
//     } catch (error) {
//       console.error(`Error disconnecting ${service}:`, error)
//     }
//   }

//   const getButtonText = (service: string) => {
//     if (isConnecting === service) return 'Connecting...'
//     if (connectionStatus[service] === 'connected') return 'Connected'
//     if (connectionStatus[service] === 'failed') return 'Retry'
//     return 'Connect'
//   }

//   const getButtonClass = (service: string) => {
//     if (isConnecting === service) {
//       return 'bg-gray-300 text-gray-500 cursor-not-allowed'
//     }
//     if (connectionStatus[service] === 'connected') {
//       return 'bg-green-600 hover:bg-green-700 text-white'
//     }
//     if (connectionStatus[service] === 'failed') {
//       return 'bg-red-600 hover:bg-red-700 text-white'
//     }
//     return 'bg-blue-600 hover:bg-blue-700 text-white'
//   }

//   const isButtonDisabled = (service: string) => {
//     return isConnecting === service
//   }

//   const handleRefreshStatus = () => {
//     logUserAction('Refresh Status', 'Dashboard', 'pending', 'User manually refreshed connection status')
//     checkConnectionStatus()
//   }

//   const getConfidenceColor = (score: number) => {
//     if (score >= 0.8) return 'text-green-600 bg-green-100'
//     if (score >= 0.6) return 'text-yellow-600 bg-yellow-100'
//     return 'text-red-600 bg-red-100'
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Welcome Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Welcome back, {session.user?.name?.split(' ')[0]}!
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Let's get your AI assistant set up to help manage your busy schedule.
//           </p>
//         </div>

//         {/* Error Message */}
//         {errorMessage && (
//           <div className="mb-6 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-gray-700">{errorMessage}</p>
//               </div>
//               <div className="ml-auto pl-3">
//                 <button
//                   onClick={() => setErrorMessage(null)}
//                   className="inline-flex text-gray-400 hover:text-gray-600"
//                 >
//                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Pending Events Section - NEW */}
//         {pendingEvents.length > 0 && (
//           <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900">Pending Events</h2>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Review and approve events detected by AI from your emails
//                   </p>
//                 </div>
//                 <button
//                   onClick={fetchDashboardData}
//                   className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
//                 >
//                   Refresh
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6">
//               {loadingEvents ? (
//                 <div className="text-center py-8">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                   <p className="mt-2 text-gray-600">Loading pending events...</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {pendingEvents.map((event) => (
//                     <div key={event.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
//                       {editingEvent === event.id ? (
//                         // Edit Mode
//                         <div className="space-y-4">
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                             <input
//                               type="text"
//                               value={editForm.title || ''}
//                               onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                             <textarea
//                               value={editForm.description || ''}
//                               onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
//                               rows={3}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                           </div>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//                               <input
//                                 type="datetime-local"
//                                 value={editForm.startDate || ''}
//                                 onChange={(e) => setEditForm(prev => ({ ...prev, startDate: e.target.value }))}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               />
//                             </div>
//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//                               <input
//                                 type="datetime-local"
//                                 value={editForm.endDate || ''}
//                                 onChange={(e) => setEditForm(prev => ({ ...prev, endDate: e.target.value }))}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               />
//                             </div>
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//                             <input
//                               type="text"
//                               value={editForm.location || ''}
//                               onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                           </div>
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleSaveEdit(event.id)}
//                               className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
//                             >
//                               Save Changes
//                             </button>
//                             <button
//                               onClick={() => {
//                                 setEditingEvent(null)
//                                 setEditForm({})
//                               }}
//                               className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         // View Mode
//                         <div>
//                           <div className="flex items-start justify-between mb-3">
//                             <div className="flex-1">
//                               <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
//                               <p className="text-gray-600 text-sm mt-1">{event.description}</p>
//                             </div>
//                             <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(event.confidenceScore)}`}>
//                               {Math.round(event.confidenceScore * 100)}% confidence
//                             </span>
//                           </div>
                          
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
//                             <div>
//                               <span className="font-medium">Start:</span> {new Date(event.startDate).toLocaleDateString()} at {new Date(event.startDate).toLocaleTimeString()}
//                             </div>
//                             <div>
//                               <span className="font-medium">End:</span> {new Date(event.endDate).toLocaleDateString()} at {new Date(event.endDate).toLocaleTimeString()}
//                             </div>
//                             {event.location && (
//                               <div>
//                                 <span className="font-medium">Location:</span> {event.location}
//                               </div>
//                             )}
//                             <div>
//                               <span className="font-medium">Source:</span> {event.source}
//                             </div>
//                           </div>
                          
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleApproveEvent(event.id)}
//                               className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm"
//                             >
//                               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                               </svg>
//                               Approve
//                             </button>
//                             <button
//                               onClick={() => handleEditEvent(event)}
//                               className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
//                             >
//                               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                               </svg>
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => handleRejectEvent(event.id)}
//                               className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
//                             >
//                               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                               </svg>
//                               Reject
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Stats Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Emails Processed</p>
//                 <p className="text-2xl font-semibold text-gray-900">{stats.emailsProcessed}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Events Created</p>
//                 <p className="text-2xl font-semibold text-gray-900">{stats.eventsCreated}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Time Saved</p>
//                 <p className="text-2xl font-semibold text-gray-900">{stats.timeSaved}h</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Connection Status Overview */}
//         <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-gray-900">Connection Status</h2>
//             <div className="flex space-x-2">
//               <button
//                 onClick={handleRefreshStatus}
//                 className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
//               >
//                 Refresh Status
//               </button>
//               <button
//                 onClick={async () => {
//                   try {
//                     const response = await fetch('/api/test-google-sheets')
//                     const data = await response.json()
//                     if (data.success) {
//                       setErrorMessage('✅ Google Sheets connection successful! Check your spreadsheet for logs.')
//                     } else {
//                       setErrorMessage(`❌ Google Sheets test failed: ${data.error}`)
//                     }
//                     setTimeout(() => setErrorMessage(null), 5000)
//                   } catch (error) {
//                     setErrorMessage('❌ Failed to test Google Sheets connection')
//                     setTimeout(() => setErrorMessage(null), 5000)
//                   }
//                 }}
//                 className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
//               >
//                 Test Logging
//               </button>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="flex items-center p-3 bg-gray-50 rounded-lg">
//               <div className={`w-3 h-3 rounded-full mr-3 ${
//                 connectionStatus.gmail === 'connected' ? 'bg-green-500' :
//                 connectionStatus.gmail === 'failed' ? 'bg-red-500' : 'bg-gray-400'
//               }`}></div>
//               <span className="text-sm font-medium text-gray-700">Gmail</span>
//               <span className="ml-auto text-xs text-gray-500">
//                 {connectionStatus.gmail === 'connected' ? 'Connected' :
//                   connectionStatus.gmail === 'failed' ? 'Failed' : 'Not Connected'}
//               </span>
//             </div>
            
//             <div className="flex items-center p-3 bg-gray-50 rounded-lg">
//               <div className={`w-3 h-3 rounded-full mr-3 ${
//                 connectionStatus.calendar === 'connected' ? 'bg-green-500' :
//                 connectionStatus.calendar === 'failed' ? 'bg-red-500' : 'bg-gray-400'
//               }`}></div>
//               <span className="text-sm font-medium text-gray-700">Calendar</span>
//               <span className="ml-auto text-xs text-gray-500">
//                 {connectionStatus.calendar === 'connected' ? 'Connected' :
//                   connectionStatus.calendar === 'failed' ? 'Failed' : 'Not Connected'}
//               </span>
//             </div>
            
//             <div className="flex items-center p-3 bg-gray-50 rounded-lg">
//               <div className={`w-3 h-3 rounded-full mr-3 ${
//                 connectionStatus.reminder === 'connected' ? 'bg-green-500' :
//                 connectionStatus.reminder === 'failed' ? 'bg-red-500' : 'bg-gray-400'
//               }`}></div>
//               <span className="text-sm font-medium text-gray-700">Reminders</span>
//               <span className="ml-auto text-xs text-gray-500">
//                 {connectionStatus.reminder === 'connected' ? 'Connected' :
//                   connectionStatus.reminder === 'failed' ? 'Failed' : 'Not Connected'}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Integration Setup */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-900">Connect Your Services</h2>
//             <p className="text-sm text-gray-600 mt-1">
//               Connect your accounts to start automating your schedule management.
//             </p>
//           </div>
          
//           <div className="p-6 space-y-6">
//             {/* Gmail Integration */}
//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center space-x-4">
//                 <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">Gmail</h3>
//                   <p className="text-sm text-gray-600">Connect to process school emails automatically</p>
//                   {connectionStatus.gmail === 'connected' && (
//                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
//                   )}
//                   {connectionStatus.gmail === 'failed' && (
//                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
//                   )}
//                 </div>
//               </div>
//               {connectionStatus.gmail === 'connected' ? (
//                 <button
//                   onClick={() => handleDisconnect('gmail')}
//                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
//                 >
//                   Disconnect
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => handleConnect('gmail')}
//                   disabled={isButtonDisabled('gmail')}
//                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('gmail')}`}
//                 >
//                   {getButtonText('gmail')}
//                 </button>
//               )}
//             </div>

//             {/* Calendar Integration */}
//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center space-x-4">
//                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">Google Calendar</h3>
//                   <p className="text-sm text-gray-600">Automatically create events from emails</p>
//                   {connectionStatus.calendar === 'connected' && (
//                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
//                   )}
//                   {connectionStatus.calendar === 'failed' && (
//                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
//                   )}
//                 </div>
//               </div>
//               {connectionStatus.calendar === 'connected' ? (
//                 <button
//                   onClick={() => handleDisconnect('calendar')}
//                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
//                 >
//                   Disconnect
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => handleConnect('calendar')}
//                   disabled={isButtonDisabled('calendar')}
//                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('calendar')}`}
//                 >
//                   {getButtonText('calendar')}
//                 </button>
//               )}
//             </div>

//             {/* Reminders Integration */}
//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center space-x-4">
//                 <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 006.03 3h11.94c.7 0 1.35.37 1.7.97L21 9v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9c0-.26.06-.51.19-.74L4.19 4.19z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">Smart Reminders</h3>
//                   <p className="text-sm text-gray-600">Get intelligent reminders for important events</p>
//                   {connectionStatus.reminder === 'connected' && (
//                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
//                   )}
//                   {connectionStatus.reminder === 'failed' && (
//                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
//                   )}
//                 </div>
//               </div>
//               {connectionStatus.reminder === 'connected' ? (
//                 <button
//                   onClick={() => handleDisconnect('reminder')}
//                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
//                 >
//                   Disconnect
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => handleConnect('reminder')}
//                   disabled={isButtonDisabled('reminder')}
//                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('reminder')}`}
//                 >
//                   {getButtonText('reminder')}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* How It Works */}
//         <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="text-center">
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <span className="text-blue-600 font-semibold">1</span>
//               </div>
//               <h3 className="font-medium text-gray-900 mb-2">Connect Your Accounts</h3>
//               <p className="text-sm text-gray-600">Link your Gmail and Calendar to get started</p>
//             </div>
//             <div className="text-center">
//               <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <span className="text-purple-600 font-semibold">2</span>
//               </div>
//               <h3 className="font-medium text-gray-900 mb-2">AI Processes Emails</h3>
//               <p className="text-sm text-gray-600">Our AI automatically scans school emails for events</p>
//             </div>
//             <div className="text-center">
//               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <span className="text-green-600 font-semibold">3</span>
//               </div>
//               <h3 className="font-medium text-gray-900 mb-2">Events Created</h3>
//               <p className="text-sm text-gray-600">Calendar events are automatically created with reminders</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }