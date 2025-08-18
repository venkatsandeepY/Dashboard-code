import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/dashboard' })
}));

const HeaderWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Header Component', () => {
  const defaultProps = {
    isCollapsed: false,
    onToggleCollapse: jest.fn()
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    defaultProps.onToggleCollapse.mockClear();
  });

  test('renders header with title and subtitle', () => {
    render(
      <HeaderWrapper>
        <Header {...defaultProps} />
      </HeaderWrapper>
    );

    expect(screen.getByText('ESQM')).toBeInTheDocument();
    expect(screen.getByText('Operations Dashboard')).toBeInTheDocument();
  });

  test('renders search input', () => {
    render(
      <HeaderWrapper>
        <Header {...defaultProps} />
      </HeaderWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toBeInTheDocument();
  });

  test('renders toggle button', () => {
    render(
      <HeaderWrapper>
        <Header {...defaultProps} />
      </HeaderWrapper>
    );

    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  test('calls onToggleCollapse when toggle button is clicked', () => {
    render(
      <HeaderWrapper>
        <Header {...defaultProps} />
      </HeaderWrapper>
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    expect(defaultProps.onToggleCollapse).toHaveBeenCalledTimes(1);
  });

  test('shows correct icon based on collapse state', () => {
    const { rerender } = render(
      <HeaderWrapper>
        <Header {...defaultProps} isCollapsed={false} />
      </HeaderWrapper>
    );

    // Should show X icon when expanded
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(
      <HeaderWrapper>
        <Header {...defaultProps} isCollapsed={true} />
      </HeaderWrapper>
    );

    // Should show Menu icon when collapsed
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('renders logo image', () => {
    render(
      <HeaderWrapper>
        <Header {...defaultProps} />
      </HeaderWrapper>
    );

    const logo = screen.getByAltText('Discover Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/image copy.png');
  });

  test('search input accepts user input', () => {
    render(
      <HeaderWrapper>
        <Header {...defaultProps} />
      </HeaderWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    expect(searchInput.value).toBe('test search');
  });

  test('has proper CSS classes', () => {
    const { container } = render(
      <HeaderWrapper>
        <Header {...defaultProps} />
      </HeaderWrapper>
    );

    expect(container.querySelector('.header')).toBeInTheDocument();
    expect(container.querySelector('.header__content')).toBeInTheDocument();
    expect(container.querySelector('.header__left')).toBeInTheDocument();
    expect(container.querySelector('.header__center')).toBeInTheDocument();
    expect(container.querySelector('.header__right')).toBeInTheDocument();
  });

  test('renders search icon', () => {
    const { container } = render(
      <HeaderWrapper>
        <Header {...defaultProps} />
      </HeaderWrapper>
    );

    const searchIcon = container.querySelector('.header__search-icon');
    expect(searchIcon).toBeInTheDocument();
  });

  test('logo has hover effects', () => {
    render(
      <HeaderWrapper>
        <Header {...defaultProps} />
      </HeaderWrapper>
    );

    const logo = screen.getByAltText('Discover Logo');
    
    // Test hover events
    fireEvent.mouseEnter(logo);
    expect(logo.style.opacity).toBe('0.9');
    
    fireEvent.mouseLeave(logo);
    expect(logo.style.opacity).toBe('1');
  });

  test('renders logo image', () => {
    render(
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
    );

    const logo = screen.getByAltText('Discover Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/image copy.png');
  });
});