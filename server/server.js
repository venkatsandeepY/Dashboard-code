const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Sample data matching the API schema
const sampleData = {
  "lastRefresh": "JAN-09-2025 14:30",
  "batchDetails": [
    {
      "environment": "ASYS",
      "overallBatchStatus": [
        {
          "batchId": "A_20250109_JAN_CRD",
          "batchType": "CARD",
          "status": "COMPLETED",
          "completion": "100",
          "phase": {
            "PRERUN": { "status": "COMPLETED" },
            "MAINRUN": { "status": "COMPLETED" },
            "POSTRUN": { "status": "COMPLETED" }
          }
        },
        {
          "batchId": "A_20250109_JAN_BNK",
          "batchType": "BANK",
          "status": "INPROGRESS",
          "completion": "75",
          "phase": {
            "PRERUN": { "status": "COMPLETED" },
            "MAINRUN": { "status": "INPROGRESS" },
            "POSTRUN": { "status": "NOTSTARTED" }
          }
        }
      ]
    },
    {
      "environment": "TSYS",
      "overallBatchStatus": [
        {
          "batchId": "T_20250109_JAN_CRD",
          "batchType": "CARD",
          "status": "INPROGRESS",
          "completion": "45",
          "phase": {
            "ER": { "status": "COMPLETED" },
            "CPB": { "status": "INPROGRESS" },
            "VALIDATION": { "status": "NOTSTARTED" }
          }
        }
      ]
    },
    {
      "environment": "MST0",
      "overallBatchStatus": [
        {
          "batchId": "M_20250109_JAN_MAINT",
          "batchType": "MAINTENANCE",
          "status": "NOTSTARTED",
          "completion": "0",
          "phase": {
            "CLEANUP": { "status": "NOTSTARTED" },
            "BACKUP": { "status": "NOTSTARTED" }
          }
        }
      ]
    },
    {
      "environment": "OSYS",
      "overallBatchStatus": [
        {
          "batchId": "O_20250109_JAN_ORD",
          "batchType": "ORDER",
          "status": "COMPLETED",
          "completion": "100",
          "phase": {
            "PROCESSING": { "status": "COMPLETED" },
            "RECONCILIATION": { "status": "COMPLETED" }
          }
        },
        {
          "batchId": "O_20250109_JAN_INV",
          "batchType": "INVENTORY",
          "status": "FAILED",
          "completion": "25",
          "phase": {
            "SYNC": { "status": "FAILED" },
            "UPDATE": { "status": "NOTSTARTED" }
          }
        }
      ]
    },
    {
      "environment": "ECT0",
      "overallBatchStatus": [
        {
          "batchId": "E_20250109_JAN_ECOM",
          "batchType": "ECOMMERCE",
          "status": "INPROGRESS",
          "completion": "60",
          "phase": {
            "CATALOG": { "status": "COMPLETED" },
            "PRICING": { "status": "INPROGRESS" },
            "INVENTORY": { "status": "NOTSTARTED" }
          }
        }
      ]
    },
    {
      "environment": "QSYS",
      "overallBatchStatus": [
        {
          "batchId": "Q_20250109_JAN_QA",
          "batchType": "QUALITY",
          "status": "INPROGRESS",
          "completion": "80",
          "phase": {
            "TESTING": { "status": "COMPLETED" },
            "VALIDATION": { "status": "INPROGRESS" },
            "REPORTING": { "status": "NOTSTARTED" }
          }
        }
      ]
    },
    {
      "environment": "VST0",
      "overallBatchStatus": [
        {
          "batchId": "V_20250109_JAN_VAL",
          "batchType": "VALIDATION",
          "status": "NOTSTARTED",
          "completion": "0",
          "phase": {
            "SETUP": { "status": "NOTSTARTED" },
            "EXECUTION": { "status": "NOTSTARTED" },
            "CLEANUP": { "status": "NOTSTARTED" }
          }
        }
      ]
    }
  ]
};

// API endpoint
app.get('/api/v1/overallstatus', (req, res) => {
  console.log('📡 API Request received at:', new Date().toISOString());
  
  // Simulate some processing time
  setTimeout(() => {
    // Update lastRefresh to current time
    const now = new Date();
    const formattedTime = now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    }).toUpperCase().replace(/,/g, '') + ' ' + 
    now.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const responseData = {
      ...sampleData,
      lastRefresh: formattedTime
    };
    
    console.log('✅ Sending response with', responseData.batchDetails.length, 'environments');
    res.json(responseData);
  }, 500); // 500ms delay to simulate real API
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Dummy Backend Server Started!');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🔗 API Endpoint: http://localhost:${PORT}/api/v1/overallstatus`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('📊 Sample Data Available:');
  sampleData.batchDetails.forEach(env => {
    console.log(`   • ${env.environment}: ${env.overallBatchStatus.length} batch(es)`);
  });
  console.log('');
  console.log('🔄 Server will auto-update timestamps on each request');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});