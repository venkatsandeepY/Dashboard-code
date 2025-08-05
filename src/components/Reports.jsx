import React, { useState } from 'react';
import { useApi, useApiSubmit } from '../hooks/useApi';
import { reportsAPI } from '../services/api';
import { FileText, Download, Search, Filter, Plus, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { data: reports, loading, error, refetch } = useApi(reportsAPI.getReportsList);
  const { submit: generateReport, submitting } = useApiSubmit();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'generating':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleGenerateReport = async (reportType) => {
    try {
      await generateReport(reportsAPI.generateReport, { type: reportType });
      refetch(); // Refresh the reports list
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  const handleDownloadReport = async (reportId) => {
    try {
      // In a real implementation, this would trigger a download
      console.log('Downloading report:', reportId);
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  const filteredReports = reports?.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesFilter;
  }) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Reports</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and manage system reports</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleGenerateReport('performance')}
            disabled={submitting}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Types</option>
              <option value="performance">Performance</option>
              <option value="activity">Activity</option>
              <option value="health">Health</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Available Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{report.name}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600 capitalize">
                          Type: {report.type}
                        </span>
                        <span className="text-sm text-gray-600">
                          Created: {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(report.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        report.status === 'ready' ? 'bg-green-100 text-green-800' :
                        report.status === 'generating' ? 'bg-blue-100 text-blue-800' :
                        report.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    {report.status === 'ready' && (
                      <button
                        onClick={() => handleDownloadReport(report.id)}
                        className="flex items-center space-x-2 px-3 py-1 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Generate your first report to get started'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;