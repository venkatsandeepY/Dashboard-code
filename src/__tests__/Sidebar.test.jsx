import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/dashboard' })
}));

// Mock window.open
global.open = jest.fn();

const SidebarWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Sidebar Component', () => {
  const defaultProps = {
    isCollapsed: false,
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    global.open.mockClear();
  });

  test('renders sidebar with navigation items', () => {
    render(
      <SidebarWrapper>
        <Sidebar {...defaultProps} />
      </SidebarWrapper>
    );

    expect(screen.getByText('ESQM')).toBeInTheDocument();
    expect(screen.getByText('(DLIFE)')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Feedback')).toBeInTheDocument();
  });

  test('applies collapsed class when isCollapsed is true', () => {
    const { container } = render(
      <SidebarWrapper>
        <Sidebar {...defaultProps} isCollapsed={true} />
      </SidebarWrapper>
    );

    const sidebar = container.querySelector('.sidebar');
    expect(sidebar).toHaveClass('sidebar--collapsed');
  });

  test('applies expanded class when isCollapsed is false', () => {
    const { container } = render(
      <SidebarWrapper>
        <Sidebar {...defaultProps} isCollapsed={false} />
      </SidebarWrapper>
    );

    const sidebar = container.querySelector('.sidebar');
    expect(sidebar).toHaveClass('sidebar--expanded');
  });

  test('navigates to internal routes', () => {
    render(
      <SidebarWrapper>
        <Sidebar {...defaultProps} />
      </SidebarWrapper>
    );

    const dashboardButton = screen.getByText('Dashboard').closest('button');
    fireEvent.click(dashboardButton);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('opens external URLs in new tab', () => {
    render(
      <SidebarWrapper>
        <Sidebar {...defaultProps} />
      </SidebarWrapper>
    );

    const feedbackButton = screen.getByText('Feedback').closest('button');
    fireEvent.click(feedbackButton);

    expect(global.open).toHaveBeenCalledWith('https://google.com', '_blank');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('shows active state for current route', () => {
    render(
      <SidebarWrapper>
        <Sidebar {...defaultProps} />
      </SidebarWrapper>
    );

    const dashboardButton = screen.getByText('Dashboard').closest('button');
    expect(dashboardButton).toHaveClass('nav-item--active');
  });

  test('hides labels when collapsed', () => {
    render(
      <SidebarWrapper>
        <Sidebar {...defaultProps} isCollapsed={true} />
      </SidebarWrapper>
    );

    // In collapsed state, labels should not be visible (but still in DOM)
    const dashboardButton = screen.getByText('Dashboard').closest('button');
    expect(dashboardButton).toHaveClass('nav-item--collapsed');
  });

  test('renders all navigation icons', () => {
    const { container } = render(
      <SidebarWrapper>
        <Sidebar {...defaultProps} />
      </SidebarWrapper>
    );

    // Check if SVG icons are rendered for each nav item
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThanOrEqual(4); // At least 4 nav items
  });

  test('handles navigation correctly for different routes', () => {
    render(
      <SidebarWrapper>
        <Sidebar {...defaultProps} />
      </SidebarWrapper>
    );

    const statusButton = screen.getByText('Status').closest('button');
    fireEvent.click(statusButton);

    expect(mockNavigate).toHaveBeenCalledWith('/status');
  });
});