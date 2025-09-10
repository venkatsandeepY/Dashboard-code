// API Service for Backend Integration
// Centralized service for all API calls to the backend microservice

import { getApiBaseUrl, getRequestTimeout } from '../config/environment';

const API_BASE_URL = getApiBaseUrl();

// Default request configuration
const defaultConfig = {
  timeout: getRequestTimeout(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Utility function to create abort signal with timeout
const createTimeoutSignal = (timeoutMs) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  return { signal: controller.signal, cleanup: () => clearTimeout(timeoutId) };
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

  const { signal, cleanup } = createTimeoutSignal(config.timeout);
  
  try {
    console.log(`🌐 API Request: ${config.method || 'GET'} ${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...config,
      signal
    });

    cleanup();

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ API Response: ${endpoint}`, data);
    
    return {
      success: true,
      data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    cleanup();
    
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${config.timeout}ms`);
    }
    
    console.error(`❌ API Error: ${endpoint}`, error);
    throw error;
  }
};

// Batch Status API - Live Data Only
export const fetchBatchStatus = async () => {
  try {
    const result = await apiRequest('/api/v1/overallstatus');
    return {
      ...result.data,
      lastRefresh: result.timestamp
    };
  } catch (error) {
    console.error('Failed to fetch batch status:', error);
    throw error;
  }
};

// Health Check API (optional - for monitoring API availability)
export const checkApiHealth = async () => {
  try {
    const result = await apiRequest('/health', { timeout: 5000 });
    return result;
  } catch (error) {
    console.error('API health check failed:', error);
    return { success: false, error: error.message };
  }
};

// Export the base URL for other services that might need it
export { API_BASE_URL };
