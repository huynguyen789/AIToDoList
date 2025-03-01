/**
 * Header component
 * Displays the app title, total score, theme toggle, and authentication controls
 */

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTaskOperations } from '../hooks/useTaskOperations';
import { useAuth } from '../context/AuthContext';
import AuthModal from './auth/AuthModal';

/**
 * Header component
 * Input: None
 * Process: Display header with theme toggle and auth controls
 * Output: Header UI with app title and controls
 */
export const Header: React.FC = () => {
  const { state: { darkMode }, dispatch } = useTheme();
  const { totalScore } = useTaskOperations();
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register'>('login');
  
  /**
   * Toggle theme
   * Input: None
   * Process: Dispatch theme toggle action
   * Output: None
   */
  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };
  
  /**
   * Open auth modal with specified view
   * Input: View type (login or register)
   * Process: Set modal state and view
   * Output: None
   */
  const openAuthModal = (view: 'login' | 'register') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };
  
  /**
   * Handle logout
   * Input: None
   * Process: Call logout function from auth context
   * Output: None
   */
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <>
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
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                >
                  Login
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
                >
                  Register
                </button>
              </div>
            )}
            
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
        </div>
      </header>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialView={authModalView} 
      />
    </>
  );
}; 