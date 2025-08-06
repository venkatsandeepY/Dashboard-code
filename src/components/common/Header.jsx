import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, Search, Bell, Home, TrendingUp, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/status', label: 'Status', icon: TrendingUp },
    { path: '/reports', label: 'Reports', icon: FileText },
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Add search functionality here
    }
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

        {/* Center - Search & Navigation */}
        <div className="header__center">
          <div className="header__search">
            <Search className="header__search-icon w-4 h-4" />
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search operations, reports, status..."
                className="header__search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>

        {/* Right side - Navigation & Actions */}
        <div className="header__right">
          {/* Floating Navigation */}
          <nav className="header__nav">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`header__nav-item ${isActive ? 'header__nav-item--active' : ''}`}
                  title={item.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </nav>

          {/* Notifications */}
          <div className="header__notification">
            <Bell className="w-5 h-5 text-white" />
            <div className="header__notification-badge"></div>
          </div>

          {/* User Profile */}
          <div className="dropdown" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="btn btn--ghost btn--icon-only text-inverse hover-glow"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '15px',
                transition: 'all 0.3s ease',
                padding: '12px'
              }}
            >
              <User className="w-6 h-6" />
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
            className="logo"
            style={{ height: '2.5rem', borderRadius: '8px' }}
          />
        </div>
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