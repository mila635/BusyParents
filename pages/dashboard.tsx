
// // // //New Dashboard Code
// // // import { useSession, signIn } from 'next-auth/react'
// // // import { useRouter } from 'next/router'
// // // import { useState, useEffect } from 'react'
// // // import Navbar from '../components/Navbar'

// // // // Interface for pending events
// // // interface PendingEvent {
// // //   id: string
// // //   title: string
// // //   description: string
// // //   startDate: string
// // //   endDate: string
// // //   location?: string
// // //   source: string
// // //   confidenceScore: number
// // //   extractedFrom: string
// // //   createdAt: string
// // // }

// // // // Simple function to log user actions to Google Sheets
// // // const logUserAction = async (action: string, service: string, status: string, details?: string) => {
// // //   try {
// // //     await fetch('/api/log-action', {
// // //       method: 'POST',
// // //       headers: { 'Content-Type': 'application/json' },
// // //       body: JSON.stringify({
// // //         action,
// // //         service,
// // //         status,
// // //         details
// // //       })
// // //     })
// // //   } catch (error) {
// // //     console.error('Failed to log action:', error)
// // //   }
// // // }

// // // // Dummy data for demonstration purposes
// // // const DUMMY_PENDING_EVENTS: PendingEvent[] = [
// // //   {
// // //     id: 'event_001',
// // //     title: 'School Play Auditions',
// // //     description: 'Auditions for the annual school play. All students are welcome to participate.',
// // //     startDate: new Date('2025-09-15T10:00:00').toISOString(),
// // //     endDate: new Date('2025-09-15T12:00:00').toISOString(),
// // //     location: 'School Auditorium',
// // //     source: 'Gmail',
// // //     confidenceScore: 0.95,
// // //     extractedFrom: 'email_123',
// // //     createdAt: new Date('2025-09-04T10:00:00').toISOString(),
// // //   },
// // //   {
// // //     id: 'event_002',
// // //     title: 'Parent-Teacher Conference',
// // //     description: 'Schedule a time to meet with your child\'s teachers to discuss their progress.',
// // //     startDate: new Date('2025-10-01T08:00:00').toISOString(),
// // //     endDate: new Date('2025-10-01T17:00:00').toISOString(),
// // //     location: 'Online via Google Meet',
// // //     source: 'Gmail',
// // //     confidenceScore: 0.88,
// // //     extractedFrom: 'email_124',
// // //     createdAt: new Date('2025-09-04T10:05:00').toISOString(),
// // //   },
// // // ];

// // // export default function Dashboard() {
// // //   const { data: session, status } = useSession()
// // //   const router = useRouter()
// // //   const [isConnecting, setIsConnecting] = useState<string | null>(null)
// // //   const [connectionStatus, setConnectionStatus] = useState<{[key: string]: 'connected' | 'failed' | 'not_connected'}>({
// // //     gmail: 'not_connected',
// // //     calendar: 'not_connected',
// // //     reminder: 'not_connected'
// // //   })
// // //   const [errorMessage, setErrorMessage] = useState<string | null>(null)
// // //   const [hasCheckedStatus, setHasCheckedStatus] = useState(false)
  
// // //   // State for pending events
// // //   const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([])
// // //   const [loadingEvents, setLoadingEvents] = useState(false)
// // //   const [editingEvent, setEditingEvent] = useState<string | null>(null)
// // //   const [editForm, setEditForm] = useState<Partial<PendingEvent>>({})

// // //   // Fetch data on initial load
// // //   useEffect(() => {
// // //     if (session?.accessToken && !hasCheckedStatus) {
// // //       checkConnectionStatus()
// // //       fetchPendingEvents()
// // //       setHasCheckedStatus(true)
// // //       logUserAction('Dashboard Access', 'Dashboard', 'success', 'User accessed dashboard')
// // //     }
// // //   }, [session, hasCheckedStatus])

// // //   // Fetch pending events from a dummy data source for testing
// // //   const fetchPendingEvents = async () => {
// // //     setLoadingEvents(true)
// // //     try {
// // //       // Simulate fetching data from your API
// // //       const events = DUMMY_PENDING_EVENTS;
// // //       setPendingEvents(events)
// // //       logUserAction('Fetch Events', 'Pending Events', 'success', `Loaded ${events.length} pending events`)
// // //     } catch (error) {
// // //       console.error('Error fetching pending events:', error)
// // //       logUserAction('Fetch Events', 'Pending Events', 'failed', 'Failed to load pending events')
// // //     } finally {
// // //       setLoadingEvents(false)
// // //     }
// // //   }

// // //   // Handle event approval
// // //   const handleApproveEvent = async (eventId: string) => {
// // //     try {
// // //       // Simulate API call and state update
// // //       setPendingEvents(prev => prev.filter(event => event.id !== eventId))
// // //       setErrorMessage('Event approved and added to calendar!')
// // //       setTimeout(() => setErrorMessage(null), 3000)
// // //       logUserAction('Approve Event', 'Pending Events', 'success', `Event ${eventId} approved`)
// // //     } catch (error) {
// // //       console.error('Error approving event:', error)
// // //       setErrorMessage('Failed to approve event. Please try again.')
// // //       setTimeout(() => setErrorMessage(null), 3000)
// // //       logUserAction('Approve Event', 'Pending Events', 'failed', `Failed to approve event ${eventId}`)
// // //     }
// // //   }

// // //   // Handle event rejection
// // //   const handleRejectEvent = async (eventId: string) => {
// // //     try {
// // //       // Simulate API call and state update
// // //       setPendingEvents(prev => prev.filter(event => event.id !== eventId))
// // //       setErrorMessage('Event rejected successfully.')
// // //       setTimeout(() => setErrorMessage(null), 3000)
// // //       logUserAction('Reject Event', 'Pending Events', 'success', `Event ${eventId} rejected`)
// // //     } catch (error) {
// // //       console.error('Error rejecting event:', error)
// // //       setErrorMessage('Failed to reject event. Please try again.')
// // //       setTimeout(() => setErrorMessage(null), 3000)
// // //       logUserAction('Reject Event', 'Pending Events', 'failed', `Failed to reject event ${eventId}`)
// // //     }
// // //   }

// // //   // Handle edit event
// // //   const handleEditEvent = (event: PendingEvent) => {
// // //     setEditingEvent(event.id)
// // //     setEditForm(event)
// // //   }

// // //   // Save edited event
// // //   const handleSaveEdit = async (eventId: string) => {
// // //     try {
// // //       // Simulate API call and state update
// // //       const updatedEvent = { ...editForm, id: eventId } as PendingEvent
// // //       setPendingEvents(prev => prev.map(event => 
// // //         event.id === eventId ? updatedEvent : event
// // //       ))
// // //       setEditingEvent(null)
// // //       setEditForm({})
// // //       setErrorMessage('Event updated successfully!')
// // //       setTimeout(() => setErrorMessage(null), 3000)
// // //       logUserAction('Edit Event', 'Pending Events', 'success', `Event ${eventId} updated`)
// // //     } catch (error) {
// // //       console.error('Error saving event:', error)
// // //       setErrorMessage('Failed to save changes. Please try again.')
// // //       setTimeout(() => setErrorMessage(null), 3000)
// // //       logUserAction('Edit Event', 'Pending Events', 'failed', `Failed to update event ${eventId}`)
// // //     }
// // //   }

// // //   const checkConnectionStatus = async () => {
// // //     if (!session?.accessToken) {
// // //       return
// // //     }
    
// // //     // Simulate connection checks
// // //     setConnectionStatus(prev => ({ ...prev, gmail: 'connected', calendar: 'connected', reminder: 'connected' }))
// // //   }

// // //   if (status === 'loading') {
// // //     return (
// // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// // //         <div className="text-center">
// // //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
// // //           <p className="mt-4 text-gray-600">Loading your dashboard...</p>
// // //         </div>
// // //       </div>
// // //     )
// // //   }

// // //   if (!session) {
// // //     router.push('/auth/signin')
// // //     return null
// // //   }

// // //   const handleConnect = async (service: string) => {
// // //     setIsConnecting(service)
// // //     setErrorMessage(null)
// // //     logUserAction('Connect Attempt', service.charAt(0).toUpperCase() + service.slice(1), 'pending', 'User clicked connect button')
// // //     signIn('google')
// // //   }

// // //   const handleDisconnect = async (service: string) => {
// // //     logUserAction('Disconnect', service.charAt(0).toUpperCase() + service.slice(1), 'success', 'User manually disconnected service')
// // //     try {
// // //       setConnectionStatus(prev => ({ ...prev, [service]: 'not_connected' }))
// // //       setErrorMessage(`${service.charAt(0).toUpperCase() + service.slice(1)} disconnected successfully!`)
// // //       setTimeout(() => setErrorMessage(null), 3000)
// // //     } catch (error) {
// // //       console.error(`Error disconnecting ${service}:`, error)
// // //     }
// // //   }

// // //   const getButtonText = (service: string) => {
// // //     if (isConnecting === service) return 'Connecting...'
// // //     if (connectionStatus[service] === 'connected') return 'Connected'
// // //     if (connectionStatus[service] === 'failed') return 'Retry'
// // //     return 'Connect'
// // //   }

// // //   const getButtonClass = (service: string) => {
// // //     if (isConnecting === service) {
// // //       return 'bg-gray-300 text-gray-500 cursor-not-allowed'
// // //     }
// // //     if (connectionStatus[service] === 'connected') {
// // //       return 'bg-green-600 hover:bg-green-700 text-white'
// // //     }
// // //     if (connectionStatus[service] === 'failed') {
// // //       return 'bg-red-600 hover:bg-red-700 text-white'
// // //     }
// // //     return 'bg-blue-600 hover:bg-blue-700 text-white'
// // //   }

// // //   const isButtonDisabled = (service: string) => {
// // //     return isConnecting === service
// // //   }

// // //   const handleRefreshStatus = () => {
// // //     logUserAction('Refresh Status', 'Dashboard', 'pending', 'User manually refreshed connection status')
// // //     checkConnectionStatus()
// // //   }

// // //   const getConfidenceColor = (score: number) => {
// // //     if (score >= 0.8) return 'text-green-600 bg-green-100'
// // //     if (score >= 0.6) return 'text-yellow-600 bg-yellow-100'
// // //     return 'text-red-600 bg-red-100'
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-gray-50">
// // //       <Navbar />
      
// // //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// // //         {/* Welcome Section */}
// // //         <div className="mb-8">
// // //           <h1 className="text-3xl font-bold text-gray-900">
// // //             Welcome back, {session.user?.name?.split(' ')[0]}!
// // //           </h1>
// // //           <p className="text-gray-600 mt-2">
// // //             Let's get your AI assistant set up to help manage your busy schedule.
// // //           </p>
// // //         </div>

// // //         {/* Error Message */}
// // //         {errorMessage && (
// // //           <div className="mb-6 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
// // //             <div className="flex items-center">
// // //               <div className="flex-shrink-0">
// // //                 <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
// // //                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
// // //                 </svg>
// // //               </div>
// // //               <div className="ml-3">
// // //                 <p className="text-sm text-gray-700">{errorMessage}</p>
// // //               </div>
// // //               <div className="ml-auto pl-3">
// // //                 <button
// // //                   onClick={() => setErrorMessage(null)}
// // //                   className="inline-flex text-gray-400 hover:text-gray-600"
// // //                 >
// // //                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
// // //                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
// // //                   </svg>
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* Pending Events Section - NEW */}
// // //         {pendingEvents.length > 0 && (
// // //           <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
// // //             <div className="px-6 py-4 border-b border-gray-200">
// // //               <div className="flex items-center justify-between">
// // //                 <div>
// // //                   <h2 className="text-lg font-semibold text-gray-900">Pending Events</h2>
// // //                   <p className="text-sm text-gray-600 mt-1">
// // //                     Review and approve events detected by AI from your emails
// // //                   </p>
// // //                 </div>
// // //                 <button
// // //                   onClick={fetchPendingEvents}
// // //                   className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
// // //                 >
// // //                   Refresh
// // //                 </button>
// // //               </div>
// // //             </div>
            
// // //             <div className="p-6">
// // //               {loadingEvents ? (
// // //                 <div className="text-center py-8">
// // //                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
// // //                   <p className="mt-2 text-gray-600">Loading pending events...</p>
// // //                 </div>
// // //               ) : (
// // //                 <div className="space-y-4">
// // //                   {pendingEvents.map((event) => (
// // //                     <div key={event.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
// // //                       {editingEvent === event.id ? (
// // //                         // Edit Mode
// // //                         <div className="space-y-4">
// // //                           <div>
// // //                             <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
// // //                             <input
// // //                               type="text"
// // //                               value={editForm.title || ''}
// // //                               onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
// // //                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                             />
// // //                           </div>
// // //                           <div>
// // //                             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
// // //                             <textarea
// // //                               value={editForm.description || ''}
// // //                               onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
// // //                               rows={3}
// // //                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                             />
// // //                           </div>
// // //                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                             <div>
// // //                               <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
// // //                               <input
// // //                                 type="datetime-local"
// // //                                 value={editForm.startDate || ''}
// // //                                 onChange={(e) => setEditForm(prev => ({ ...prev, startDate: e.target.value }))}
// // //                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                               />
// // //                             </div>
// // //                             <div>
// // //                               <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
// // //                               <input
// // //                                 type="datetime-local"
// // //                                 value={editForm.endDate || ''}
// // //                                 onChange={(e) => setEditForm(prev => ({ ...prev, endDate: e.target.value }))}
// // //                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                               />
// // //                             </div>
// // //                           </div>
// // //                           <div>
// // //                             <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
// // //                             <input
// // //                               type="text"
// // //                               value={editForm.location || ''}
// // //                               onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
// // //                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                             />
// // //                           </div>
// // //                           <div className="flex space-x-2">
// // //                             <button
// // //                               onClick={() => handleSaveEdit(event.id)}
// // //                               className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
// // //                             >
// // //                               Save Changes
// // //                             </button>
// // //                             <button
// // //                               onClick={() => {
// // //                                 setEditingEvent(null)
// // //                                 setEditForm({})
// // //                               }}
// // //                               className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
// // //                             >
// // //                               Cancel
// // //                             </button>
// // //                           </div>
// // //                         </div>
// // //                       ) : (
// // //                         // View Mode
// // //                         <div>
// // //                           <div className="flex items-start justify-between mb-3">
// // //                             <div className="flex-1">
// // //                               <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
// // //                               <p className="text-gray-600 text-sm mt-1">{event.description}</p>
// // //                             </div>
// // //                             <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(event.confidenceScore)}`}>
// // //                               {Math.round(event.confidenceScore * 100)}% confidence
// // //                             </span>
// // //                           </div>
                          
// // //                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
// // //                             <div>
// // //                               <span className="font-medium">Start:</span> {new Date(event.startDate).toLocaleDateString()} at {new Date(event.startDate).toLocaleTimeString()}
// // //                             </div>
// // //                             <div>
// // //                               <span className="font-medium">End:</span> {new Date(event.endDate).toLocaleDateString()} at {new Date(event.endDate).toLocaleTimeString()}
// // //                             </div>
// // //                             {event.location && (
// // //                               <div>
// // //                                 <span className="font-medium">Location:</span> {event.location}
// // //                               </div>
// // //                             )}
// // //                             <div>
// // //                               <span className="font-medium">Source:</span> {event.source}
// // //                             </div>
// // //                           </div>
                          
// // //                           <div className="flex space-x-2">
// // //                             <button
// // //                               onClick={() => handleApproveEvent(event.id)}
// // //                               className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm"
// // //                             >
// // //                               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
// // //                               </svg>
// // //                               Approve
// // //                             </button>
// // //                             <button
// // //                               onClick={() => handleEditEvent(event)}
// // //                               className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
// // //                             >
// // //                               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
// // //                               </svg>
// // //                               Edit
// // //                             </button>
// // //                             <button
// // //                               onClick={() => handleRejectEvent(event.id)}
// // //                               className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
// // //                             >
// // //                               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // //                               </svg>
// // //                               Reject
// // //                             </button>
// // //                           </div>
// // //                         </div>
// // //                       )}
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* Stats Overview */}
// // //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
// // //           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// // //             <div className="flex items-center">
// // //               <div className="flex-shrink-0">
// // //                 <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
// // //                   <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
// // //                   </svg>
// // //                 </div>
// // //               </div>
// // //               <div className="ml-4">
// // //                 <p className="text-sm font-medium text-gray-500">Emails Processed</p>
// // //                 <p className="text-2xl font-semibold text-gray-900">0</p>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// // //             <div className="flex items-center">
// // //               <div className="flex-shrink-0">
// // //                 <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
// // //                   <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// // //                   </svg>
// // //                 </div>
// // //               </div>
// // //               <div className="ml-4">
// // //                 <p className="text-sm font-medium text-gray-500">Events Created</p>
// // //                 <p className="text-2xl font-semibold text-gray-900">0</p>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// // //             <div className="flex items-center">
// // //               <div className="flex-shrink-0">
// // //                 <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
// // //                   <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// // //                   </svg>
// // //                 </div>
// // //               </div>
// // //               <div className="ml-4">
// // //                 <p className="text-sm font-medium text-gray-500">Time Saved</p>
// // //                 <p className="text-2xl font-semibold text-gray-900">0h</p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Connection Status Overview */}
// // //         <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// // //           <div className="flex items-center justify-between mb-4">
// // //             <h2 className="text-lg font-semibold text-gray-900">Connection Status</h2>
// // //             <div className="flex space-x-2">
// // //               <button
// // //                 onClick={handleRefreshStatus}
// // //                 className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
// // //               >
// // //                 Refresh Status
// // //               </button>
// // //               <button
// // //                 onClick={async () => {
// // //                   try {
// // //                     const response = await fetch('/api/test-google-sheets')
// // //                     const data = await response.json()
// // //                     if (data.success) {
// // //                       setErrorMessage('✅ Google Sheets connection successful! Check your spreadsheet for logs.')
// // //                     } else {
// // //                       setErrorMessage(`❌ Google Sheets test failed: ${data.error}`)
// // //                     }
// // //                     setTimeout(() => setErrorMessage(null), 5000)
// // //                   } catch (error) {
// // //                     setErrorMessage('❌ Failed to test Google Sheets connection')
// // //                     setTimeout(() => setErrorMessage(null), 5000)
// // //                   }
// // //                 }}
// // //                 className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
// // //               >
// // //                 Test Logging
// // //               </button>
// // //             </div>
// // //           </div>
// // //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //             <div className="flex items-center p-3 bg-gray-50 rounded-lg">
// // //               <div className={`w-3 h-3 rounded-full mr-3 ${
// // //                 connectionStatus.gmail === 'connected' ? 'bg-green-500' :
// // //                 connectionStatus.gmail === 'failed' ? 'bg-red-500' : 'bg-gray-400'
// // //               }`}></div>
// // //               <span className="text-sm font-medium text-gray-700">Gmail</span>
// // //               <span className="ml-auto text-xs text-gray-500">
// // //                 {connectionStatus.gmail === 'connected' ? 'Connected' :
// // //                   connectionStatus.gmail === 'failed' ? 'Failed' : 'Not Connected'}
// // //               </span>
// // //             </div>
            
// // //             <div className="flex items-center p-3 bg-gray-50 rounded-lg">
// // //               <div className={`w-3 h-3 rounded-full mr-3 ${
// // //                 connectionStatus.calendar === 'connected' ? 'bg-green-500' :
// // //                 connectionStatus.calendar === 'failed' ? 'bg-red-500' : 'bg-gray-400'
// // //               }`}></div>
// // //               <span className="text-sm font-medium text-gray-700">Calendar</span>
// // //               <span className="ml-auto text-xs text-gray-500">
// // //                 {connectionStatus.calendar === 'connected' ? 'Connected' :
// // //                   connectionStatus.calendar === 'failed' ? 'Failed' : 'Not Connected'}
// // //               </span>
// // //             </div>
            
// // //             <div className="flex items-center p-3 bg-gray-50 rounded-lg">
// // //               <div className={`w-3 h-3 rounded-full mr-3 ${
// // //                 connectionStatus.reminder === 'connected' ? 'bg-green-500' :
// // //                 connectionStatus.reminder === 'failed' ? 'bg-red-500' : 'bg-gray-400'
// // //               }`}></div>
// // //               <span className="text-sm font-medium text-gray-700">Reminders</span>
// // //               <span className="ml-auto text-xs text-gray-500">
// // //                 {connectionStatus.reminder === 'connected' ? 'Connected' :
// // //                   connectionStatus.reminder === 'failed' ? 'Failed' : 'Not Connected'}
// // //               </span>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Integration Setup */}
// // //         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
// // //           <div className="px-6 py-4 border-b border-gray-200">
// // //             <h2 className="text-lg font-semibold text-gray-900">Connect Your Services</h2>
// // //             <p className="text-sm text-gray-600 mt-1">
// // //               Connect your accounts to start automating your schedule management.
// // //             </p>
// // //           </div>
          
// // //           <div className="p-6 space-y-6">
// // //             {/* Gmail Integration */}
// // //             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
// // //               <div className="flex items-center space-x-4">
// // //                 <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
// // //                   <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
// // //                     <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
// // //                   </svg>
// // //                 </div>
// // //                 <div>
// // //                   <h3 className="text-lg font-medium text-gray-900">Gmail</h3>
// // //                   <p className="text-sm text-gray-600">Connect to process school emails automatically</p>
// // //                   {connectionStatus.gmail === 'connected' && (
// // //                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
// // //                   )}
// // //                   {connectionStatus.gmail === 'failed' && (
// // //                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
// // //                   )}
// // //                 </div>
// // //               </div>
// // //               {connectionStatus.gmail === 'connected' ? (
// // //                 <button
// // //                   onClick={() => handleDisconnect('gmail')}
// // //                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
// // //                 >
// // //                   Disconnect
// // //                 </button>
// // //               ) : (
// // //                 <button
// // //                   onClick={() => handleConnect('gmail')}
// // //                   disabled={isButtonDisabled('gmail')}
// // //                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('gmail')}`}
// // //                 >
// // //                   {getButtonText('gmail')}
// // //                 </button>
// // //               )}
// // //             </div>

// // //             {/* Calendar Integration */}
// // //             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
// // //               <div className="flex items-center space-x-4">
// // //                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
// // //                   <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// // //                   </svg>
// // //                 </div>
// // //                 <div>
// // //                   <h3 className="text-lg font-medium text-gray-900">Google Calendar</h3>
// // //                   <p className="text-sm text-gray-600">Automatically create events from emails</p>
// // //                   {connectionStatus.calendar === 'connected' && (
// // //                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
// // //                   )}
// // //                   {connectionStatus.calendar === 'failed' && (
// // //                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
// // //                   )}
// // //                 </div>
// // //               </div>
// // //               {connectionStatus.calendar === 'connected' ? (
// // //                 <button
// // //                   onClick={() => handleDisconnect('calendar')}
// // //                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
// // //                 >
// // //                   Disconnect
// // //                 </button>
// // //               ) : (
// // //                 <button
// // //                   onClick={() => handleConnect('calendar')}
// // //                   disabled={isButtonDisabled('calendar')}
// // //                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('calendar')}`}
// // //                 >
// // //                   {getButtonText('calendar')}
// // //                 </button>
// // //               )}
// // //             </div>

// // //             {/* Reminders Integration */}
// // //             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
// // //               <div className="flex items-center space-x-4">
// // //                 <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
// // //                   <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 006.03 3h11.94c.7 0 1.35.37 1.7.97L21 9v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9c0-.26.06-.51.19-.74L4.19 4.19z" />
// // //                   </svg>
// // //                 </div>
// // //                 <div>
// // //                   <h3 className="text-lg font-medium text-gray-900">Smart Reminders</h3>
// // //                   <p className="text-sm text-gray-600">Get intelligent reminders for important events</p>
// // //                   {connectionStatus.reminder === 'connected' && (
// // //                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
// // //                   )}
// // //                   {connectionStatus.reminder === 'failed' && (
// // //                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
// // //                   )}
// // //                 </div>
// // //               </div>
// // //               {connectionStatus.reminder === 'connected' ? (
// // //                 <button
// // //                   onClick={() => handleDisconnect('reminder')}
// // //                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
// // //                 >
// // //                   Disconnect
// // //                 </button>
// // //               ) : (
// // //                 <button
// // //                   onClick={() => handleConnect('reminder')}
// // //                   disabled={isButtonDisabled('reminder')}
// // //                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('reminder')}`}
// // //                 >
// // //                   {getButtonText('reminder')}
// // //                 </button>
// // //               )}
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* How It Works */}
// // //         <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
// // //           <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
// // //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// // //             <div className="text-center">
// // //               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
// // //                 <span className="text-blue-600 font-semibold">1</span>
// // //               </div>
// // //               <h3 className="font-medium text-gray-900 mb-2">Connect Your Accounts</h3>
// // //               <p className="text-sm text-gray-600">Link your Gmail and Calendar to get started</p>
// // //             </div>
// // //             <div className="text-center">
// // //               <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
// // //                 <span className="text-purple-600 font-semibold">2</span>
// // //               </div>
// // //               <h3 className="font-medium text-gray-900 mb-2">AI Processes Emails</h3>
// // //               <p className="text-sm text-gray-600">Our AI automatically scans school emails for events</p>
// // //             </div>
// // //             <div className="text-center">
// // //               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
// // //                 <span className="text-green-600 font-semibold">3</span>
// // //               </div>
// // //               <h3 className="font-medium text-gray-900 mb-2">Events Created</h3>
// // //               <p className="text-sm text-gray-600">Calendar events are automatically created with reminders</p>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   )
// // // }

































// // import { useSession, signIn } from 'next-auth/react'
// // import { useRouter } from 'next/router'
// // import { useState, useEffect } from 'react'
// // import Navbar from '../components/Navbar'

// // // Simple function to log user actions to Google Sheets
// // const logUserAction = async (action: string, service: string, status: string, details?: string) => {
// //   try {
// //     await fetch('/api/log-action', {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify({
// //         action,
// //         service,
// //         status,
// //         details
// //       })
// //     })
// //   } catch (error) {
// //     console.error('Failed to log action:', error)
// //   }
// // }

// // // Interface for pending events
// // interface PendingEvent {
// //   id: string
// //   title: string
// //   description: string
// //   date: string
// //   time: string
// //   location?: string
// //   confidence: number
// //   source: string // email subject or source
// //   originalEmail: string
// // }

// // // Interface for notification settings
// // interface NotificationSettings {
// //   emailAlerts: boolean
// //   whatsappAlerts: boolean
// //   emailAddress: string
// //   whatsappNumber: string
// //   reminderTiming: number // minutes before event
// // }

// // export default function Dashboard() {
// //   const { data: session, status } = useSession()
// //   const router = useRouter()
// //   const [isConnecting, setIsConnecting] = useState<string | null>(null)
// //   const [connectionStatus, setConnectionStatus] = useState<{[key: string]: 'connected' | 'failed' | 'not_connected'}>({
// //     gmail: 'not_connected',
// //     calendar: 'not_connected',
// //     reminder: 'not_connected'
// //   })
// //   const [errorMessage, setErrorMessage] = useState<string | null>(null)
// //   const [hasCheckedStatus, setHasCheckedStatus] = useState(false)

// //   // New state for pending events
// //   const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([])
// //   const [processingEventId, setProcessingEventId] = useState<string | null>(null)
// //   const [editingEvent, setEditingEvent] = useState<PendingEvent | null>(null)

// //   // New state for notification settings
// //   const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
// //     emailAlerts: false,
// //     whatsappAlerts: false,
// //     emailAddress: '',
// //     whatsappNumber: '',
// //     reminderTiming: 30
// //   })
// //   const [showNotificationSettings, setShowNotificationSettings] = useState(false)
// //   const [isSavingSettings, setIsSavingSettings] = useState(false)

// //   // Mock data for demonstration - replace with actual API call
// //   useEffect(() => {
// //     // Simulate loading pending events
// //     const mockPendingEvents: PendingEvent[] = [
// //       {
// //         id: '1',
// //         title: 'Math Test - Chapter 5',
// //         description: 'Algebra and Geometry test covering chapters 4-5',
// //         date: '2025-09-15',
// //         time: '10:00',
// //         location: 'Room 204',
// //         confidence: 92,
// //         source: 'Math Department - Important Test Announcement',
// //         originalEmail: 'Dear students, we have a test on September 15th...'
// //       },
// //       {
// //         id: '2',
// //         title: 'Science Fair Project Due',
// //         description: 'Final submission for science fair project',
// //         date: '2025-09-20',
// //         time: '23:59',
// //         confidence: 87,
// //         source: 'Science Department - Project Deadline Reminder',
// //         originalEmail: 'This is a reminder that your science fair projects...'
// //       },
// //       {
// //         id: '3',
// //         title: 'Parent-Teacher Conference',
// //         description: 'Individual meetings with teachers',
// //         date: '2025-09-25',
// //         time: '15:00',
// //         location: 'Main Hall',
// //         confidence: 78,
// //         source: 'School Administration - Conference Schedule',
// //         originalEmail: 'Parent-teacher conferences are scheduled for...'
// //       }
// //     ]
// //     setPendingEvents(mockPendingEvents)
// //     // Load notification settings from localStorage or API
// //     const savedSettings = localStorage.getItem('notificationSettings')
// //     if (savedSettings) {
// //       setNotificationSettings(JSON.parse(savedSettings))
// //     }
// //   }, [])

// //   // Check connection status when component mounts and when the session becomes available
// //   useEffect(() => {
// //     if (session?.accessToken && !hasCheckedStatus) {
// //       console.log('Dashboard: Session access token available, checking connection status...')
// //       checkConnectionStatus()
// //       setHasCheckedStatus(true)

// //       // Log dashboard access
// //       logUserAction('Dashboard Access', 'Dashboard', 'success', 'User accessed dashboard')
// //     }
// //   }, [session, hasCheckedStatus])

// //   const checkConnectionStatus = async () => {
// //     if (!session?.accessToken) {
// //       console.log('Dashboard: Session access token not available, skipping connection status check.')
// //       return
// //     }
// //     console.log('Dashboard: Starting connection status check...')

// //     try {
// //       // Check Gmail connection
// //       try {
// //         console.log('Dashboard: Testing Gmail API access...')
// //         const gmailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
// //           headers: {
// //             'Authorization': `Bearer ${session?.accessToken}`,
// //             'Content-Type': 'application/json'
// //           }
// //         })
// //         if (gmailResponse.ok) {
// //           console.log('Dashboard: Gmail API accessible')
// //           setConnectionStatus(prev => ({ ...prev, gmail: 'connected' }))
// //           logUserAction('Status Check', 'Gmail', 'success', 'Gmail API accessible')
// //         } else {
// //           console.log('Dashboard: Gmail API not accessible, status:', gmailResponse.status)
// //           setConnectionStatus(prev => ({ ...prev, gmail: 'not_connected' }))
// //           logUserAction('Status Check', 'Gmail', 'failed', `Status: ${gmailResponse.status}`)
// //         }
// //       } catch (error) {
// //         console.log('Dashboard: Gmail not accessible:', error)
// //         setConnectionStatus(prev => ({ ...prev, gmail: 'not_connected' }))
// //         logUserAction('Status Check', 'Gmail', 'failed', 'API call failed')
// //       }
// //       // Check Calendar connection
// //       try {
// //         console.log('Dashboard: Testing Calendar API access...')
// //         const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
// //           headers: {
// //             'Authorization': `Bearer ${session?.accessToken}`,
// //             'Content-Type': 'application/json'
// //           }
// //         })
// //         if (calendarResponse.ok) {
// //           console.log('Dashboard: Calendar API accessible')
// //           setConnectionStatus(prev => ({ ...prev, calendar: 'connected' }))
// //           logUserAction('Status Check', 'Google Calendar', 'success', 'Calendar API accessible')
// //         } else {
// //           console.log('Dashboard: Calendar API not accessible, status:', calendarResponse.status)
// //           setConnectionStatus(prev => ({ ...prev, calendar: 'not_connected' }))
// //           logUserAction('Status Check', 'Google Calendar', 'failed', `Status: ${calendarResponse.status}`)
// //         }
// //       } catch (error) {
// //         console.log('Dashboard: Calendar not accessible:', error)
// //         setConnectionStatus(prev => ({ ...prev, calendar: 'not_connected' }))
// //         logUserAction('Status Check', 'Google Calendar', 'failed', 'API call failed')
// //       }
// //       // Smart Reminders are always available
// //       console.log('Dashboard: Setting reminders as connected')
// //       setConnectionStatus(prev => ({ ...prev, reminder: 'connected' }))
// //       logUserAction('Status Check', 'Smart Reminders', 'success', 'Internal feature enabled')

// //     } catch (error) {
// //       console.error('Dashboard: Error checking connection status:', error)
// //       logUserAction('Status Check', 'Dashboard', 'failed', 'Connection check failed')
// //     } finally {
// //       console.log('Dashboard: Connection status check completed')
// //     }
// //   }

// //   // Handle approve event with notifications
// //   const handleApproveEvent = async (eventId: string) => {
// //     setProcessingEventId(eventId)
// //     const event = pendingEvents.find(e => e.id === eventId)

// //     try {
// //       // Call API to create calendar event
// //       const response = await fetch('/api/create-calendar-event', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           title: event?.title,
// //           description: event?.description,
// //           date: event?.date,
// //           time: event?.time,
// //           location: event?.location
// //         })
// //       })
// //       if (response.ok) {
// //         // Remove from pending events
// //         setPendingEvents(prev => prev.filter(e => e.id !== eventId))
// //         setErrorMessage(`✅ Event "${event?.title}" has been approved and added to your calendar!`)
// //         logUserAction('Approve Event', 'Calendar', 'success', `Event: ${event?.title}`)
// //         // Send notifications if enabled
// //         if (notificationSettings.emailAlerts || notificationSettings.whatsappAlerts) {
// //           await sendEventNotifications(event, 'approved')
// //         }
// //       } else {
// //         throw new Error('Failed to create calendar event')
// //       }
// //     } catch (error) {
// //       console.error('Error approving event:', error)
// //       setErrorMessage(`❌ Failed to approve event. Please try again.`)
// //       logUserAction('Approve Event', 'Calendar', 'failed', `Event: ${event?.title}`)
// //     } finally {
// //       setProcessingEventId(null)
// //       setTimeout(() => setErrorMessage(null), 5000)
// //     }
// //   }

// //   // Handle reject event
// //   const handleRejectEvent = async (eventId: string) => {
// //     setProcessingEventId(eventId)
// //     const event = pendingEvents.find(e => e.id === eventId)

// //     try {
// //       // Remove from pending events
// //       setPendingEvents(prev => prev.filter(e => e.id !== eventId))
// //       setErrorMessage(`❌ Event "${event?.title}" has been rejected and removed.`)
// //       logUserAction('Reject Event', 'Dashboard', 'success', `Event: ${event?.title}`)
// //     } catch (error) {
// //       console.error('Error rejecting event:', error)
// //     } finally {
// //       setProcessingEventId(null)
// //       setTimeout(() => setErrorMessage(null), 3000)
// //     }
// //   }

// //   // Handle edit event
// //   const handleEditEvent = (event: PendingEvent) => {
// //     setEditingEvent(event)
// //   }

// //   // Handle save edited event
// //   const handleSaveEditedEvent = async (editedEvent: PendingEvent) => {
// //     setProcessingEventId(editedEvent.id)

// //     try {
// //       // Update the pending event
// //       setPendingEvents(prev => prev.map(e => e.id === editedEvent.id ? editedEvent : e))
// //       setEditingEvent(null)
// //       setErrorMessage(`✅ Event "${editedEvent.title}" has been updated!`)
// //       logUserAction('Edit Event', 'Dashboard', 'success', `Event: ${editedEvent.title}`)
// //     } catch (error) {
// //       console.error('Error editing event:', error)
// //       setErrorMessage(`❌ Failed to edit event. Please try again.`)
// //     } finally {
// //       setProcessingEventId(null)
// //       setTimeout(() => setErrorMessage(null), 3000)
// //     }
// //   }

// //   // Send event notifications
// //   const sendEventNotifications = async (event: PendingEvent | null, action: 'approved' | 'reminder') => {
// //     if (!event) return
// //     try {
// //       const response = await fetch('/api/send-notifications', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           event,
// //           action,
// //           settings: notificationSettings
// //         })
// //       })
// //       if (response.ok) {
// //         logUserAction('Send Notification', 'Notifications', 'success', `Event: ${event.title}, Action: ${action}`)
// //       } else {
// //         throw new Error('Failed to send notifications')
// //       }
// //     } catch (error) {
// //       console.error('Error sending notifications:', error)
// //       logUserAction('Send Notification', 'Notifications', 'failed', `Event: ${event.title}, Action: ${action}`)
// //     }
// //   }

// //   // Save notification settings
// //   const handleSaveNotificationSettings = async () => {
// //     setIsSavingSettings(true)

// //     try {
// //       // Save to localStorage (replace with API call in production)
// //       localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings))

// //       // You can also save to your backend API
// //       // await fetch('/api/save-notification-settings', {
// //       //   method: 'POST',
// //       //   headers: { 'Content-Type': 'application/json' },
// //       //   body: JSON.stringify(notificationSettings)
// //       // })
// //       setErrorMessage('✅ Notification settings saved successfully!')
// //       setShowNotificationSettings(false)
// //       logUserAction('Save Settings', 'Notifications', 'success', 'Notification settings updated')

// //       setTimeout(() => setErrorMessage(null), 3000)
// //     } catch (error) {
// //       console.error('Error saving notification settings:', error)
// //       setErrorMessage('❌ Failed to save notification settings. Please try again.')
// //       logUserAction('Save Settings', 'Notifications', 'failed', 'Settings save failed')
// //       setTimeout(() => setErrorMessage(null), 5000)
// //     } finally {
// //       setIsSavingSettings(false)
// //     }
// //   }

// //   // Send test WhatsApp message
// //   const handleTestWhatsApp = async () => {
// //     if (!notificationSettings.whatsappNumber) {
// //       setErrorMessage('❌ Please enter a WhatsApp number first.')
// //       setTimeout(() => setErrorMessage(null), 3000)
// //       return
// //     }
// //     try {
// //       const response = await fetch('/api/send-whatsapp-test', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           number: notificationSettings.whatsappNumber,
// //           message: 'This is a test message from your AI Schedule Assistant! 🤖'
// //         })
// //       })
// //       if (response.ok) {
// //         setErrorMessage('✅ Test WhatsApp message sent successfully!')
// //         logUserAction('Test WhatsApp', 'WhatsApp', 'success', `Number: ${notificationSettings.whatsappNumber}`)
// //       } else {
// //         throw new Error('Failed to send test message')
// //       }
// //     } catch (error) {
// //       console.error('Error sending test WhatsApp:', error)
// //       setErrorMessage('❌ Failed to send test WhatsApp message. Please check your number.')
// //       logUserAction('Test WhatsApp', 'WhatsApp', 'failed', `Number: ${notificationSettings.whatsappNumber}`)
// //     }
// //     setTimeout(() => setErrorMessage(null), 5000)
// //   }

// //   // Get confidence color class
// //   const getConfidenceColor = (confidence: number) => {
// //     if (confidence >= 90) return 'bg-green-100 text-green-800'
// //     if (confidence >= 75) return 'bg-yellow-100 text-yellow-800'
// //     return 'bg-red-100 text-red-800'
// //   }

// //   if (status === 'loading') {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
// //           <p className="mt-4 text-gray-600">Loading your dashboard...</p>
// //         </div>
// //       </div>
// //     )
// //   }

// //   if (!session) {
// //     router.push('/auth/signin')
// //     return null
// //   }

// //   const handleConnect = async (service: string) => {
// //     console.log(`Dashboard: Attempting to connect ${service}...`)
// //     setIsConnecting(service)
// //     setErrorMessage(null)
// //     // Log connection attempt
// //     logUserAction('Connect Attempt', service.charAt(0).toUpperCase() + service.slice(1), 'pending', 'User clicked connect button')

// //     // Redirect to the Google sign-in flow to get a new access token
// //     signIn('google')
// //   }

// //   const handleDisconnect = async (service: string) => {
// //     console.log(`Dashboard: Disconnecting ${service}...`)

// //     // Log disconnect action
// //     logUserAction('Disconnect', service.charAt(0).toUpperCase() + service.slice(1), 'success', 'User manually disconnected service')

// //     try {
// //       setConnectionStatus(prev => ({ ...prev, [service]: 'not_connected' }))
// //       setErrorMessage(`${service.charAt(0).toUpperCase() + service.slice(1)} disconnected successfully!`)
// //       setTimeout(() => setErrorMessage(null), 3000)
// //       console.log(`Dashboard: ${service} disconnected successfully`)
// //     } catch (error) {
// //       console.error(`Error disconnecting ${service}:`, error)
// //     }
// //   }

// //   const getButtonText = (service: string) => {
// //     if (isConnecting === service) return 'Connecting...'
// //     if (connectionStatus[service] === 'connected') return 'Connected'
// //     if (connectionStatus[service] === 'failed') return 'Retry'
// //     return 'Connect'
// //   }

// //   const getButtonClass = (service: string) => {
// //     if (isConnecting === service) {
// //       return 'bg-gray-300 text-gray-500 cursor-not-allowed'
// //     }
// //     if (connectionStatus[service] === 'connected') {
// //       return 'bg-green-600 hover:bg-green-700 text-white'
// //     }
// //     if (connectionStatus[service] === 'failed') {
// //       return 'bg-red-600 hover:bg-red-700 text-white'
// //     }
// //     return 'bg-blue-600 hover:bg-blue-700 text-white'
// //   }

// //   const isButtonDisabled = (service: string) => {
// //     return isConnecting === service
// //   }

// //   const handleRefreshStatus = () => {
// //     logUserAction('Refresh Status', 'Dashboard', 'pending', 'User manually refreshed connection status')
// //     checkConnectionStatus()
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <Navbar />

// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         {/* Welcome Section */}
// //         <div className="mb-8">
// //           <h1 className="text-3xl font-bold text-gray-900">
// //             Welcome back, {session.user?.name?.split(' ')[0]}!
// //           </h1>
// //           <p className="text-gray-600 mt-2">
// //             Let's get your AI assistant set up to help manage your busy schedule.
// //           </p>
// //         </div>
// //         {/* Error Message */}
// //         {errorMessage && (
// //           <div className="mb-6 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
// //             <div className="flex items-center">
// //               <div className="flex-shrink-0">
// //                 <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
// //                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
// //                 </svg>
// //               </div>
// //               <div className="ml-3">
// //                 <p className="text-sm text-gray-700">{errorMessage}</p>
// //               </div>
// //               <div className="ml-auto pl-3">
// //                 <button
// //                   onClick={() => setErrorMessage(null)}
// //                   className="inline-flex text-gray-400 hover:text-gray-600"
// //                 >
// //                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
// //                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
// //                   </svg>
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //         {/* Notification Settings Section */}
// //         <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
// //           <div className="px-6 py-4 border-b border-gray-200">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <h2 className="text-lg font-semibold text-gray-900">Alert Settings</h2>
// //                 <p className="text-sm text-gray-600 mt-1">
// //                   Configure email and WhatsApp notifications for your events.
// //                 </p>
// //               </div>
// //               <button
// //                 onClick={() => setShowNotificationSettings(!showNotificationSettings)}
// //                 className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
// //               >
// //                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //                 </svg>
// //                 Configure Alerts
// //               </button>
// //             </div>
// //           </div>

// //           {showNotificationSettings && (
// //             <div className="p-6 border-t border-gray-200 bg-gray-50">
// //               <div className="space-y-6">
// //                 {/* Email Settings */}
// //                 <div>
// //                   <div className="flex items-center justify-between mb-3">
// //                     <div className="flex items-center">
// //                       <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
// //                         <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
// //                       </svg>
// //                       <h3 className="text-md font-medium text-gray-900">Email Alerts</h3>
// //                     </div>
// //                     <label className="relative inline-flex items-center cursor-pointer">
// //                       <input
// //                         type="checkbox"
// //                         checked={notificationSettings.emailAlerts}
// //                         onChange={(e) => setNotificationSettings(prev => ({
// //                            ...prev,
// //                            emailAlerts: e.target.checked
// //                          }))}
// //                         className="sr-only peer"
// //                       />
// //                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
// //                     </label>
// //                   </div>
// //                   {notificationSettings.emailAlerts && (
// //                     <div className="ml-7">
// //                       <input
// //                         type="email"
// //                         placeholder="Enter email address"
// //                         value={notificationSettings.emailAddress}
// //                         onChange={(e) => setNotificationSettings(prev => ({
// //                            ...prev,
// //                            emailAddress: e.target.value
// //                          }))}
// //                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
// //                       />
// //                     </div>
// //                   )}
// //                 </div>
// //                 {/* WhatsApp Settings */}
// //                 <div>
// //                   <div className="flex items-center justify-between mb-3">
// //                     <div className="flex items-center">
// //                       <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
// //                         <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63z"/>
// //                       </svg>
// //                       <h3 className="text-md font-medium text-gray-900">WhatsApp Alerts</h3>
// //                     </div>
// //                     <label className="relative inline-flex items-center cursor-pointer">
// //                       <input
// //                         type="checkbox"
// //                         checked={notificationSettings.whatsappAlerts}
// //                         onChange={(e) => setNotificationSettings(prev => ({
// //                            ...prev,
// //                            whatsappAlerts: e.target.checked
// //                          }))}
// //                         className="sr-only peer"
// //                       />
// //                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
// //                     </label>
// //                   </div>
// //                   {notificationSettings.whatsappAlerts && (
// //                     <div className="ml-7 space-y-2">
// //                       <div className="flex space-x-2">
// //                         <input
// //                           type="tel"
// //                           placeholder="+1234567890"
// //                           value={notificationSettings.whatsappNumber}
// //                           onChange={(e) => setNotificationSettings(prev => ({
// //                              ...prev,
// //                              whatsappNumber: e.target.value
// //                            }))}
// //                           className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
// //                         />
// //                         <button
// //                           onClick={handleTestWhatsApp}
// //                           className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
// //                         >
// //                           Test
// //                         </button>
// //                       </div>
// //                       <p className="text-xs text-gray-500">Include country code (e.g., +1 for US)</p>
// //                     </div>
// //                   )}
// //                 </div>
// //                 {/* Reminder Timing */}
// //                 <div>
// //                   <h3 className="text-md font-medium text-gray-900 mb-3">Reminder Timing</h3>
// //                   <div className="flex items-center space-x-3">
// //                     <label className="text-sm text-gray-600">Send alerts</label>
// //                     <select
// //                       value={notificationSettings.reminderTiming}
// //                       onChange={(e) => setNotificationSettings(prev => ({
// //                          ...prev,
// //                          reminderTiming: parseInt(e.target.value)
// //                        }))}
// //                       className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
// //                     >
// //                       <option value={15}>15 minutes</option>
// //                       <option value={30}>30 minutes</option>
// //                       <option value={60}>1 hour</option>
// //                       <option value={120}>2 hours</option>
// //                       <option value={1440}>1 day</option>
// //                     </select>
// //                     <label className="text-sm text-gray-600">before events</label>
// //                   </div>
// //                 </div>
// //                 {/* Save Button */}
// //                 <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
// //                   <button
// //                     onClick={() => setShowNotificationSettings(false)}
// //                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
// //                   >
// //                     Cancel
// //                   </button>
// //                   <button
// //                     onClick={handleSaveNotificationSettings}
// //                     disabled={isSavingSettings}
// //                     className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
// //                   >
// //                     {isSavingSettings ? (
// //                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
// //                     ) : (
// //                       <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
// //                       </svg>
// //                     )}
// //                     Save Settings
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* Quick Alert Status */}
// //           {!showNotificationSettings && (
// //             <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
// //               <div className="flex items-center justify-between text-sm">
// //                 <div className="flex items-center space-x-6">
// //                   <div className="flex items-center">
// //                     <div className={`w-3 h-3 rounded-full mr-2 ${notificationSettings.emailAlerts ? 'bg-green-500' : 'bg-gray-400'}`}></div>
// //                     <span className="text-gray-600">Email Alerts: {notificationSettings.emailAlerts ? 'On' : 'Off'}</span>
// //                   </div>
// //                   <div className="flex items-center">
// //                     <div className={`w-3 h-3 rounded-full mr-2 ${notificationSettings.whatsappAlerts ? 'bg-green-500' : 'bg-gray-400'}`}></div>
// //                     <span className="text-gray-600">WhatsApp Alerts: {notificationSettings.whatsappAlerts ? 'On' : 'Off'}</span>
// //                   </div>
// //                   <div className="flex items-center">
// //                     <svg className="w-3 h-3 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// //                     </svg>
// //                     <span className="text-gray-600">Remind {notificationSettings.reminderTiming} min before</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //         {/* Pending Events Section */}
// //         {pendingEvents.length > 0 && (
// //           <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
// //             <div className="px-6 py-4 border-b border-gray-200">
// //               <div className="flex items-center justify-between">
// //                 <div>
// //                   <h2 className="text-lg font-semibold text-gray-900">Pending Events</h2>
// //                   <p className="text-sm text-gray-600 mt-1">
// //                     AI has detected {pendingEvents.length} potential events from your emails. Please review and approve.
// //                   </p>
// //                 </div>
// //                 <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
// //                   {pendingEvents.length} pending
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="p-6 space-y-4">
// //               {pendingEvents.map((event) => (
// //                 <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
// //                   <div className="flex items-start justify-between">
// //                     <div className="flex-1">
// //                       <div className="flex items-center space-x-3 mb-2">
// //                         <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
// //                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(event.confidence)}`}>
// //                           {event.confidence}% confident
// //                         </span>
// //                       </div>
// //                       <p className="text-sm text-gray-600 mb-2">{event.description}</p>
// //                       <div className="flex items-center space-x-4 text-sm text-gray-500">
// //                         <div className="flex items-center">
// //                           <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// //                           </svg>
// //                           {new Date(event.date).toLocaleDateString()} at {event.time}
// //                         </div>
// //                         {event.location && (
// //                           <div className="flex items-center">
// //                             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
// //                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
// //                             </svg>
// //                             {event.location}
// //                           </div>
// //                         )}
// //                       </div>
// //                       <div className="mt-2 text-xs text-gray-400">
// //                         Source: {event.source}
// //                       </div>
// //                     </div>

// //                     <div className="flex items-center space-x-2 ml-4">
// //                       <button
// //                         onClick={() => handleApproveEvent(event.id)}
// //                         disabled={processingEventId === event.id}
// //                         className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
// //                       >
// //                         {processingEventId === event.id ? (
// //                           <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
// //                         ) : (
// //                           <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
// //                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
// //                           </svg>
// //                         )}
// //                         Approve & Notify
// //                       </button>
// //                       <button
// //                         onClick={() => handleEditEvent(event)}
// //                         disabled={processingEventId === event.id}
// //                         className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
// //                       >
// //                         <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
// //                         </svg>
// //                         Edit
// //                       </button>
// //                       <button
// //                         onClick={() => handleRejectEvent(event.id)}
// //                         disabled={processingEventId === event.id}
// //                         className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
// //                       >
// //                         <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
// //                           <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
// //                         </svg>
// //                         Reject
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         )}
// //         {/* Edit Event Modal */}
// //         {editingEvent && (
// //           <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
// //             <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
// //               <div className="mt-3">
// //                 <div className="flex items-center justify-between mb-4">
// //                   <h3 className="text-lg font-medium text-gray-900">Edit Event</h3>
// //                   <button
// //                     onClick={() => setEditingEvent(null)}
// //                     className="text-gray-400 hover:text-gray-600"
// //                   >
// //                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
// //                       <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
// //                     </svg>
// //                   </button>
// //                 </div>
// //                 <form onSubmit={(e) => {
// //                   e.preventDefault()
// //                   const formData = new FormData(e.currentTarget)
// //                   const updatedEvent = {
// //                     ...editingEvent,
// //                     title: formData.get('title') as string,
// //                     description: formData.get('description') as string,
// //                     date: formData.get('date') as string,
// //                     time: formData.get('time') as string,
// //                     location: formData.get('location') as string
// //                   }
// //                   handleSaveEditedEvent(updatedEvent)
// //                 }}>
// //                   <div className="space-y-4">
// //                     <div>
// //                       <label className="block text-sm font-medium text-gray-700">Title</label>
// //                       <input
// //                         name="title"
// //                         type="text"
// //                         defaultValue={editingEvent.title}
// //                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// //                       />
// //                     </div>
// //                     <div>
// //                       <label className="block text-sm font-medium text-gray-700">Description</label>
// //                       <textarea
// //                         name="description"
// //                         rows={3}
// //                         defaultValue={editingEvent.description}
// //                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// //                       />
// //                     </div>
// //                     <div className="grid grid-cols-2 gap-4">
// //                       <div>
// //                         <label className="block text-sm font-medium text-gray-700">Date</label>
// //                         <input
// //                           name="date"
// //                           type="date"
// //                           defaultValue={editingEvent.date}
// //                           className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// //                         />
// //                       </div>
// //                       <div>
// //                         <label className="block text-sm font-medium text-gray-700">Time</label>
// //                         <input
// //                           name="time"
// //                           type="time"
// //                           defaultValue={editingEvent.time}
// //                           className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// //                         />
// //                       </div>
// //                     </div>
// //                     <div>
// //                       <label className="block text-sm font-medium text-gray-700">Location (Optional)</label>
// //                       <input
// //                         name="location"
// //                         type="text"
// //                         defaultValue={editingEvent.location || ''}
// //                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// //                       />
// //                     </div>
// //                   </div>
// //                   <div className="flex justify-end space-x-3 mt-6">
// //                     <button
// //                       type="button"
// //                       onClick={() => setEditingEvent(null)}
// //                       className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
// //                     >
// //                       Cancel
// //                     </button>
// //                     <button
// //                       type="submit"
// //                       className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
// //                     >
// //                       Save Changes
// //                     </button>
// //                   </div>
// //                 </form>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //         {/* Stats Overview */}
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
// //           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //             <div className="flex items-center">
// //               <div className="flex-shrink-0">
// //                 <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
// //                   <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
// //                   </svg>
// //                 </div>
// //               </div>
// //               <div className="ml-4">
// //                 <p className="text-sm font-medium text-gray-500">Emails Processed</p>
// //                 <p className="text-2xl font-semibold text-gray-900">0</p>
// //               </div>
// //             </div>
// //           </div>
// //           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //             <div className="flex items-center">
// //               <div className="flex-shrink-0">
// //                 <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
// //                   <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// //                   </svg>
// //                 </div>
// //               </div>
// //               <div className="ml-4">
// //                 <p className="text-sm font-medium text-gray-500">Events Created</p>
// //                 <p className="text-2xl font-semibold text-gray-900">0</p>
// //               </div>
// //             </div>
// //           </div>
// //           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //             <div className="flex items-center">
// //               <div className="flex-shrink-0">
// //                 <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
// //                   <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.19 4.19A13 13 0 1019.81 19.81M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //                   </svg>
// //                 </div>
// //               </div>
// //               <div className="ml-4">
// //                 <p className="text-sm font-medium text-gray-500">Alerts Sent</p>
// //                 <p className="text-2xl font-semibold text-gray-900">0</p>
// //               </div>
// //             </div>
// //           </div>
// //           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //             <div className="flex items-center">
// //               <div className="flex-shrink-0">
// //                 <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
// //                   <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// //                   </svg>
// //                 </div>
// //               </div>
// //               <div className="ml-4">
// //                 <p className="text-sm font-medium text-gray-500">Time Saved</p>
// //                 <p className="text-2xl font-semibold text-gray-900">0h</p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //         {/* Connection Status Overview */}
// //         <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //           <div className="flex items-center justify-between mb-4">
// //             <h2 className="text-lg font-semibold text-gray-900">Connection Status</h2>
// //             <div className="flex space-x-2">
// //               <button
// //                 onClick={handleRefreshStatus}
// //                 className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
// //               >
// //                 Refresh Status
// //               </button>
// //               <button
// //                 onClick={async () => {
// //                   try {
// //                     const response = await fetch('/api/test-google-sheets')
// //                     const data = await response.json()
// //                     if (data.success) {
// //                       setErrorMessage('✅ Google Sheets connection successful! Check your spreadsheet for logs.')
// //                     } else {
// //                       setErrorMessage(`❌ Google Sheets test failed: ${data.error}`)
// //                     }
// //                     setTimeout(() => setErrorMessage(null), 5000)
// //                   } catch (error) {
// //                     setErrorMessage('❌ Failed to test Google Sheets connection')
// //                     setTimeout(() => setErrorMessage(null), 5000)
// //                   }
// //                 }}
// //                 className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
// //               >
// //                 Test Logging
// //               </button>
// //             </div>
// //           </div>
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //             <div className="flex items-center p-3 bg-gray-50 rounded-lg">
// //               <div className={`w-3 h-3 rounded-full mr-3 ${
// //                 connectionStatus.gmail === 'connected' ? 'bg-green-500' :
// //                 connectionStatus.gmail === 'failed' ? 'bg-red-500' : 'bg-gray-400'
// //               }`}></div>
// //               <span className="text-sm font-medium text-gray-700">Gmail</span>
// //               <span className="ml-auto text-xs text-gray-500">
// //                 {connectionStatus.gmail === 'connected' ? 'Connected' :
// //                  connectionStatus.gmail === 'failed' ? 'Failed' : 'Not Connected'}
// //               </span>
// //             </div>

// //             <div className="flex items-center p-3 bg-gray-50 rounded-lg">
// //               <div className={`w-3 h-3 rounded-full mr-3 ${
// //                 connectionStatus.calendar === 'connected' ? 'bg-green-500' :
// //                 connectionStatus.calendar === 'failed' ? 'bg-red-500' : 'bg-gray-400'
// //               }`}></div>
// //               <span className="text-sm font-medium text-gray-700">Calendar</span>
// //               <span className="ml-auto text-xs text-gray-500">
// //                 {connectionStatus.calendar === 'connected' ? 'Connected' :
// //                  connectionStatus.calendar === 'failed' ? 'Failed' : 'Not Connected'}
// //               </span>
// //             </div>

// //             <div className="flex items-center p-3 bg-gray-50 rounded-lg">
// //               <div className={`w-3 h-3 rounded-full mr-3 ${
// //                 connectionStatus.reminder === 'connected' ? 'bg-green-500' :
// //                 connectionStatus.reminder === 'failed' ? 'bg-red-500' : 'bg-gray-400'
// //               }`}></div>
// //               <span className="text-sm font-medium text-gray-700">Reminders</span>
// //               <span className="ml-auto text-xs text-gray-500">
// //                 {connectionStatus.reminder === 'connected' ? 'Connected' :
// //                  connectionStatus.reminder === 'failed' ? 'Failed' : 'Not Connected'}
// //               </span>
// //             </div>
// //           </div>
// //         </div>
// //         {/* Integration Setup */}
// //         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
// //           <div className="px-6 py-4 border-b border-gray-200">
// //             <h2 className="text-lg font-semibold text-gray-900">Connect Your Services</h2>
// //             <p className="text-sm text-gray-600 mt-1">
// //               Connect your accounts to start automating your schedule management.
// //             </p>
// //           </div>

// //           <div className="p-6 space-y-6">
// //             {/* Gmail Integration */}
// //             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
// //               <div className="flex items-center space-x-4">
// //                 <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
// //                   <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
// //                     <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
// //                   </svg>
// //                 </div>
// //                 <div>
// //                   <h3 className="text-lg font-medium text-gray-900">Gmail</h3>
// //                   <p className="text-sm text-gray-600">Connect to process school emails automatically</p>
// //                   {connectionStatus.gmail === 'connected' && (
// //                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
// //                   )}
// //                   {connectionStatus.gmail === 'failed' && (
// //                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
// //                   )}
// //                 </div>
// //               </div>
// //               {connectionStatus.gmail === 'connected' ? (
// //                 <button
// //                   onClick={() => handleDisconnect('gmail')}
// //                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
// //                 >
// //                   Disconnect
// //                 </button>
// //               ) : (
// //                 <button
// //                   onClick={() => handleConnect('gmail')}
// //                   disabled={isButtonDisabled('gmail')}
// //                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('gmail')}`}
// //                 >
// //                   {getButtonText('gmail')}
// //                 </button>
// //               )}
// //             </div>
// //             {/* Calendar Integration */}
// //             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
// //               <div className="flex items-center space-x-4">
// //                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
// //                   <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
// //                     <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/>
// //                   </svg>
// //                 </div>
// //                 <div>
// //                   <h3 className="text-lg font-medium text-gray-900">Google Calendar</h3>
// //                   <p className="text-sm text-gray-600">Add events to your personal calendar</p>
// //                   {connectionStatus.calendar === 'connected' && (
// //                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
// //                   )}
// //                   {connectionStatus.calendar === 'failed' && (
// //                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
// //                   )}
// //                 </div>
// //               </div>
// //               {connectionStatus.calendar === 'connected' ? (
// //                 <button
// //                   onClick={() => handleDisconnect('calendar')}
// //                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
// //                 >
// //                   Disconnect
// //                 </button>
// //               ) : (
// //                 <button
// //                   onClick={() => handleConnect('calendar')}
// //                   disabled={isButtonDisabled('calendar')}
// //                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('calendar')}`}
// //                 >
// //                   {getButtonText('calendar')}
// //                 </button>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }









































// // import { useSession, signIn } from 'next-auth/react'
// // import { useRouter } from 'next/router'
// // import { useState, useEffect } from 'react'
// // import Navbar from './Navbar'

// // // Interface for pending events
// // interface PendingEvent {
// //   id: string
// //   title: string
// //   description: string
// //   startDate: string
// //   endDate: string
// //   location?: string
// //   source: string
// //   confidenceScore: number
// //   extractedFrom: string
// //   createdAt: string
// // }

// // // Interface for notification settings
// // interface NotificationSettings {
// //   emailAlerts: boolean
// //   whatsappAlerts: boolean
// //   emailAddress: string
// //   whatsappNumber: string
// //   reminderTiming: number // minutes before event
// // }

// // // Simple function to log user actions to Google Sheets
// // const logUserAction = async (action: string, service: string, status: string, details?: string) => {
// //   try {
// //     await fetch('/api/log-action', {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify({
// //         action,
// //         service,
// //         status,
// //         details
// //       })
// //     })
// //   } catch (error) {
// //     console.error('Failed to log action:', error)
// //   }
// // }


// // export default function Dashboard() {
// //   const { data: session, status } = useSession()
// //   const router = useRouter()
// //   const [isConnecting, setIsConnecting] = useState<string | null>(null)
// //   const [connectionStatus, setConnectionStatus] = useState<{[key: string]: 'connected' | 'failed' | 'not_connected'}>({
// //     gmail: 'not_connected',
// //     calendar: 'not_connected',
// //     reminder: 'not_connected'
// //   })
// //   const [errorMessage, setErrorMessage] = useState<string | null>(null)
// //   const [hasCheckedStatus, setHasCheckedStatus] = useState(false)
// //   
// //   // State for pending events
// //   const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([])
// //   const [loadingEvents, setLoadingEvents] = useState(false)
// //   const [editingEvent, setEditingEvent] = useState<string | null>(null)
// //   const [editForm, setEditForm] = useState<Partial<PendingEvent>>({})
// //   const [isTriggeringWorkflow, setIsTriggeringWorkflow] = useState(false);

// //   const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
// //     emailAlerts: false,
// //     whatsappAlerts: false,
// //     emailAddress: '',
// //     whatsappNumber: '',
// //     reminderTiming: 30
// //   })
// //   const [showNotificationSettings, setShowNotificationSettings] = useState(false)
// //   const [isSavingSettings, setIsSavingSettings] = useState(false)

// //   // Fetch pending events from API
// //   const fetchPendingEvents = async () => {
// //     setLoadingEvents(true)
// //     try {
// //       const response = await fetch('/api/events')
// //       if (response.ok) {
// //         const events: PendingEvent[] = await response.json()
// //         setPendingEvents(events)
// //         logUserAction('Fetch Events', 'Pending Events', 'success', `Loaded ${events.length} pending events`)
// //       } else {
// //         throw new Error('Failed to fetch events')
// //       }
// //     } catch (error) {
// //       console.error('Error fetching pending events:', error)
// //       setErrorMessage('❌ Failed to load events. Please try refreshing.')
// //       logUserAction('Fetch Events', 'Pending Events', 'failed', 'Failed to load pending events')
// //     } finally {
// //       setLoadingEvents(false)
// //     }
// //   }

// //   // Fetch data on initial load
// //   useEffect(() => {
// //     if (session?.accessToken && !hasCheckedStatus) {
// //       checkConnectionStatus()
// //       fetchPendingEvents()
// //       setHasCheckedStatus(true)
// //       logUserAction('Dashboard Access', 'Dashboard', 'success', 'User accessed dashboard')
// //     }
// //   }, [session, hasCheckedStatus])

// //   // Handle event approval
// //   const handleApproveEvent = async (eventId: string) => {
// //     try {
// //       const eventToApprove = pendingEvents.find(e => e.id === eventId);
// //       if (!eventToApprove) {
// //         return;
// //       }
// //       // Simulate API call and state update
// //       const response = await fetch('/api/create-calendar-event', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(eventToApprove)
// //       });
// //       if (response.ok) {
// //         setPendingEvents(prev => prev.filter(event => event.id !== eventId));
// //         setErrorMessage('✅ Event approved and added to calendar!');
// //         setTimeout(() => setErrorMessage(null), 3000);
// //         logUserAction('Approve Event', 'Pending Events', 'success', `Event ${eventId} approved`);
// //       } else {
// //         throw new Error('Failed to approve event');
// //       }
// //     } catch (error) {
// //       console.error('Error approving event:', error)
// //       setErrorMessage('❌ Failed to approve event. Please try again.')
// //       setTimeout(() => setErrorMessage(null), 3000)
// //       logUserAction('Approve Event', 'Pending Events', 'failed', `Failed to approve event ${eventId}`)
// //     }
// //   }

// //   // Handle event rejection
// //   const handleRejectEvent = async (eventId: string) => {
// //     try {
// //       // Call API to delete event
// //       const response = await fetch(`/api/events/${eventId}`, {
// //         method: 'DELETE',
// //       });
// //       if (response.ok) {
// //         setPendingEvents(prev => prev.filter(event => event.id !== eventId));
// //         setErrorMessage('❌ Event rejected successfully.');
// //         setTimeout(() => setErrorMessage(null), 3000);
// //         logUserAction('Reject Event', 'Pending Events', 'success', `Event ${eventId} rejected`);
// //       } else {
// //         throw new Error('Failed to reject event');
// //       }
// //     } catch (error) {
// //       console.error('Error rejecting event:', error)
// //       setErrorMessage('❌ Failed to reject event. Please try again.')
// //       setTimeout(() => setErrorMessage(null), 3000)
// //       logUserAction('Reject Event', 'Pending Events', 'failed', `Failed to reject event ${eventId}`)
// //     }
// //   }

// //   // Handle edit event
// //   const handleEditEvent = (event: PendingEvent) => {
// //     setEditingEvent(event.id)
// //     setEditForm(event)
// //   }

// //   // Save edited event
// //   const handleSaveEdit = async (eventId: string) => {
// //     try {
// //       const updatedEvent: PendingEvent = { ...editForm, id: eventId } as PendingEvent
// //       const response = await fetch(`/api/events/${eventId}`, {
// //         method: 'PUT',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(updatedEvent),
// //       });

// //       if (response.ok) {
// //         setPendingEvents(prev => prev.map(event => 
// //          event.id === eventId ? updatedEvent : event
// //        ));
// //         setEditingEvent(null);
// //         setEditForm({});
// //         setErrorMessage('✅ Event updated successfully!');
// //         setTimeout(() => setErrorMessage(null), 3000);
// //         logUserAction('Edit Event', 'Pending Events', 'success', `Event ${eventId} updated`);
// //       } else {
// //         throw new Error('Failed to update event');
// //       }

// //     } catch (error) {
// //       console.error('Error saving event:', error)
// //       setErrorMessage('❌ Failed to save changes. Please try again.')
// //       setTimeout(() => setErrorMessage(null), 3000)
// //       logUserAction('Edit Event', 'Pending Events', 'failed', `Failed to update event ${eventId}`)
// //     }
// //   }

// //   const checkConnectionStatus = async () => {
// //     if (!session?.accessToken) {
// //       return
// //     }
// //     try {
// //       const gmailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
// //         headers: { 'Authorization': `Bearer ${session?.accessToken}` }
// //       });
// //       setConnectionStatus(prev => ({ ...prev, gmail: gmailResponse.ok ? 'connected' : 'not_connected' }));

// //       const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
// //         headers: { 'Authorization': `Bearer ${session?.accessToken}` }
// //       });
// //       setConnectionStatus(prev => ({ ...prev, calendar: calendarResponse.ok ? 'connected' : 'not_connected' }));

// //       setConnectionStatus(prev => ({ ...prev, reminder: 'connected' }));
// //     } catch (error) {
// //       console.error('Error checking connection status:', error);
// //       logUserAction('Status Check', 'Dashboard', 'failed', 'Connection check failed');
// //     }
// //   }

// //   const handleTriggerWorkflow = async () => {
// //     setIsTriggeringWorkflow(true);
// //     try {
// //         const response = await fetch('/api/trigger-workflow', { method: 'POST' });
// //         const result = await response.json();
// //         if (response.ok) {
// //             setErrorMessage(`✅ Workflow triggered! Check your inbox for new events to appear here shortly.`);
// //         } else {
// //             setErrorMessage(`❌ Failed to trigger workflow. Error: ${result.error}`);
// //         }
// //     } catch (error) {
// //         setErrorMessage('❌ Failed to trigger workflow. Network error.');
// //     } finally {
// //         setIsTriggeringWorkflow(false);
// //         setTimeout(() => setErrorMessage(null), 5000);
// //     }
// //   };

// //   const handleSaveNotificationSettings = async () => {
// //     setIsSavingSettings(true)
// //     try {
// //       localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings))
// //       setErrorMessage('✅ Notification settings saved successfully!')
// //       setShowNotificationSettings(false)
// //       setTimeout(() => setErrorMessage(null), 3000)
// //     } catch (error) {
// //       console.error('Error saving notification settings:', error)
// //       setErrorMessage('❌ Failed to save notification settings. Please try again.')
// //       setTimeout(() => setErrorMessage(null), 5000)
// //     } finally {
// //       setIsSavingSettings(false)
// //     }
// //   }

// //   const handleTestWhatsApp = async () => {
// //     if (!notificationSettings.whatsappNumber) {
// //       setErrorMessage('❌ Please enter a WhatsApp number first.')
// //       setTimeout(() => setErrorMessage(null), 3000)
// //       return
// //     }
// //     try {
// //       const response = await fetch('/api/send-whatsapp-test', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           number: notificationSettings.whatsappNumber,
// //           message: 'This is a test message from your AI Schedule Assistant! 🤖'
// //         })
// //       })
// //       if (response.ok) {
// //         setErrorMessage('✅ Test WhatsApp message sent successfully!')
// //       } else {
// //         throw new Error('Failed to send test message')
// //       }
// //     } catch (error) {
// //       console.error('Error sending test WhatsApp:', error)
// //       setErrorMessage('❌ Failed to send test WhatsApp message. Please check your number.')
// //     }
// //     setTimeout(() => setErrorMessage(null), 5000)
// //   }

// //   if (status === 'loading') {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
// //           <p className="mt-4 text-gray-600">Loading your dashboard...</p>
// //         </div>
// //       </div>
// //     )
// //   }

// //   if (!session) {
// //     router.push('/auth/signin')
// //     return null
// //   }

// //   const handleConnect = async (service: string) => {
// //     setIsConnecting(service)
// //     setErrorMessage(null)
// //     logUserAction('Connect Attempt', service.charAt(0).toUpperCase() + service.slice(1), 'pending', 'User clicked connect button')
// //     signIn('google')
// //   }

// //   const handleDisconnect = async (service: string) => {
// //     logUserAction('Disconnect', service.charAt(0).toUpperCase() + service.slice(1), 'success', 'User manually disconnected service')
// //     try {
// //       setConnectionStatus(prev => ({ ...prev, [service]: 'not_connected' }))
// //       setErrorMessage(`${service.charAt(0).toUpperCase() + service.slice(1)} disconnected successfully!`)
// //       setTimeout(() => setErrorMessage(null), 3000)
// //     } catch (error) {
// //       console.error(`Error disconnecting ${service}:`, error)
// //     }
// //   }

// //   const getButtonText = (service: string) => {
// //     if (isConnecting === service) return 'Connecting...'
// //     if (connectionStatus[service] === 'connected') return 'Connected'
// //     if (connectionStatus[service] === 'failed') return 'Retry'
// //     return 'Connect'
// //   }

// //   const getButtonClass = (service: string) => {
// //     if (isConnecting === service) {
// //       return 'bg-gray-300 text-gray-500 cursor-not-allowed'
// //     }
// //     if (connectionStatus[service] === 'connected') {
// //       return 'bg-green-600 hover:bg-green-700 text-white'
// //     }
// //     if (connectionStatus[service] === 'failed') {
// //       return 'bg-red-600 hover:bg-red-700 text-white'
// //     }
// //     return 'bg-blue-600 hover:bg-blue-700 text-white'
// //   }

// //   const isButtonDisabled = (service: string) => {
// //     return isConnecting === service
// //   }

// //   const handleRefreshStatus = () => {
// //     logUserAction('Refresh Status', 'Dashboard', 'pending', 'User manually refreshed connection status')
// //     checkConnectionStatus()
// //   }

// //   const getConfidenceColor = (score: number) => {
// //     if (score >= 0.8) return 'text-green-600 bg-green-100'
// //     if (score >= 0.6) return 'text-yellow-600 bg-yellow-100'
// //     return 'text-red-600 bg-red-100'
// //   }

// //   const formatDate = (isoString: string) => {
// //     const date = new Date(isoString);
// //     return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
// //   };


// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <Navbar />
// //       
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         {/* Welcome Section */}
// //         <div className="mb-8">
// //           <h1 className="text-3xl font-bold text-gray-900">
// //             Welcome back, {session.user?.name?.split(' ')[0]}!
// //           </h1>
// //           <p className="text-gray-600 mt-2">
// //             Let's get your AI assistant set up to help manage your busy schedule.
// //           </p>
// //         </div>

// //         {/* Error Message */}
// //         {errorMessage && (
// //           <div className="mb-6 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
// //             <div className="flex items-center">
// //               <div className="flex-shrink-0">
// //                 <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
// //                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
// //                 </svg>
// //               </div>
// //               <div className="ml-3">
// //                 <p className="text-sm text-gray-700">{errorMessage}</p>
// //               </div>
// //               <div className="ml-auto pl-3">
// //                 <button
// //                   onClick={() => setErrorMessage(null)}
// //                   className="inline-flex text-gray-400 hover:text-gray-600"
// //                 >
// //                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
// //                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
// //                   </svg>
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //         <div className="mb-8">
// //             <div className="flex items-center justify-between mb-4">
// //               <h2 className="text-lg font-semibold text-gray-900">Pending Events</h2>
// //               <button
// //                 onClick={handleTriggerWorkflow}
// //                 disabled={isTriggeringWorkflow}
// //                 className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${isTriggeringWorkflow ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
// //               >
// //                 {isTriggeringWorkflow ? (
// //                   <>
// //                     <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2"></div>
// //                     <span>Scanning...</span>
// //                   </>
// //                 ) : (
// //                   <>
// //                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.418 0h.582m-15.418 0a8.001 8.001 0 0015.418 0m-15.418 0v-.582m15.418 0v.582M5.196 13.916v-.582m15.418 0v.582" />
// //                     </svg>
// //                     Scan for New Events
// //                   </>
// //                 )}
// //               </button>
// //             </div>
// //             {pendingEvents.length > 0 && (
// //            <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
// //              <div className="px-6 py-4 border-b border-gray-200">
// //                <div className="flex items-center justify-between">
// //                  <div>
// //                    <p className="text-sm text-gray-600 mt-1">
// //                      Review and approve events detected by AI from your emails
// //                    </p>
// //                  </div>
// //                  <button
// //                    onClick={fetchPendingEvents}
// //                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
// //                  >
// //                    Refresh
// //                  </button>
// //                </div>
// //              </div>
// //             
// //              <div className="p-6">
// //                {loadingEvents ? (
// //                  <div className="text-center py-8">
// //                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
// //                    <p className="mt-2 text-gray-600">Loading pending events...</p>
// //                  </div>
// //                ) : (
// //                  <div className="space-y-4">
// //                    {pendingEvents.map((event) => (
// //                      <div key={event.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
// //                        {editingEvent === event.id ? (
// //                          // Edit Mode
// //                          <div className="space-y-4">
// //                            <div>
// //                              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
// //                              <input
// //                                type="text"
// //                                value={editForm.title || ''}
// //                                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
// //                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                              />
// //                            </div>
// //                            <div>
// //                              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
// //                              <textarea
// //                                value={editForm.description || ''}
// //                                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
// //                                rows={3}
// //                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                              />
// //                            </div>
// //                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                              <div>
// //                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
// //                                <input
// //                                  type="datetime-local"
// //                                  value={editForm.startDate ? editForm.startDate.substring(0, 16) : ''}
// //                                  onChange={(e) => setEditForm(prev => ({ ...prev, startDate: e.target.value }))}
// //                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                                />
// //                              </div>
// //                              <div>
// //                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
// //                                <input
// //                                  type="datetime-local"
// //                                  value={editForm.endDate ? editForm.endDate.substring(0, 16) : ''}
// //                                  onChange={(e) => setEditForm(prev => ({ ...prev, endDate: e.target.value }))}
// //                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                                />
// //                              </div>
// //                            </div>
// //                            <div>
// //                              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
// //                              <input
// //                                type="text"
// //                                value={editForm.location || ''}
// //                                onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
// //                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                              />
// //                            </div>
// //                            <div className="flex space-x-2">
// //                              <button
// //                                onClick={() => handleSaveEdit(event.id)}
// //                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
// //                              >
// //                                Save Changes
// //                              </button>
// //                              <button
// //                                onClick={() => {
// //                                  setEditingEvent(null)
// //                                  setEditForm({})
// //                                }}
// //                                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
// //                              >
// //                                Cancel
// //                              </button>
// //                            </div>
// //                          </div>
// //                        ) : (
// //                          // View Mode
// //                          <div>
// //                            <div className="flex items-start justify-between mb-3">
// //                              <div className="flex-1">
// //                                <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
// //                                <p className="text-gray-600 text-sm mt-1">{event.description}</p>
// //                              </div>
// //                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(event.confidenceScore)}`}>
// //                                {Math.round(event.confidenceScore * 100)}% confidence
// //                              </span>
// //                            </div>
// //                           
// //                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
// //                              <div>
// //                                <span className="font-medium">Start:</span> {formatDate(event.startDate)}
// //                              </div>
// //                              <div>
// //                                <span className="font-medium">End:</span> {formatDate(event.endDate)}
// //                              </div>
// //                              {event.location && (
// //                                <div>
// //                                  <span className="font-medium">Location:</span> {event.location}
// //                                </div>
// //                              )}
// //                              <div>
// //                                <span className="font-medium">Source:</span> {event.source}
// //                              </div>
// //                            </div>
// //                           
// //                            <div className="flex space-x-2">
// //                              <button
// //                                onClick={() => handleApproveEvent(event.id)}
// //                                className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm"
// //                              >
// //                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
// //                                </svg>
// //                                Approve
// //                              </button>
// //                              <button
// //                                onClick={() => handleEditEvent(event)}
// //                                className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
// //                              >
// //                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
// //                                </svg>
// //                                Edit
// //                              </button>
// //                              <button
// //                                onClick={() => handleRejectEvent(event.id)}
// //                                className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
// //                              >
// //                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                                </svg>
// //                                Reject
// //                              </button>
// //                            </div>
// //                          </div>
// //                        )}
// //                      </div>
// //                    ))}
// //                  </div>
// //                )}
// //              </div>
// //            </div>
// //          )}
// //         {pendingEvents.length === 0 && (
// //           <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm border border-gray-200">
// //             {loadingEvents ? (
// //               <div className="flex items-center justify-center">
// //                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// //                 <p className="ml-4 text-gray-600">Loading events...</p>
// //               </div>
// //             ) : (
// //               <p>No pending events. Click "Scan for New Events" to trigger a scan.</p>
// //             )}
// //           </div>
// //         )}
// //       </div>

// //          {/* Stats Overview */}
// //          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
// //            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //              <div className="flex items-center">
// //                <div className="flex-shrink-0">
// //                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
// //                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
// //                    </svg>
// //                 </div>
// //                <div className="ml-4">
// //                  <p className="text-sm font-medium text-gray-500">Emails Processed</p>
// //                  <p className="text-2xl font-semibold text-gray-900">0</p>
// //                </div>
// //              </div>
// //            </div>

// //            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //              <div className="flex items-center">
// //                <div className="flex-shrink-0">
// //                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
// //                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// //                    </svg>
// //                 </div>
// //                <div className="ml-4">
// //                  <p className="text-sm font-medium text-gray-500">Events Created</p>
// //                  <p className="text-2xl font-semibold text-gray-900">0</p>
// //                </div>
// //              </div>
// //            </div>

// //            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //              <div className="flex items-center">
// //                <div className="flex-shrink-0">
// //                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
// //                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// //                    </svg>
// //                 </div>
// //                <div className="ml-4">
// //                  <p className="text-sm font-medium text-gray-500">Time Saved</p>
// //                  <p className="text-2xl font-semibold text-gray-900">0h</p>
// //                </div>
// //              </div>
// //            </div>
// //          </div>

// //          {/* Connection Status Overview */}
// //          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //            <div className="flex items-center justify-between mb-4">
// //              <h2 className="text-lg font-semibold text-gray-900">Connection Status</h2>
// //              <div className="flex space-x-2">
// //                <button
// //                  onClick={handleRefreshStatus}
// //                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
// //                >
// //                  Refresh Status
// //                </button>
// //                <button
// //                  onClick={async () => {
// //                    try {
// //                      const response = await fetch('/api/test-google-sheets')
// //                      const data = await response.json()
// //                      if (data.success) {
// //                        setErrorMessage('✅ Google Sheets connection successful! Check your spreadsheet for logs.')
// //                      } else {
// //                        setErrorMessage(`❌ Google Sheets test failed: ${data.error}`)
// //                      }
// //                      setTimeout(() => setErrorMessage(null), 5000)
// //                    } catch (error) {
// //                      setErrorMessage('❌ Failed to test Google Sheets connection')
// //                      setTimeout(() => setErrorMessage(null), 5000)
// //                    }
// //                  }}
// //                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
// //                >
// //                  Test Logging
// //                </button>
// //              </div>
// //            </div>
// //            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
// //                <div className={`w-3 h-3 rounded-full mr-3 ${
// //                  connectionStatus.gmail === 'connected' ? 'bg-green-500' :
// //                  connectionStatus.gmail === 'failed' ? 'bg-red-500' : 'bg-gray-400'
// //                }`}></div>
// //                <span className="text-sm font-medium text-gray-700">Gmail</span>
// //                <span className="ml-auto text-xs text-gray-500">
// //                  {connectionStatus.gmail === 'connected' ? 'Connected' :
// //                    connectionStatus.gmail === 'failed' ? 'Failed' : 'Not Connected'}
// //                </span>
// //              </div>
// //             
// //              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
// //                <div className={`w-3 h-3 rounded-full mr-3 ${
// //                  connectionStatus.calendar === 'connected' ? 'bg-green-500' :
// //                  connectionStatus.calendar === 'failed' ? 'bg-red-500' : 'bg-gray-400'
// //                }`}></div>
// //                <span className="text-sm font-medium text-gray-700">Calendar</span>
// //                <span className="ml-auto text-xs text-gray-500">
// //                  {connectionStatus.calendar === 'connected' ? 'Connected' :
// //                    connectionStatus.calendar === 'failed' ? 'Failed' : 'Not Connected'}
// //                </span>
// //              </div>
// //             
// //              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
// //                <div className={`w-3 h-3 rounded-full mr-3 ${
// //                  connectionStatus.reminder === 'connected' ? 'bg-green-500' :
// //                  connectionStatus.reminder === 'failed' ? 'bg-red-500' : 'bg-gray-400'
// //                }`}></div>
// //                <span className="text-sm font-medium text-gray-700">Reminders</span>
// //                <span className="ml-auto text-xs text-gray-500">
// //                  {connectionStatus.reminder === 'connected' ? 'Connected' :
// //                    connectionStatus.reminder === 'failed' ? 'Failed' : 'Not Connected'}
// //                </span>
// //              </div>
// //            </div>
// //          </div>

// //          {/* Integration Setup */}
// //          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
// //            <div className="px-6 py-4 border-b border-gray-200">
// //              <h2 className="text-lg font-semibold text-gray-900">Connect Your Services</h2>
// //              <p className="text-sm text-gray-600 mt-1">
// //                Connect your accounts to start automating your schedule management.
// //              </p>
// //            </div>
// //           
// //            <div className="p-6 space-y-6">
// //              {/* Gmail Integration */}
// //              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
// //                <div className="flex items-center space-x-4">
// //                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
// //                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
// //                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
// //                    </svg>
// //                 </div>
// //                 <div>
// //                   <h3 className="text-lg font-medium text-gray-900">Gmail</h3>
// //                   <p className="text-sm text-gray-600">Connect to process school emails automatically</p>
// //                   {connectionStatus.gmail === 'connected' && (
// //                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
// //                   )}
// //                   {connectionStatus.gmail === 'failed' && (
// //                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
// //                   )}
// //                 </div>
// //                 {connectionStatus.gmail === 'connected' ? (
// //                   <button
// //                     onClick={() => handleDisconnect('gmail')}
// //                     className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
// //                   >
// //                     Disconnect
// //                   </button>
// //                 ) : (
// //                   <button
// //                     onClick={() => handleConnect('gmail')}
// //                     disabled={isButtonDisabled('gmail')}
// //                     className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('gmail')}`}
// //                   >
// //                     {getButtonText('gmail')}
// //                   </button>
// //                 )}
// //               </div>

// //               {/* Calendar Integration */}
// //               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
// //                 <div className="flex items-center space-x-4">
// //                   <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
// //                     <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
// //                       <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/>
// //                     </svg>
// //                 </div>
// //                 <div>
// //                   <h3 className="text-lg font-medium text-gray-900">Google Calendar</h3>
// //                   <p className="text-sm text-gray-600">Automatically create events from emails</p>
// //                   {connectionStatus.calendar === 'connected' && (
// //                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
// //                   )}
// //                   {connectionStatus.calendar === 'failed' && (
// //                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
// //                   )}
// //                 </div>
// //                 {connectionStatus.calendar === 'connected' ? (
// //                   <button
// //                     onClick={() => handleDisconnect('calendar')}
// //                     className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
// //                   >
// //                     Disconnect
// //                   </button>
// //               ) : (
// //                   <button
// //                     onClick={() => handleConnect('calendar')}
// //                     disabled={isButtonDisabled('calendar')}
// //                     className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('calendar')}`}
// //                   >
// //                     {getButtonText('calendar')}
// //                   </button>
// //                 )}
// //               </div>

// //               {/* Reminders Integration */}
// //               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
// //                 <div className="flex items-center space-x-4">
// //                   <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
// //                     <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 006.03 3h11.94c.7 0 1.35.37 1.7.97L21 9v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9c0-.26.06-.51.19-.74L4.19 4.19z" />
// //                     </svg>
// //                 </div>
// //                 <div>
// //                   <h3 className="text-lg font-medium text-gray-900">Smart Reminders</h3>
// //                   <p className="text-sm text-gray-600">Get intelligent reminders for important events</p>
// //                   {connectionStatus.reminder === 'connected' && (
// //                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
// //                   )}
// //                   {connectionStatus.reminder === 'failed' && (
// //                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
// //                   )}
// //                 </div>
// //                 {connectionStatus.reminder === 'connected' ? (
// //                   <button
// //                     onClick={() => handleDisconnect('reminder')}
// //                     className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
// //                   >
// //                     Disconnect
// //                   </button>
// //                 ) : (
// //                   <button
// //                     onClick={() => handleConnect('reminder')}
// //                     disabled={isButtonDisabled('reminder')}
// //                     className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('reminder')}`}
// //                   >
// //                     {getButtonText('reminder')}
// //                   </button>
// //                 )}
// //               </div>
// //             </div>

// //             {/* How It Works */}
// //             <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
// //               <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //                 <div className="text-center">
// //                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
// //                     <span className="text-blue-600 font-semibold">1</span>
// //                   </div>
// //                   <h3 className="font-medium text-gray-900 mb-2">Connect Your Accounts</h3>
// //                   <p className="text-sm text-gray-600">Link your Gmail and Calendar to get started</p>
// //                 </div>
// //                 <div className="text-center">
// //                   <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
// //                     <span className="text-purple-600 font-semibold">2</span>
// //                   </div>
// //                   <h3 className="font-medium text-gray-900 mb-2">AI Processes Emails</h3>
// //                   <p className="text-sm text-gray-600">Our AI automatically scans school emails for events</p>
// //                 </div>
// //                 <div className="text-center">
// //                   <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
// //                     <span className="text-green-600 font-semibold">3</span>
// //                   </div>
// //                   <h3 className="font-medium text-gray-900 mb-2">Events Created</h3>
// //                   <p className="text-sm text-gray-600">Calendar events are automatically created with reminders</p>
// //                 </div>
// //               </div>
// //             </div>
// //          </div>
// //        </div>
// //      </div>
// //    )
// // }











// // 










// // import { useSession, signIn } from 'next-auth/react'
// // import { useRouter } from 'next/router'
// // import { useState, useEffect } from 'react'
// // import Navbar from './Navbar'

// // // Interface for pending events
// // interface PendingEvent {
// //   id: string
// //   title: string
// //   description: string
// //   startDate: string
// //   endDate: string
// //   location?: string
// //   source: string
// //   confidenceScore: number
// //   extractedFrom: string
// //   createdAt: string
// // }

// // // Interface for notification settings
// // interface NotificationSettings {
// //   emailAlerts: boolean
// //   whatsappAlerts: boolean
// //   emailAddress: string
// //   whatsappNumber: string
// //   reminderTiming: number // minutes before event
// // }

// // // Simple function to log user actions to Google Sheets
// // const logUserAction = async (action: string, service: string, status: string, details?: string) => {
// //   try {
// //     await fetch('/api/log-action', {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify({
// //         action,
// //         service,
// //         status,
// //         details
// //       })
// //     })
// //   } catch (error) {
// //     console.error('Failed to log action:', error)
// //   }
// // }


// // export default function Dashboard() {
// //   const { data: session, status } = useSession()
// //   const router = useRouter()
// //   const [isConnecting, setIsConnecting] = useState<string | null>(null)
// //   const [connectionStatus, setConnectionStatus] = useState<{[key: string]: 'connected' | 'failed' | 'not_connected'}>({
// //     gmail: 'not_connected',
// //     calendar: 'not_connected',
// //     reminder: 'not_connected'
// //   })
// //   const [errorMessage, setErrorMessage] = useState<string | null>(null)
// //   const [hasCheckedStatus, setHasCheckedStatus] = useState(false)
// //   
// //   // State for pending events
// //   const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([])
// //   const [loadingEvents, setLoadingEvents] = useState(false)
// //   const [editingEvent, setEditingEvent] = useState<string | null>(null)
// //   const [editForm, setEditForm] = useState<Partial<PendingEvent>>({})
// //   const [isTriggeringWorkflow, setIsTriggeringWorkflow] = useState(false);

// //   const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
// //     emailAlerts: false,
// //     whatsappAlerts: false,
// //     emailAddress: '',
// //     whatsappNumber: '',
// //     reminderTiming: 30
// //   })
// //   const [showNotificationSettings, setShowNotificationSettings] = useState(false)
// //   const [isSavingSettings, setIsSavingSettings] = useState(false)

// //   // Fetch pending events from API
// //   const fetchPendingEvents = async () => {
// //     setLoadingEvents(true)
// //     try {
// //       const response = await fetch('/api/events')
// //       if (response.ok) {
// //         const events: PendingEvent[] = await response.json()
// //         setPendingEvents(events)
// //         logUserAction('Fetch Events', 'Pending Events', 'success', `Loaded ${events.length} pending events`)
// //       } else {
// //         throw new Error('Failed to fetch events')
// //       }
// //     } catch (error) {
// //       console.error('Error fetching pending events:', error)
// //       setErrorMessage('❌ Failed to load events. Please try refreshing.')
// //       logUserAction('Fetch Events', 'Pending Events', 'failed', 'Failed to load pending events')
// //     } finally {
// //       setLoadingEvents(false)
// //     }
// //   }

// //   // Fetch data on initial load
// //   useEffect(() => {
// //     if (session?.accessToken && !hasCheckedStatus) {
// //       checkConnectionStatus()
// //       fetchPendingEvents()
// //       setHasCheckedStatus(true)
// //       logUserAction('Dashboard Access', 'Dashboard', 'success', 'User accessed dashboard')
// //     }
// //   }, [session, hasCheckedStatus])

// //   // Handle event approval
// //   const handleApproveEvent = async (eventId: string) => {
// //     try {
// //       const eventToApprove = pendingEvents.find(e => e.id === eventId);
// //       if (!eventToApprove) {
// //         return;
// //       }
// //       // Simulate API call and state update
// //       const response = await fetch('/api/create-calendar-event', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(eventToApprove)
// //       });
// //       if (response.ok) {
// //         setPendingEvents(prev => prev.filter(event => event.id !== eventId));
// //         setErrorMessage('✅ Event approved and added to calendar!');
// //         setTimeout(() => setErrorMessage(null), 3000);
// //         logUserAction('Approve Event', 'Pending Events', 'success', `Event ${eventId} approved`);
// //       } else {
// //         throw new Error('Failed to approve event');
// //       }
// //     } catch (error) {
// //       console.error('Error approving event:', error)
// //       setErrorMessage('❌ Failed to approve event. Please try again.')
// //       setTimeout(() => setErrorMessage(null), 3000)
// //       logUserAction('Approve Event', 'Pending Events', 'failed', `Failed to approve event ${eventId}`)
// //     }
// //   }

// //   // Handle event rejection
// //   const handleRejectEvent = async (eventId: string) => {
// //     try {
// //       // Call API to delete event
// //       const response = await fetch(`/api/events/${eventId}`, {
// //         method: 'DELETE',
// //       });
// //       if (response.ok) {
// //         setPendingEvents(prev => prev.filter(event => event.id !== eventId));
// //         setErrorMessage('❌ Event rejected successfully.');
// //         setTimeout(() => setErrorMessage(null), 3000);
// //         logUserAction('Reject Event', 'Pending Events', 'success', `Event ${eventId} rejected`);
// //       } else {
// //         throw new Error('Failed to reject event');
// //       }
// //     } catch (error) {
// //       console.error('Error rejecting event:', error)
// //       setErrorMessage('❌ Failed to reject event. Please try again.')
// //       setTimeout(() => setErrorMessage(null), 3000)
// //       logUserAction('Reject Event', 'Pending Events', 'failed', `Failed to reject event ${eventId}`)
// //     }
// //   }

// //   // Handle edit event
// //   const handleEditEvent = (event: PendingEvent) => {
// //     setEditingEvent(event.id)
// //     setEditForm(event)
// //   }

// //   // Save edited event
// //   const handleSaveEdit = async (eventId: string) => {
// //     try {
// //       const updatedEvent: Partial<PendingEvent> = { ...editForm, id: eventId }
// //       const response = await fetch(`/api/events/${eventId}`, {
// //         method: 'PUT',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(updatedEvent),
// //       });

// //       if (response.ok) {
// //         setPendingEvents(prev => prev.map(event => 
// //          event.id === eventId ? updatedEvent as PendingEvent : event
// //        ));
// //         setEditingEvent(null);
// //         setEditForm({});
// //         setErrorMessage('✅ Event updated successfully!');
// //         setTimeout(() => setErrorMessage(null), 3000);
// //         logUserAction('Edit Event', 'Pending Events', 'success', `Event ${eventId} updated`);
// //       } else {
// //         throw new Error('Failed to update event');
// //       }

// //     } catch (error) {
// //       console.error('Error saving event:', error)
// //       setErrorMessage('❌ Failed to save changes. Please try again.')
// //       setTimeout(() => setErrorMessage(null), 3000)
// //       logUserAction('Edit Event', 'Pending Events', 'failed', `Failed to update event ${eventId}`)
// //     }
// //   }

// //   const checkConnectionStatus = async () => {
// //     if (!session?.accessToken) {
// //       return
// //     }
// //     try {
// //       const gmailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
// //         headers: { 'Authorization': `Bearer ${session?.accessToken}` }
// //       });
// //       setConnectionStatus(prev => ({ ...prev, gmail: gmailResponse.ok ? 'connected' : 'not_connected' }));

// //       const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
// //         headers: { 'Authorization': `Bearer ${session?.accessToken}` }
// //       });
// //       setConnectionStatus(prev => ({ ...prev, calendar: calendarResponse.ok ? 'connected' : 'not_connected' }));

// //       setConnectionStatus(prev => ({ ...prev, reminder: 'connected' }));
// //     } catch (error) {
// //       console.error('Error checking connection status:', error);
// //       logUserAction('Status Check', 'Dashboard', 'failed', 'Connection check failed');
// //     }
// //   }

// //   const handleTriggerWorkflow = async () => {
// //     setIsTriggeringWorkflow(true);
// //     try {
// //         const response = await fetch('/api/trigger-workflow', { method: 'POST' });
// //         const result = await response.json();
// //         if (response.ok) {
// //             setErrorMessage(`✅ Workflow triggered! Check your inbox for new events to appear here shortly.`);
// //         } else {
// //             setErrorMessage(`❌ Failed to trigger workflow. Error: ${result.error}`);
// //         }
// //     } catch (error) {
// //         setErrorMessage('❌ Failed to trigger workflow. Network error.');
// //     } finally {
// //         setIsTriggeringWorkflow(false);
// //         setTimeout(() => setErrorMessage(null), 5000);
// //     }
// //   };

// //   const handleSaveNotificationSettings = async () => {
// //     setIsSavingSettings(true)
// //     try {
// //       localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings))
// //       setErrorMessage('✅ Notification settings saved successfully!')
// //       setShowNotificationSettings(false)
// //       setTimeout(() => setErrorMessage(null), 3000)
// //     } catch (error) {
// //       console.error('Error saving notification settings:', error)
// //       setErrorMessage('❌ Failed to save notification settings. Please try again.')
// //       setTimeout(() => setErrorMessage(null), 5000)
// //     } finally {
// //       setIsSavingSettings(false)
// //     }
// //   }

// //   const handleTestWhatsApp = async () => {
// //     if (!notificationSettings.whatsappNumber) {
// //       setErrorMessage('❌ Please enter a WhatsApp number first.')
// //       setTimeout(() => setErrorMessage(null), 3000)
// //       return
// //     }
// //     try {
// //       const response = await fetch('/api/send-whatsapp-test', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           number: notificationSettings.whatsappNumber,
// //           message: 'This is a test message from your AI Schedule Assistant! 🤖'
// //         })
// //       })
// //       if (response.ok) {
// //         setErrorMessage('✅ Test WhatsApp message sent successfully!')
// //       } else {
// //         throw new Error('Failed to send test message')
// //       }
// //     } catch (error) {
// //       console.error('Error sending test WhatsApp:', error)
// //       setErrorMessage('❌ Failed to send test WhatsApp message. Please check your number.')
// //     }
// //     setTimeout(() => setErrorMessage(null), 5000)
// //   }

// //   if (status === 'loading') {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
// //           <p className="mt-4 text-gray-600">Loading your dashboard...</p>
// //         </div>
// //       </div>
// //     )
// //   }

// //   if (!session) {
// //     router.push('/auth/signin')
// //     return null
// //   }

// //   const handleConnect = async (service: string) => {
// //     setIsConnecting(service)
// //     setErrorMessage(null)
// //     logUserAction('Connect Attempt', service.charAt(0).toUpperCase() + service.slice(1), 'pending', 'User clicked connect button')
// //     signIn('google')
// //   }

// //   const handleDisconnect = async (service: string) => {
// //     logUserAction('Disconnect', service.charAt(0).toUpperCase() + service.slice(1), 'success', 'User manually disconnected service')
// //     try {
// //       setConnectionStatus(prev => ({ ...prev, [service]: 'not_connected' }))
// //       setErrorMessage(`${service.charAt(0).toUpperCase() + service.slice(1)} disconnected successfully!`)
// //       setTimeout(() => setErrorMessage(null), 3000)
// //     } catch (error) {
// //       console.error(`Error disconnecting ${service}:`, error)
// //     }
// //   }

// //   const getButtonText = (service: string) => {
// //     if (isConnecting === service) return 'Connecting...'
// //     if (connectionStatus[service] === 'connected') return 'Connected'
// //     if (connectionStatus[service] === 'failed') return 'Retry'
// //     return 'Connect'
// //   }

// //   const getButtonClass = (service: string) => {
// //     if (isConnecting === service) {
// //       return 'bg-gray-300 text-gray-500 cursor-not-allowed'
// //     }
// //     if (connectionStatus[service] === 'connected') {
// //       return 'bg-green-600 hover:bg-green-700 text-white'
// //     }
// //     if (connectionStatus[service] === 'failed') {
// //       return 'bg-red-600 hover:bg-red-700 text-white'
// //     }
// //     return 'bg-blue-600 hover:bg-blue-700 text-white'
// //   }

// //   const isButtonDisabled = (service: string) => {
// //     return isConnecting === service
// //   }

// //   const handleRefreshStatus = () => {
// //     logUserAction('Refresh Status', 'Dashboard', 'pending', 'User manually refreshed connection status')
// //     checkConnectionStatus()
// //   }

// //   const getConfidenceColor = (score: number) => {
// //     if (score >= 0.8) return 'text-green-600 bg-green-100'
// //     if (score >= 0.6) return 'text-yellow-600 bg-yellow-100'
// //     return 'text-red-600 bg-red-100'
// //   }

// //   const formatDate = (isoString: string) => {
// //     const date = new Date(isoString);
// //     return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
// //   };


// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <Navbar />
// //       
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         {/* Welcome Section */}
// //         <div className="mb-8">
// //           <h1 className="text-3xl font-bold text-gray-900">
// //             Welcome back, {session.user?.name?.split(' ')[0]}!
// //           </h1>
// //           <p className="text-gray-600 mt-2">
// //             Let's get your AI assistant set up to help manage your busy schedule.
// //           </p>
// //         </div>

// //         {/* Error Message */}
// //         {errorMessage && (
// //           <div className="mb-6 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
// //             <div className="flex items-center">
// //               <div className="flex-shrink-0">
// //                 <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
// //                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
// //                 </svg>
// //               </div>
// //               <div className="ml-3">
// //                 <p className="text-sm text-gray-700">{errorMessage}</p>
// //               </div>
// //               <div className="ml-auto pl-3">
// //                 <button
// //                   onClick={() => setErrorMessage(null)}
// //                   className="inline-flex text-gray-400 hover:text-gray-600"
// //                 >
// //                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
// //                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
// //                   </svg>
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //         <div className="mb-8">
// //             <div className="flex items-center justify-between mb-4">
// //               <h2 className="text-lg font-semibold text-gray-900">Pending Events</h2>
// //               <button
// //                 onClick={handleTriggerWorkflow}
// //                 disabled={isTriggeringWorkflow}
// //                 className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${isTriggeringWorkflow ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
// //               >
// //                 {isTriggeringWorkflow ? (
// //                   <>
// //                     <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2"></div>
// //                     <span>Scanning...</span>
// //                   </>
// //                 ) : (
// //                   <>
// //                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.418 0h.582m-15.418 0a8.001 8.001 0 0015.418 0m-15.418 0v-.582m15.418 0v.582M5.196 13.916v-.582m15.418 0v.582" />
// //                     </svg>
// //                     Scan for New Events
// //                   </>
// //                 )}
// //               </button>
// //             </div>
// //             {pendingEvents.length > 0 && (
// //            <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
// //              <div className="px-6 py-4 border-b border-gray-200">
// //                <div className="flex items-center justify-between">
// //                  <div>
// //                    <p className="text-sm text-gray-600 mt-1">
// //                      Review and approve events detected by AI from your emails
// //                    </p>
// //                  </div>
// //                  <button
// //                    onClick={fetchPendingEvents}
// //                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
// //                  >
// //                    Refresh
// //                  </button>
// //                </div>
// //              </div>
// //             
// //              <div className="p-6">
// //                {loadingEvents ? (
// //                  <div className="text-center py-8">
// //                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
// //                    <p className="mt-2 text-gray-600">Loading pending events...</p>
// //                  </div>
// //                ) : (
// //                  <div className="space-y-4">
// //                    {pendingEvents.map((event) => (
// //                      <div key={event.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
// //                        {editingEvent === event.id ? (
// //                          // Edit Mode
// //                          <div className="space-y-4">
// //                            <div>
// //                              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
// //                              <input
// //                                type="text"
// //                                value={editForm.title || ''}
// //                                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
// //                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                              />
// //                            </div>
// //                            <div>
// //                              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
// //                              <textarea
// //                                value={editForm.description || ''}
// //                                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
// //                                rows={3}
// //                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                              />
// //                            </div>
// //                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                              <div>
// //                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
// //                                <input
// //                                  type="datetime-local"
// //                                  value={editForm.startDate ? editForm.startDate.substring(0, 16) : ''}
// //                                  onChange={(e) => setEditForm(prev => ({ ...prev, startDate: e.target.value }))}
// //                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                                />
// //                              </div>
// //                              <div>
// //                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
// //                                <input
// //                                  type="datetime-local"
// //                                  value={editForm.endDate ? editForm.endDate.substring(0, 16) : ''}
// //                                  onChange={(e) => setEditForm(prev => ({ ...prev, endDate: e.target.value }))}
// //                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                                />
// //                              </div>
// //                            </div>
// //                            <div>
// //                              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
// //                              <input
// //                                type="text"
// //                                value={editForm.location || ''}
// //                                onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
// //                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                              />
// //                            </div>
// //                            <div className="flex space-x-2">
// //                              <button
// //                                onClick={() => handleSaveEdit(event.id)}
// //                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
// //                              >
// //                                Save Changes
// //                              </button>
// //                              <button
// //                                onClick={() => {
// //                                  setEditingEvent(null)
// //                                  setEditForm({})
// //                                }}
// //                                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
// //                              >
// //                                Cancel
// //                              </button>
// //                            </div>
// //                          </div>
// //                        ) : (
// //                          // View Mode
// //                          <div>
// //                            <div className="flex items-start justify-between mb-3">
// //                              <div className="flex-1">
// //                                <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
// //                                <p className="text-gray-600 text-sm mt-1">{event.description}</p>
// //                              </div>
// //                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(event.confidenceScore)}`}>
// //                                {Math.round(event.confidenceScore * 100)}% confidence
// //                              </span>
// //                            </div>
// //                           
// //                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
// //                              <div>
// //                                <span className="font-medium">Start:</span> {formatDate(event.startDate)}
// //                              </div>
// //                              <div>
// //                                <span className="font-medium">End:</span> {formatDate(event.endDate)}
// //                              </div>
// //                              {event.location && (
// //                                <div>
// //                                  <span className="font-medium">Location:</span> {event.location}
// //                                </div>
// //                              )}
// //                              <div>
// //                                <span className="font-medium">Source:</span> {event.source}
// //                              </div>
// //                            </div>
// //                           
// //                            <div className="flex space-x-2">
// //                              <button
// //                                onClick={() => handleApproveEvent(event.id)}
// //                                className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm"
// //                              >
// //                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
// //                                </svg>
// //                                Approve
// //                              </button>
// //                              <button
// //                                onClick={() => handleEditEvent(event)}
// //                                className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
// //                              >
// //                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
// //                                </svg>
// //                                Edit
// //                              </button>
// //                              <button
// //                                onClick={() => handleRejectEvent(event.id)}
// //                                className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
// //                              >
// //                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                                </svg>
// //                                Reject
// //                              </button>
// //                            </div>
// //                          </div>
// //                        )}
// //                      </div>
// //                    ))}
// //                  </div>
// //                )}
// //              </div>
// //            </div>
// //          )}
// //         {pendingEvents.length === 0 && (
// //           <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm border border-gray-200">
// //             {loadingEvents ? (
// //               <div className="flex items-center justify-center">
// //                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// //                 <p className="ml-4 text-gray-600">Loading events...</p>
// //               </div>
// //             ) : (
// //               <p>No pending events. Click "Scan for New Events" to trigger a scan.</p>
// //             )}
// //           </div>
// //         )}
// //       </div>

// //          {/* Stats Overview */}
// //          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
// //            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //              <div className="flex items-center">
// //                <div className="flex-shrink-0">
// //                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
// //                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
// //                    </svg>
// //                 </div>
// //                <div className="ml-4">
// //                  <p className="text-sm font-medium text-gray-500">Emails Processed</p>
// //                  <p className="text-2xl font-semibold text-gray-900">0</p>
// //                </div>
// //              </div>
// //            </div>

// //            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //              <div className="flex items-center">
// //                <div className="flex-shrink-0">
// //                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
// //                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// //                    </svg>
// //                 </div>
// //                <div className="ml-4">
// //                  <p className="text-sm font-medium text-gray-500">Events Created</p>
// //                  <p className="text-2xl font-semibold text-gray-900">0</p>
// //                </div>
// //              </div>
// //            </div>

// //            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //              <div className="flex items-center">
// //                <div className="flex-shrink-0">
// //                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
// //                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// //                    </svg>
// //                 </div>
// //                <div className="ml-4">
// //                  <p className="text-sm font-medium text-gray-500">Time Saved</p>
// //                  <p className="text-2xl font-semibold text-gray-900">0h</p>
// //                </div>
// //              </div>
// //            </div>
// //          </div>

// //          {/* Connection Status Overview */}
// //          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //            <div className="flex items-center justify-between mb-4">
// //              <h2 className="text-lg font-semibold text-gray-900">Connection Status</h2>
// //              <div className="flex space-x-2">
// //                <button
// //                  onClick={handleRefreshStatus}
// //                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
// //                >
// //                  Refresh Status
// //                </button>
// //                <button
// //                  onClick={async () => {
// //                    try {
// //                      const response = await fetch('/api/test-google-sheets')
// //                      const data = await response.json()
// //                      if (data.success) {
// //                        setErrorMessage('✅ Google Sheets connection successful! Check your spreadsheet for logs.')
// //                      } else {
// //                        setErrorMessage(`❌ Google Sheets test failed: ${data.error}`)
// //                      }
// //                      setTimeout(() => setErrorMessage(null), 5000)
// //                    } catch (error) {
// //                      setErrorMessage('❌ Failed to test Google Sheets connection')
// //                      setTimeout(() => setErrorMessage(null), 5000)
// //                    }
// //                  }}
// //                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
// //                >
// //                  Test Logging
// //                </button>
// //              </div>
// //            </div>
// //            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
// //                <div className={`w-3 h-3 rounded-full mr-3 ${
// //                  connectionStatus.gmail === 'connected' ? 'bg-green-500' :
// //                  connectionStatus.gmail === 'failed' ? 'bg-red-500' : 'bg-gray-400'
// //                }`}></div>
// //                <span className="text-sm font-medium text-gray-700">Gmail</span>
// //                <span className="ml-auto text-xs text-gray-500">
// //                  {connectionStatus.gmail === 'connected' ? 'Connected' :
// //                    connectionStatus.gmail === 'failed' ? 'Failed' : 'Not Connected'}
// //                </span>
// //              </div>
// //             
// //              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
// //                <div className={`w-3 h-3 rounded-full mr-3 ${
// //                  connectionStatus.calendar === 'connected' ? 'bg-green-500' :
// //                  connectionStatus.calendar === 'failed' ? 'bg-red-500' : 'bg-gray-400'
// //                }`}></div>
// //                <span className="text-sm font-medium text-gray-700">Calendar</span>
// //                <span className="ml-auto text-xs text-gray-500">
// //                  {connectionStatus.calendar === 'connected' ? 'Connected' :
// //                    connectionStatus.calendar === 'failed' ? 'Failed' : 'Not Connected'}
// //                </span>
// //              </div>
// //             
// //              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
// //                <div className={`w-3 h-3 rounded-full mr-3 ${
// //                  connectionStatus.reminder === 'connected' ? 'bg-green-500' :
// //                  connectionStatus.reminder === 'failed' ? 'bg-red-500' : 'bg-gray-400'
// //                }`}></div>
// //                <span className="text-sm font-medium text-gray-700">Reminders</span>
// //                <span className="ml-auto text-xs text-gray-500">
// //                  {connectionStatus.reminder === 'connected' ? 'Connected' :
// //                    connectionStatus.reminder === 'failed' ? 'Failed' : 'Not Connected'}
// //                </span>
// //              </div>
// //            </div>
// //          </div>

// //          {/* Integration Setup */}
// //          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
// //            <div className="px-6 py-4 border-b border-gray-200">
// //              <h2 className="text-lg font-semibold text-gray-900">Connect Your Services</h2>
// //              <p className="text-sm text-gray-600 mt-1">
// //                Connect your accounts to start automating your schedule management.
// //              </p>
// //            </div>
// //           
// //            <div className="p-6 space-y-6">
// //              {/* Gmail Integration */}
// //              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
// //                <div className="flex items-center space-x-4">
// //                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
// //                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
// //                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
// //                    </svg>
// //                 </div>
// //                 <div>
// //                   <h3 className="text-lg font-medium text-gray-900">Gmail</h3>
// //                   <p className="text-sm text-gray-600">Connect to process school emails automatically</p>
// //                   {connectionStatus.gmail === 'connected' && (
// //                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
// //                   )}
// //                   {connectionStatus.gmail === 'failed' && (
// //                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
// //                   )}
// //                 </div>
// //                 {connectionStatus.gmail === 'connected' ? (
// //                   <button
// //                     onClick={() => handleDisconnect('gmail')}
// //                     className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
// //                   >
// //                     Disconnect
// //                   </button>
// //                 ) : (
// //                   <button
// //                     onClick={() => handleConnect('gmail')}
// //                     disabled={isButtonDisabled('gmail')}
// //                     className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('gmail')}`}
// //                   >
// //                     {getButtonText('gmail')}
// //                   </button>
// //                 )}
// //               </div>

// //               {/* Calendar Integration */}
// //               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
// //                 <div className="flex items-center space-x-4">
// //                   <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
// //                     <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
// //                       <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/>
// //                     </svg>
// //                 </div>
// //                 <div>
// //                   <h3 className="text-lg font-medium text-gray-900">Google Calendar</h3>
// //                   <p className="text-sm text-gray-600">Automatically create events from emails</p>
// //                   {connectionStatus.calendar === 'connected' && (
// //                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
// //                   )}
// //                   {connectionStatus.calendar === 'failed' && (
// //                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
// //                   )}
// //                 </div>
// //                 {connectionStatus.calendar === 'connected' ? (
// //                   <button
// //                     onClick={() => handleDisconnect('calendar')}
// //                     className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
// //                   >
// //                     Disconnect
// //                   </button>
// //                 ) : (
// //                   <button
// //                     onClick={() => handleConnect('calendar')}
// //                     disabled={isButtonDisabled('calendar')}
// //                     className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('calendar')}`}
// //                   >
// //                     {getButtonText('calendar')}
// //                   </button>
// //                 )}
// //               </div>

// //               {/* Reminders Integration */}
// //               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
// //                 <div className="flex items-center space-x-4">
// //                   <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
// //                     <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 006.03 3h11.94c.7 0 1.35.37 1.7.97L21 9v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9c0-.26.06-.51.19-.74L4.19 4.19z" />
// //                     </svg>
// //                 </div>
// //                 <div>
// //                   <h3 className="text-lg font-medium text-gray-900">Smart Reminders</h3>
// //                   <p className="text-sm text-gray-600">Get intelligent reminders for important events</p>
// //                   {connectionStatus.reminder === 'connected' && (
// //                     <p className="text-xs text-green-600 mt-1">✓ Connected</p>
// //                   )}
// //                   {connectionStatus.reminder === 'failed' && (
// //                     <p className="text-xs text-red-600 mt-1">✗ Connection failed</p>
// //                   )}
// //                 </div>
// //                 {connectionStatus.reminder === 'connected' ? (
// //                   <button
// //                     onClick={() => handleDisconnect('reminder')}
// //                     className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
// //                   >
// //                     Disconnect
// //                   </button>
// //                 ) : (
// //                   <button
// //                     onClick={() => handleConnect('reminder')}
// //                     disabled={isButtonDisabled('reminder')}
// //                     className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('reminder')}`}
// //                   >
// //                     {getButtonText('reminder')}
// //                   </button>
// //                 )}
// //               </div>
// //             </div>

// //             {/* How It Works */}
// //             <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
// //               <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //                 <div className="text-center">
// //                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
// //                     <span className="text-blue-600 font-semibold">1</span>
// //                   </div>
// //                   <h3 className="font-medium text-gray-900 mb-2">Connect Your Accounts</h3>
// //                   <p className="text-sm text-gray-600">Link your Gmail and Calendar to get started</p>
// //                 </div>
// //                 <div className="text-center">
// //                   <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
// //                     <span className="text-purple-600 font-semibold">2</span>
// //                   </div>
// //                   <h3 className="font-medium text-gray-900 mb-2">AI Processes Emails</h3>
// //                   <p className="text-sm text-gray-600">Our AI automatically scans school emails for events</p>
// //                 </div>
// //                 <div className="text-center">
// //                   <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
// //                     <span className="text-green-600 font-semibold">3</span>
// //                   </div>
// //                   <h3 className="font-medium text-gray-900 mb-2">Events Created</h3>
// //                   <p className="text-sm text-gray-600">Calendar events are automatically created with reminders</p>
// //                 </div>
// //               </div>
// //             </div>
// //          </div>
// //        </div>
// //      </div>
// //    )
// // }




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

// // Interface for notification settings
// interface NotificationSettings {
//   emailAlerts: boolean
//   whatsappAlerts: boolean
//   emailAddress: string
//   whatsappNumber: string
//   reminderTiming: number // minutes before event
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
//   const [connectionStatus, setConnectionStatus] = useState<{ [key: string]: 'connected' | 'failed' | 'not_connected' }>({
//     gmail: 'not_connected',
//     calendar: 'not_connected',
//     reminder: 'not_connected'
//   })
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)
//   const [hasCheckedStatus, setHasCheckedStatus] = useState(false)

//   // State for pending events
//   const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([])
//   const [loadingEvents, setLoadingEvents] = useState(false)
//   const [editingEvent, setEditingEvent] = useState<string | null>(null)
//   const [editForm, setEditForm] = useState<Partial<PendingEvent>>({})
//   const [isTriggeringWorkflow, setIsTriggeringWorkflow] = useState(false)

//   const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
//     emailAlerts: false,
//     whatsappAlerts: false,
//     emailAddress: '',
//     whatsappNumber: '',
//     reminderTiming: 30
//   })
//   const [showNotificationSettings, setShowNotificationSettings] = useState(false)
//   const [isSavingSettings, setIsSavingSettings] = useState(false)

//   // Fetch pending events from API
//   const fetchPendingEvents = async () => {
//     setLoadingEvents(true)
//     try {
//       const response = await fetch('/api/events')
//       if (response.ok) {
//         const events: PendingEvent[] = await response.json()
//         setPendingEvents(events)
//         logUserAction('Fetch Events', 'Pending Events', 'success', `Loaded ${events.length} pending events`)
//       } else {
//         throw new Error('Failed to fetch events')
//       }
//     } catch (error) {
//       console.error('Error fetching pending events:', error)
//       setErrorMessage('❌ Failed to load events. Please try refreshing.')
//       logUserAction('Fetch Events', 'Pending Events', 'failed', 'Failed to load pending events')
//     } finally {
//       setLoadingEvents(false)
//     }
//   }

//   // Fetch data on initial load
//   useEffect(() => {
//     if (session?.accessToken && !hasCheckedStatus) {
//       checkConnectionStatus()
//       fetchPendingEvents()
//       setHasCheckedStatus(true)
//       logUserAction('Dashboard Access', 'Dashboard', 'success', 'User accessed dashboard')
//     }
//     // Load notification settings from localStorage
//     const savedSettings = localStorage.getItem('notificationSettings')
//     if (savedSettings) {
//       setNotificationSettings(JSON.parse(savedSettings))
//     }
//   }, [session, hasCheckedStatus])

//   // Handle event approval
//   const handleApproveEvent = async (eventId: string) => {
//     try {
//       const eventToApprove = pendingEvents.find(e => e.id === eventId)
//       if (!eventToApprove) return
//       const response = await fetch('/api/create-calendar-event', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(eventToApprove)
//       })
//       if (response.ok) {
//         setPendingEvents(prev => prev.filter(event => event.id !== eventId))
//         setErrorMessage('✅ Event approved and added to calendar!')
//         setTimeout(() => setErrorMessage(null), 3000)
//         logUserAction('Approve Event', 'Pending Events', 'success', `Event ${eventId} approved`)
//       } else {
//         throw new Error('Failed to approve event')
//       }
//     } catch (error) {
//       console.error('Error approving event:', error)
//       setErrorMessage('❌ Failed to approve event. Please try again.')
//       setTimeout(() => setErrorMessage(null), 3000)
//       logUserAction('Approve Event', 'Pending Events', 'failed', `Failed to approve event ${eventId}`)
//     }
//   }

//   // Handle event rejection
//   const handleRejectEvent = async (eventId: string) => {
//     try {
//       const response = await fetch(`/api/events/${eventId}`, {
//         method: 'DELETE',
//       })
//       if (response.ok) {
//         setPendingEvents(prev => prev.filter(event => event.id !== eventId))
//         setErrorMessage('❌ Event rejected successfully.')
//         setTimeout(() => setErrorMessage(null), 3000)
//         logUserAction('Reject Event', 'Pending Events', 'success', `Event ${eventId} rejected`)
//       } else {
//         throw new Error('Failed to reject event')
//       }
//     } catch (error) {
//       console.error('Error rejecting event:', error)
//       setErrorMessage('❌ Failed to reject event. Please try again.')
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
//       const updatedEvent: PendingEvent = { ...editForm, id: eventId } as PendingEvent
//       const response = await fetch(`/api/events/${eventId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedEvent),
//       })
//       if (response.ok) {
//         setPendingEvents(prev => prev.map(event =>
//           event.id === eventId ? updatedEvent : event
//         ))
//         setEditingEvent(null)
//         setEditForm({})
//         setErrorMessage('✅ Event updated successfully!')
//         setTimeout(() => setErrorMessage(null), 3000)
//         logUserAction('Edit Event', 'Pending Events', 'success', `Event ${eventId} updated`)
//       } else {
//         throw new Error('Failed to update event')
//       }
//     } catch (error) {
//       console.error('Error saving event:', error)
//       setErrorMessage('❌ Failed to save changes. Please try again.')
//       setTimeout(() => setErrorMessage(null), 3000)
//       logUserAction('Edit Event', 'Pending Events', 'failed', `Failed to update event ${eventId}`)
//     }
//   }

//   const checkConnectionStatus = async () => {
//     if (!session?.accessToken) return
//     try {
//       const gmailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
//         headers: { 'Authorization': `Bearer ${session?.accessToken}` }
//       })
//       setConnectionStatus(prev => ({ ...prev, gmail: gmailResponse.ok ? 'connected' : 'not_connected' }))

//       const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
//         headers: { 'Authorization': `Bearer ${session?.accessToken}` }
//       })
//       setConnectionStatus(prev => ({ ...prev, calendar: calendarResponse.ok ? 'connected' : 'not_connected' }))

//       setConnectionStatus(prev => ({ ...prev, reminder: 'connected' }))
//     } catch (error) {
//       console.error('Error checking connection status:', error)
//       logUserAction('Status Check', 'Dashboard', 'failed', 'Connection check failed')
//     }
//   }

//   const handleTriggerWorkflow = async () => {
//     setIsTriggeringWorkflow(true)
//     try {
//       const response = await fetch('/api/trigger-workflow', { method: 'POST' })
//       const result = await response.json()
//       if (response.ok) {
//         setErrorMessage(`✅ Workflow triggered! Check your inbox for new events to appear here shortly.`)
//       } else {
//         setErrorMessage(`❌ Failed to trigger workflow. Error: ${result.error}`)
//       }
//     } catch (error) {
//       setErrorMessage('❌ Failed to trigger workflow. Network error.')
//     } finally {
//       setIsTriggeringWorkflow(false)
//       setTimeout(() => setErrorMessage(null), 5000)
//     }
//   }

//   const handleSaveNotificationSettings = async () => {
//     setIsSavingSettings(true)
//     try {
//       localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings))
//       setErrorMessage('✅ Notification settings saved successfully!')
//       setShowNotificationSettings(false)
//       setTimeout(() => setErrorMessage(null), 3000)
//     } catch (error) {
//       console.error('Error saving notification settings:', error)
//       setErrorMessage('❌ Failed to save notification settings. Please try again.')
//       setTimeout(() => setErrorMessage(null), 5000)
//     } finally {
//       setIsSavingSettings(false)
//     }
//   }

//   const handleTestWhatsApp = async () => {
//     if (!notificationSettings.whatsappNumber) {
//       setErrorMessage('❌ Please enter a WhatsApp number first.')
//       setTimeout(() => setErrorMessage(null), 3000)
//       return
//     }
//     try {
//       const response = await fetch('/api/send-whatsapp-test', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           number: notificationSettings.whatsappNumber,
//           message: 'This is a test message from your AI Schedule Assistant! 🤖'
//         })
//       })
//       if (response.ok) {
//         setErrorMessage('✅ Test WhatsApp message sent successfully!')
//       } else {
//         throw new Error('Failed to send test message')
//       }
//     } catch (error) {
//       console.error('Error sending test WhatsApp:', error)
//       setErrorMessage('❌ Failed to send test WhatsApp message. Please check your number.')
//     }
//     setTimeout(() => setErrorMessage(null), 5000)
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

//   const handleRefreshStatus = () => {
//     logUserAction('Refresh Status', 'Dashboard', 'pending', 'User manually refreshed connection status')
//     checkConnectionStatus()
//   }

//   const getConfidenceColor = (score: number) => {
//     if (score >= 0.8) return 'text-green-600 bg-green-100'
//     if (score >= 0.6) return 'text-yellow-600 bg-yellow-100'
//     return 'text-red-600 bg-red-100'
//   }

//   const formatDate = (isoString: string) => {
//     const date = new Date(isoString)
//     return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`
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

//         {/* Pending Events Section */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-gray-900">Pending Events</h2>
//             <button
//               onClick={handleTriggerWorkflow}
//               disabled={isTriggeringWorkflow}
//               className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${isTriggeringWorkflow ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
//             >
//               {isTriggeringWorkflow ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2"></div>
//                   <span>Scanning...</span>
//                 </>
//               ) : (
//                 <>
//                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.418 0h.582m-15.418 0a8.001 8.001 0 0015.418 0m-15.418 0v-.582m15.418 0v.582M5.196 13.916v-.582m15.418 0v.582" />
//                   </svg>
//                   Scan for New Events
//                 </>
//               )}
//             </button>
//           </div>
//           {pendingEvents.length > 0 && (
//             <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
//               <div className="px-6 py-4 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600 mt-1">
//                       Review and approve events detected by AI from your emails
//                     </p>
//                   </div>
//                   <button
//                     onClick={fetchPendingEvents}
//                     className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
//                   >
//                     Refresh
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6">
//                 {loadingEvents ? (
//                   <div className="text-center py-8">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                     <p className="mt-2 text-gray-600">Loading pending events...</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {pendingEvents.map((event) => (
//                       <div key={event.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
//                         {editingEvent === event.id ? (
//                           // Edit Mode
//                           <div className="space-y-4">
//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                               <input
//                                 type="text"
//                                 value={editForm.title || ''}
//                                 onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               />
//                             </div>
//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                               <textarea
//                                 value={editForm.description || ''}
//                                 onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
//                                 rows={3}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               />
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//                                 <input
//                                   type="datetime-local"
//                                   value={editForm.startDate ? editForm.startDate.substring(0, 16) : ''}
//                                   onChange={(e) => setEditForm(prev => ({ ...prev, startDate: e.target.value }))}
//                                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//                                 <input
//                                   type="datetime-local"
//                                   value={editForm.endDate ? editForm.endDate.substring(0, 16) : ''}
//                                   onChange={(e) => setEditForm(prev => ({ ...prev, endDate: e.target.value }))}
//                                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                               </div>
//                             </div>
//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//                               <input
//                                 type="text"
//                                 value={editForm.location || ''}
//                                 onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               />
//                             </div>
//                             <div className="flex space-x-2">
//                               <button
//                                 onClick={() => handleSaveEdit(event.id)}
//                                 className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
//                               >
//                                 Save Changes
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   setEditingEvent(null)
//                                   setEditForm({})
//                                 }}
//                                 className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
//                               >
//                                 Cancel
//                               </button>
//                             </div>
//                           </div>
//                         ) : (
//                           // View Mode
//                           <div>
//                             <div className="flex items-start justify-between mb-3">
//                               <div className="flex-1">
//                                 <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
//                                 <p className="text-gray-600 text-sm mt-1">{event.description}</p>
//                               </div>
//                               <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(event.confidenceScore)}`}>
//                                 {Math.round(event.confidenceScore * 100)}% confidence
//                               </span>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
//                               <div>
//                                 <span className="font-medium">Start:</span> {formatDate(event.startDate)}
//                               </div>
//                               <div>
//                                 <span className="font-medium">End:</span> {formatDate(event.endDate)}
//                               </div>
//                               {event.location && (
//                                 <div>
//                                   <span className="font-medium">Location:</span> {event.location}
//                                 </div>
//                               )}
//                               <div>
//                                 <span className="font-medium">Source:</span> {event.source}
//                               </div>
//                             </div>
//                             <div className="flex space-x-2">
//                               <button
//                                 onClick={() => handleApproveEvent(event.id)}
//                                 className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm"
//                               >
//                                 <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                 </svg>
//                                 Approve
//                               </button>
//                               <button
//                                 onClick={() => handleEditEvent(event)}
//                                 className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
//                               >
//                                 <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                                 </svg>
//                                 Edit
//                               </button>
//                               <button
//                                 onClick={() => handleRejectEvent(event.id)}
//                                 className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
//                               >
//                                 <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                                 Reject
//                               </button>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//           {pendingEvents.length === 0 && (
//             <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm border border-gray-200">
//               {loadingEvents ? (
//                 <div className="flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                   <p className="ml-4 text-gray-600">Loading events...</p>
//                 </div>
//               ) : (
//                 <p>No pending events. Click "Scan for New Events" to trigger a scan.</p>
//               )}
//             </div>
//           )}
//         </div>

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
//                 {connectionStatus.gmail === 'connected' ? (
//                   <button
//                     onClick={() => handleDisconnect('gmail')}
//                     className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
//                   >
//                     Disconnect
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => handleConnect('gmail')}
//                     disabled={isButtonDisabled('gmail')}
//                     className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('gmail')}`}
//                   >
//                     {getButtonText('gmail')}
//                   </button>
//                 )}
//               </div>
//             </div>
//             {/* Calendar Integration */}
//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center space-x-4">
//                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/>
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
//                 {connectionStatus.calendar === 'connected' ? (
//                   <button
//                     onClick={() => handleDisconnect('calendar')}
//                     className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
//                   >
//                     Disconnect
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => handleConnect('calendar')}
//                     disabled={isButtonDisabled('calendar')}
//                     className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('calendar')}`}
//                   >
//                     {getButtonText('calendar')}
//                   </button>
//                 )}
//               </div>
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
//                 {connectionStatus.reminder === 'connected' ? (
//                   <button
//                     onClick={() => handleDisconnect('reminder')}
//                     className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
//                   >
//                     Disconnect
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => handleConnect('reminder')}
//                     disabled={isButtonDisabled('reminder')}
//                     className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass('reminder')}`}
//                   >
//                     {getButtonText('reminder')}
//                   </button>
//                 )}
//               </div>
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