import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Clock, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    runningJobs: 0,
    failedJobs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats({
        totalJobs: 156,
        completedJobs: 142,
        runningJobs: 8,
        failedJobs: 6
      });
      setLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1">
              +{trend}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-sm text-gray-600">
              Overview of system performance and job statistics
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Jobs"
            value={stats.totalJobs}
            icon={BarChart3}
            color="bg-blue-500"
            trend="12"
          />
          <StatCard
            title="Completed"
            value={stats.completedJobs}
            icon={CheckCircle}
            color="bg-green-500"
            trend="8"
          />
          <StatCard
            title="Running"
            value={stats.runningJobs}
            icon={Clock}
            color="bg-yellow-500"
          />
          <StatCard
            title="Failed"
            value={stats.failedJobs}
            icon={AlertTriangle}
            color="bg-red-500"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Activity Feed</h3>
              <p className="text-gray-600">Recent system activities will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;