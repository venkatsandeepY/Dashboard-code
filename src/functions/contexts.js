// Context functions for the application
import { createContext, useContext } from 'react';

// Application Context
export const AppContext = createContext();

// Custom hook to use App Context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Theme Context
export const ThemeContext = createContext();

// Custom hook to use Theme Context
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

// User Context
export const UserContext = createContext();

// Custom hook to use User Context
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};