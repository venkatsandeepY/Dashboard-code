import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, TrendingUp, FileText } from 'react-feather';

const Sidebar = ({ isCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard' },
    { id: 'status', icon: TrendingUp, label: 'Status', path: '/status' },
    { id: 'reports', icon: FileText, label: 'Reports', path: '/reports' }
  ];

  const handleNavigation = (path) => {
    if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : 'sidebar--expanded'}`}>
      {/* Header */}
      <div className="sidebar__header">
        <div className="flex items-start justify-start w-full">
          {!isCollapsed && (
            <div>
              <div className="flex items-center gap-2">
                <h1 className="sidebar__title">ESQM</h1>
              </div>
              <p className="sidebar__subtitle">(DLIFE)</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        <ul className="sidebar__nav-list">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`nav-item ${isActive ? 'nav-item--active' : ''} ${isCollapsed ? 'nav-item--collapsed' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={20} className="nav-item__icon" />
                  {!isCollapsed && (
                    <span className="nav-item__label capitalize">{item.label}</span>
                  )}
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