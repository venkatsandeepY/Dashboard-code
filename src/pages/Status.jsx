import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Clock, Play, History, MoreHorizontal, RefreshCw, CheckCircle, AlertCircle, Pause, RotateCcw, Download, FileText, Eye, Calendar } from 'lucide-react';
import { fetchBatchData, fetchJobsData, fetchHistoryData } from '../data/mockData';

const Status = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batchData, setBatchData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load batch data on component mount
  useEffect(() => {
    const loadBatchData = async () => {
      try {
        setLoading(true);
        const data = await fetchBatchData();
        setBatchData(data);
      } catch (error) {
        console.error('Error loading batch data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBatchData();
  }, []);

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

  const JobsDropdown = ({ environment }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(false);
    const dropdownRef = useRef(null);
    
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);
    
    // Load jobs data when dropdown opens
    useEffect(() => {
      if (isOpen && jobs.length === 0) {
        const loadJobs = async () => {
          try {
            setLoadingJobs(true);
            const jobsData = await fetchJobsData(environment);
            setJobs(jobsData);
          } catch (error) {
            console.error('Error loading jobs:', error);
          } finally {
            setLoadingJobs(false);
          }
        };
        loadJobs();
      }
    }, [isOpen, environment, jobs.length]);

    const getJobIcon = (iconName) => {
      const icons = {
        Play,
        CheckCircle,
        Clock,
        AlertCircle
      };
      return icons[iconName] || Clock;
    };

    return (
      <div className="relative group" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
        >
          <Play className="w-4 h-4" />
          Jobs
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Play className="w-4 h-4 text-blue-600" />
                Recent Jobs - {environment}
              </h3>
              <p className="text-xs text-gray-600 mt-1">Active and recent job executions</p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {loadingJobs ? (
                <div className="p-4 text-center text-gray-500">Loading jobs...</div>
              ) : jobs.length > 0 ? (
                jobs.map((job, index) => {
                  const JobIcon = getJobIcon(job.icon);
                  return (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <JobIcon className={`w-4 h-4 ${job.color}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{job.name}</p>
                        <p className="text-xs text-gray-500">Started: {job.startTime}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      job.status === 'Running' ? 'bg-blue-100 text-blue-700' :
                      job.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      job.status === 'Queued' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No recent jobs found for {environment}
                </div>
              )}
            </div>
            <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-150 flex items-center justify-center gap-1">
                  <Eye className="w-3 h-3" />
                  View All
                </button>
                <button className="flex-1 px-3 py-2 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-150 flex items-center justify-center gap-1">
                  <Play className="w-3 h-3" />
                  Start New
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const HistoryDropdown = ({ environment }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const dropdownRef = useRef(null);
    
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);
    
    // Load history data when dropdown opens
    useEffect(() => {
      if (isOpen && history.length === 0) {
        const loadHistory = async () => {
          try {
            setLoadingHistory(true);
            const historyData = await fetchHistoryData(environment);
            setHistory(historyData);
          } catch (error) {
            console.error('Error loading history:', error);
          } finally {
            setLoadingHistory(false);
          }
        };
        loadHistory();
      }
    }, [isOpen, environment, history.length]);

    return (
      <div className="relative group" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
        >
          <History className="w-4 h-4" />
          History
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <History className="w-4 h-4 text-purple-600" />
                Batch History - {environment}
              </h3>
              <p className="text-xs text-gray-600 mt-1">Recent batch execution history</p>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {loadingHistory ? (
                <div className="p-4 text-center text-gray-500">Loading history...</div>
              ) : history.length > 0 ? (
                history.map((batch, index) => {
                const formatted = formatDateTime(batch.completedAt);
                return (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                            {batch.type}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            batch.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {batch.status}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="font-medium text-gray-900">{formatted.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span>{formatted.time}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                            <span>Duration: {batch.duration}</span>
                            <span>Records: {batch.records}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
                })
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No batch history found for {environment}
                </div>
              )}
            </div>
            <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-150 flex items-center justify-center gap-1">
                  <FileText className="w-3 h-3" />
                  Full Report
                </button>
                <button className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150 flex items-center justify-center gap-1">
                  <Download className="w-3 h-3" />
                  Export
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
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
              Last Updated: {formatDateTime(currentTime).date} at {formatDateTime(currentTime).time}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <>
        <>
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
                {batchData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
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
                      <div className="flex items-center gap-3">
                        <JobsDropdown environment={row.environment} />
                        <HistoryDropdown environment={row.environment} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Batch Runs Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-in slide-in-from-bottom duration-700">
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
                {recentRuns.map((run, index) => {
                  const formatted = formatDateTime(run.completedAt);
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-all duration-200 animate-in fade-in" style={{ animationDelay: `${(index + batchData.length) * 100}ms` }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                          <span className="text-sm font-medium text-gray-900">{run.environment}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full animate-in scale-in duration-300">
                          {run.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium">{formatted.date}</div>
                            <div className="text-xs text-gray-500">{formatted.time}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          {run.duration}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 transform hover:scale-105 ${
                          run.status === 'Success' ? 'text-green-700 bg-green-100 shadow-green-200' : 'text-yellow-700 bg-yellow-100 shadow-yellow-200'
                        } shadow-sm`}>
                          {run.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          )}
        </div>
        </>
        </>
      </div>
    </div>
  );
};

export default Status;