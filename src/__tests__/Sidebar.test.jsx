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
    onToggleCollapse: jest.fn()
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    global.open.mockClear();
    defaultProps.onToggleCollapse.mockClear();
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

  test('toggles collapse when hamburger menu is clicked', () => {
    render(
      <SidebarWrapper>
        <Sidebar {...defaultProps} />
      </SidebarWrapper>
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    expect(defaultProps.onToggleCollapse).toHaveBeenCalledTimes(1);
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

    const dashboardButton = screen.getByText('Dashboard');
    fireEvent.click(dashboardButton);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('opens external URLs in new tab', () => {
    render(
      <SidebarWrapper>
        <Sidebar {...defaultProps} />
      </SidebarWrapper>
    );

    const feedbackButton = screen.getByText('Feedback');
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
});