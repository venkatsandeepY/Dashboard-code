import React from 'react';
import { Search } from 'react-feather';

const Header = () => {
  return (
    <header className="bg-transparent border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-center">
        {/* Search Box */}
        <div className="relative w-full max-width-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;