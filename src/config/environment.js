// Environment Configuration
// Centralized configuration for different environments and API endpoints

const environments = {
  development: {
    API_BASE_URL: 'http://localhost:3001', // Dummy backend for development
    USE_MOCK_DATA: false, // Set to true to use mock data instead of API
    AUTO_REFRESH_INTERVAL: 30000, // 30 seconds
    REQUEST_TIMEOUT: 10000, // 10 seconds
  },
  development_real: {
    API_BASE_URL: 'https://etems-backend-dev-dev-250904-1046.apps-useast1-apps-dev-2.ocpdev.us-east-1.ac.discoverfinancial.com',
    USE_MOCK_DATA: false,
    AUTO_REFRESH_INTERVAL: 30000,
    REQUEST_TIMEOUT: 10000,
  },
  production: {
    API_BASE_URL: 'https://etems-backend-prod.apps-useast1-apps-prod-2.ocpdev.us-east-1.ac.discoverfinancial.com',
    USE_MOCK_DATA: false,
    AUTO_REFRESH_INTERVAL: 30000,
    REQUEST_TIMEOUT: 10000,
  },
  staging: {
    API_BASE_URL: 'https://etems-backend-staging.apps-useast1-apps-staging-2.ocpdev.us-east-1.ac.discoverfinancial.com',
    USE_MOCK_DATA: false,
    AUTO_REFRESH_INTERVAL: 30000,
    REQUEST_TIMEOUT: 10000,
  }
};

// Get current environment from Vite environment variables
const currentEnv = import.meta.env.VITE_APP_ENV || 'development';

// Export current environment configuration
export const config = environments[currentEnv] || environments.development;

// Export all environments for reference
export { environments };

// Helper function to check if we should use mock data
export const shouldUseMockData = () => {
  return import.meta.env.VITE_MOCK_API === 'true' || config.USE_MOCK_DATA;
};

// Helper function to get API base URL
export const getApiBaseUrl = () => {
  return config.API_BASE_URL;
};

// Helper function to get refresh interval
export const getRefreshInterval = () => {
  return config.AUTO_REFRESH_INTERVAL;
};

// Helper function to get request timeout
export const getRequestTimeout = () => {
  return config.REQUEST_TIMEOUT;
};
