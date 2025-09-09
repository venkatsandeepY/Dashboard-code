import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Dashboard from './pages/Dashboard';
import Status from './pages/Status';
import Reports from './pages/Reports';
import Footer from './components/common/Footer';
import BannerNotice from './components/common/BannerNotice';

function AppContent() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getActiveItem = () => {
    const path = location.pathname;
    if (path === '/status') return 'status';
    if (path === '/reports') return 'reports';
    if (path === '/dashboard') return 'dashboard';
    return 'dashboard';
  };

  return (
    <>
      {/* Banner Notice - Outside app container to show at very top */}
      <BannerNotice />
      
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/status" element={<Status />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
      </div>
    </>
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