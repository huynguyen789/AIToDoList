/**
 * Header component
 * Displays the app title, total score, and theme toggle
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTaskOperations } from '../hooks/useTaskOperations';

/**
 * Header component
 * Input: None
 * Process: Display header with theme toggle
 * Output: Header UI with app title and controls
 */
export const Header: React.FC = () => {
  const { state: { darkMode }, dispatch } = useTheme();
  const { totalScore } = useTaskOperations();
  
  /**
   * Toggle theme
   * Input: None
   * Process: Dispatch theme toggle action
   * Output: None
   */
  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            AI Todo List
          </h1>
          
          <div className="ml-4 px-3 py-1 bg-purple-100 text-purple-800 rounded-full flex items-center dark:bg-purple-900 dark:text-purple-200">
            <span className="text-sm font-medium">Score: {totalScore}</span>
          </div>
        </div>
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}; 