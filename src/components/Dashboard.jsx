import React from 'react';
import { useState, useEffect } from 'react';
import { dashboardAPI, mockData } from '../services/api';
import { useApi } from '../hooks/useApi';
import { Activity, Users, Server, TrendingUp, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  // API hooks for fetching dashboard data
  const { data: overview, loading: overviewLoading, error: overviewError, refetch: refetchOverview } = useApi(
    () => Promise.resolve(mockData.dashboard.overview), // Replace with dashboardAPI.getOverview() when backend is ready
    []
  );

  const { data: metrics, loading: metricsLoading, error: metricsError } = useApi(
    () => Promise.resolve(mockData.dashboard.metrics), // Replace with dashboardAPI.getMetrics() when backend is ready
    []
  );

  const { data: activities, loading: activitiesLoading, error: activitiesError } = useApi(
    () => Promise.resolve(mockData.dashboard.activities), // Replace with dashboardAPI.getRecentActivities() when backend is ready
    []
  );

  // Loading component
  const LoadingCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  // Error component
  const ErrorCard = ({ error, onRetry }) => (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <p className="text-red-600 mb-2">Error loading data</p>
      <p className="text-red-500 text-sm mb-4">{error}</p>
      <button 
        onClick={onRetry}
        className="text-red-600 hover:text-red-800 text-sm font-medium"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Overview of system performance and activities</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewLoading ? (
          Array(4).fill(0).map((_, i) => <LoadingCard key={i} />)
        ) : overviewError ? (
          <div className="col-span-full">
            <ErrorCard error={overviewError} onRetry={refetchOverview} />
          </div>
        ) : overview ? (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{overview.totalUsers?.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Services</p>
                  <p className="text-3xl font-bold text-gray-900">{overview.activeServices}</p>
                </div>
                <Server className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">System Uptime</p>
                  <p className="text-3xl font-bold text-gray-900">{overview.systemUptime}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Last Updated</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(overview.lastUpdated).toLocaleTimeString()}
                  </p>
                </div>
                <RefreshCw className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* System Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">System Metrics</h3>
        {metricsLoading ? (
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : metricsError ? (
          <ErrorCard error={metricsError} onRetry={() => window.location.reload()} />
        ) : metrics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">{metric.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    metric.status === 'normal' ? 'bg-green-100 text-green-800' :
                    metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {metric.status}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {metric.value}{metric.unit}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h3>
        {activitiesLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activitiesError ? (
          <ErrorCard error={activitiesError} onRetry={() => window.location.reload()} />
        ) : activities ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                <Activity className="w-8 h-8 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">
                    by {activity.user} • {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* API Integration Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-2">🔧 Backend Integration Ready</h4>
        <p className="text-blue-800 mb-4">
          This component is ready for backend integration. Replace the mock data calls with actual API endpoints:
        </p>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• <code>dashboardAPI.getOverview()</code> - for overview statistics</li>
          <li>• <code>dashboardAPI.getMetrics()</code> - for system metrics</li>
          <li>• <code>dashboardAPI.getRecentActivities()</code> - for activity feed</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;