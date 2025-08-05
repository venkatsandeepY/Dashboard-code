import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, TrendingUp, FileText, MessageCircle, Menu, X } from 'lucide-react';

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
          className="btn btn--ghost btn--icon-only text-inverse"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
        {!isCollapsed && (
          <div className="ml-md">
            <h1 className="text-inverse text-xl font-bold">ESQM</h1>
            <p className="text-inverse opacity-75 text-sm">(DLIFE)</p>
          </div>
        )}
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