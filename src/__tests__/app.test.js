// src/__tests__/App.test.js

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mocks for the imported components
jest.mock('../components/common/Sidebar', () => ({ activeItem, isCollapsed, onToggleCollapse }) => (
  <div data-testid="sidebar">
    <span>{activeItem}</span>
    <button onClick={onToggleCollapse}>Toggle</button>
    <span>{isCollapsed ? 'Collapsed' : 'Expanded'}</span>
  </div>
));
jest.mock('../components/common/Header', () => ({ isCollapsed, onToggleCollapse }) => (
  <div data-testid="header">
    <span>{isCollapsed ? 'Collapsed' : 'Expanded'}</span>
    <button onClick={onToggleCollapse}>HeaderToggle</button>
  </div>
));
jest.mock('../pages/Dashboard', () => () => <div>Dashboard Page</div>);
jest.mock('../pages/Status', () => () => <div>Status Page</div>);
jest.mock('../pages/Reports', () => () => <div>Reports Page</div>);
jest.mock('../components/common/Footer', () => () => <div data-testid="footer">Footer</div>);

describe('<AppContent />', () => {
  function setup(initialRoute = '/dashboard') {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <App />
      </MemoryRouter>
    );
  }

  test('renders Sidebar, Header, and Footer', () => {
    setup();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('shows dashboard page by default route', () => {
    setup('/dashboard');
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    expect(screen.getByText('dashboard')).toBeInTheDocument();
  });

  test('shows status page for /status route', () => {
    setup('/status');
    expect(screen.getByText('Status Page')).toBeInTheDocument();
    expect(screen.getByText('status')).toBeInTheDocument();
  });

  test('shows reports page for /reports route', () => {
    setup('/reports');
    expect(screen.getByText('Reports Page')).toBeInTheDocument();
    expect(screen.getByText('reports')).toBeInTheDocument();
  });

  test('toggles sidebar collapse state when button clicked', () => {
    setup();
    const sidebarToggle = screen.getByText('Toggle');
    // Initially should be Expanded
    expect(screen.getByText('Expanded')).toBeInTheDocument();
    fireEvent.click(sidebarToggle);
    // After toggle should be Collapsed
    expect(screen.getByText('Collapsed')).toBeInTheDocument();
  });

  test('toggles header collapse state when button clicked', () => {
    setup();
    const headerToggle = screen.getByText('HeaderToggle');
    // Initially should be Expanded
    expect(screen.getByText('Expanded')).toBeInTheDocument();
    fireEvent.click(headerToggle);
    // After toggle should be Collapsed
    expect(screen.getByText('Collapsed')).toBeInTheDocument();
  });
});
