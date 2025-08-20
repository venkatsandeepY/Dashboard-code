// Report Filters Component - Pure UI component driven by props
import React from 'react';
import { Filter, Download, AlertCircle } from 'react-feather';
import { Filters, ValidationErrors } from '../../types/slaTypes';

interface ReportFiltersProps {
  value: Filters;
  onChange: (filters: Filters) => void;
  onSubmit: () => void;
  errors: ValidationErrors;
  isLoading: boolean;
}

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

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  value,
  onChange,
  onSubmit,
  errors,
  isLoading
}) => {
  const handleFilterChange = (field: keyof Filters, newValue: string) => {
    let processedValue: any = newValue;
    
    // Handle date fields
    if (field === 'from' || field === 'to') {
      processedValue = newValue ? new Date(newValue) : null;
    }
    
    onChange({
      ...value,
      [field]: processedValue
    });
  };

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
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
            value={value.env}
            onChange={(e) => handleFilterChange('env', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.env ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Environment</option>
            {environments.map((env) => (
              <option key={env.value} value={env.value}>
                {env.label}
              </option>
            ))}
          </select>
          {errors.env && (
            <div className="flex items-center gap-1 text-red-600 text-xs">
              <AlertCircle className="w-3 h-3" />
              {errors.env}
            </div>
          )}
        </div>

        {/* Type Dropdown */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            value={value.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.type ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Type</option>
            {reportTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
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
            value={formatDateForInput(value.from)}
            onChange={(e) => handleFilterChange('from', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.from ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.from && (
            <div className="flex items-center gap-1 text-red-600 text-xs">
              <AlertCircle className="w-3 h-3" />
              {errors.from}
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
            value={formatDateForInput(value.to)}
            onChange={(e) => handleFilterChange('to', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.to ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.to && (
            <div className="flex items-center gap-1 text-red-600 text-xs">
              <AlertCircle className="w-3 h-3" />
              {errors.to}
            </div>
          )}
        </div>
      </div>

      {/* Generate Report Button */}
      <div className="flex justify-end">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
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
  );
};