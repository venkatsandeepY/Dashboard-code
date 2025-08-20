import React, { useState, useEffect } from 'react';
import { ChevronDown, AlertCircle, CheckCircle, Download, Filter, AlertTriangle, FileText, Settings, Search, ChevronLeft, ChevronRight, BarChart } from 'react-feather';
import { generateReport } from '../services/reportService';
import { 
  getSlaDetails, 
  filterData, 
  prepareChartData, 
  csvFromRows, 
  formatDateMDY, 
  toDaysHrsMins 
} from '../utils/slaDataService';
import SlaRuntimeChart from '../components/SlaRuntimeChart';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('sla-reports');
  const [filters, setFilters] = useState({
    environment: '',
    type: '',
    fromDate: '',
    toDate: ''
  });
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [apiError, setApiError] = useState('');
  
  // SLA Data State - Single Source of Truth
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSlaData, setShowSlaData] = useState(false);
  
  // Table State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'runDate', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const tabs = [
    { id: 'sla-reports', label: 'SLA Reports', icon: BarChart },
    { id: 'snow-incidents', label: 'SNOW Incidents', icon: AlertTriangle },
    { id: 'vits', label: 'VITS', icon: FileText },
    { id: 'admin-tools', label: 'Admin Tools', icon: Settings }
  ];

  const environments = [
    { value: 'ALL', label: 'ALL' },
    { value: 'ASYS', label: 'ASYS' },
    { value: 'TSYS', label: 'TSYS' },
    { value: 'MST0', label: 'MST0' },
    { value: 'OSYS', label: 'OSYS' },
    { value: 'ECT0', label: 'ECT0' },
    { value: 'QSYS', label: 'QSYS' },
    { value: 'VST0', label: 'VST0' }
  ];

  const reportTypes = [
    { value: 'ALL', label: 'ALL' },
    { value: 'BANK', label: 'BANK' },
    { value: 'CARD', label: 'CARD' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!filters.environment) {
      newErrors.environment = 'Environment is required';
    }

    if (!filters.type) {
      newErrors.type = 'Report type is required';
    }

    if (!filters.fromDate) {
      newErrors.fromDate = 'From date is required';
    }

    if (!filters.toDate) {
      newErrors.toDate = 'To date is required';
    }

    if (filters.fromDate && filters.toDate) {
      const fromDate = new Date(filters.fromDate);
      const toDate = new Date(filters.toDate);
      
      if (fromDate > toDate) {
        newErrors.toDate = 'To date must be after from date';
      }

      const today = new Date();
      if (fromDate > today) {
        newErrors.fromDate = 'From date cannot be in the future';
      }

      if (toDate > today) {
        newErrors.toDate = 'To date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setFilters(prev => ({
      ...prev,
      type: ''
    }));
    setErrors({});
    setApiError('');
    setReportGenerated(false);
    setShowSlaData(false);
  };

  // Handle form submission for SLA reports
  const handleSlaSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    console.log('🚀 Loading SLA data after Generate Report clicked...');
    setLoading(true);
    setApiError('');
    
    try {
      // Load fresh data
      const result = await getSlaDetails(filters);
      setRawData(result.rawData);
      setFilteredData(result.filteredData);
      setShowSlaData(true);
    } catch (error) {
      console.error('❌ Error loading SLA data:', error);
      setApiError('Failed to load SLA data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Chart data preparation
  const getChartData = (chartType) => {
    console.log('📊 Preparing chart data for:', chartType, 'with', filteredData.length, 'records');
    return prepareChartData(filteredData, chartType);
  };
  
  // Determine chart types based on filter selection
  let leftChartType, rightChartType;
  if (!filters.type || filters.type === 'ALL') {
    leftChartType = 'CARD';
    rightChartType = 'BANK';
  } else {
    // Show selected type in both charts
    leftChartType = filters.type;
    rightChartType = filters.type;
  }
  
  const leftChartData = getChartData(leftChartType);
  const rightChartData = getChartData(rightChartType);

  // Table data processing - search within filtered data
  const searchFilteredData = filteredData.filter(item => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      item.env.toLowerCase().includes(searchLower) ||
      item.type.toLowerCase().includes(searchLower) ||
      item.phase.toLowerCase().includes(searchLower) ||
      item.status.toLowerCase().includes(searchLower) ||
      formatDateMDY(item.runDate).includes(searchTerm)
    );
  });

  // Sort the search-filtered data
  const sortedData = [...searchFilteredData].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // Handle date sorting
      if (sortConfig.key === 'runDate' || sortConfig.key === 'lrd') {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      // Handle string sorting
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle CSV download
  const handleDownloadCSV = () => {
    console.log('📄 Downloading CSV with', sortedData.length, 'records');
    const blob = csvFromRows(sortedData);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sla-application-details-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-50';
      case 'FAILED': return 'text-red-600 bg-red-50';
      case 'PENDING': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">REPORTS</h1>
            <p className="text-sm text-gray-600 mt-2">
              Generate and download comprehensive reports across all environments
            </p>
          </div>
          <div className="flex items-center gap-4">
            <img 
              src="/image copy.png" 
              alt="Discover Logo" 
              className="h-10 rounded-lg shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Report Filters Section - Only show for SLA Reports */}
          {activeTab === 'sla-reports' && (
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">Report Filters</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Environment Dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Environment <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={filters.environment}
                      onChange={(e) => handleFilterChange('environment', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.environment ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                      } appearance-none pr-10`}
                    >
                      <option value="">Select Environment</option>
                      {environments.map((env) => (
                        <option key={env.value} value={env.value}>
                          {env.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.environment && (
                    <div className="flex items-center gap-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      {errors.environment}
                    </div>
                  )}
                </div>

                {/* Type Dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.type ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                      } appearance-none pr-10`}
                    >
                      <option value="">Select Type</option>
                      {reportTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.type && (
                    <div className="flex items-center gap-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      {errors.type}
                    </div>
                  )}
                </div>

                {/* From Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    From Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.fromDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.fromDate && (
                    <div className="flex items-center gap-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      {errors.fromDate}
                    </div>
                  )}
                </div>

                {/* To Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    To Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={filters.toDate}
                    onChange={(e) => handleFilterChange('toDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.toDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.toDate && (
                    <div className="flex items-center gap-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      {errors.toDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Generate Report Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSlaSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error Generating Report</h3>
                <p className="text-sm text-red-700 mt-1">{apiError}</p>
              </div>
            </div>
          </div>
        )}

        {/* SLA Reports Content */}
        {activeTab === 'sla-reports' && showSlaData && (
          <>
            {/* Runtime Charts */}
            <div className="row mb-4">
              <div className="col-lg-6 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                <SlaRuntimeChart
                  title={`Weighted Avg vs Actual Runtime — ${leftChartType} (Duration in Hours)`}
                  data={leftChartData}
                  environment={filters.environment || 'ALL'}
                  type={leftChartType}
                />
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                <SlaRuntimeChart
                  title={`Weighted Avg vs Actual Runtime — ${rightChartType} (Duration in Hours)`}
                  data={rightChartData}
                  environment={filters.environment || 'ALL'}
                  type={rightChartType}
                />
                  </div>
                </div>
              </div>
            </div>

            {/* Application Details Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Application Details - {filters.environment || 'ALL'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {sortedData.length} records found
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    {/* Download CSV */}
                    <button
                      onClick={handleDownloadCSV}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                      Download CSV
                    </button>
                  </div>
                </div>
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className="text-gray-500">Loading application details...</div>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-gray-400 mb-2">📊</div>
                  <div className="text-gray-500 font-medium">No data for selected filters</div>
                  <div className="text-gray-400 text-sm mt-2">Try adjusting your filter criteria</div>
                </div>
              ) : (
                <>
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          {[
                            { key: 'runDate', label: 'Run Date' },
                            { key: 'type', label: 'Type' },
                            { key: 'lrd', label: 'LRD' },
                            { key: 'env', label: 'ENV' },
                            { key: 'phase', label: 'Phase' },
                            { key: 'startTime', label: 'Start Time' },
                            { key: 'endTime', label: 'End Time' },
                            { key: 'duration', label: 'Days:Hrs:Mins' },
                            { key: 'status', label: 'Status' }
                          ].map((column) => (
                            <th
                              key={column.key}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort(column.key)}
                            >
                              <div className="flex items-center gap-1">
                                {column.label}
                                {sortConfig.key === column.key && (
                                  <span className="text-blue-500">
                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                  </span>
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.map((row) => (
                          <tr key={row.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDateMDY(row.runDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {row.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDateMDY(row.lrd)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {row.env}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {row.phase}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {row.startTime.toLocaleTimeString('en-US', { hour12: false })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {row.endTime.toLocaleTimeString('en-US', { hour12: false })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {toDaysHrsMins(row.startTime, row.endTime)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(row.status)}`}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} results
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                          </button>
                          
                          {/* Page numbers */}
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }
                              
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                    currentPage === pageNum
                                      ? 'bg-blue-600 text-white'
                                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            })}
                          </div>
                          
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {/* SNOW Incidents Tab */}
        {activeTab === 'snow-incidents' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">SNOW Incidents</h3>
              <p className="text-sm text-gray-600 mt-1">
                ServiceNow incident tracking and reporting
              </p>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-orange-500" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Under Development</h4>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  SNOW Incidents reporting functionality is currently being developed. 
                  This feature will provide comprehensive ServiceNow incident tracking and analysis.
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                  🚧 Coming Soon
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VITS Tab */}
        {activeTab === 'vits' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">VITS</h3>
              <p className="text-sm text-gray-600 mt-1">
                Vendor Issue Tracking System reports
              </p>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Under Development</h4>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  VITS reporting functionality is currently being developed. 
                  This feature will provide vendor issue tracking and resolution analytics.
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  🚧 Coming Soon
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Tools Tab */}
        {activeTab === 'admin-tools' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Admin Tools</h3>
              <p className="text-sm text-gray-600 mt-1">
                Administrative tools and system management reports
              </p>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Settings className="w-8 h-8 text-purple-500" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Under Development</h4>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  Admin Tools functionality is currently being developed. 
                  This feature will provide system administration and management capabilities.
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  🚧 Coming Soon
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;