const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Generate realistic sample data that matches the expected API structure
const generateBatchStatusData = () => {
  const environments = ['ASYS', 'TSYS', 'MST0', 'OSYS', 'ECT0', 'QSYS', 'VST0'];
  const batchTypes = ['CARD', 'BANK'];
  const statuses = ['COMPLETED', 'INPROGRESS', 'NOTSTARTED', 'FAILED'];
  const phaseNames = ['Pre-Processing', 'Main Processing', 'Post-Processing', 'Validation', 'Cleanup'];

  const batchDetails = environments.map(env => {
    // Generate 2-4 batches per environment
    const batchCount = Math.floor(Math.random() * 3) + 2;
    const overallBatchStatus = [];

    for (let i = 0; i < batchCount; i++) {
      const batchType = batchTypes[Math.floor(Math.random() * batchTypes.length)];
      const batchId = `${env}_${batchType}_${String(i + 1).padStart(3, '0')}`;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Generate completion percentage based on status
      let completion;
      switch (status) {
        case 'COMPLETED':
          completion = 100;
          break;
        case 'INPROGRESS':
          completion = Math.floor(Math.random() * 80) + 10; // 10-90%
          break;
        case 'FAILED':
          completion = Math.floor(Math.random() * 50); // 0-50%
          break;
        case 'NOTSTARTED':
        default:
          completion = 0;
          break;
      }

      // Generate phases for this batch
      const phases = {};
      const numPhases = Math.floor(Math.random() * 3) + 2; // 2-4 phases
      
      for (let p = 0; p < numPhases; p++) {
        const phaseName = phaseNames[p % phaseNames.length];
        const phaseStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        phases[phaseName] = {
          status: phaseStatus,
          startTime: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          endTime: phaseStatus === 'COMPLETED' ? new Date().toISOString() : null
        };
      }

      overallBatchStatus.push({
        batchId: batchId,
        batchType: batchType,
        status: status,
        completion: completion,
        startTime: new Date(Date.now() - Math.random() * 7200000).toISOString(),
        endTime: status === 'COMPLETED' ? new Date().toISOString() : null,
        phase: phases
      });
    }

    return {
      environment: env,
      overallBatchStatus: overallBatchStatus
    };
  });

  return {
    lastRefresh: new Date().toLocaleString(),
    batchDetails: batchDetails
  };
};

// API endpoint for overall status
app.get('/api/v1/overallstatus', (req, res) => {
  console.log(`[${new Date().toISOString()}] API request received for /api/v1/overallstatus`);
  
  // Simulate realistic API delay
  setTimeout(() => {
    const data = generateBatchStatusData();
    console.log(`[${new Date().toISOString()}] Sending response with ${data.batchDetails.length} environments`);
    res.json(data);
  }, 300);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ESQM Batch Status API Server',
    version: '1.0.0',
    endpoints: {
      overallStatus: '/api/v1/overallstatus',
      health: '/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 ===============================================');
  console.log(`🚀 ESQM Dummy Backend Server Started Successfully`);
  console.log('🚀 ===============================================');
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`📊 API Endpoint: http://localhost:${PORT}/api/v1/overallstatus`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log('🚀 ===============================================');
  console.log('✅ Ready to serve batch status data!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Server shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Server shutting down gracefully...');
  process.exit(0);
});