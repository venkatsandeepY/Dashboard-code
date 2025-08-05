import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="bg-[#1F1246] text-white shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left side - Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>

        {/* Right side - Dummy Image */}
        <div className="flex items-center">
          <div className="bg-white text-[#1F1246] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">D</span>
            </div>
            <span>DISCOVER</span>
          </div>
        <h1 className="text-2xl font-bold">ESQM Operations Dashboard</h1>
      </div>
    </header>
  );
};

export default Header;