import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App.jsx';

describe('App', () => {
  it('renders key layout elements', () => {
    render(<App />);

    // Sidebar title and Header title share text 'ESQM'; ensure at least one appears
    expect(screen.getAllByText('ESQM').length).toBeGreaterThan(0);

    // Footer content
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();

    // Navigation labels
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });
});


