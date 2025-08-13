import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, X } from 'react-feather';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ isCollapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();


  return (
    <header className="header">
      <div className="header__content">
        {/* Left side - Brand */}
        <div className="header__left">
          <button
            onClick={onToggleCollapse}
            className="btn btn--ghost btn--icon-only text-primary hover-lift mr-md"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
          <div>
            <h1 className="header__title" style={{ fontSize: '1.5rem' }}>ESQM</h1>
            <p className="header__subtitle">Operations Dashboard</p>
          </div>
        </div>

        {/* Centered Search Bar */}
        <div className="header__center">
          <div className="header__search">
            <div className="header__search-icon">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="header__search-input"
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="header__right">
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