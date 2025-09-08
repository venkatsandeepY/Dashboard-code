// Mock Backend Data for Status Dashboard

export const mockBatchData = [
  {
    id: 1,
    environment: 'ASYS',
    bank: { status: 'Completed', progress: 100 },
    card: { status: 'In Progress', progress: 78 },
    lastRun: new Date('2025-01-09T08:30:00'),
    eta: new Date('2025-01-09T09:15:00'),
    runtime: '45m 32s'
  },
  {
    id: 2,
    environment: 'TSYS',
    bank: { status: 'In Progress', progress: 65 },
    card: { status: 'Completed', progress: 100 },
    lastRun: new Date('2025-01-09T07:45:00'),
    eta: new Date('2025-01-09T09:30:00'),
    runtime: '1h 12m 18s'
  },
  {
    id: 3,
    environment: 'MST0',
    bank: { status: 'Not Started', progress: 0 },
    card: { status: 'Not Started', progress: 0 },
    lastRun: new Date('2025-01-08T23:45:00'),
    eta: new Date('2025-01-09T10:00:00'),
    runtime: '0m 0s'
  },
  {
    id: 4,
    environment: 'OSYS',
    bank: { status: 'Completed', progress: 100 },
    card: { status: 'Completed', progress: 100 },
    lastRun: new Date('2025-01-09T06:15:00'),
    eta: new Date('2025-01-09T08:45:00'),
    runtime: '2h 30m 45s'
  },
  {
    id: 5,
    environment: 'ECT0',
    bank: { status: 'In Progress', progress: 42 },
    card: { status: 'In Progress', progress: 38 },
    lastRun: new Date('2025-01-09T08:00:00'),
    eta: new Date('2025-01-09T10:30:00'),
    runtime: '32m 15s'
  },
  {
    id: 6,
    environment: 'QSYS',
    bank: { status: 'Completed', progress: 100 },
    card: { status: 'In Progress', progress: 85 },
    lastRun: new Date('2025-01-09T07:30:00'),
    eta: new Date('2025-01-09T09:00:00'),
    runtime: '1h 28m 42s'
  },
  {
    id: 7,
    environment: 'VST0',
    bank: { status: 'Not Started', progress: 0 },
    card: { status: 'Not Started', progress: 0 },
    lastRun: new Date('2025-01-08T22:30:00'),
    eta: new Date('2025-01-09T11:00:00'),
    runtime: '0m 0s'
  }
];

export const mockJobsData = {
  'ASYS': [
    { name: 'Daily Processing', status: 'Running', startTime: '08:30 AM', icon: 'Play', color: 'text-blue-600' },
    { name: 'Data Validation', status: 'Completed', startTime: '07:45 AM', icon: 'CheckCircle', color: 'text-green-600' },
    { name: 'Report Generation', status: 'Queued', startTime: '09:00 AM', icon: 'Clock', color: 'text-yellow-600' },
    { name: 'Backup Process', status: 'Failed', startTime: '06:30 AM', icon: 'AlertCircle', color: 'text-red-600' }
  ],
  'TSYS': [
    { name: 'Transaction Processing', status: 'Running', startTime: '07:45 AM', icon: 'Play', color: 'text-blue-600' },
    { name: 'Account Reconciliation', status: 'Completed', startTime: '06:30 AM', icon: 'CheckCircle', color: 'text-green-600' },
    { name: 'Risk Assessment', status: 'Queued', startTime: '09:15 AM', icon: 'Clock', color: 'text-yellow-600' },
    { name: 'Fraud Detection', status: 'Running', startTime: '08:00 AM', icon: 'Play', color: 'text-blue-600' }
  ],
  'MST0': [
    { name: 'System Maintenance', status: 'Queued', startTime: '10:00 AM', icon: 'Clock', color: 'text-yellow-600' },
    { name: 'Database Cleanup', status: 'Queued', startTime: '10:30 AM', icon: 'Clock', color: 'text-yellow-600' },
    { name: 'Log Rotation', status: 'Queued', startTime: '11:00 AM', icon: 'Clock', color: 'text-yellow-600' }
  ],
  'OSYS': [
    { name: 'Order Processing', status: 'Completed', startTime: '06:15 AM', icon: 'CheckCircle', color: 'text-green-600' },
    { name: 'Inventory Update', status: 'Completed', startTime: '05:45 AM', icon: 'CheckCircle', color: 'text-green-600' },
    { name: 'Customer Sync', status: 'Completed', startTime: '05:30 AM', icon: 'CheckCircle', color: 'text-green-600' },
    { name: 'Payment Processing', status: 'Completed', startTime: '06:00 AM', icon: 'CheckCircle', color: 'text-green-600' }
  ],
  'ECT0': [
    { name: 'E-commerce Sync', status: 'Running', startTime: '08:00 AM', icon: 'Play', color: 'text-blue-600' },
    { name: 'Product Catalog Update', status: 'Running', startTime: '07:30 AM', icon: 'Play', color: 'text-blue-600' },
    { name: 'Price Adjustment', status: 'Queued', startTime: '09:30 AM', icon: 'Clock', color: 'text-yellow-600' }
  ],
  'QSYS': [
    { name: 'Quality Check', status: 'Running', startTime: '07:30 AM', icon: 'Play', color: 'text-blue-600' },
    { name: 'Test Automation', status: 'Completed', startTime: '06:45 AM', icon: 'CheckCircle', color: 'text-green-600' },
    { name: 'Performance Monitor', status: 'Running', startTime: '08:15 AM', icon: 'Play', color: 'text-blue-600' },
    { name: 'Security Scan', status: 'Queued', startTime: '09:45 AM', icon: 'Clock', color: 'text-yellow-600' }
  ],
  'VST0': [
    { name: 'Validation Suite', status: 'Queued', startTime: '11:00 AM', icon: 'Clock', color: 'text-yellow-600' },
    { name: 'Data Integrity Check', status: 'Queued', startTime: '11:30 AM', icon: 'Clock', color: 'text-yellow-600' },
    { name: 'Compliance Audit', status: 'Queued', startTime: '12:00 PM', icon: 'Clock', color: 'text-yellow-600' }
  ]
};

export const mockHistoryData = {
  'ASYS': [
    { 
      date: new Date('2025-01-09T08:30:00'), 
      bank: { status: 'Success', duration: '2h 15m', completedAt: new Date('2025-01-09T08:30:00') },
      card: { status: 'Success', duration: '1h 45m', completedAt: new Date('2025-01-09T07:45:00') }
    },
    { 
      date: new Date('2025-01-08T22:30:00'), 
      bank: { status: 'Warning', duration: '2h 30m', completedAt: new Date('2025-01-08T22:15:00') },
      card: { status: 'Success', duration: '1h 20m', completedAt: new Date('2025-01-08T21:30:00') }
    },
    { 
      date: new Date('2025-01-07T20:15:00'), 
      bank: { status: 'Success', duration: '2h 10m', completedAt: new Date('2025-01-07T20:15:00') },
      card: { status: 'Success', duration: '1h 35m', completedAt: new Date('2025-01-07T19:45:00') }
    }
  ],
  'TSYS': [
    { 
      date: new Date('2025-01-09T07:45:00'), 
      bank: { status: 'Success', duration: '2h 05m', completedAt: new Date('2025-01-09T06:30:00') },
      card: { status: 'Success', duration: '1h 12m', completedAt: new Date('2025-01-09T07:45:00') }
    },
    { 
      date: new Date('2025-01-08T21:15:00'), 
      bank: { status: 'Warning', duration: '2h 20m', completedAt: new Date('2025-01-08T21:00:00') },
      card: { status: 'Success', duration: '1h 35m', completedAt: new Date('2025-01-08T20:15:00') }
    },
    { 
      date: new Date('2025-01-07T19:30:00'), 
      bank: { status: 'Success', duration: '2h 15m', completedAt: new Date('2025-01-07T19:30:00') },
      card: { status: 'Success', duration: '1h 25m', completedAt: new Date('2025-01-07T18:45:00') }
    }
  ],
  'MST0': [
    { 
      date: new Date('2025-01-08T23:45:00'), 
      bank: { status: 'Success', duration: '2h 45m', completedAt: new Date('2025-01-08T23:45:00') },
      card: { status: 'Success', duration: '1h 50m', completedAt: new Date('2025-01-08T22:30:00') }
    },
    { 
      date: new Date('2025-01-07T22:15:00'), 
      bank: { status: 'Success', duration: '2h 35m', completedAt: new Date('2025-01-07T22:15:00') },
      card: { status: 'Success', duration: '1h 40m', completedAt: new Date('2025-01-07T21:30:00') }
    }
  ],
  'OSYS': [
    { 
      date: new Date('2025-01-09T06:15:00'), 
      bank: { status: 'Success', duration: '2h 30m', completedAt: new Date('2025-01-09T06:15:00') },
      card: { status: 'Success', duration: '1h 40m', completedAt: new Date('2025-01-09T05:45:00') }
    },
    { 
      date: new Date('2025-01-08T20:30:00'), 
      bank: { status: 'Success', duration: '2h 25m', completedAt: new Date('2025-01-08T20:30:00') },
      card: { status: 'Success', duration: '1h 30m', completedAt: new Date('2025-01-08T19:15:00') }
    }
  ],
  'ECT0': [
    { 
      date: new Date('2025-01-09T08:00:00'), 
      bank: { status: 'Running', duration: '32m', completedAt: new Date('2025-01-09T08:00:00') },
      card: { status: 'Running', duration: '28m', completedAt: new Date('2025-01-09T07:30:00') }
    },
    { 
      date: new Date('2025-01-08T18:45:00'), 
      bank: { status: 'Success', duration: '45m', completedAt: new Date('2025-01-08T18:45:00') },
      card: { status: 'Success', duration: '35m', completedAt: new Date('2025-01-08T18:00:00') }
    }
  ],
  'QSYS': [
    { 
      date: new Date('2025-01-09T07:30:00'), 
      bank: { status: 'Success', duration: '1h 28m', completedAt: new Date('2025-01-09T07:30:00') },
      card: { status: 'Running', duration: '1h 15m', completedAt: new Date('2025-01-09T06:45:00') }
    },
    { 
      date: new Date('2025-01-08T17:30:00'), 
      bank: { status: 'Success', duration: '1h 35m', completedAt: new Date('2025-01-08T17:30:00') },
      card: { status: 'Success', duration: '1h 20m', completedAt: new Date('2025-01-08T16:15:00') }
    }
  ],
  'VST0': [
    { 
      date: new Date('2025-01-08T22:30:00'), 
      bank: { status: 'Success', duration: '3h 15m', completedAt: new Date('2025-01-08T22:30:00') },
      card: { status: 'Success', duration: '2h 45m', completedAt: new Date('2025-01-08T21:15:00') }
    },
    { 
      date: new Date('2025-01-07T20:00:00'), 
      bank: { status: 'Warning', duration: '3h 05m', completedAt: new Date('2025-01-07T20:00:00') },
      card: { status: 'Success', duration: '2h 30m', completedAt: new Date('2025-01-07T19:00:00') }
    }
  ]
};

// API simulation functions
export const fetchBatchData = async () => {
  // TODO: Replace with actual Java REST API call
  // const response = await fetch('/api/batch-status');
  // return response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBatchData);
    }, 500); // Simulate network delay
  });
};

// Mock data for Status page - matches the image structure
export const mockStatusData = [
  {
    environment: 'ASYS',
    bank: { status: 'Completed', progress: 100 },
    card: { status: 'Completed', progress: 100 },
    lastRun: '1/9/2025 8:30:00 AM',
    eta: '1/9/2025 9:15:00 AM',
    runtime: '45 min 30s'
  },
  {
    environment: 'TSYS',
    bank: { status: 'In Progress', progress: 65 },
    card: { status: 'In Progress', progress: 45 },
    lastRun: '1/9/2025 7:45:00 AM',
    eta: '1/9/2025 9:30:00 AM',
    runtime: '1 hr 12 min'
  },
  {
    environment: 'MSYS',
    bank: { status: 'Not Started', progress: 0 },
    card: { status: 'Not Started', progress: 0 },
    lastRun: '1/8/2025 11:45:00 PM',
    eta: '1/9/2025 10:00:00 AM',
    runtime: '0 min'
  },
  {
    environment: 'QSYS',
    bank: { status: 'Completed', progress: 100 },
    card: { status: 'Completed', progress: 100 },
    lastRun: '1/9/2025 6:15:00 AM',
    eta: '1/9/2025 8:45:00 AM',
    runtime: '2 hr 30 min'
  },
  {
    environment: 'KTOS',
    bank: { status: 'In Progress', progress: 42 },
    card: { status: 'In Progress', progress: 38 },
    lastRun: '1/9/2025 8:00:00 AM',
    eta: '1/9/2025 10:30:00 AM',
    runtime: '32 min'
  },
  {
    environment: 'QSTS',
    bank: { status: 'Completed', progress: 100 },
    card: { status: 'In Progress', progress: 85 },
    lastRun: '1/9/2025 7:30:00 AM',
    eta: '1/9/2025 9:00:00 AM',
    runtime: '1 hr 28 min'
  }
];

export const fetchJobsData = async (environment) => {
  // TODO: Replace with actual Java REST API call
  // const response = await fetch(`/api/environments/${environment}/jobs`);
  // return response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockJobsData[environment] || []);
    }, 300);
  });
};

export const fetchHistoryData = async (environment) => {
  // TODO: Replace with actual Java REST API call
  // const response = await fetch(`/api/environments/${environment}/history`);
  // return response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockHistoryData[environment] || []);
    }, 300);
  });
};