// components/WorkflowStatusDashboard.js
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import WorkflowStatus from './WorkflowStatus'
import { FiActivity, FiRefreshCw } from 'react-icons/fi'

export default function WorkflowStatusDashboard() {
  const { data: session } = useSession()
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Define the workflows to display
  const workflows = [
    { action: 'sync_emails', title: 'Email Sync' },
    { action: 'sync_calendar', title: 'Calendar Sync' },
    { action: 'process_events', title: 'Event Processing' },
    { action: 'generate_summary', title: 'Summary Generation' }
  ]
  
  const refreshAll = async () => {
    if (!session) return
    
    setIsRefreshing(true)
    
    // This is just to show the refresh animation
    // The actual refresh happens in the WorkflowStatus components
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }
  
  if (!session) return null
  
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FiActivity className="text-blue-500 mr-2" size={20} />
          <h2 className="text-lg font-medium">Workflow Status Dashboard</h2>
        </div>
        <button
          onClick={refreshAll}
          disabled={isRefreshing}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center text-sm"
        >
          <FiRefreshCw className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh All
        </button>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        Monitor the status of all your automated workflows.
      </div>
      
      <div className="space-y-4">
        {workflows.map(workflow => (
          <div key={workflow.action} className="border rounded-md overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 border-b">
              <h3 className="font-medium">{workflow.title}</h3>
            </div>
            <div className="p-2">
              <WorkflowStatus 
                action={workflow.action} 
                showRefresh={true}
                showHistory={true}
                limit={3}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}