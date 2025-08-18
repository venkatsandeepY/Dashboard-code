import React from 'react';
import { render, screen } from '@testing-library/react';
import Feedback from '../Feedback';

describe('Feedback Component', () => {
  test('renders feedback placeholder content', () => {
    render(<Feedback />);
    
    expect(screen.getByText('Development Starts Here')).toBeInTheDocument();
    expect(screen.getByText('Feedback component ready for implementation')).toBeInTheDocument();
  });

  test('renders icons', () => {
    const { container } = render(<Feedback />);
    
    // Check if SVG icons are rendered
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  test('has proper styling classes', () => {
    const { container } = render(<Feedback />);
    
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('flex', 'items-center', 'justify-center');
  });

  test('displays MessageCircle and Code icons', () => {
    const { container } = render(<Feedback />);
    
    // Should have at least 2 SVG elements (MessageCircle and Code icons)
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThanOrEqual(2);
  });

  test('has proper icon positioning', () => {
    const { container } = render(<Feedback />);
    
    const iconContainer = container.querySelector('.relative');
    expect(iconContainer).toBeInTheDocument();
  });

  test('has proper text styling', () => {
    render(<Feedback />);
    
    const heading = screen.getByText('Development Starts Here');
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'text-gray-900', 'mb-4');
    
    const subtitle = screen.getByText('Feedback component ready for implementation');
    expect(subtitle).toHaveClass('text-gray-600', 'text-lg');
  });
});