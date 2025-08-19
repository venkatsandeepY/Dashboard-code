import React, { useState, useEffect } from 'react';
import { Calendar, BarChart ,ChevronDown, AlertCircle, CheckCircle, Download, Filter, AlertTriangle, FileText, Settings } from 'react-feather';
import { generateReport } from '../services/reportService';

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

  const tabs = [
    { id: 'sla-reports', label: 'SLA Reports', icon: BarChart },
    { id: 'snow-incidents', label: 'SNOW Incidents', icon: AlertTriangle },
    { id: 'vits', label: 'VITS', icon: FileText },
    { id: 'admin-tools', label: 'Admin Tools', icon: Settings }
  ];

  const environments = [
    { value: 'ASYS', label: 'ASYS' },
    { value: 'TSYS', label: 'TSYS' },
    { value: 'MST0', label: 'MST0' },
    { value: 'OSYS', label: 'OSYS' },
    { value: 'ECT0', label: 'ECT0' },
    { value: 'QSYS', label: 'QSYS' },
    { value: 'VST0', label: 'VST0' }
  ];

  const reportTypes = {
    'sla-reports': [
      { value: 'bank', label: 'Bank' },
      { value: 'card', label: 'Card' }
    ],
    'snow-incidents': [
      { value: 'bank', label: 'Bank' },
      { value: 'card', label: 'Card' }
    ],
    'vits': [
      { value: 'bank', label: 'Bank' },
      { value: 'card', label: 'Card' }
    ],
    'admin-tools': [
      { value: 'bank', label: 'Bank' },
      { value: 'card', label: 'Card' }
    ]
  };

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

    // Reset type when tab changes
    if (field === 'activeTab') {
      setFilters(prev => ({
        ...prev,
        type: ''
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
  };

  const handleGenerateReport = async () => {
    if (!validateForm()) {
      return;
    }

    setIsGenerating(true);
    setApiError('');
    setReportGenerated(false);

    try {
      const reportData = {
        tab: activeTab,
        environment: filters.environment,
        type: filters.type,
        fromDate: filters.fromDate,
        toDate: filters.toDate
      };

      await generateReport(reportData);
      setReportGenerated(true);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setReportGenerated(false);
      }, 5000);

    } catch (error) {
      console.error('Report generation failed:', error);
      setApiError(error.message || 'Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const getCurrentTypes = () => {
    return reportTypes[activeTab] || [];
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

          {/* Report Filters Section */}
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
                    }`}
                  >
                    <option value="">Select Environment</option>
                    {environments.map((env) => (
                      <option key={env.value} value={env.value}>
                        {env.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
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
                    }`}
                  >
                    <option value="">Select Type</option>
                    {getCurrentTypes().map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
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
                <div className="relative">
                  <input
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.fromDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
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
                <div className="relative">
                  <input
                    type="date"
                    value={filters.toDate}
                    onChange={(e) => handleFilterChange('toDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.toDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
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
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isGenerating ? (
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
        </div>

        {/* Success Message */}
        {reportGenerated && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Report Generated Successfully</h3>
                <p className="text-sm text-green-700 mt-1">
                  Your {getCurrentTypes().find(t => t.value === filters.type)?.label || 'report'} for {filters.environment} 
                  from {formatDate(filters.fromDate)} to {formatDate(filters.toDate)} has been generated and downloaded.
                </p>
              </div>
            </div>
          </div>
        )}

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

        {/* Report Preview/Summary Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Report Summary</h3>
            <p className="text-sm text-gray-600 mt-1">
              Configure your filters above and generate reports for the selected criteria
            </p>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Download className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Report Generated</h4>
              <p className="text-gray-600 max-w-md mx-auto">
                Select your filters and click "Generate Report" to create a comprehensive report 
                for the {tabs.find(t => t.id === activeTab)?.label} category.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;