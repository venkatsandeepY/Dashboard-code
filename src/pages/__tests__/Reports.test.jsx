import React from 'react';
import { render, screen } from '@testing-library/react';
import Reports from '../Reports';

describe('Reports Component', () => {
  test('renders reports placeholder content', () => {
    render(<Reports />);
    
    expect(screen.getByText('Development Starts Here')).toBeInTheDocument();
    expect(screen.getByText('Reports component ready for implementation')).toBeInTheDocument();
  });

  test('renders icons', () => {
    const { container } = render(<Reports />);
    
    // Check if SVG icons are rendered
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  test('has proper styling classes', () => {
    const { container } = render(<Reports />);
    
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('flex', 'items-center', 'justify-center');
  });

  test('displays FileText and Code icons', () => {
    const { container } = render(<Reports />);
    
    // Should have at least 2 SVG elements (FileText and Code icons)
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThanOrEqual(2);
  });

  test('has proper icon positioning', () => {
    const { container } = render(<Reports />);
    
    const iconContainer = container.querySelector('.relative');
    expect(iconContainer).toBeInTheDocument();
  });
});