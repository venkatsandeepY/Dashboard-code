import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './components/common/Header';
import Dashboard from './pages/Dashboard';
import Status from './pages/Status';
import Reports from './pages/Reports';
import Feedback from './pages/Feedback';
import Footer from './components/common/Footer';
import './App.css';

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

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 app-container">
      {/* Sidebar */}
      <Tabs 
        activeItem={activeItem} 
        onItemClick={setActiveItem}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      <Tabs 
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col main-content">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <main className="flex-1 px-8 py-8 content-area">
          {renderContent()}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default App;