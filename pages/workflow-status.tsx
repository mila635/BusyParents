import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '../components/Layout'
import WorkflowStatusDashboard from '../components/WorkflowStatusDashboard'
import { FiActivity } from 'react-icons/fi'

export default function WorkflowStatusPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect unauthenticated users to home page
  if (status === 'unauthenticated') {
    router.push('/')
    return null
  }

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Head>
        <title>Workflow Status | AI Assistant for Busy Parents</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FiActivity className="mr-2" />
            Workflow Status Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor and track all your automated workflows in real-time.
          </p>
        </div>

        <WorkflowStatusDashboard />
      </div>
    </Layout>
  )
}