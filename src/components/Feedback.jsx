import React from 'react';

const Feedback = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 max-w-md">
          <div className="text-6xl mb-6">💬</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Feedback</h2>
          <p className="text-gray-600 text-lg mb-2">Code starts here</p>
          <p className="text-gray-500 text-sm">Development in progress</p>
        </div>
      </div>
    </div>
  );
};

export default Feedback;