import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut } from 'lucide-react';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('');
  const dropdownRef = useRef(null);

  // Get username from localStorage on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || 'Guest User';
    setUsername(storedUsername);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    // Clear user data from localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    // You can add more localStorage items to clear as needed
    
    // Redirect to login page or refresh
    window.location.reload();
    setShowDropdown(false);
  };

  return (
    <header className="bg-[#1F1246] text-white shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left side - Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">ESQM Operations Dashboard</h1>
        </div>

        {/* Right side - Dummy Image */}
        <div className="flex items-center space-x-4 relative">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-white hover:bg-purple-700 hover:bg-opacity-50 rounded-lg transition-colors duration-200"
            >
            <User className="w-6 h-6" />
          </button>
            
            {/* Profile Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{username}</p>
                  <p className="text-xs text-gray-500">Logged in</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
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