import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, Search, Bell, Home, TrendingUp, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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
        {/* Left side - Brand */}
        <div className="header__left">
          <div>
            <h1 className="header__title">ESQM</h1>
            <p className="header__subtitle">Operations Dashboard</p>
          </div>
        </div>

        {/* Right side - User Profile & Logo */}
        <div className="header__right">
          {/* User Profile */}
          <div className="dropdown" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="header__notification"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <User className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.9)' }} />
            </button>
            
            {/* Enhanced Profile Dropdown */}
            {showDropdown && (
              <div className={`dropdown__menu ${showDropdown ? 'dropdown__menu--open' : ''}`}>
                <div className="dropdown__header">
                  <div className="dropdown__user-avatar">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div className="dropdown__user-info">
                    <p className="dropdown__header-title">
                      <User className="w-4 h-4" />
                      {username}
                    </p>
                    <p className="dropdown__header-subtitle">
                      <span style={{ color: '#10b981' }}>●</span>
                      Online • Active Session
                    </p>
                  </div>
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

          {/* Logo */}
          <img 
            src="/image copy.png" 
            alt="Discover Logo" 
            style={{ 
              height: '40px', 
              borderRadius: '8px',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;