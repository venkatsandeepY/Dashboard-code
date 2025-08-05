import React from 'react';
import { useState, useEffect } from 'react';
import { statusAPI, mockData } from '../services/api';
import { useApi } from '../hooks/useApi';
import { CheckCircle, AlertTriangle, XCircle, Clock, RefreshCw } from 'lucide-react';

const Status = () => {
  // API hooks for fetching status data
  const { data: systemStatus, loading: systemLoading, error: systemError, refetch: refetchSystem } = useApi(
    () => Promise.resolve(mockData.status.system), // Replace with statusAPI.getSystemStatus() when backend is ready
    []
  );

  const { data: services, loading: servicesLoading, error: servicesError } = useApi(
    () => Promise.resolve(mockData.status.services), // Replace with statusAPI.getServiceHealth() when backend is ready
    []
  );

  const { data: alerts, loading: alertsLoading, error: alertsError } = useApi(
    () => Promise.resolve(mockData.status.alerts), // Replace with statusAPI.getAlerts() when backend is ready
    []
  );

  // Status icon helper
  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'down':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  // Status color helper
  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Status</h2>
        <p className="text-gray-600">System health and service status monitoring</p>
      </div>

      {/* Overall System Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Overall System Status</h3>
          <button 
            onClick={refetchSystem}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={systemLoading}
          >
            <RefreshCw className={`w-5 h-5 ${systemLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        {systemLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : systemError ? (
          <div className="text-red-600 p-4 bg-red-50 rounded-lg">
            Error loading system status: {systemError}
          </div>
        ) : systemStatus ? (
          <div className={`p-4 rounded-lg border ${getStatusColor(systemStatus.status)}`}>
            <div className="flex items-center space-x-3">
              {getStatusIcon(systemStatus.status)}
              <div>
                <p className="font-semibold capitalize">{systemStatus.status}</p>
                <p className="text-sm">
                  Uptime: {systemStatus.uptime} • Last checked: {new Date(systemStatus.lastCheck).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Service Health */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Service Health</h3>
        
        {servicesLoading ? (
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4 p-4">
                <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : servicesError ? (
          <div className="text-red-600 p-4 bg-red-50 rounded-lg">
            Error loading services: {servicesError}
          </div>
        ) : services ? (
          <div className="space-y-3">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <p className="text-sm text-gray-600 capitalize">{service.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{service.responseTime}</p>
                  <p className="text-xs text-gray-500">Response Time</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Alerts and Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Alerts</h3>
        
        {alertsLoading ? (
          <div className="space-y-4">
            {Array(2).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : alertsError ? (
          <div className="text-red-600 p-4 bg-red-50 rounded-lg">
            Error loading alerts: {alertsError}
          </div>
        ) : alerts && alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                alert.type === 'error' ? 'bg-red-50 border-red-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start space-x-3">
                  {alert.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  ) : alert.type === 'error' ? (
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{alert.message}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <p>No alerts at this time</p>
            <p className="text-sm">All systems are running normally</p>
          </div>
        )}
      </div>

      {/* API Integration Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-2">🔧 Backend Integration Ready</h4>
        <p className="text-blue-800 mb-4">
          This component is ready for backend integration. Replace the mock data calls with actual API endpoints:
        </p>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• <code>statusAPI.getSystemStatus()</code> - for overall system status</li>
          <li>• <code>statusAPI.getServiceHealth()</code> - for individual service health</li>
          <li>• <code>statusAPI.getAlerts()</code> - for alerts and notifications</li>
        </ul>
      </div>
    </div>
  );
};

export default Status;
        </div>
      </div>
      </div>
    </div>
  );
};

export default Status;