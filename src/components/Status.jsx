import React from 'react';
import { useApi } from '../hooks/useApi';
import { statusAPI } from '../services/api';
import { Server, CheckCircle, AlertTriangle, XCircle, Clock, Wifi, Database, Shield, HardDrive } from 'lucide-react';

const Status = () => {
  const { data: systemStatus, loading: systemLoading, error: systemError } = useApi(statusAPI.getSystemStatus);
  const { data: services, loading: servicesLoading, error: servicesError } = useApi(statusAPI.getServiceHealth);
  const { data: alerts, loading: alertsLoading, error: alertsError } = useApi(statusAPI.getAlerts);

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

  const getServiceIcon = (serviceName) => {
    switch (serviceName.toLowerCase()) {
      case 'database':
        return <Database className="w-6 h-6" />;
      case 'api gateway':
        return <Wifi className="w-6 h-6" />;
      case 'authentication':
        return <Shield className="w-6 h-6" />;
      case 'file storage':
        return <HardDrive className="w-6 h-6" />;
      default:
        return <Server className="w-6 h-6" />;
    }
  };

  if (systemLoading || servicesLoading || alertsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (systemError || servicesError || alertsError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Status</h2>
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
          <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
          <p className="text-gray-600 mt-1">Monitor system health and service availability</p>
        </div>
        <div className="text-sm text-gray-500">
          Last check: {systemStatus?.lastCheck ? new Date(systemStatus.lastCheck).toLocaleTimeString() : 'Loading...'}
        </div>
      </div>

      {/* Overall System Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${
              systemStatus?.status === 'operational' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {getStatusIcon(systemStatus?.status)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {systemStatus?.status === 'operational' ? 'All Systems Operational' : 'System Issues Detected'}
              </h2>
              <p className="text-gray-600">
                Uptime: {systemStatus?.uptime || '0%'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Service Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services?.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  service.status === 'operational' ? 'bg-green-100 text-green-600' :
                  service.status === 'degraded' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {getServiceIcon(service.name)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600">Response: {service.responseTime}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(service.status)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                  service.status === 'operational' ? 'bg-green-100 text-green-800' :
                  service.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {service.status}
                </span>
              </div>
            </div>
          )) || (
            <div className="col-span-2 text-center py-8 text-gray-500">
              No service data available
            </div>
          )}
        </div>
      </div>

      {/* Alerts and Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Alerts</h2>
        <div className="space-y-4">
          {alerts?.map((alert) => (
            <div key={alert.id} className={`flex items-start space-x-3 p-4 rounded-lg border-l-4 ${
              alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
              alert.type === 'error' ? 'bg-red-50 border-red-400' :
              'bg-blue-50 border-blue-400'
            }`}>
              <div className={`p-2 rounded-lg ${
                alert.type === 'warning' ? 'bg-yellow-100' :
                alert.type === 'error' ? 'bg-red-100' :
                'bg-blue-100'
              }`}>
                {alert.type === 'warning' ? (
                  <AlertTriangle className={`w-4 h-4 ${
                    alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                  }`} />
                ) : alert.type === 'error' ? (
                  <XCircle className="w-4 h-4 text-red-600" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{alert.message}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          )) || (
            <div className="text-center py-8 text-gray-500">
              No recent alerts
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Status;