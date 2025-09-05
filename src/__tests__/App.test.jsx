import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock all the page components
jest.mock('../pages/Dashboard', () => {
  return function MockDashboard() {
    return <div data-testid="dashboard">Dashboard Page</div>;
  };
});

jest.mock('../pages/Reports', () => {
  return function MockReports() {
    return <div data-testid="reports">Reports Page</div>;
  };
});

jest.mock('../pages/Status', () => {
  return function MockStatus() {
    return <div data-testid="status">Status Page</div>;
  };
});

jest.mock('../pages/Feedback', () => {
  return function MockFeedback() {
    return <div data-testid="feedback">Feedback Page</div>;
  };
});

jest.mock('../components/common/Header', () => {
  return function MockHeader({ onToggleSidebar }) {
    return (
      <div data-testid="header">
        <button onClick={onToggleSidebar}>Toggle Sidebar</button>
      </div>
    );
  };
});

jest.mock('../components/common/Sidebar', () => {
  return function MockSidebar({ isExpanded, onToggle, activeItem, onItemClick }) {
    return (
      <div data-testid="sidebar">
        <button onClick={onToggle}>Toggle</button>
        <div>Active: {activeItem}</div>
        <div>Expanded: {String(isExpanded)}</div>
        <button onClick={() => onItemClick('dashboard')}>Dashboard</button>
        <button onClick={() => onItemClick('reports')}>Reports</button>
        <button onClick={() => onItemClick('status')}>Status</button>
        <button onClick={() => onItemClick('feedback')}>Feedback</button>
      </div>
    );
  };
});

jest.mock('../components/common/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

describe('App integration', () => {
});