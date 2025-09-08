import React, { useState, useEffect } from 'react';
import { ChevronDown, Clock, Play, RotateCcw, Calendar, FileText, X } from 'react-feather';
import { batchStatusService } from '../services/batchStatusService';

const Status = () => {
  const [batchData, setBatchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState('');
  const [expandedBatch, setExpandedBatch] = useState(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);

  // Fixed order of environments
  const environmentOrder = ['ASYS', 'TSYS', 'MST0', 'OSYS', 'ECT0', 'QSYS', 'VST0'];

  useEffect(() => {
    loadBatchData();
    
    // Cleanup on unmount
    return () => {
      batchStatusService.stopAutoRefresh();
    };
  }, []);

  const loadBatchData = async (isAutoRefresh = false) => {
    const setters = {
      setBatchData,
      setLoading,
      setRefreshing,
      setError,
      setLastRefresh,
      setExpandedBatch
    };

    await batchStatusService.loadBatchData(setters, environmentOrder, isAutoRefresh);
  };

  const handleRefresh = () => {
    loadBatchData(false);
  };

  const toggleAutoRefresh = () => {
    if (autoRefreshEnabled) {
      batchStatusService.stopAutoRefresh();
      setAutoRefreshEnabled(false);
    } else {
      batchStatusService.startAutoRefresh(loadBatchData, 60000); // 60 seconds
      setAutoRefreshEnabled(true);
    }
  };

  const toggleBatchExpansion = (batchId) => {
    setExpandedBatch(expandedBatch === batchId ? null : batchId);
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'text-green-600 bg-green-50 border-green-200';
      case 'INPROGRESS': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'NOTSTARTED': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'FAILED': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getProgressColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'bg-green-500';
      case 'INPROGRESS': return 'bg-yellow-500';
      case 'NOTSTARTED': return 'bg-gray-300';
      case 'FAILED': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getPhaseStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return '✅';
      case 'INPROGRESS': return '🔄';
      case 'NOTSTARTED': return '⏳';
      case 'FAILED': return '❌';
      default: return '⏳';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString || timeString === '-') return '-';
    try {
      // Handle different time formats
      if (timeString.includes('T')) {
        return new Date(timeString).toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
      return timeString;
    } catch (error) {
      return timeString;
    }
  };

  const formatDuration = (days, hours, mins) => {
    if (!days && !hours && !mins) return '-';
    return `${days || 0}d ${hours || 0}h ${mins || 0}m`;
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Batch Status</h1>
            <p className="text-sm text-gray-600 mt-1">
              Real-time monitoring of batch processing across all environments
            </p>
          </div>
          <div className="flex items-center gap-4">
            {lastRefresh && (
              <div className="text-sm text-gray-500">
                <Calendar className="w-4 h-4 inline mr-1" />
                Last Updated: {lastRefresh}
              </div>
            )}
            <button
              onClick={toggleAutoRefresh}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                autoRefreshEnabled
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Play className="w-4 h-4 inline mr-1" />
              Auto Refresh {autoRefreshEnabled ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RotateCcw className={`w-4 h-4 inline mr-1 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-2">Environment</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-2">Progress</div>
              <div className="col-span-1">LRD</div>
              <div className="col-span-1">ETA</div>
              <div className="col-span-2">Runtime</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {batchData.map((envData) => (
              <div key={envData.environment}>
                {envData.hasData ? (
                  envData.batches.map((batch, index) => (
                    <div key={batch.batchId || `${envData.environment}-${index}`}>
                      {/* Main Row */}
                      <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Environment */}
                          <div className="col-span-2">
                            <div className="font-medium text-gray-900">
                              {envData.environment}
                            </div>
                            <div className="text-sm text-gray-500">
                              {batch.batchId || 'N/A'}
                            </div>
                          </div>

                          {/* Type */}
                          <div className="col-span-1">
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {batch.batchType || 'N/A'}
                            </span>
                          </div>

                          {/* Progress */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(batch.status)}`}
                                  style={{ width: `${batch.completion || 0}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
                                {batch.completion || 0}%
                              </span>
                            </div>
                          </div>

                          {/* LRD */}
                          <div className="col-span-1 text-sm text-gray-600">
                            {batch.lrd || '-'}
                          </div>

                          {/* ETA */}
                          <div className="col-span-1 text-sm text-gray-600">
                            {batch.eta || '-'}
                          </div>

                          {/* Runtime */}
                          <div className="col-span-2">
                            <div className="text-sm text-gray-900">
                              {formatDuration(batch.days, batch.hours, batch.mins)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTime(batch.startTime)} - {formatTime(batch.endTime)}
                            </div>
                          </div>

                          {/* Status */}
                          <div className="col-span-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(batch.status)}`}>
                              {batch.status || 'Unknown'}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="col-span-1">
                            {batch.phase && Object.keys(batch.phase).length > 0 && (
                              <button
                                onClick={() => toggleBatchExpansion(batch.batchId)}
                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform ${
                                    expandedBatch === batch.batchId ? 'rotate-180' : ''
                                  }`}
                                />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Phase Details */}
                      {expandedBatch === batch.batchId && batch.phase && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {Object.entries(batch.phase).map(([phaseName, phaseData]) => (
                              <div
                                key={phaseName}
                                className="flex items-center gap-2 p-2 bg-white rounded border"
                              >
                                <span className="text-lg">
                                  {getPhaseStatusIcon(phaseData.status)}
                                </span>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {phaseName}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {phaseData.status || 'Unknown'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  /* No Data Row */
                  <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-2">
                        <div className="font-medium text-gray-900">
                          {envData.environment}
                        </div>
                      </div>
                      <div className="col-span-10 text-center text-gray-500 text-sm">
                        No active batches
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(() => {
            const totalBatches = batchData.reduce((sum, env) => sum + env.batches.length, 0);
            const completedBatches = batchData.reduce((sum, env) => 
              sum + env.batches.filter(b => b.status === 'COMPLETED').length, 0
            );
            const inProgressBatches = batchData.reduce((sum, env) => 
              sum + env.batches.filter(b => b.status === 'INPROGRESS').length, 0
            );
            const failedBatches = batchData.reduce((sum, env) => 
              sum + env.batches.filter(b => b.status === 'FAILED').length, 0
            );

            return (
              <>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Total Batches</p>
                      <p className="text-2xl font-semibold text-gray-900">{totalBatches}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <div className="w-5 h-5 text-green-600 font-bold">✓</div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Completed</p>
                      <p className="text-2xl font-semibold text-gray-900">{completedBatches}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">In Progress</p>
                      <p className="text-2xl font-semibold text-gray-900">{inProgressBatches}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <X className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Failed</p>
                      <p className="text-2xl font-semibold text-gray-900">{failedBatches}</p>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default Status;