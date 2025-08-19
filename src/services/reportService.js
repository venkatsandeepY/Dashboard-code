// Report Service - Handles all report generation API calls

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Simulate API delay for realistic UX
const simulateDelay = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));

// Mock report generation - Replace with actual API call
export const generateReport = async (reportData) => {
  try {
    // Simulate network delay
    await simulateDelay(2000);

    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/reports/generate`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   },
    //   body: JSON.stringify(reportData)
    // });

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }

    // const result = await response.json();
    // return result;

    // Mock successful response
    const mockResponse = {
      success: true,
      reportId: `RPT-${Date.now()}`,
      fileName: `${reportData.tab}-${reportData.environment}-${reportData.type}-${new Date().toISOString().split('T')[0]}.xlsx`,
      downloadUrl: `/downloads/reports/${reportData.tab}-${reportData.environment}-${reportData.type}.xlsx`,
      generatedAt: new Date().toISOString(),
      recordCount: Math.floor(Math.random() * 10000) + 100,
      fileSize: '2.4 MB'
    };

    // Simulate random errors for testing (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Report generation service is temporarily unavailable. Please try again later.');
    }

    // Simulate file download
    simulateFileDownload(mockResponse.fileName);

    return mockResponse;

  } catch (error) {
    console.error('Report generation error:', error);
    
    // Handle different types of errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the report service. Please check your connection and try again.');
    }
    
    if (error.message.includes('401')) {
      throw new Error('Authentication error: Please log in again to generate reports.');
    }
    
    if (error.message.includes('403')) {
      throw new Error('Permission error: You do not have access to generate this type of report.');
    }
    
    if (error.message.includes('500')) {
      throw new Error('Server error: The report service is experiencing issues. Please try again later.');
    }

    // Re-throw the error with original message if it's already user-friendly
    throw error;
  }
};

// Simulate file download
const simulateFileDownload = (fileName) => {
  // Create a mock blob for demonstration
  const mockData = 'Report data would be here...';
  const blob = new Blob([mockData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Create download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Get available report types for a specific tab
export const getReportTypes = async (tabId) => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/reports/types/${tabId}`);
    // return response.json();

    // Mock data - this would come from the backend
    const reportTypes = {
      'sla-reports': [
        { value: 'performance', label: 'Performance Report', description: 'System performance metrics and SLA compliance' },
        { value: 'availability', label: 'Availability Report', description: 'System uptime and availability statistics' },
        { value: 'response-time', label: 'Response Time Report', description: 'API and system response time analysis' }
      ],
      'snow-incidents': [
        { value: 'open', label: 'Open Incidents', description: 'Currently active incidents in ServiceNow' },
        { value: 'resolved', label: 'Resolved Incidents', description: 'Recently resolved incidents and resolution times' },
        { value: 'critical', label: 'Critical Incidents', description: 'High priority and critical incidents' }
      ],
      'vits': [
        { value: 'transaction', label: 'Transaction Report', description: 'Transaction volume and success rates' },
        { value: 'volume', label: 'Volume Report', description: 'Data processing volumes and trends' },
        { value: 'error', label: 'Error Report', description: 'Error rates and failure analysis' }
      ],
      'admin-tools': [
        { value: 'user-activity', label: 'User Activity', description: 'User login and activity patterns' },
        { value: 'system-health', label: 'System Health', description: 'Overall system health and performance' },
        { value: 'audit', label: 'Audit Report', description: 'Security and compliance audit trails' }
      ]
    };

    return reportTypes[tabId] || [];
  } catch (error) {
    console.error('Error fetching report types:', error);
    throw new Error('Failed to load report types. Please refresh the page and try again.');
  }
};

// Get available environments
export const getEnvironments = async () => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/environments`);
    // return response.json();

    // Mock data
    return [
      { value: 'ASYS', label: 'ASYS - Production', status: 'active' },
      { value: 'TSYS', label: 'TSYS - Test', status: 'active' },
      { value: 'MST0', label: 'MST0 - Master', status: 'active' },
      { value: 'OSYS', label: 'OSYS - Operations', status: 'active' },
      { value: 'ECT0', label: 'ECT0 - E-Commerce', status: 'active' },
      { value: 'QSYS', label: 'QSYS - Quality', status: 'active' },
      { value: 'VST0', label: 'VST0 - Validation', status: 'maintenance' }
    ];
  } catch (error) {
    console.error('Error fetching environments:', error);
    throw new Error('Failed to load environments. Please refresh the page and try again.');
  }
};

// Validate report parameters
export const validateReportParams = (params) => {
  const errors = {};

  if (!params.environment) {
    errors.environment = 'Environment is required';
  }

  if (!params.type) {
    errors.type = 'Report type is required';
  }

  if (!params.fromDate) {
    errors.fromDate = 'From date is required';
  }

  if (!params.toDate) {
    errors.toDate = 'To date is required';
  }

  if (params.fromDate && params.toDate) {
    const fromDate = new Date(params.fromDate);
    const toDate = new Date(params.toDate);
    
    if (fromDate > toDate) {
      errors.toDate = 'To date must be after from date';
    }

    // Check if date range is too large (more than 1 year)
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    if (toDate - fromDate > oneYear) {
      errors.toDate = 'Date range cannot exceed 1 year';
    }

    const today = new Date();
    if (fromDate > today) {
      errors.fromDate = 'From date cannot be in the future';
    }

    if (toDate > today) {
      errors.toDate = 'To date cannot be in the future';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};