import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Reports from '../Reports';
import * as reportService from '../../services/reportService';

// Mock the report service
jest.mock('../../services/reportService');

describe('Reports Component', () => {
  beforeEach(() => {
    // Mock successful report generation
    reportService.generateReport.mockResolvedValue({
      success: true,
      reportId: 'RPT-123456',
      fileName: 'test-report.xlsx'
    });

    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('renders reports page with title and tabs', () => {
    render(<Reports />);
    
    expect(screen.getByText('REPORTS')).toBeInTheDocument();
    expect(screen.getByText('SLA Reports')).toBeInTheDocument();
    expect(screen.getByText('SNOW Incidents')).toBeInTheDocument();
    expect(screen.getByText('VITS')).toBeInTheDocument();
    expect(screen.getByText('Admin Tools')).toBeInTheDocument();
  });

  test('renders all filter fields', () => {
    render(<Reports />);
    
    expect(screen.getByText('Environment')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('From Date')).toBeInTheDocument();
    expect(screen.getByText('To Date')).toBeInTheDocument();
    expect(screen.getByText('Generate Report')).toBeInTheDocument();
  });

  test('shows validation errors when form is submitted empty', async () => {
    render(<Reports />);
    
    const generateButton = screen.getByText('Generate Report');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Environment is required')).toBeInTheDocument();
      expect(screen.getByText('Report type is required')).toBeInTheDocument();
      expect(screen.getByText('From date is required')).toBeInTheDocument();
      expect(screen.getByText('To date is required')).toBeInTheDocument();
    });
  });

  test('clears validation errors when user starts typing', async () => {
    render(<Reports />);
    
    // Trigger validation errors
    const generateButton = screen.getByText('Generate Report');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Environment is required')).toBeInTheDocument();
    });

    // Select environment
    const environmentSelect = screen.getByDisplayValue('');
    fireEvent.change(environmentSelect, { target: { value: 'ASYS' } });

    await waitFor(() => {
      expect(screen.queryByText('Environment is required')).not.toBeInTheDocument();
    });
  });

  test('validates date range correctly', async () => {
    render(<Reports />);
    
    // Set from date after to date
    const fromDateInput = screen.getByLabelText(/From Date/);
    const toDateInput = screen.getByLabelText(/To Date/);
    
    fireEvent.change(fromDateInput, { target: { value: '2024-12-31' } });
    fireEvent.change(toDateInput, { target: { value: '2024-01-01' } });

    const generateButton = screen.getByText('Generate Report');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('To date must be after from date')).toBeInTheDocument();
    });
  });

  test('prevents future dates', async () => {
    render(<Reports />);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const futureDate = tomorrow.toISOString().split('T')[0];

    const fromDateInput = screen.getByLabelText(/From Date/);
    fireEvent.change(fromDateInput, { target: { value: futureDate } });

    const generateButton = screen.getByText('Generate Report');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('From date cannot be in the future')).toBeInTheDocument();
    });
  });

  test('changes report types when tab is switched', () => {
    render(<Reports />);
    
    // Click on SNOW Incidents tab
    const snowTab = screen.getByText('SNOW Incidents');
    fireEvent.click(snowTab);

    // Check if tab is active
    expect(snowTab.closest('button')).toHaveClass('text-blue-600');
  });

  test('generates report successfully with valid data', async () => {
    render(<Reports />);
    
    // Fill out form
    const environmentSelect = screen.getByDisplayValue('');
    fireEvent.change(environmentSelect, { target: { value: 'ASYS' } });

    const typeSelects = screen.getAllByDisplayValue('');
    fireEvent.change(typeSelects[1], { target: { value: 'performance' } });

    const fromDateInput = screen.getByLabelText(/From Date/);
    const toDateInput = screen.getByLabelText(/To Date/);
    
    fireEvent.change(fromDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(toDateInput, { target: { value: '2024-01-31' } });

    // Generate report
    const generateButton = screen.getByText('Generate Report');
    fireEvent.click(generateButton);

    // Check loading state
    await waitFor(() => {
      expect(screen.getByText('Generating...')).toBeInTheDocument();
    });

    // Check success message
    await waitFor(() => {
      expect(screen.getByText('Report Generated Successfully')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(reportService.generateReport).toHaveBeenCalledWith({
      tab: 'sla-reports',
      environment: 'ASYS',
      type: 'performance',
      fromDate: '2024-01-01',
      toDate: '2024-01-31'
    });
  });

  test('handles API errors gracefully', async () => {
    // Mock API error
    reportService.generateReport.mockRejectedValue(new Error('Server error'));

    render(<Reports />);
    
    // Fill out form with valid data
    const environmentSelect = screen.getByDisplayValue('');
    fireEvent.change(environmentSelect, { target: { value: 'ASYS' } });

    const typeSelects = screen.getAllByDisplayValue('');
    fireEvent.change(typeSelects[1], { target: { value: 'performance' } });

    const fromDateInput = screen.getByLabelText(/From Date/);
    const toDateInput = screen.getByLabelText(/To Date/);
    
    fireEvent.change(fromDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(toDateInput, { target: { value: '2024-01-31' } });

    // Generate report
    const generateButton = screen.getByText('Generate Report');
    fireEvent.click(generateButton);

    // Check error message
    await waitFor(() => {
      expect(screen.getByText('Error Generating Report')).toBeInTheDocument();
      expect(screen.getByText('Server error')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('disables generate button during report generation', async () => {
    render(<Reports />);
    
    // Fill out form
    const environmentSelect = screen.getByDisplayValue('');
    fireEvent.change(environmentSelect, { target: { value: 'ASYS' } });

    const typeSelects = screen.getAllByDisplayValue('');
    fireEvent.change(typeSelects[1], { target: { value: 'performance' } });

    const fromDateInput = screen.getByLabelText(/From Date/);
    const toDateInput = screen.getByLabelText(/To Date/);
    
    fireEvent.change(fromDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(toDateInput, { target: { value: '2024-01-31' } });

    // Generate report
    const generateButton = screen.getByText('Generate Report');
    fireEvent.click(generateButton);

    // Button should be disabled during generation
    await waitFor(() => {
      expect(generateButton).toBeDisabled();
    });
  });

  test('renders discover logo', () => {
    render(<Reports />);
    
    const logo = screen.getByAltText('Discover Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/image copy.png');
  });

  test('shows report summary section', () => {
    render(<Reports />);
    
    expect(screen.getByText('Report Summary')).toBeInTheDocument();
    expect(screen.getByText('No Report Generated')).toBeInTheDocument();
  });

  test('resets type when switching tabs', () => {
    render(<Reports />);
    
    // Select a type in SLA Reports
    const typeSelects = screen.getAllByDisplayValue('');
    fireEvent.change(typeSelects[1], { target: { value: 'performance' } });

    // Switch to SNOW Incidents tab
    const snowTab = screen.getByText('SNOW Incidents');
    fireEvent.click(snowTab);

    // Type should be reset
    const typeSelectAfterSwitch = screen.getAllByDisplayValue('')[1];
    expect(typeSelectAfterSwitch.value).toBe('');
  });
});