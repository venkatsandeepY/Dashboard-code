import { fetchBatchStatus } from '../services/apiService';
import { shouldUseMockData } from '../config/environment';

// Real-time API service for batch status
export const fetchBatchStatusData = async () => {
  // Check if we should use mock data
  if (shouldUseMockData()) {
    console.log('🔧 Using mock data (configured to use mock data)');
    return mockBatchStatusData;
  }

  try {
    console.log('🌐 Fetching real-time data from backend API...');
    const data = await fetchBatchStatus();
    console.log('✅ Successfully fetched real-time data:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching batch status from API:', error);
    
    // Return structured error response with fallback data
    return {
      error: true,
      message: error.message || 'Failed to fetch batch status from backend',
      lastRefresh: new Date().toISOString(),
      dataSource: 'FALLBACK',
      batchDetails: mockBatchStatusData.batchDetails
    };
  }
};

// Mock data for development/fallback
export const mockBatchStatusData = {
  "lastRefresh": "SEP-05-2025 10:00",
  "batchDetails": [
    {
      "environment": "ASYS",
      "overallBatchStatus": [
        {
          "batchId": "A_20250904_SEP_CRD",
          "batchType": "CARD",
          "runDate": "SEP-04-25",
          "lrd": "OCT-01-25",
          "startTime": "SEP-04-25 19:40",
          "endTime": "",
          "status": "INPROGRESS",
          "completion": "95",
          "daysRun": null,
          "days": "2912560",
          "hours": "16",
          "mins": "32",
          "latest": "2025-09-04 00:00:00",
          "eta": "SEP-05-25 10:02",
          "phase": {
            "POSTRUN": { "status": "COMPLETED" },
            "CPB": { "status": "COMPLETED" },
            "FDR": { "status": "COMPLETED" },
            "PRECPB": { "status": "COMPLETED" },
            "SOC": { "status": "COMPLETED" },
            "END": { "status": "COMPLETED" },
            "ER": { "status": "INPROGRESS" },
            "CFR": { "status": "COMPLETED" },
            "POSTCPB": { "status": "COMPLETED" }
          },
          "nextLRD": null
        },
        {
          "batchId": "A_20250904_SEP_BNK",
          "batchType": "BANK",
          "runDate": "SEP-04-25",
          "lrd": "OCT-01-25",
          "startTime": "SEP-04-25 20:41",
          "endTime": "SEP-05-25 10:00",
          "status": "COMPLETED",
          "completion": "100",
          "daysRun": "0-1-5",
          "days": "0",
          "hours": "13",
          "mins": "19",
          "latest": "2025-09-04 00:00:00",
          "eta": "",
          "phase": {
            "HBSCOD": { "status": "COMPLETED" },
            "HBKCOP": { "status": "COMPLETED" },
            "HBKOD": { "status": "COMPLETED" },
            "CDS": { "status": "COMPLETED" },
            "DEFBOO": { "status": "COMPLETED" },
            "ECS": { "status": "COMPLETED" },
            "INTRA": { "status": "COMPLETED" },
            "DM": { "status": "COMPLETED" },
            "PREPPAY": { "status": "COMPLETED" },
            "END": { "status": "COMPLETED" },
            "POSTBOD": { "status": "COMPLETED" },
            "BTPRNT": { "status": "COMPLETED" }
          },
          "nextLRD": null
        }
      ]
    },
    {
      "environment": "MSTO",
      "overallBatchStatus": [
        {
          "batchId": "M_20250904_OCT_BNK",
          "batchType": "BANK",
          "runDate": "SEP-04-25",
          "lrd": "SEP-07-25",
          "startTime": "SEP-04-25 04:03",
          "endTime": "",
          "status": "INPROGRESS",
          "completion": "97",
          "daysRun": null,
          "days": "2912561",
          "hours": "8",
          "mins": "58",
          "latest": "2025-09-04 00:00:00",
          "eta": "",
          "phase": {
            "HBSCOD": { "status": "COMPLETED" },
            "HBKCOP": { "status": "COMPLETED" },
            "HBKOD": { "status": "COMPLETED" },
            "CDS": { "status": "NOTSTARTED" },
            "DEFBOOD": { "status": "COMPLETED" },
            "INTRA": { "status": "COMPLETED" },
            "DM": { "status": "COMPLETED" },
            "PREPPAY": { "status": "COMPLETED" },
            "POSTBOD": { "status": "COMPLETED" }
          },
          "nextLRD": null
        }
      ]
    },
    {
      "environment": "ECT0",
      "overallBatchStatus": [
        {
          "batchId": "E_20250904_SEP_CRD",
          "batchType": "CARD",
          "runDate": "SEP-04-25",
          "lrd": "SEP-04-25",
          "startTime": "SEP-04-25 20:15",
          "endTime": "SEP-04-25 20:45",
          "status": "COMPLETED",
          "completion": "100",
          "daysRun": "0-1-0",
          "days": "0",
          "hours": "0",
          "mins": "30",
          "latest": "2025-09-04 00:00:00",
          "eta": "-",
          "phase": {},
          "nextLRD": null
        }
      ]
    },
    {
      "environment": "TSYS",
      "overallBatchStatus": [
        {
          "batchId": "O_20250904_OCT_CRD",
          "batchType": "CARD",
          "runDate": "SEP-04-25",
          "lrd": "JAN-13-26",
          "startTime": "SEP-04-25 20:56",
          "endTime": "SEP-05-25 01:18",
          "status": "COMPLETED",
          "completion": "100",
          "daysRun": null,
          "days": "2",
          "hours": "2",
          "mins": "22",
          "latest": "2025-09-04 00:00:00",
          "eta": "",
          "phase": {
            "POSTRUN": { "status": "COMPLETED" },
            "CPB": { "status": "COMPLETED" },
            "FDR": { "status": "COMPLETED" },
            "PRECPB": { "status": "COMPLETED" },
            "SOC": { "status": "COMPLETED" },
            "END": { "status": "COMPLETED" },
            "ER": { "status": "COMPLETED" }
          },
          "nextLRD": null
        }
      ]
    },
    {
      "environment": "QSYS",
      "overallBatchStatus": []
    },
    {
      "environment": "VSTO",
      "overallBatchStatus": []
    },
    {
      "environment": "OSYS",
      "overallBatchStatus": []
    }
  ]
};