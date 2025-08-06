import React, { useState, useEffect } from 'react';
import { ChevronDown, Clock, Play, History, MoreHorizontal, RefreshCw } from 'lucide-react';

const Status = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data for batch status
  const batchData = [
    {
      environment: 'ASYS',
      bank: { status: 'Completed', progress: 100 },
      card: { status: 'In Progress', progress: 78 },
      lastRun: new Date('2025-01-09T08:30:00'),
      eta: new Date('2025-01-09T09:15:00'),
      runtime: '45m 32s'
    },
    {
      environment: 'TSYS',
      bank: { status: 'In Progress', progress: 65 },
      card: { status: 'Completed', progress: 100 },
      lastRun: new Date('2025-01-09T07:45:00'),
      eta: new Date('2025-01-09T09:30:00'),
      runtime: '1h 12m 18s'
    },
    {
      environment: 'MST0',
      bank: { status: 'Not Started', progress: 0 },
      card: { status: 'Not Started', progress: 0 },
      lastRun: new Date('2025-01-08T23:45:00'),
      eta: new Date('2025-01-09T10:00:00'),
      runtime: '0m 0s'
    },
    {
      environment: 'OSYS',
      bank: { status: 'Completed', progress: 100 },
      card: { status: 'Completed', progress: 100 },
      lastRun: new Date('2025-01-09T06:15:00'),
      eta: new Date('2025-01-09T08:45:00'),
      runtime: '2h 30m 45s'
    },
    {
      environment: 'ECT0',
      bank: { status: 'In Progress', progress: 42 },
      card: { status: 'In Progress', progress: 38 },
      lastRun: new Date('2025-01-09T08:00:00'),
      eta: new Date('2025-01-09T10:30:00'),
      runtime: '32m 15s'
    },
    {
      environment: 'QSYS',
      bank: { status: 'Completed', progress: 100 },
      card: { status: 'In Progress', progress: 85 },
      lastRun: new Date('2025-01-09T07:30:00'),
      eta: new Date('2025-01-09T09:00:00'),
      runtime: '1h 28m 42s'
    },
    {
      environment: 'VST0',
      bank: { status: 'Not Started', progress: 0 },
      card: { status: 'Not Started', progress: 0 },
      lastRun: new Date('2025-01-08T22:30:00'),
      eta: new Date('2025-01-09T11:00:00'),
      runtime: '0m 0s'
    }
  ];

  // Mock data for recent batch runs
  const recentRuns = [
    { environment: 'OSYS', type: 'BANK', completedAt: new Date('2025-01-09T06:15:00'), duration: '2h 30m 45s', status: 'Success' },
    { environment: 'ASYS', type: 'BANK', completedAt: new Date('2025-01-09T05:45:00'), duration: '1h 45m 20s', status: 'Success' },
    { environment: 'TSYS', type: 'CARD', completedAt: new Date('2025-01-09T05:30:00'), duration: '58m 12s', status: 'Success' },
    { environment: 'QSYS', type: 'BANK', completedAt: new Date('2025-01-09T04:15:00'), duration: '1h 15m 33s', status: 'Success' },
    { environment: 'ASYS', type: 'CARD', completedAt: new Date('2025-01-09T03:45:00'), duration: '42m 18s', status: 'Warning' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'In Progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Not Started': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Not Started': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', {
      month: '1-digit',
      day: '1-digit',
      year: 'numeric',
      hour: '1-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const DropdownMenu = ({ label, options = ['View Details', 'Download Report', 'Export Data'] }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          {label}
          <ChevronDown className="w-4 h-4" />
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            {options.map((option, index) => (
              <button
                key={index}
                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                onClick={() => setIsOpen(false)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Batch Status</h1>
            <p className="text-sm text-gray-600 mt-1">
              Real-time monitoring of batch processing across all environments
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Last Updated: {formatDateTime(currentTime)}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Main Batch Status Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Environment Status Overview</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Environment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Run
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ETA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Runtime
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {batchData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-sm font-medium text-gray-900">{row.environment}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">BANK:</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(row.bank.status)}`}>
                            {row.bank.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">CARD:</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(row.card.status)}`}>
                            {row.card.status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-500">BANK</span>
                            <span className="text-xs font-medium text-gray-700">{row.bank.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(row.bank.status)}`}
                              style={{ width: `${row.bank.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-500">CARD</span>
                            <span className="text-xs font-medium text-gray-700">{row.card.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(row.card.status)}`}
                              style={{ width: `${row.card.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {formatDateTime(row.lastRun)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(row.eta)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.runtime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <DropdownMenu label="Jobs" options={['View Jobs', 'Start Job', 'Stop Job', 'Restart Job']} />
                        <DropdownMenu label="History" options={['View History', 'Download Logs', 'Export Report']} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Batch Runs Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Recent Batch Runs</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Environment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentRuns.map((run, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm font-medium text-gray-900">{run.environment}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                        {run.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {formatDateTime(run.completedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {run.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        run.status === 'Success' ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-yellow-100'
                      }`}>
                        {run.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;