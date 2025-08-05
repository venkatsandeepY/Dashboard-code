import React from 'react';
import { User } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-[#1F1246] text-white shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left side - Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">ESQM Operations Dashboard</h1>
        </div>

        {/* Right side - Dummy Image */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-white hover:bg-purple-700 hover:bg-opacity-50 rounded-lg transition-colors duration-200">
            <User className="w-6 h-6" />
          </button>
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