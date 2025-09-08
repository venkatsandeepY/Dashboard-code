import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Status from './pages/Status';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Feedback from './pages/Feedback';
import Footer from './components/common/Footer';

function AppContent() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getActiveItem = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path === '/reports') return 'reports';
    if (path === '/feedback') return 'feedback';
    if (path === '/status') return 'status';
    return 'dashboard';
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/status" element={<Status />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
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