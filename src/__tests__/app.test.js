import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppContent from './AppContent';
import '@testing-library/jest-dom';

describe('AppContent', () => {
    test('renders Dashboard by default', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <AppContent />
            </MemoryRouter>
        );
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });

    test('renders Status when navigated to /status', () => {
        render(
            <MemoryRouter initialEntries={['/status']}>
                <AppContent />
            </MemoryRouter>
        );
        expect(screen.getByText(/status/i)).toBeInTheDocument();
    });

    test('renders Reports when navigated to /reports', () => {
        render(
            <MemoryRouter initialEntries={['/reports']}>
                <AppContent />
            </MemoryRouter>
        );
        expect(screen.getByText(/reports/i)).toBeInTheDocument();
    });

    test('toggles sidebar collapse state', () => {
        render(
            <MemoryRouter>
                <AppContent />
            </MemoryRouter>
        );
        const sidebarToggleButton = screen.getByTestId('sidebar-toggle'); // Update with your actual test id/class
        fireEvent.click(sidebarToggleButton);
        // Depending on your implementation, check for a class or prop change
        // For example, expect(sidebarToggleButton).toHaveClass('collapsed');
    });
});
