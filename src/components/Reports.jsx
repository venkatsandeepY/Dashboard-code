import React from 'react';
import { Code, FileText } from 'lucide-react';

const Reports = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <FileText className="w-16 h-16 text-orange-500" />
            <Code className="w-8 h-8 text-purple-500 absolute -bottom-2 -right-2" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Development Starts Here</h2>
        <p className="text-gray-600 text-lg">Reports component ready for implementation</p>
      </div>
    </div>
  );
};

export default Reports;