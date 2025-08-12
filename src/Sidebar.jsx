import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, TrendingUp, FileText, MessageCircle, Menu, X } from 'react-feather';

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
    if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
  };

  return (
    <div className={`bg-gradient-to-b from-indigo-900 to-purple-900 min-h-screen flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-56'
    }`}>
      {/* Header */}
      <div className="p-3 border-b border-indigo-700">
        <div className="flex items-center">
          <button
            onClick={onToggleCollapse}
            className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors duration-200"
          >
            {isCollapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
          {!isCollapsed && (
            <div className="ml-3">
              <h1 className="text-white text-lg font-bold">ESQM</h1>
              <p className="text-indigo-200 text-xs font-medium">(DLIFE)</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-white text-indigo-900'
                      : 'text-white hover:bg-white hover:bg-opacity-10'
                  } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3">{item.label}</span>
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