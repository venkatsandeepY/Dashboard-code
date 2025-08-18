import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Status from '../Status';
import * as mockData from '../../data/mockData';

// Mock the data module
jest.mock('../../data/mockData');

const mockBatchData = [
  {
    id: 1,
    environment: 'ASYS',
    bank: { status: 'Completed', progress: 100 },
    card: { status: 'In Progress', progress: 78 },
    lastRun: new Date('2025-01-09T08:30:00'),
    eta: new Date('2025-01-09T09:15:00'),
    runtime: '45m 32s'
  }
];

const mockJobsData = [
  { name: 'Daily Processing', status: 'Running', startTime: '08:30 AM', icon: 'Play', color: 'text-blue-600' }
];

describe('Status Component', () => {
  beforeEach(() => {
    mockData.fetchBatchData.mockResolvedValue(mockBatchData);
    mockData.fetchJobsData.mockResolvedValue(mockJobsData);
    mockData.fetchHistoryData.mockResolvedValue([]);
    
    // Mock console.log to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('renders status page header', async () => {
    render(<Status />);
    
    expect(screen.getByText('Batch Status')).toBeInTheDocument();
    expect(screen.getByText('Real-time monitoring of batch processing across all environments')).toBeInTheDocument();
  });

  test('loads and displays batch data', async () => {
    render(<Status />);
    
    await waitFor(() => {
      expect(screen.getByText('ASYS')).toBeInTheDocument();
    });

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    render(<Status />);
    
    expect(screen.getByText('Loading batch data...')).toBeInTheDocument();
  });

  test('refresh button calls fetchBatchData', async () => {
    render(<Status />);
    
    await waitFor(() => {
      expect(screen.getByText('ASYS')).toBeInTheDocument();
    });

    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    expect(mockData.fetchBatchData).toHaveBeenCalledTimes(2); // Once on mount, once on refresh
  });

  test('displays progress bars with correct percentages', async () => {
    render(<Status />);
    
    await waitFor(() => {
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('78%')).toBeInTheDocument();
    });
  });

  test('formats date and time correctly', async () => {
    render(<Status />);
    
    await waitFor(() => {
      expect(screen.getByText('1/9/2025')).toBeInTheDocument();
    });
  });

  test('opens jobs dropdown when Jobs button is clicked', async () => {
    render(<Status />);
    
    await waitFor(() => {
      expect(screen.getByText('ASYS')).toBeInTheDocument();
    });

    const jobsButton = screen.getByText('Jobs');
    fireEvent.click(jobsButton);

    await waitFor(() => {
      expect(mockData.fetchJobsData).toHaveBeenCalledWith('ASYS');
    });
  });

  test('opens history dropdown when History button is clicked', async () => {
    render(<Status />);
    
    await waitFor(() => {
      expect(screen.getByText('ASYS')).toBeInTheDocument();
    });

    const historyButton = screen.getByText('History');
    fireEvent.click(historyButton);

    await waitFor(() => {
      expect(mockData.fetchHistoryData).toHaveBeenCalledWith('ASYS');
    });
  });

  test('closes dropdown when same button is clicked twice', async () => {
    render(<Status />);
    
    await waitFor(() => {
      expect(screen.getByText('ASYS')).toBeInTheDocument();
    });

    const jobsButton = screen.getByText('Jobs');
    
    // Open dropdown
    fireEvent.click(jobsButton);
    await waitFor(() => {
      expect(mockData.fetchJobsData).toHaveBeenCalled();
    });

    // Close dropdown
    fireEvent.click(jobsButton);
    
    // Verify dropdown is closed (no additional API calls)
    expect(mockData.fetchJobsData).toHaveBeenCalledTimes(1);
  });

  test('displays runtime information', async () => {
    render(<Status />);
    
    await waitFor(() => {
      expect(screen.getByText('45m 32s')).toBeInTheDocument();
    });
  });

  test('shows current time in header', async () => {
    render(<Status />);
    
    // Should show "Last Updated" text
    expect(screen.getByText(/Last Updated:/)).toBeInTheDocument();
  });

  test('handles error states gracefully', async () => {
    mockData.fetchBatchData.mockRejectedValue(new Error('API Error'));
    
    render(<Status />);
    
    // Should still render the header even if data fails to load
    expect(screen.getByText('Batch Status')).toBeInTheDocument();
  });

  test('displays status badges correctly', async () => {
    render(<Status />);
    
    await waitFor(() => {
      expect(screen.getByText('ASYS')).toBeInTheDocument();
    });

    // Check for BANK and CARD labels
    expect(screen.getAllByText('BANK:')).toHaveLength(1);
    expect(screen.getAllByText('CARD:')).toHaveLength(1);
  });

  test('refresh button shows loading state', async () => {
    render(<Status />);
    
    await waitFor(() => {
      expect(screen.getByText('ASYS')).toBeInTheDocument();
    });

    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    // Button should be disabled during refresh
    expect(refreshButton).toBeDisabled();
  });
});