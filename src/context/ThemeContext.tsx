/**
 * Theme Context for the AI Todo List application
 * Provides global state management for theme (dark/light mode)
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ThemeState, ThemeAction } from '../types';
import { loadDarkMode, saveDarkMode } from '../lib/storage';

// Initial state
const initialState: ThemeState = {
  darkMode: false,
};

// Create context
const ThemeContext = createContext<{
  state: ThemeState;
  dispatch: React.Dispatch<ThemeAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

/**
 * Theme reducer function
 * Input: Current state and action
 * Process: Apply state changes based on action type
 * Output: New state
 */
const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return {
        ...state,
        darkMode: !state.darkMode,
      };
    default:
      return state;
  }
};

/**
 * Theme Provider component
 * Input: Children components
 * Process: Provide theme context to children
 * Output: Context provider with state and dispatch
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Load dark mode preference from local storage on initial render
  useEffect(() => {
    const savedDarkMode = loadDarkMode();
    if (savedDarkMode !== state.darkMode) {
      dispatch({ type: 'TOGGLE_THEME' });
    }
  }, []);

  // Save dark mode preference to local storage whenever it changes
  useEffect(() => {
    saveDarkMode(state.darkMode);
    
    // Apply dark mode class to document
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the theme context
 * Input: None
 * Process: Access context
 * Output: State and dispatch function
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 