// API Data Provider - Fetches from /api/sla and maps response → ReportRow[]
import { ReportRow } from '../types/slaTypes';

export const apiProvider = {
  async getData(days = 30): Promise<ReportRow[]> {
    console.log('🌐 API Provider: Fetching SLA data from backend...');
    
    try {
      const response = await fetch(`/api/sla?days=${days}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers when needed
          // 'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();
      
      // Map API response to ReportRow interface
      const mappedData: ReportRow[] = rawData.map((item: any) => ({
        id: item.id || `${item.env}-${item.type}-${item.runDate}`,
        runDate: new Date(item.runDate),
        type: item.type as "BANK" | "CARD",
        lrd: new Date(item.lrd),
        env: item.env,
        phase: item.phase,
        startTime: new Date(item.startTime),
        endTime: new Date(item.endTime),
        durationHrs: parseFloat(item.durationHrs),
        status: item.status as "COMPLETED" | "FAILED" | "PENDING"
      }));

      console.log(`✅ API Provider: Fetched ${mappedData.length} SLA records`);
      return mappedData;
      
    } catch (error) {
      console.error('❌ API Provider: Error fetching data:', error);
      throw new Error(`Failed to fetch SLA data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};