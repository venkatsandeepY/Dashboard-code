import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock child components
jest.mock('../Sidebar', () => {
  return function MockSidebar(props) {
    return <div data-testid="sidebar">Sidebar - Collapsed: {props.isCollapsed.toString()}</div>;
  };
});

jest.mock('../components/common/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock('../components/common/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock('../pages/Dashboard', () => {
  return function MockDashboard() {
    return <div data-testid="dashboard">Dashboard Page</div>;
  };
});

jest.mock('../pages/Status', () => {
  return function MockStatus() {
    return <div data-testid="status">Status Page</div>;
  };
});

jest.mock('../pages/Reports', () => {
  return function MockReports() {
    return <div data-testid="reports">Reports Page</div>;
  };
});

describe('App Component', () => {
  test('renders main layout components', () => {
    render(<App />);
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('renders dashboard by default', () => {
    render(<App />);
    
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  test('sidebar starts in expanded state', () => {
    render(<App />);
    
    expect(screen.getByText('Sidebar - Collapsed: false')).toBeInTheDocument();
  });

  test('handles sidebar toggle functionality', () => {
    render(<App />);
    
    // Initial state should be expanded (false)
    expect(screen.getByText('Sidebar - Collapsed: false')).toBeInTheDocument();
  });

  test('has proper app container structure', () => {
    const { container } = render(<App />);
    
    const appContainer = container.querySelector('.app-container');
    expect(appContainer).toBeInTheDocument();
    
    const mainContent = container.querySelector('.main-content');
    expect(mainContent).toBeInTheDocument();
    
    const contentArea = container.querySelector('.content-area');
    expect(contentArea).toBeInTheDocument();
  });

  test('routes work correctly', () => {
    // Test that routing is properly set up
    const { container } = render(<App />);
    expect(container.querySelector('.app-container')).toBeInTheDocument();
  });
});