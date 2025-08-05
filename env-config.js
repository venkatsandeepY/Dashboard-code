// Environment configuration
const config = {
  development: {
    API_URL: 'http://localhost:3001/api',
    DEBUG: true,
    LOG_LEVEL: 'debug',
  },
  production: {
    API_URL: process.env.VITE_API_URL || 'https://api.production.com',
    DEBUG: false,
    LOG_LEVEL: 'error',
  },
  test: {
    API_URL: 'http://localhost:3001/api',
    DEBUG: true,
    LOG_LEVEL: 'warn',
  },
};

const environment = process.env.NODE_ENV || 'development';

export default config[environment];