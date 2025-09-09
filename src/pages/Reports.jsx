import React, { useState, useEffect } from 'react';
import { ChevronDown, AlertCircle, CheckCircle, Download, Filter, AlertTriangle, FileText, Settings, Search, ChevronLeft, ChevronRight, BarChart, Plus, Edit, Tool } from 'react-feather';
import { generateReport } from '../services/reportService';
import CustomDatePicker from '../components/common/CustomDatePicker';
import { 
  getSlaDetails, 
  filterData, 
  prepareChartData, 
  csvFromRows, 
  formatDateMDY, 
  toDaysHrsMins 
} from '../utils/slaDataService';
import SlaRuntimeChart from '../components/SlaRuntimeChart';
import { getBanners, addBanner, updateBanner } from '../services/bannerService';
import EditBannerModal from '../components/modals/EditBannerModal';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('sla-reports');
  const [activeAdminSection, setActiveAdminSection] = useState('overview'); // overview, add-banner, update-batch-phases
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
  
  // Banner Management State
  const [banners, setBanners] = useState([]);
  const [bannerForm, setBannerForm] = useState({ header: '', content: '' });
  const [bannerLoading, setBannerLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

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
    setActiveAdminSection('overview'); // Reset to overview when switching tabs
    setFilters(prev => ({
      ...prev,
      type: ''
    }));
    setErrors({});
    setApiError('');
    setReportGenerated(false);
    setShowSlaData(false);
  };

  // Load banners when admin-tools tab is active
  useEffect(() => {
    if (activeTab === 'admin-tools') {
      loadBanners();
    }
  }, [activeTab]);

  const loadBanners = async () => {
    try {
      const bannerData = await getBanners();
      setBanners(bannerData);
    } catch (error) {
      console.error('Error loading banners:', error);
    }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    if (!bannerForm.header.trim() || !bannerForm.content.trim()) {
      return;
    }

    setBannerLoading(true);
    try {
      await addBanner(bannerForm);
      setBannerForm({ header: '', content: '' });
      await loadBanners();
    } catch (error) {
      console.error('Error adding banner:', error);
    } finally {
      setBannerLoading(false);
    }
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setEditModalOpen(true);
  };

  const handleSaveBanner = async (id, bannerData) => {
    await updateBanner(id, bannerData);
    await loadBanners();
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
                  <CustomDatePicker
                    selected={filters.fromDate}
                    onChange={(date) => handleFilterChange('fromDate', date)}
                    placeholder="MM-DD-YYYY"
                    error={!!errors.fromDate}
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
                  <CustomDatePicker
                    selected={filters.toDate}
                    onChange={(date) => handleFilterChange('toDate', date)}
                    placeholder="MM-DD-YYYY"
                    error={!!errors.toDate}
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
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Admin Tools</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Administrative tools and system management
                  </p>
                </div>
                {activeAdminSection !== 'overview' && (
                  <button
                    onClick={() => setActiveAdminSection('overview')}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    ← Back to Overview
                  </button>
                )}
              </div>
            </div>
            <div className="p-6">
              {/* Overview Section */}
              {activeAdminSection === 'overview' && (
                <>
                  <div className="flex items-center gap-2 mb-6">
                    <Tool className="w-5 h-5 text-gray-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Admin Tasks</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Add Banner Option */}
                    <button
                      onClick={() => setActiveAdminSection('add-banner')}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Plus className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Add Banner</h3>
                          <p className="text-sm text-gray-600">Create system-wide banner notifications</p>
                        </div>
                      </div>
                    </button>

                    {/* Update Batch Phases Option */}
                    <button
                      onClick={() => setActiveAdminSection('update-batch-phases')}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Settings className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Update Batch Phases</h3>
                          <p className="text-sm text-gray-600">Manage batch processing phases</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              )}

              {/* Add Banner Section */}
              {activeAdminSection === 'add-banner' && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Plus className="w-5 h-5 text-gray-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Add Banner</h2>
                  </div>
                  
                  <form onSubmit={handleBannerSubmit} className="bg-gray-50 p-6 rounded-lg mb-8">
                    <div className="grid grid-cols-1 gap-6">
                      {/* Header Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Header <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={bannerForm.header}
                          onChange={(e) => setBannerForm(prev => ({ ...prev, header: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter banner header"
                          required
                        />
                      </div>

                      {/* Content Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={bannerForm.content}
                          onChange={(e) => setBannerForm(prev => ({ ...prev, content: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                          placeholder="Enter banner content"
                          required
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={bannerLoading || !bannerForm.header.trim() || !bannerForm.content.trim()}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          {bannerLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Adding...
                            </>
                          ) : (
                            <>
                              <Plus size={16} />
                              Add Banner
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Banner Details Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <h2 className="text-lg font-semibold text-gray-900">Banner Details</h2>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Header
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Content
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Active
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {banners.length === 0 ? (
                              <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                  No banners found. Add your first banner above.
                                </td>
                              </tr>
                            ) : (
                              banners.map((banner) => (
                                <tr key={banner.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{banner.header}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900 max-w-md truncate">{banner.content}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                      banner.active 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {banner.active ? 'Yes' : 'No'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                      onClick={() => handleEditBanner(banner)}
                                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                                    >
                                      <Edit size={14} />
                                      Edit
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Update Batch Phases Section */}
              {activeAdminSection === 'update-batch-phases' && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Settings className="w-5 h-5 text-gray-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Update Batch Phases</h2>
                  </div>
                  
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Settings className="w-8 h-8 text-gray-500" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Under Development</h4>
                    <p className="text-gray-600 max-w-md mx-auto mb-4">
                      Batch phases management functionality is currently being developed. 
                      This feature will allow you to update and manage batch processing phases across all environments.
                    </p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      🚧 Coming Soon
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Banner Modal */}
        <EditBannerModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          banner={editingBanner}
          onSave={handleSaveBanner}
        />
      </div>
    </div>
  );
};

export default Reports;