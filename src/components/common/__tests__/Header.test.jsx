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
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  test('renders header with title and subtitle', () => {
    render(
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
    );

    expect(screen.getByText('ESQM')).toBeInTheDocument();
    expect(screen.getByText('Operations Dashboard')).toBeInTheDocument();
  });

  test('renders search input', () => {
    render(
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toBeInTheDocument();
  });

  test('displays username from localStorage', () => {
    localStorage.setItem('username', 'John Doe');
    
    render(
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
    );

    // Click user dropdown to show username
    const userButton = screen.getByRole('button');
    fireEvent.click(userButton);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('displays default username when localStorage is empty', () => {
    render(
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
    );

    const userButton = screen.getByRole('button');
    fireEvent.click(userButton);

    expect(screen.getByText('Guest User')).toBeInTheDocument();
  });

  test('opens and closes user dropdown', () => {
    render(
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
    );

    const userButton = screen.getByRole('button');
    
    // Open dropdown
    fireEvent.click(userButton);
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
    
    // Close dropdown by clicking outside
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
  });

  test('handles sign out functionality', () => {
    localStorage.setItem('username', 'John Doe');
    localStorage.setItem('token', 'abc123');
    localStorage.setItem('userRole', 'admin');

    // Mock window.location.reload
    const mockReload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    });

    render(
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
    );

    const userButton = screen.getByRole('button');
    fireEvent.click(userButton);

    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);

    // Check localStorage is cleared
    expect(localStorage.removeItem).toHaveBeenCalledWith('username');
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('userRole');
    expect(mockReload).toHaveBeenCalled();
  });

  test('search input accepts user input', () => {
    render(
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    expect(searchInput.value).toBe('test search');
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