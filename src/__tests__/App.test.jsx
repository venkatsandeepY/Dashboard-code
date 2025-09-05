import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mocks for child components
jest.mock('../components/common/Sidebar', () => ({ activeItem, isCollapsed, onToggleCollapse }) => (
  <button data-testid="sidebar" onClick={onToggleCollapse}>
    Sidebar-{activeItem}-{String(isCollapsed)}
  </button>
));
jest.mock('../components/common/Header', () => ({ isCollapsed, onToggleCollapse }) => (
  <button data-testid="header" onClick={onToggleCollapse}>
    Header-{String(isCollapsed)}
  </button>
));
jest.mock('../components/common/Footer', () => () => (
  <div data-testid="footer">Footer</div>
));

jest.mock('../pages/Dashboard', () => () => (
  <div data-testid="dashboard">Dashboard Page</div>
));
jest.mock('../pages/Status', () => () => (
  <div data-testid="status">Status Page</div>
));
jest.mock('../pages/Reports', () => () => (
  <div data-testid="reports">Reports Page</div>
));

describe('App integration', () => {
});