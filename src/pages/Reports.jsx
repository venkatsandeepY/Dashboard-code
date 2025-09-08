import React, { useState } from 'react';
import { Download, Filter, FileText, Settings, AlertTriangle, BarChart } from 'lucide-react';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('sla-reports');
  const [filters, setFilters] = useState({
    environment: '',
    type: '',
    fromDate: '',
    toDate: ''
  });

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

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">REPORTS</h1>
            <p className="text-sm text-gray-600 mt-2">
              Generate and download comprehensive reports across all environments
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs */}
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

          {/* SLA Reports Content */}
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
                  <select
                    value={filters.environment}
                    onChange={(e) => handleFilterChange('environment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Environment</option>
                    {environments.map((env) => (
                      <option key={env.value} value={env.value}>
                        {env.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type Dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Type</option>
                    {reportTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Generate Report Button */}
              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
                  <Download className="w-4 h-4" />
                  Generate Report
                </button>
              </div>
            </div>
          )}

          {/* Other tabs content */}
          {activeTab !== 'sla-reports' && (
            <div className="p-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  {activeTab === 'snow-incidents' && <AlertTriangle className="w-8 h-8 text-gray-400" />}
                  {activeTab === 'vits' && <FileText className="w-8 h-8 text-gray-400" />}
                  {activeTab === 'admin-tools' && <Settings className="w-8 h-8 text-gray-400" />}
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Under Development</h4>
                <p className="text-gray-600 max-w-md mx-auto">
                  This feature is currently being developed and will be available soon.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;