import React from 'react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
      </div>
      <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 max-w-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h3>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
          <p className="text-gray-600 text-lg mb-2">Code starts here</p>
          <p className="text-gray-500 text-sm">This page is under development</p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;