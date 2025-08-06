import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, TrendingUp, FileText, MessageCircle, Menu, X, Zap, Star, Sparkles } from 'lucide-react';

const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard' },
    { id: 'status', icon: TrendingUp, label: 'Status', path: '/status' },
    { id: 'reports', icon: FileText, label: 'Reports', path: '/reports' },
    { id: 'feedback', icon: MessageCircle, label: 'Feedback', path: 'https://google.com' },
  ];

  const handleNavigation = (path) => {
    console.log('Navigating to:', path);
    console.log('Is external URL:', path.startsWith('http'));
    
    if (path.startsWith('http')) {
      console.log('Opening external URL in new tab');
      window.open(path, '_blank');
    } else {
      console.log('Navigating internally');
      navigate(path);
    }
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : 'sidebar--expanded'}`}>
      {/* Header with hamburger menu */}
      <div className="sidebar__header">
        <button
          onClick={onToggleCollapse}
          className="sidebar__toggle-btn"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
        {!isCollapsed && (
          <div className="sidebar__brand">
            <div className="sidebar__brand-icon">
              <Zap className="w-6 h-6" />
              <Sparkles className="sidebar__brand-sparkle" />
            </div>
            <div className="sidebar__brand-text">
              <h1 className="sidebar__brand-title">ESQM</h1>
              <p className="sidebar__brand-subtitle">(DLIFE)</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {!isCollapsed && (
          <div className="sidebar__nav-header">
            <Star className="w-4 h-4" />
            <span>Navigation</span>
          </div>
        )}
        <ul className="sidebar__nav-list">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''} ${isCollapsed ? 'sidebar__nav-item--collapsed' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className="sidebar__nav-item-icon">
                    <Icon size={20} />
                    <div className="sidebar__nav-item-glow"></div>
                  </div>
                  {!isCollapsed && (
                    <span className="sidebar__nav-item-label">{item.label}</span>
                  )}
                  <div className="sidebar__nav-item-trail"></div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;