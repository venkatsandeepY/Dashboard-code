// Batch Status Service - API integration for batch status data
// Handles all API calls and data processing for batch status functionality

const API_BASE_URL = 'http://localhost:8080/api/v1';

/**
 * Fetch overall batch status from the API
 * @returns {Promise<Object>} API response with batch status data
 */
export const fetchOverallStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/overallstatus`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching overall status:', error);
    // Throw a more descriptive error message
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the API server. Please ensure the backend service is running at http://localhost:8080');
    }
    throw new Error(`API Error: ${error.message}`);
  }
};

/**
 * Process API data to match component structure
 * @param {Object} apiData - Raw API response
 * @param {Array} environmentOrder - Fixed order of environments
 * @returns {Array} Processed data for component consumption
 */
export const processApiData = (apiData, environmentOrder) => {
  // Create a map of environments from API data
  const envMap = {};
  if (apiData.batchDetails) {
    apiData.batchDetails.forEach(envData => {
      envMap[envData.environment] = envData.overallBatchStatus || [];
    });
  }

  // Create processed data for all environments in fixed order
  return environmentOrder.map(env => ({
    environment: env,
    batches: envMap[env] || [],
    hasData: !!(envMap[env] && envMap[env].length > 0)
  }));
};

/**
 * Get status color classes for UI styling
 * @param {string} status - Status value
 * @returns {string} CSS classes for status styling
 */
export const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'COMPLETED': return 'text-green-600 bg-green-50 border-green-200';
    case 'INPROGRESS': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'NOTSTARTED': return 'text-gray-600 bg-gray-50 border-gray-200';
    case 'FAILED': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

/**
 * Get progress bar color based on status
 * @param {string} status - Status value
 * @returns {string} CSS class for progress bar color
 */
export const getProgressColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'COMPLETED': return 'bg-green-500';
    case 'INPROGRESS': return 'bg-yellow-500';
    case 'NOTSTARTED': return 'bg-gray-300';
    case 'FAILED': return 'bg-red-500';
    default: return 'bg-gray-300';
  }
};

/**
 * Get phase status icon
 * @param {string} status - Phase status
 * @returns {string} Emoji icon for status
 */
export const getPhaseStatusIcon = (status) => {
  switch (status?.toUpperCase()) {
    case 'COMPLETED': return '✅';
    case 'INPROGRESS': return '🔄';
    case 'NOTSTARTED': return '⏳';
    case 'FAILED': return '❌';
    default: return '⏳';
  }
};

/**
 * Format date and time for display
 * @param {Date} date - Date object
 * @returns {Object} Formatted date and time strings
 */
export const formatDateTime = (date) => {
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });
  
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  
  return { date: dateStr, time: timeStr };
};

/**
 * Batch Status Service class for managing API calls and state
 */
export class BatchStatusService {
  constructor() {
    this.refreshInterval = null;
    this.isRefreshing = false;
  }

  /**
   * Start auto-refresh with specified interval
   * @param {Function} callback - Function to call on each refresh
   * @param {number} intervalMs - Refresh interval in milliseconds (default: 60000)
   */
  startAutoRefresh(callback, intervalMs = 60000) {
    this.stopAutoRefresh(); // Clear any existing interval
    
    this.refreshInterval = setInterval(async () => {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        try {
          await callback(true); // Pass true to indicate auto-refresh
        } catch (error) {
          console.error('Auto-refresh failed:', error);
        } finally {
          this.isRefreshing = false;
        }
      }
    }, intervalMs);
  }

  /**
   * Stop auto-refresh
   */
  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  /**
   * Load batch data with error handling
   * @param {Function} setters - Object containing state setter functions
   * @param {Array} environmentOrder - Fixed order of environments
   * @param {boolean} isAutoRefresh - Whether this is an auto-refresh call
   */
  async loadBatchData(setters, environmentOrder, isAutoRefresh = false) {
    const { setBatchData, setLoading, setRefreshing, setError, setLastRefresh, setExpandedBatch } = setters;

    try {
      if (!isAutoRefresh) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);

      const data = await fetchOverallStatus();
      
      // Process the API data to match component structure
      const processedData = processApiData(data, environmentOrder);
      setBatchData(processedData);
      setLastRefresh(data.lastRefresh || new Date().toLocaleString());
      
      // Clear any open dropdowns on refresh
      setExpandedBatch(null);
    } catch (error) {
      console.error('Error loading batch data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }
}

// Export a singleton instance
export const batchStatusService = new BatchStatusService();