const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data for batch status
const generateSampleData = () => {
  const environments = ['ASYS', 'TSYS', 'MST0', 'OSYS', 'ECT0', 'QSYS', 'VST0'];
  const batchTypes = ['CARD', 'BANK', 'MAINTENANCE', 'ORDER', 'PAYMENT', 'REPORT'];
  const statuses = ['COMPLETED', 'INPROGRESS', 'NOTSTARTED', 'FAILED'];
  const phases = ['PHASE1', 'PHASE2', 'PHASE3', 'PHASE4'];

  const data = environments.map(env => {
    const batches = batchTypes.map(batchType => {
      const batchPhases = phases.map(phase => {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const completionPercentage = status === 'COMPLETED' ? 100 : 
                                   status === 'INPROGRESS' ? Math.floor(Math.random() * 99) + 1 :
                                   status === 'FAILED' ? Math.floor(Math.random() * 50) : 0;
        
        return {
          phaseName: phase,
          status: status,
          completionPercentage: completionPercentage,
          startTime: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          endTime: status === 'COMPLETED' ? new Date().toISOString() : null
        };
      });

      return {
        batchName: batchType,
        phases: batchPhases
      };
    });

    return {
      environmentName: env,
      batches: batches
    };
  });

  return data;
};

// API endpoint for overall status
app.get('/api/v1/overallstatus', (req, res) => {
  console.log('API request received for /api/v1/overallstatus');
  
  // Simulate API delay
  setTimeout(() => {
    const data = generateSampleData();
    res.json(data);
  }, 500);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Dummy backend server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/api/v1/overallstatus`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Server shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Server shutting down gracefully...');
  process.exit(0);
});