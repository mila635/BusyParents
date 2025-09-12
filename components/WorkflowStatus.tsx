import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FiCheckCircle, FiAlertCircle, FiClock, FiRefreshCw, FiInfo } from 'react-icons/fi';

interface WorkflowStatusProps {
  action?: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
  className?: string;
  showHistory?: boolean;
  limit?: number;
}

interface WorkflowData {
  id?: string;
  status: string;
  scenarioName: string;
  timestamp: string;
  executionId?: string;
  error?: string;
  completedAt?: string;
  errorAt?: string;
  additionalData?: any;
}

interface PaginationData {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface WorkflowHistoryResponse {
  items: WorkflowData[];
  pagination: PaginationData;
}

const WorkflowStatus: React.FC<WorkflowStatusProps> = ({
  action,
  showRefresh = true,
  onRefresh,
  className = '',
  showHistory = false,
  limit = 5
}) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null);
  const [history, setHistory] = useState<WorkflowData[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  const fetchWorkflowStatus = async () => {
    if (!session?.user?.email) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Use GET method with query parameters instead of POST with body
      const url = new URL('/api/workflow-status', window.location.origin);
      if (action) url.searchParams.append('action', action);
      
      const response = await fetch(url.toString());

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch workflow status');
      }

      const data = await response.json();
      setWorkflowData(data);
      
      // If showHistory is true and expanded, also fetch history
      if (showHistory && isHistoryExpanded) {
        await fetchHistory();
      }
    } catch (err) {
      console.error('Error fetching workflow status:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch workflow status');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchHistory = async () => {
    try {
      const url = new URL('/api/workflow-status', window.location.origin);
      url.searchParams.append('history', 'true');
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', limit.toString());
      if (action) url.searchParams.append('action', action);
      
      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error('Failed to fetch workflow history');
      }

      const data: WorkflowHistoryResponse = await response.json();
      setHistory(data.items);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching workflow history:', err);
      setError(err instanceof Error ? err.message : 'An error occurred fetching history');
    }
  };

  useEffect(() => {
    if (session?.user?.email && action) {
      fetchWorkflowStatus();
      
      // Refresh status every 30 seconds
      const intervalId = setInterval(fetchWorkflowStatus, 30000);
      return () => clearInterval(intervalId);
    }
  }, [session, action]);
  
  // Fetch history when page changes
  useEffect(() => {
    if (showHistory && isHistoryExpanded && session?.user?.email) {
      fetchHistory();
    }
  }, [page, showHistory, isHistoryExpanded, session]);

  const handleRefresh = () => {
    fetchWorkflowStatus();
    if (onRefresh) onRefresh();
  };
  
  const toggleHistory = () => {
    setIsHistoryExpanded(!isHistoryExpanded);
    if (!isHistoryExpanded && history.length === 0) {
      fetchHistory();
    }
  };
  
  const handlePrevPage = () => {
    if (pagination?.hasPreviousPage) {
      setPage(prev => prev - 1);
    }
  };
  
  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      setPage(prev => prev + 1);
    }
  };

  const getStatusIcon = (data = workflowData) => {
    if (!data) return <FiClock className="text-gray-400" />;
    
    switch (data.status) {
      case 'success':
        return <FiCheckCircle className="text-green-500" />;
      case 'error':
        return <FiAlertCircle className="text-red-500" />;
      case 'in_progress':
        return <FiClock className="text-blue-500 animate-pulse" />;
      case 'triggered':
        return <FiClock className="text-yellow-500" />;
      default:
        return <FiClock className="text-gray-400" />;
    }
  };

  const getStatusText = (data = workflowData) => {
    if (!data) return 'No workflow data';
    
    switch (data.status) {
      case 'success':
        return `${data.scenarioName} completed successfully`;
      case 'error':
        return `${data.scenarioName} failed: ${data.error || 'Unknown error'}`;
      case 'in_progress':
        return `${data.scenarioName} is in progress...`;
      case 'triggered':
        return `${data.scenarioName} has been triggered`;
      default:
        return `${data.scenarioName}: ${data.status}`;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (err) {
      return timestamp;
    }
  };

  if (error) {
    return (
      <div className={`flex items-center text-sm text-red-500 ${className}`}>
        <FiAlertCircle className="mr-2" />
        <span>{error}</span>
        {showRefresh && (
          <button
            onClick={handleRefresh}
            className="ml-2 p-1 rounded-full hover:bg-gray-100"
            aria-label="Refresh workflow status"
          >
            <FiRefreshCw className="text-gray-500" />
          </button>
        )}
      </div>
    );
  }

  if (loading && !workflowData) {
    return (
      <div className={`flex items-center text-sm text-gray-500 ${className}`}>
        <FiClock className="mr-2 animate-pulse" />
        <span>Loading workflow status...</span>
      </div>
    );
  }

  if (!workflowData) {
    return (
      <div className={`flex items-center text-sm text-gray-500 ${className}`}>
        <FiClock className="mr-2" />
        <span>No recent workflow data</span>
        {showRefresh && (
          <button
            onClick={handleRefresh}
            className="ml-2 p-1 rounded-full hover:bg-gray-100"
            aria-label="Refresh workflow status"
          >
            <FiRefreshCw className="text-gray-500" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center text-sm">
        <div className="mr-2">{loading ? <FiRefreshCw className="animate-spin text-blue-500" /> : getStatusIcon()}</div>
        <div className="flex flex-col">
          <span className={`font-medium ${
            workflowData.status === 'success' ? 'text-green-600' :
            workflowData.status === 'error' ? 'text-red-600' :
            workflowData.status === 'in_progress' ? 'text-blue-600' :
            workflowData.status === 'triggered' ? 'text-yellow-600' :
            'text-gray-600'
          }`}>
            {getStatusText()}
          </span>
          {workflowData.timestamp && (
            <span className="text-xs text-gray-500">
              Triggered: {formatTimestamp(workflowData.timestamp)}
            </span>
          )}
          {workflowData.completedAt && (
            <span className="text-xs text-gray-500">
              Completed: {formatTimestamp(workflowData.completedAt)}
            </span>
          )}
        </div>
        <div className="ml-auto flex items-center">
          {showHistory && (
            <button 
              onClick={toggleHistory} 
              className="p-1 text-gray-500 hover:text-blue-500 mr-1"
              title={isHistoryExpanded ? "Hide history" : "Show history"}
            >
              <FiInfo className="text-gray-500" />
            </button>
          )}
          {showRefresh && (
            <button
              onClick={handleRefresh}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Refresh workflow status"
            >
              <FiRefreshCw className={loading ? "text-blue-500 animate-spin" : "text-gray-500"} />
            </button>
          )}
        </div>
      </div>
      
      {/* History section */}
      {showHistory && isHistoryExpanded && (
        <div className="mt-3 border-t pt-2">
          <h4 className="text-sm font-medium mb-2">History</h4>
          
          {history.length === 0 ? (
            <p className="text-sm text-gray-500 py-2">No history available</p>
          ) : (
            <div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {history.map((item, index) => (
                  <div key={item.id || index} className="text-sm border-l-2 pl-2 py-1" 
                       style={{ borderColor: item.status === 'success' ? '#10B981' : 
                                           item.status === 'error' ? '#EF4444' : 
                                           item.status === 'in_progress' ? '#3B82F6' : '#F59E0B' }}>
                    <div className="flex items-center">
                      {getStatusIcon(item)}
                      <span className="ml-2 font-medium">{formatTimestamp(item.timestamp)}</span>
                    </div>
                    <div className="ml-6 text-gray-600">{getStatusText(item)}</div>
                    {item.additionalData && (
                      <div className="ml-6 text-xs text-gray-500 mt-1">
                        Additional data: {JSON.stringify(item.additionalData)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Pagination controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-3 text-sm">
                  <button 
                    onClick={handlePrevPage} 
                    disabled={!pagination.hasPreviousPage}
                    className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button 
                    onClick={handleNextPage} 
                    disabled={!pagination.hasNextPage}
                    className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkflowStatus;