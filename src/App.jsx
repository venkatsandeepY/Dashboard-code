import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './components/common/Header';
import Dashboard from './Dashboard';
import Status from './Status';
import Reports from './Reports';
import Feedback from './Feedback';
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
    if (path === '/reports') return 'reports';
    if (path === '/dashboard') return 'dashboard';
    return 'dashboard';
  };

  return (
    <div className="flex min-h-screen bg-gray-50 app-container" style={{ margin: 0, padding: 0 }}>
      {/* Sidebar */}
      <Sidebar 
        activeItem={getActiveItem()} 
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col main-content" style={{ margin: 0, padding: 0 }}>
        {/* Header */}
        <Header />

        {/* Content Area */}
        <main className="flex-1 px-8 py-8 content-area">
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