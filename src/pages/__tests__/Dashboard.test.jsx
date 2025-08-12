import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';

describe('Dashboard Component', () => {
  test('renders dashboard placeholder content', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Development Starts Here')).toBeInTheDocument();
    expect(screen.getByText('Dashboard component ready for implementation')).toBeInTheDocument();
  });

  test('renders icons', () => {
    const { container } = render(<Dashboard />);
    
    // Check if SVG icons are rendered
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  test('has proper styling classes', () => {
    const { container } = render(<Dashboard />);
    
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('flex', 'items-center', 'justify-center');
  });
});