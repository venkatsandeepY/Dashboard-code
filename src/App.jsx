import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Status from './components/Status';
import Reports from './components/Reports';
import Feedback from './components/Feedback';
import Footer from './components/Footer';

function App() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeItem) {
      case 'status':
        return <Status />;
      case 'reports':
        return <Reports />;
      case 'feedback':
        return <Feedback />;
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (activeItem) {
      case 'status':
        return 'Status';
      case 'reports':
        return 'Reports';
      case 'feedback':
        return 'Feedback';
      default:
        return 'Dashboard';
    }
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activeItem={activeItem} 
        onItemClick={setActiveItem}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header title={getPageTitle()} />

        {/* Content Area */}
        <main className="flex-1 px-8 py-8">
          {renderContent()}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default App;