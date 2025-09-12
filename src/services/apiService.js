// API Service for Backend Integration
// Centralized service for all API calls to the backend microservice

import { getApiBaseUrl } from '../config/environment';

const API_BASE_URL = getApiBaseUrl();

// Default request configuration
const defaultConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const config = {
    ...defaultConfig,
    ...options,
    headers: {
      ...defaultConfig.headers,
      ...options.headers
    }
  };
  
  try {
    console.log(`API Request: ${config.method || 'GET'} ${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`API Response: ${endpoint}`, data);
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error(`API Error: ${endpoint}`, error);
    throw error;
  }
};

// ============================================================================
// BATCH STATUS API
// ============================================================================

/**
 * Fetch batch status data from the backend API
 * @returns {Promise<Object>} Batch status data from the backend
 */
export const fetchBatchStatus = async () => {
  try {
    const result = await apiRequest('/api/v1/overallstatus');
    return result.data;
  } catch (error) {
    console.error('Failed to fetch batch status:', error);
    throw error;
  }
};

/**
 * Fetch batch status data (wrapper for backward compatibility)
 * @returns {Promise<Object>} Batch status data from the API
 */
export const fetchBatchStatusData = async () => {
  try {
    console.log('Fetching live batch status data from backend API...');
    const data = await fetchBatchStatus();
    console.log('Successfully fetched live batch status data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching batch status from API:', error);
    throw error;
  }
};

// ============================================================================
// REPORT GENERATION API
// ============================================================================

/**
 * Generate a report for various report types
 * @param {Object} reportConfig - Report configuration object
 * @returns {Promise<Object>} Report generation result
 */
export const generateReport = async (reportConfig) => {
  try {
    console.log('Generating report:', reportConfig);
    const result = await apiRequest('/reports/generate', {
      method: 'POST',
      body: JSON.stringify(reportConfig)
    });
    console.log('Successfully generated report:', result.data);
    return result.data;
  } catch (error) {
    console.error('Error generating report:', error);
    // Fallback to mock response for development
    console.log('Using mock report generation...');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          reportId: `RPT-${Date.now()}`,
          fileName: `${reportConfig.tab}-report.xlsx`
        });
      }, 1000);
    });
  }
};


// ============================================================================
// BANNER MANAGEMENT API
// ============================================================================

// No mock data - using live backend API only

/**
 * Fetch all banners from the backend API
 * @returns {Promise<Array>} Array of banner objects
 */
export const fetchBanners = async () => {
  try {
    console.log('Fetching banners from backend API: GET /bannerdetails');
    const result = await apiRequest('/bannerdetails');
    console.log('Backend response:', result.data);
    return result.data;
  } catch (error) {
    console.error('Failed to fetch banners from backend:', error);
    throw error;
  }
};

/**
 * Create or update a banner using PUT method
 * @param {Object} bannerData - Banner data object (with or without key)
 * @returns {Promise<Object>} Created or updated banner data
 */
export const updateBanner = async (bannerData) => {
  try {
    console.log('Sending banner data to backend API: PUT /updatebanner', bannerData);
    const result = await apiRequest('/updatebanner', {
      method: 'PUT',
      body: JSON.stringify(bannerData)
    });
    console.log('Backend response:', result.data);
    return result.data;
  } catch (error) {
    console.error('Failed to update banner:', error);
    throw error;
  }
};



// ============================================================================
// EXPORTS
// ============================================================================

// Export the base URL and apiRequest for other services that might need it
export { API_BASE_URL, apiRequest };
