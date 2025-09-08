import React, { useState, useEffect } from 'react';
import { ChevronDown, Clock, RotateCcw, Calendar, X, Activity } from 'lucide-react';
import { fetchBatchStatusData } from '../data/mockData';

const Status = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedType, setExpandedType] = useState(null);
  const [error, setError] = useState(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load batch data on component mount
  useEffect(() => {
    loadBatchData();
    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(loadBatchData, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  const loadBatchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBatchStatusData();
      setBatchData(data);
    } catch (error) {
      console.error('Error loading batch data:', error);
      setError('Failed to load batch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const data = await fetchBatchStatusData();
      setBatchData(data);
      // Clear any open dropdowns on refresh
      setExpandedRow(null);
      setExpandedType(null);
    } catch (error) {
      console.error('Error refreshing batch data:', error);
      setError('Failed to refresh batch data. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'text-green-600 bg-green-50 border-green-200';
      case 'INPROGRESS': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'NOTSTARTED': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'FAILED': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getProgressColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'bg-green-500';
      case 'INPROGRESS': return 'bg-blue-500';
      case 'NOTSTARTED': return 'bg-gray-300';
      case 'FAILED': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr || dateStr === '-') return { date: '-', time: '-' };
    
    try {
      // Handle the date format from API (e.g., "SEP-04-25 19:40")
      const date = new Date(dateStr.replace(/(\w{3})-(\d{2})-(\d{2})/, '20$3-$2-$1'));
      
      const dateStr2 = date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      });
      
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      return { date: dateStr2, time: timeStr };
    } catch (error) {
      return { date: dateStr, time: '' };
    }
  };

  const formatRuntime = (days, hours, mins) => {
    if (!days && !hours && !mins) return '0m 0s';
    return `${days || 0}d ${hours || 0}h ${mins || 0}m`;
  };

  const handlePhaseToggle = (environment, batchType) => {
    const key = `${environment}-${batchType}`;
    if (expandedRow === key) {
      setExpandedRow(null);
      setExpandedType(null);
    } else {
      setExpandedRow(key);
      setExpandedType('phases');
    }
  };

  const StatusBadge = ({ status }) => {
    return (
      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(status)}`}>
        {status}
      </span>
    );
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

  const PhaseRow = ({ environment, batch }) => {
    const phases = batch.phase || {};
    const phaseEntries = Object.entries(phases);

    if (phaseEntries.length === 0) {
      return (
        <tr className="bg-yellow-50 border-l-4 border-yellow-400">
          <td colSpan="7" className="px-6 py-4">
            <div className="bg-white rounded-lg border border-yellow-200 overflow-hidden">
              <div className="px-4 py-3 bg-yellow-100 border-b border-yellow-200">
                <h4 className="text-sm font-semibold text-yellow-900 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Phases - {environment} ({batch.batchType})
                </h4>
              </div>
              <div className="p-4 text-center text-gray-500 text-sm">
                No phases available for this batch
              </div>
            </div>
          </td>
        </tr>
      );
    }

    return (
      <tr className="bg-purple-50 border-l-4 border-purple-400">
        <td colSpan="7" className="px-6 py-4">
          <div className="bg-white rounded-lg border border-purple-200 overflow-hidden">
            <div className="px-4 py-3 bg-purple-100 border-b border-purple-200">
              <h4 className="text-sm font-semibold text-purple-900 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Phases - {environment} ({batch.batchType})
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {phaseEntries.map(([phaseName, phaseData]) => (
                <div key={phaseName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      phaseData.status === 'COMPLETED' ? 'bg-green-500' :
                      phaseData.status === 'INPROGRESS' ? 'bg-blue-500' :
                      phaseData.status === 'NOTSTARTED' ? 'bg-gray-400' :
                      'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">{phaseName}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    phaseData.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    phaseData.status === 'INPROGRESS' ? 'bg-blue-100 text-blue-700' :
                    phaseData.status === 'NOTSTARTED' ? 'bg-gray-100 text-gray-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {phaseData.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </td>
      </tr>
    );
  };

  // Transform API data for display
  const getDisplayData = () => {
    if (!batchData?.batchDetails) return [];
    
    const displayRows = [];
    
    batchData.batchDetails.forEach(envData => {
      const environment = envData.environment;
      
      if (!envData.overallBatchStatus || envData.overallBatchStatus.length === 0) {
        // Show environment with no batches
        displayRows.push({
          id: `${environment}-empty`,
          environment,
          bank: { status: 'No Data', progress: 0 },
          card: { status: 'No Data', progress: 0 },
          lastRun: null,
          eta: null,
          runtime: '0d 0h 0m',
          batches: []
        });
        return;
      }

      // Group batches by type
      const bankBatch = envData.overallBatchStatus.find(b => b.batchType === 'BANK');
      const cardBatch = envData.overallBatchStatus.find(b => b.batchType === 'CARD');

      displayRows.push({
        id: environment,
        environment,
        bank: bankBatch ? {
          status: bankBatch.status,
          progress: parseInt(bankBatch.completion) || 0
        } : { status: 'No Data', progress: 0 },
        card: cardBatch ? {
          status: cardBatch.status,
          progress: parseInt(cardBatch.completion) || 0
        } : { status: 'No Data', progress: 0 },
        lastRun: bankBatch?.startTime || cardBatch?.startTime,
        eta: bankBatch?.eta || cardBatch?.eta,
        runtime: formatRuntime(
          bankBatch?.days || cardBatch?.days,
          bankBatch?.hours || cardBatch?.hours,
          bankBatch?.mins || cardBatch?.mins
        ),
        batches: envData.overallBatchStatus
      });
    });

    return displayRows;
  };

  if (loading && !batchData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-500">Loading batch data...</div>
          </div>
        </div>
      </div>
    );
  }

  const displayData = getDisplayData();

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
              Last Updated: {batchData?.lastRefresh || formatDateTime(currentTime.toISOString()).date + ' ' + formatDateTime(currentTime.toISOString()).time}
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
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <X className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Batch Status Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
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
                {displayData.map((row) => (
                  <React.Fragment key={row.id}>
                    <tr className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{row.environment}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">BANK:</span>
                            <StatusBadge status={row.bank.status} />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">CARD:</span>
                            <StatusBadge status={row.card.status} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-gray-500">BANK</span>
                              <span className="text-xs font-medium text-gray-700">{row.bank.progress}%</span>
                            </div>
                            <ProgressBar progress={row.bank.progress} status={row.bank.status} />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-gray-500">CARD</span>
                              <span className="text-xs font-medium text-gray-700">{row.card.progress}%</span>
                            </div>
                            <ProgressBar progress={row.card.progress} status={row.card.status} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium">{formatDateTime(row.lastRun).date}</div>
                            <div className="text-xs text-gray-500">{formatDateTime(row.lastRun).time}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium">{formatDateTime(row.eta).date}</div>
                            <div className="text-xs text-gray-500">{formatDateTime(row.eta).time}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          {row.runtime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          {row.batches && row.batches.map((batch) => (
                            <button
                              key={batch.batchType}
                              onClick={() => handlePhaseToggle(row.environment, batch.batchType)}
                              className="flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors duration-150"
                            >
                              <Activity className="w-4 h-4" />
                              {batch.batchType} Phases
                              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                                expandedRow === `${row.environment}-${batch.batchType}` ? 'rotate-180' : ''
                              }`} />
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                    {row.batches && row.batches.map((batch) => (
                      expandedRow === `${row.environment}-${batch.batchType}` && (
                        <PhaseRow key={`${row.environment}-${batch.batchType}-phases`} environment={row.environment} batch={batch} />
                      )
                    ))}
                  </React.Fragment>
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