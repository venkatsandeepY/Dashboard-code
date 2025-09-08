import React, { useState, useEffect } from 'react';
import { ChevronDown, Clock, Play, RotateCcw, Calendar, FileText, X } from 'react-feather';
import { fetchBatchData, fetchJobsData, fetchHistoryData } from '../data/mockData';

const Status = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batchData, setBatchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedType, setExpandedType] = useState(null);
  const [dropdownData, setDropdownData] = useState({});
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);
  const [fullReportData, setFullReportData] = useState([]);
  const [fullReportEnvironment, setFullReportEnvironment] = useState('');

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
  }, []);

  const loadBatchData = async () => {
    try {
      setLoading(true);
      const data = await fetchBatchData();
      setBatchData(data);
    } catch (error) {
      console.error('Error loading batch data:', error);
      // Handle error state here if needed
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await fetchBatchData();
      setBatchData(data);
      // Clear any open dropdowns on refresh
      setExpandedRow(null);
      setExpandedType(null);
      setDropdownData({});
    } catch (error) {
      console.error('Error refreshing batch data:', error);
    } finally {
      setRefreshing(false);
    }
  };

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
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
    
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    
    return { date: dateStr, time: timeStr };
  };

  const handleDropdownToggle = async (environment, type) => {
    // If clicking the same row and type, close it
    if (expandedRow === environment && expandedType === type) {
      setExpandedRow(null);
      setExpandedType(null);
      return;
    }

    // Close any open dropdown and open the new one
    setExpandedRow(environment);
    setExpandedType(type);

    // Load data if not already loaded
    const key = `${environment}-${type}`;
    if (!dropdownData[key]) {
      setLoadingDropdown(true);
      try {
        let data;
        if (type === 'jobs') {
          data = await fetchJobsData(environment);
        } else {
          data = await fetchHistoryData(environment);
        }
        setDropdownData(prev => ({ ...prev, [key]: data }));
      } catch (error) {
        console.error(`Error loading ${type} data:`, error);
      } finally {
        setLoadingDropdown(false);
      }
    }
  };

  const handleFullReport = async (environment) => {
    setFullReportEnvironment(environment);
    setShowFullReport(true);
    
    // Generate 10 days of combined batch history
    const reportData = [];
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate one combined batch per day
      const batchDate = new Date(date);
      batchDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
      
      reportData.push({
        date: batchDate,
        bank: {
          status: Math.random() > 0.8 ? 'Warning' : 'Success',
          duration: `${Math.floor(Math.random() * 3) + 1}h ${Math.floor(Math.random() * 60)}m`,
          completedAt: new Date(batchDate.getTime() + Math.random() * 3600000) // Random time within an hour
        },
        card: {
          status: Math.random() > 0.8 ? 'Warning' : 'Success',
          duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
          completedAt: new Date(batchDate.getTime() + Math.random() * 3600000) // Random time within an hour
        },
        environment: environment
      });
    }
    
    // Sort by date descending
    reportData.sort((a, b) => b.date - a.date);
    setFullReportData(reportData);
  };

  const closeFullReport = () => {
    setShowFullReport(false);
    setFullReportData([]);
    setFullReportEnvironment('');
  };

  const ProgressBar = ({ progress, status }) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`h-3 rounded-full ${getProgressColor(status)}`}
          style={{ width: `${progress}%` }}
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

  const CollapsibleRow = ({ environment, type }) => {
    const key = `${environment}-${type}`;
    const data = dropdownData[key] || [];

    if (type === 'jobs') {
      return (
        <tr className="bg-blue-50 border-l-4 border-blue-400">
          <td colSpan="7" className="px-6 py-4">
            <div className="bg-white rounded-lg border border-blue-200 overflow-hidden">
              <div className="px-4 py-3 bg-blue-100 border-b border-blue-200">
                <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Active Jobs - {environment}
                </h4>
              </div>
              <div className="divide-y divide-gray-200">
                {loadingDropdown ? (
                  <div className="p-4 text-center text-gray-500 text-sm">Loading jobs...</div>
                ) : data.length > 0 ? (
                  data.map((job, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            job.status === 'Running' ? 'bg-blue-500' :
                            job.status === 'Completed' ? 'bg-green-500' :
                            job.status === 'Queued' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{job.name}</p>
                            <p className="text-xs text-gray-500">Started: {job.startTime}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          job.status === 'Running' ? 'bg-blue-100 text-blue-700' :
                          job.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          job.status === 'Queued' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No active jobs found for {environment}
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      );
    } else {
      return (
        <tr className="bg-purple-50 border-l-4 border-purple-400">
          <td colSpan="7" className="px-6 py-4">
            <div className="bg-white rounded-lg border border-purple-200 overflow-hidden">
              <div className="px-4 py-3 bg-purple-100 border-b border-purple-200">
                <h4 className="text-sm font-semibold text-purple-900 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Batch History - {environment}
                </h4>
              </div>
              <div className="divide-y divide-gray-200">
                {loadingDropdown ? (
                  <div className="p-4 text-center text-gray-500 text-sm">Loading history...</div>
                ) : data.length > 0 ? (
                  data.map((batch, index) => {
                    const formatted = formatDateTime(batch.date);
                    return (
                      <div key={index} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-gray-900">
                              {formatted.date} at {formatted.time}
                            </div>
                          </div>
                          
                          {/* BANK Status */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                                BANK
                              </span>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                batch.bank.status === 'Success' ? 'bg-green-100 text-green-700' : 
                                batch.bank.status === 'Running' ? 'bg-blue-100 text-blue-700' : 
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {batch.bank.status}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {batch.bank.duration}
                            </div>
                          </div>
                          
                          {/* CARD Status */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                                CARD
                              </span>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                batch.card.status === 'Success' ? 'bg-green-100 text-green-700' : 
                                batch.card.status === 'Running' ? 'bg-blue-100 text-blue-700' : 
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {batch.card.status}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {batch.card.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No batch history found for {environment}
                  </div>
                )}
              </div>
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleFullReport(environment)}
                    className="flex-1 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded hover:bg-purple-100 transition-colors duration-150 flex items-center justify-center gap-1"
                  >
                    <FileText className="w-3 h-3" />
                    Full Report
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      );
    }
  };

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
              Last Updated: {formatDateTime(currentTime).date} at {formatDateTime(currentTime).time}
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
        {/* Main Batch Status Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Environment Status Overview</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">Loading batch data...</div>
            </div>
          ) : (
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
                  {batchData.map((row) => (
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
                            <button
                              onClick={() => handleDropdownToggle(row.environment, 'jobs')}
                              className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-150"
                            >
                              <Play className="w-4 h-4" />
                              Jobs
                              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                                expandedRow === row.environment && expandedType === 'jobs' ? 'rotate-180' : ''
                              }`} />
                            </button>
                            <button
                              onClick={() => handleDropdownToggle(row.environment, 'history')}
                              className="flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors duration-150"
                            >
                              <Clock className="w-4 h-4" />
                              History
                              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                                expandedRow === row.environment && expandedType === 'history' ? 'rotate-180' : ''
                              }`} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedRow === row.environment && (
                        <CollapsibleRow environment={row.environment} type={expandedType} />
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

     {/* Full Report Modal */}
     {showFullReport && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
         <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
           <div className="px-6 py-4 border-b border-gray-200 bg-purple-50 flex items-center justify-between">
             <div>
               <h2 className="text-xl font-bold text-purple-900">10-Day Batch History Report</h2>
               <p className="text-sm text-purple-700 mt-1">Environment: {fullReportEnvironment}</p>
             </div>
             <button
               onClick={closeFullReport}
               className="p-2 hover:bg-purple-100 rounded-lg transition-colors duration-150"
             >
               <X className="w-5 h-5 text-purple-600" />
             </button>
           </div>
           
           <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
             <table className="w-full">
               <thead className="bg-gray-50 sticky top-0">
                 <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Date & Time
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Status
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Duration
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overall Status
                   </th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                 {fullReportData.map((batch, index) => {
                   const formatted = formatDateTime(batch.date);
                   return (
                     <tr key={index} className="hover:bg-gray-50">
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                         <div>
                           <div className="font-medium">{formatted.date}</div>
                           <div className="text-xs text-gray-500">{formatted.time}</div>
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="space-y-1">
                           <div className="flex items-center gap-2">
                             <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                               BANK
                             </span>
                             <span className={`px-2 py-1 text-xs font-medium rounded ${
                               batch.bank.status === 'Success' ? 'bg-green-100 text-green-700' : 
                               'bg-yellow-100 text-yellow-700'
                             }`}>
                               {batch.bank.status}
                             </span>
                           </div>
                           <div className="flex items-center gap-2">
                             <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                               CARD
                             </span>
                             <span className={`px-2 py-1 text-xs font-medium rounded ${
                               batch.card.status === 'Success' ? 'bg-green-100 text-green-700' : 
                               'bg-yellow-100 text-yellow-700'
                             }`}>
                               {batch.card.status}
                             </span>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                         <div className="space-y-1">
                           <div className="text-xs">BANK: {batch.bank.duration}</div>
                           <div className="text-xs">CARD: {batch.card.duration}</div>
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="space-y-1">
                           <span className={`px-2 py-1 text-xs font-medium rounded ${
                             batch.bank.status === 'Success' ? 'bg-green-100 text-green-700' : 
                             'bg-yellow-100 text-yellow-700'
                           }`}>
                             BANK: {batch.bank.status}
                           </span>
                           <br />
                           <span className={`px-2 py-1 text-xs font-medium rounded ${
                             batch.card.status === 'Success' ? 'bg-green-100 text-green-700' : 
                             'bg-yellow-100 text-yellow-700'
                           }`}>
                             CARD: {batch.card.status}
                           </span>
                         </div>
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           </div>
         </div>
       </div>
     )}
    </div>
  );
};

export default Status;