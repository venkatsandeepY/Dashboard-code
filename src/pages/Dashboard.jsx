import React from 'react';
import { Code, Zap } from 'react-feather';

const Dashboard = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Zap className="w-16 h-16 text-blue-500" />
            <Code className="w-8 h-8 text-purple-500 absolute -bottom-2 -right-2" />
          </div>
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Development Starts Here</h2>
        <p className="text-gray-600 text-lg font-medium">Dashboard component ready for implementation</p>
      </div>
    </div>
  );
};

export default Dashboard;