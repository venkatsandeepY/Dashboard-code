import React from 'react';
import { Home, TrendingUp, FileText, MessageCircle, Menu, X } from 'lucide-react';

const Sidebar = ({ activeItem, onItemClick, isCollapsed, onToggleCollapse }) => {
  const navigationItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'status', icon: TrendingUp, label: 'Status' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'feedback', icon: MessageCircle, label: 'Feedback' },
  ];

  return (
    <div 
      className={`bg-[#1F1246] min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header with hamburger menu */}
      <div className="p-4 border-b border-purple-700 flex items-center">
        <button
          onClick={onToggleCollapse}
          className="text-white hover:bg-purple-700 hover:bg-opacity-50 p-2 rounded-lg transition-colors duration-200"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
        {!isCollapsed && (
        <div className="ml-3">
          <h1 className="text-white text-xl font-bold">ESQM</h1>
          <p className="text-purple-200 text-sm">(DLIFE)</p>
        </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {!isCollapsed && (
          <p className="text-purple-300 text-xs uppercase tracking-wider font-medium mb-4">
            NAVIGATION
          </p>
        )}
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onItemClick(item.id)}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-start px-4'} py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-gray-900 font-medium shadow-sm'
                      : 'text-white hover:bg-purple-700 hover:bg-opacity-50'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={20} className={isActive ? 'text-gray-700' : 'text-white'} />
                  {!isCollapsed && (
                    <span className="ml-3 capitalize">{item.label}</span>
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