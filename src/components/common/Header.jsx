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
    <header className="header">
      <div className="header__content">
        {/* Left side - Title */}
        <div className="flex items-center gap-4">
          <h1 className="header__title">ESQM Operations Dashboard</h1>
        </div>

        {/* Right side - Dummy Image */}
        <div className="header__actions">
          <div className="dropdown" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="btn btn--ghost btn--icon-only text-inverse hover-glow"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
            >
              <User className="w-6 h-6" />
            </button>
            
            {/* Profile Dropdown */}
            {showDropdown && (
              <div className={`dropdown__menu ${showDropdown ? 'dropdown__menu--open' : ''}`}>
                <div className="dropdown__header">
                  <p className="dropdown__header-title">👤 {username}</p>
                  <p className="dropdown__header-subtitle">🟢 Online • Active Session</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="dropdown__item"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
          <img 
            src="/image copy.png" 
            alt="Discover Logo" 
            className="logo"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;