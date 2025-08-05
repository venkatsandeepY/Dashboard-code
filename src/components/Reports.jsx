import React from 'react';
import { useState, useEffect } from 'react';
import { reportsAPI, mockData } from '../services/api';
import { useApi, useApiSubmit } from '../hooks/useApi';
import { FileText, Download, Eye, Plus, Calendar, Filter, Search } from 'lucide-react';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // API hooks for fetching reports data
  const { data: reports, loading: reportsLoading, error: reportsError, refetch: refetchReports } = useApi(
    () => Promise.resolve(mockData.reports), // Replace with reportsAPI.getReportsList() when backend is ready
    []
  );

  // API hook for generating reports
  const { submit: generateReport, submitting: generating, submitError: generateError, submitSuccess: generateSuccess } = useApiSubmit();

  // Filter reports based on search and type
  const filteredReports = reports ? reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesType;
  }) : [];

  // Handle report generation
  const handleGenerateReport = async (reportConfig) => {
    try {
      await generateReport(
        (config) => Promise.resolve({ id: Date.now(), ...config }), // Replace with reportsAPI.generateReport() when backend is ready
        reportConfig
      );
      refetchReports();
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  // Handle report download
  const handleDownloadReport = async (reportId, format = 'pdf') => {
    try {
      // Replace with actual download logic when backend is ready
      console.log(`Downloading report ${reportId} as ${format}`);
      // const blob = await reportsAPI.downloadReport(reportId, format);
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `report-${reportId}.${format}`;
      // a.click();
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  // Status badge helper
  const getStatusBadge = (status) => {
    const statusConfig = {
      ready: { color: 'bg-green-100 text-green-800', text: 'Ready' },
      generating: { color: 'bg-yellow-100 text-yellow-800', text: 'Generating' },
      failed: { color: 'bg-red-100 text-red-800', text: 'Failed' },
    };
    
    const config = statusConfig[status] || statusConfig.ready;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Reports</h2>
        <p className="text-gray-600">Generate and manage system reports</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Types</option>
                <option value="performance">Performance</option>
                <option value="activity">Activity</option>
                <option value="health">Health</option>
              </select>
            </div>
          </div>
          
          {/* Generate Report Button */}
          <button
            onClick={() => handleGenerateReport({ 
              name: 'Custom Report', 
              type: 'performance', 
              config: { timeRange: '7d' } 
            })}
            disabled={generating}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{generating ? 'Generating...' : 'Generate Report'}</span>
          </button>
        </div>
        
        {generateError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            Error generating report: {generateError}
          </div>
        )}
        
        {generateSuccess && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            Report generation started successfully!
          </div>
        )}
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Available Reports</h3>
        </div>
        
        <div className="p-6">
          {reportsLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="w-20 h-6 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : reportsError ? (
            <div className="text-center py-8">
              <div className="text-red-600 p-4 bg-red-50 rounded-lg">
                Error loading reports: {reportsError}
              </div>
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <h4 className="font-medium text-gray-900">{report.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="capitalize">{report.type}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(report.status)}
                    
                    {report.status === 'ready' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => console.log('View report', report.id)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Report"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadReport(report.id)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Download Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No reports found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* API Integration Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-2">🔧 Backend Integration Ready</h4>
        <p className="text-blue-800 mb-4">
          This component is ready for backend integration. Replace the mock data calls with actual API endpoints:
        </p>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• <code>reportsAPI.getReportsList()</code> - for fetching available reports</li>
          <li>• <code>reportsAPI.generateReport(config)</code> - for generating new reports</li>
          <li>• <code>reportsAPI.downloadReport(id, format)</code> - for downloading reports</li>
        </ul>
      </div>
    </div>
  );
};

export default Reports;