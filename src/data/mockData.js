// Mock data for Status page
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