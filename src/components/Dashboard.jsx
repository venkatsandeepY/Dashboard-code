import React from 'react';
import { useApi } from '../hooks/useApi';
import { dashboardAPI } from '../services/api';
import { BarChart3, Users, Server, TrendingUp, Activity, Clock, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { data: overview, loading: overviewLoading, error: overviewError } = useApi(dashboardAPI.getOverview);
  const { data: metrics, loading: metricsLoading, error: metricsError } = useApi(dashboardAPI.getMetrics);
  const { data: activities, loading: activitiesLoading, error: activitiesError } = useApi(dashboardAPI.getRecentActivities);

  if (overviewLoading || metricsLoading || activitiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (overviewError || metricsError || activitiesError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Monitor your system performance and activities</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {overview?.lastUpdated ? new Date(overview.lastUpdated).toLocaleTimeString() : 'Loading...'}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{overview?.totalUsers || '0'}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Services</p>
              <p className="text-3xl font-bold text-gray-900">{overview?.activeServices || '0'}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Server className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Uptime</p>
              <p className="text-3xl font-bold text-gray-900">{overview?.systemUptime || '0%'}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Performance</p>
              <p className="text-3xl font-bold text-green-600">Good</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Metrics */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">System Metrics</h2>
            <div className="space-y-4">
              {metrics?.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">{metric.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-gray-900">
                      {metric.value}{metric.unit}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      metric.status === 'normal' ? 'bg-green-100 text-green-800' :
                      metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {metric.status}
                    </span>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  No metrics data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h2>
            <div className="space-y-4">
              {activities?.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">by {activity.user}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  No recent activities
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;