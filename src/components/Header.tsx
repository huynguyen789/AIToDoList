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
            
            <div className="relative ml-4 group">
              <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full flex items-center dark:bg-purple-900 dark:text-purple-200 cursor-help">
                <span className="text-sm font-medium">Score: {totalScore}</span>
              </div>
              <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                Your productivity score increases when you complete tasks. Higher priority tasks are worth more points!
              </div>
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
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
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