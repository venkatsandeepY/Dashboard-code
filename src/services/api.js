// API service for backend communication
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Dashboard API endpoints
export const dashboardAPI = {
  // Get dashboard overview data
  getOverview: () => apiRequest('/dashboard/overview'),
  
  // Get system metrics
  getMetrics: () => apiRequest('/dashboard/metrics'),
  
  // Get recent activities
  getRecentActivities: () => apiRequest('/dashboard/activities'),
  
  // Get performance data
  getPerformanceData: (timeRange = '24h') => 
    apiRequest(`/dashboard/performance?range=${timeRange}`),
};

// Status API endpoints
export const statusAPI = {
  // Get system status
  getSystemStatus: () => apiRequest('/status/system'),
  
  // Get service health
  getServiceHealth: () => apiRequest('/status/services'),
  
  // Get uptime statistics
  getUptimeStats: () => apiRequest('/status/uptime'),
  
  // Get alerts and notifications
  getAlerts: () => apiRequest('/status/alerts'),
};

// Reports API endpoints
export const reportsAPI = {
  // Get available reports
  getReportsList: () => apiRequest('/reports'),
  
  // Get specific report data
  getReport: (reportId) => apiRequest(`/reports/${reportId}`),
  
  // Generate new report
  generateReport: (reportConfig) => 
    apiRequest('/reports/generate', {
      method: 'POST',
      body: JSON.stringify(reportConfig),
    }),
  
  // Download report
  downloadReport: (reportId, format = 'pdf') => 
    apiRequest(`/reports/${reportId}/download?format=${format}`),
};

// Feedback API endpoints
export const feedbackAPI = {
  // Get feedback list
  getFeedbackList: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/feedback${queryParams ? `?${queryParams}` : ''}`);
  },
  
  // Submit new feedback
  submitFeedback: (feedbackData) => 
    apiRequest('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    }),
  
  // Update feedback status
  updateFeedbackStatus: (feedbackId, status) => 
    apiRequest(`/feedback/${feedbackId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  
  // Get feedback analytics
  getFeedbackAnalytics: () => apiRequest('/feedback/analytics'),
};

// Mock data for development (remove when backend is ready)
export const mockData = {
  dashboard: {
    overview: {
      totalUsers: 1250,
      activeServices: 12,
      systemUptime: '99.9%',
      lastUpdated: new Date().toISOString(),
    },
    metrics: [
      { name: 'CPU Usage', value: 45, unit: '%', status: 'normal' },
      { name: 'Memory Usage', value: 67, unit: '%', status: 'warning' },
      { name: 'Disk Usage', value: 23, unit: '%', status: 'normal' },
      { name: 'Network I/O', value: 156, unit: 'MB/s', status: 'normal' },
    ],
    activities: [
      { id: 1, action: 'User login', user: 'john.doe', timestamp: '2024-01-15T10:30:00Z' },
      { id: 2, action: 'Report generated', user: 'admin', timestamp: '2024-01-15T10:25:00Z' },
      { id: 3, action: 'System backup', user: 'system', timestamp: '2024-01-15T10:00:00Z' },
    ],
  },
  status: {
    system: { status: 'operational', uptime: '99.9%', lastCheck: new Date().toISOString() },
    services: [
      { name: 'Database', status: 'operational', responseTime: '45ms' },
      { name: 'API Gateway', status: 'operational', responseTime: '23ms' },
      { name: 'Authentication', status: 'degraded', responseTime: '156ms' },
      { name: 'File Storage', status: 'operational', responseTime: '67ms' },
    ],
    alerts: [
      { id: 1, type: 'warning', message: 'High memory usage detected', timestamp: '2024-01-15T10:30:00Z' },
      { id: 2, type: 'info', message: 'Scheduled maintenance completed', timestamp: '2024-01-15T09:00:00Z' },
    ],
  },
  reports: [
    { id: 1, name: 'Monthly Performance Report', type: 'performance', createdAt: '2024-01-15T08:00:00Z', status: 'ready' },
    { id: 2, name: 'User Activity Summary', type: 'activity', createdAt: '2024-01-14T16:30:00Z', status: 'ready' },
    { id: 3, name: 'System Health Check', type: 'health', createdAt: '2024-01-14T12:00:00Z', status: 'generating' },
  ],
  feedback: [
    { id: 1, subject: 'Dashboard Performance', message: 'The dashboard loads slowly', status: 'open', priority: 'medium', createdAt: '2024-01-15T09:30:00Z' },
    { id: 2, subject: 'Feature Request', message: 'Add dark mode support', status: 'in-progress', priority: 'low', createdAt: '2024-01-14T14:20:00Z' },
    { id: 3, subject: 'Bug Report', message: 'Export function not working', status: 'resolved', priority: 'high', createdAt: '2024-01-13T11:15:00Z' },
  ],
};