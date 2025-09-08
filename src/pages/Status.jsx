import React, { useState, useEffect } from 'react';
import { ChevronDown, Clock, RotateCcw, Calendar } from 'react-feather';

const Status = () => {
  const [batchData, setBatchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  // Mock data that matches the image structure
  const mockBatchData = [
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

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setBatchData(mockBatchData);
      setLastUpdated(new Date().toLocaleString());
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Not Started':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500';
      case 'In Progress':
        return 'bg-blue-500';
      case 'Not Started':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleString());
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading batch status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Batch Status</h1>
            <p className="text-sm text-gray-600">
              Real-time monitoring of batch processing across all environments
            </p>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <div className="text-sm text-gray-500">
                Last Updated: {lastUpdated}
              </div>
            )}
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Environment Status Overview</h2>
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-2">Environment</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Progress</div>
              <div className="col-span-2">Last Run</div>
              <div className="col-span-1">ETA</div>
              <div className="col-span-2">Runtime</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {batchData.map((env, index) => (
              <div key={env.environment} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Environment */}
                  <div className="col-span-2">
                    <div className="font-semibold text-gray-900 text-base">
                      {env.environment}
                    </div>
                  </div>

                  {/* Status Pills */}
                  <div className="col-span-2 space-y-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600 w-8">BANK</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(env.bank.status)}`}>
                          {env.bank.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600 w-8">CARD</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(env.card.status)}`}>
                          {env.card.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="col-span-2 space-y-3">
                    {/* BANK Progress */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-600 w-8">BANK</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(env.bank.status)}`}
                          style={{ width: `${env.bank.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-700 min-w-[2.5rem]">
                        {env.bank.progress}%
                      </span>
                    </div>
                    {/* CARD Progress */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-600 w-8">CARD</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(env.card.status)}`}
                          style={{ width: `${env.card.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-700 min-w-[2.5rem]">
                        {env.card.progress}%
                      </span>
                    </div>
                  </div>

                  {/* Last Run */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{env.lastRun}</span>
                    </div>
                  </div>

                  {/* ETA */}
                  <div className="col-span-1">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{env.eta}</span>
                    </div>
                  </div>

                  {/* Runtime */}
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-900">
                      {env.runtime}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1">
                    <div className="relative">
                      <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors">
                        <span>Jobs</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Statistics */}
    </div>
  );
};

export default Status;