import React from 'react';
import { Code, Rocket } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in-up">
      <div className="text-center card card--glass p-xl hover-lift">
        <div className="flex justify-center mb-6 animate-bounce-in">
          <div className="relative">
            <Rocket className="w-16 h-16 text-blue-500 animate-float" />
            <Code className="w-8 h-8 text-purple-500 absolute -bottom-2 -right-2 animate-pulse" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in-up">Development Starts Here</h2>
        <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in-up">Development Starts Here</h2>
        <p className="text-gray-200 text-lg animate-fade-in-up">Dashboard component ready for implementation</p>
      </div>
    </div>
  );
};

export default Dashboard;