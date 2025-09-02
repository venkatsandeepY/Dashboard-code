import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'; // Adjust path as needed

describe('main.jsx bootstrap', () => {
  it('renders App inside BrowserRouter to the DOM', () => {
    render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
    // Example: check for any element/text rendered by <App />
    expect(screen.getByTestId('root')).toBeInTheDocument();
    // OR if App renders some text, adjust matcher accordingly:
    // expect(screen.getByText(/some app text/i)).toBeInTheDocument();
  });
});