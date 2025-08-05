import React from 'react';

const Status = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Status</h2>
      </div>
      <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 max-w-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Status</h3>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Status</h2>
          <p className="text-gray-600 text-lg mb-2">Page will come soon</p>
          <p className="text-gray-500 text-sm">This section is under development</p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Status;