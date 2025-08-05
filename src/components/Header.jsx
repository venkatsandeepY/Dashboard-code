import React from 'react';

const Header = () => {
  return (
    <header className="bg-[#1F1246] text-white shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left side - Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">ESQM Operations Dashboard</h1>
        </div>

        {/* Right side - Dummy Image */}
        <div className="flex items-center">
          <img 
            src="/image copy.png" 
            alt="Discover Logo" 
            className="h-10 rounded-lg hover:opacity-90 transition-opacity duration-200"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;