import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Status from './pages/Status';
import Footer from './components/common/Footer';

function AppContent() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getActiveItem = () => {
    const path = location.pathname;
    if (path === '/status') return 'status';
    return 'status';
  };

  return (
    <div className="app-container" style={{ margin: 0, padding: 0 }}>
      {/* Sidebar */}
      <Sidebar 
        activeItem={getActiveItem()} 
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      
      {/* Main Content */}
      <div className="main-content" style={{ margin: 0, padding: 0 }}>
        {/* Header */}
        <Header 
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        {/* Content Area */}
        <main className="content-area">
          <Routes>
            <Route path="/status" element={<Status />} />
            <Route path="*" element={<Navigate to="/status" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;