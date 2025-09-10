// Environment Configuration
// Centralized configuration for different environments and API endpoints

const environments = {
  development: {
    API_BASE_URL: 'https://etems-backend-dev-dev-250904-1046.apps-useast1-apps-dev-2.ocpdev.us-east-1.ac.discoverfinancial.com',
  },
  development_real: {
    API_BASE_URL: 'https://etems-backend-dev-dev-250904-1046.apps-useast1-apps-dev-2.ocpdev.us-east-1.ac.discoverfinancial.com',
  },
  production: {
    API_BASE_URL: 'https://etems-backend-prod.apps-useast1-apps-prod-2.ocpdev.us-east-1.ac.discoverfinancial.com',
  },
  staging: {
    API_BASE_URL: 'https://etems-backend-staging.apps-useast1-apps-staging-2.ocpdev.us-east-1.ac.discoverfinancial.com',
  }
};

// Get current environment from Vite environment variables
const currentEnv = import.meta.env.VITE_APP_ENV || 'development';

// Export current environment configuration
export const config = environments[currentEnv] || environments.development;

// Export all environments for reference
export { environments };

// Note: Mock data functionality has been removed - only live data is supported

// Helper function to get API base URL
export const getApiBaseUrl = () => {
  return config.API_BASE_URL;
};
