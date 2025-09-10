// Batch Status Service
// Handles batch status data fetching from the backend API

import { fetchBatchStatus } from './apiService';

/**
 * Fetch batch status data from the backend API
 * @returns {Promise<Object>} Batch status data from the API
 * @throws {Error} When API call fails
 */
export const fetchBatchStatusData = async () => {
  try {
    console.log('🌐 Fetching live batch status data from backend API...');
    const data = await fetchBatchStatus();
    console.log('✅ Successfully fetched live batch status data:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching batch status from API:', error);
    throw error; // Re-throw to let the calling component handle the error
  }
};


// Export default function for backward compatibility
export default fetchBatchStatusData;
