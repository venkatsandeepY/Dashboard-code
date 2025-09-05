import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';

// Mock React DOM
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn()
  }))
}));

jest.mock('../App', () => {
}
)
jest.mock('../App', () => {
  return function MockApp() {
    return React.createElement('div', { 'data-testid': 'app' }, 'Mocked App');
  };
});

// Mock CSS import
jest.mock('../index.css', () => ({}));

describe('main.jsx', () => {
});