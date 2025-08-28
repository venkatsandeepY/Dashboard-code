import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock CSS import used in main.jsx
jest.mock('../index.css', () => ({}));

// Mock ReactDOM.createRoot
const mockRender = jest.fn();
const mockUnmount = jest.fn();
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({ render: mockRender, unmount: mockUnmount }))
}));

describe('main.jsx bootstrap', () => {
  let root;

  beforeAll(() => {
    root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);
  });

  afterAll(() => {
    if (root && root.parentNode) {
      root.parentNode.removeChild(root);
    }
  });

  it('calls ReactDOM.createRoot and renders without crashing', async () => {
    // Import after mocks and DOM are ready so the module executes
    const strictModeSpy = jest.spyOn(React, 'createElement');
    await import('../main.jsx');

    const { createRoot } = await import('react-dom/client');
    expect(createRoot).toHaveBeenCalledTimes(1);
    expect(createRoot).toHaveBeenCalledWith(document.getElementById('root'));
    expect(mockRender).toHaveBeenCalledTimes(1);
    strictModeSpy.mockRestore();
  });

  it('can render <App /> inside <BrowserRouter> without crashing', async () => {
    const App = (await import('../App.jsx')).default;
    const { container, unmount } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(container).toBeInTheDocument();
    unmount();
  });
});


