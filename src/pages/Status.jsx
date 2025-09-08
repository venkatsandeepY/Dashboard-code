import React, { useState, useEffect } from 'react';
import { ChevronDown, Clock, RotateCcw, Calendar, FileText, X, AlertCircle } from 'react-feather';
import { 
  batchStatusService, 
  getStatusColor, 
  getProgressColor, 
  getPhaseStatusIcon, 
  formatDateTime 
} from '../services/batchStatusService';

const Status = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batchData, setBatchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState('');
  const [expandedBatch, setExpandedBatch] = useState(null);

  // Fixed environment order as specified
  const ENVIRONMENT_ORDER = ['ASYS', 'TSYS', 'MSTO', 'OSYS', 'ECT0', 'QSYS', 'VSTO'];

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    // Start auto-refresh
    batchStatusService.startAutoRefresh(loadBatchData);
    
    // Cleanup on unmount
    return () => {
      batchStatusService.stopAutoRefresh();
    };
  }, []);

  // Load batch data on component mount
  useEffect(() => {
    loadBatchData();
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
    
    await batchStatusService.loadBatchData(setters, ENVIRONMENT_ORDER, isAutoRefresh);
  };

  const handleRefresh = () => {
    loadBatchData();
  };

  const handleBatchToggle = (batchId) => {
    setExpandedBatch(expandedBatch === batchId ? null : batchId);
  };

  const ProgressBar = ({ progress, status }) => {
    const progressValue = parseInt(progress) || 0;
    return (
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`h-3 rounded-full ${getProgressColor(status)}`}
          style={{ width: `${progressValue}%` }}
        >
        </div>
      </div>
    );
  };

  const StatusBadge = ({ status }) => {
    return (
      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(status)}`}>
        {status}
      </span>
    );
  };

  const PhaseDetails = ({ phases, batchId }) => {
    if (!phases || Object.keys(phases).length === 0) {
      return (
        <div className="p-4 text-center text-gray-500 text-sm">
          No phase information available
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border border-blue-200 overflow-hidden">
        <div className="px-4 py-3 bg-blue-100 border-b border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Phase Details - {batchId}
          </h4>
        </div>
        <div className="divide-y divide-gray-200">
          {Object.entries(phases).map(([phaseName, phaseData]) => (
            <div key={phaseName} className="p-4 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-lg">
                    {getPhaseStatusIcon(phaseData.status)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{phaseName}</p>
                    <p className="text-xs text-gray-500">Phase Status</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(phaseData.status).replace('border-', 'border ')}`}>
                  {phaseData.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-6">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Batch Status</h1>
              <p className="text-sm text-gray-600 mt-1">
                Real-time monitoring of batch processing across all environments
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-gray-500">Loading batch data...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-6">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Batch Status</h1>
              <p className="text-sm text-gray-600 mt-1">
                Real-time monitoring of batch processing across all environments
              </p>
            </div>
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="text-lg font-medium text-red-800">Error Loading Data</h3>
                <p className="text-red-700 mt-1">
                  Failed to fetch batch status data: {error}
                </p>
                <p className="text-red-600 text-sm mt-2">
                  Please ensure the API server is running at http://localhost:8080
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
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
              Last Updated: {lastRefresh || formatDateTime(currentTime).date + ' at ' + formatDateTime(currentTime).time}
            </div>
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 pb-8 mb-4">
        {/* Environment Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {batchData.map((envData) => (
            <div key={envData.environment} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">{envData.environment}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {envData.hasData ? `${envData.batches.length} batch(es)` : 'No data available'}
                </p>
              </div>
              
              <div className="p-6">
                {!envData.hasData ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">📊</div>
                    <div className="text-gray-500 font-medium">No Data Available</div>
                    <div className="text-gray-400 text-sm mt-2">No batches found for this environment</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {envData.batches.map((batch) => (
                      <div key={batch.batchId} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="p-4 hover:bg-gray-50 transition-colors duration-200">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">{batch.batchId}</h3>
                              <p className="text-xs text-gray-500 mt-1">Type: {batch.batchType}</p>
                            </div>
                            <StatusBadge status={batch.status} />
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-gray-500">Progress</span>
                              <span className="text-xs font-medium text-gray-700">{batch.completion}%</span>
                            </div>
                            <ProgressBar progress={batch.completion} status={batch.status} />
                          </div>

                          {/* Phases Button */}
                          {batch.phase && Object.keys(batch.phase).length > 0 && (
                            <button
                              onClick={() => handleBatchToggle(batch.batchId)}
                              className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-150"
                            >
                              <Clock className="w-4 h-4" />
                              Phases ({Object.keys(batch.phase).length})
                              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                                expandedBatch === batch.batchId ? 'rotate-180' : ''
                              }`} />
                            </button>
                          )}
                        </div>
                        
                        {/* Phase Details */}
                        {expandedBatch === batch.batchId && (
                          <div className="border-t border-gray-200 p-4 bg-blue-50">
                            <PhaseDetails phases={batch.phase} batchId={batch.batchId} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Status;