import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer Component', () => {
  test('renders copyright text', () => {
    render(<Footer />);
    
    expect(screen.getByText('© 2024 ESQM (DLIFE) • All rights reserved')).toBeInTheDocument();
  });

  test('renders all footer links', () => {
    render(<Footer />);
    
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('footer links have correct href attributes', () => {
    render(<Footer />);
    
    const privacyLink = screen.getByText('Privacy Policy');
    const termsLink = screen.getByText('Terms of Service');
    const contactLink = screen.getByText('Contact');
    
    expect(privacyLink.closest('a')).toHaveAttribute('href', '#');
    expect(termsLink.closest('a')).toHaveAttribute('href', '#');
    expect(contactLink.closest('a')).toHaveAttribute('href', '#');
  });

  test('renders separators between links', () => {
    render(<Footer />);
    
    const separators = screen.getAllByText('•');
    expect(separators).toHaveLength(2);
  });
});