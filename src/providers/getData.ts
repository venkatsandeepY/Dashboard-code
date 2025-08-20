// Data Provider Factory - Picks provider based on environment flag
import { ReportRow } from '../types/slaTypes';
import { mockProvider } from './mockProvider';
import { apiProvider } from './apiProvider';

// Factory function that picks provider based on environment
export const getData = async (days = 30): Promise<ReportRow[]> => {
  const useApi = import.meta.env.VITE_USE_API === 'true';
  
  console.log(`🏭 Data Factory: Using ${useApi ? 'API' : 'Mock'} provider`);
  
  if (useApi) {
    return apiProvider.getData(days);
  } else {
    return mockProvider.getData(days);
  }
};

// Export providers for direct use if needed
export { mockProvider, apiProvider };