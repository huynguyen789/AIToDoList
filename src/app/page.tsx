/**
 * Main page component for the AI Todo List application
 * Serves as the entry point for the application
 */

'use client';

import React, { useEffect } from 'react';
import { Header } from '../components/Header';
import { TaskInput } from '../components/TaskInput';
import { FilterBar } from '../components/FilterBar';
import { TodoListSelector } from '../components/TodoListSelector';
import { TaskMatrix } from '../components/TaskMatrix';
import { DebugInfo } from '../components/DebugInfo';
import { TasksProvider } from '../context/TasksContext';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { useTaskOperations } from '../hooks/useTaskOperations';
import { FilterOption } from '../types';

/**
 * App content component
 * Input: None
 * Process: Organize main app components
 * Output: Main app UI
 */
const AppContent = () => {
  const { tasks, filter, activeTodoList, setFilter } = useTaskOperations();
  
  // Reset filter to "All" if it's set to "Completed" and there are no completed tasks
  useEffect(() => {
    if (filter === FilterOption.Completed && activeTodoList) {
      const hasCompletedTasks = activeTodoList.tasks.some(task => task.completed);
      if (!hasCompletedTasks) {
        console.log('No completed tasks found, resetting filter to All');
        setFilter(FilterOption.All);
      }
    }
  }, [filter, activeTodoList, setFilter]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      
      <div className="mb-6">
        <TodoListSelector />
      </div>
      
      {activeTodoList && (
        <>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {activeTodoList.name}
              </h1>
              <div className="relative ml-2 group">
                <span className="cursor-help text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </span>
                <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  This is your active to-do list. You can create multiple lists for different areas of your life.
                </div>
              </div>
            </div>
            <FilterBar />
          </div>
          
          <TaskInput />
          <TaskMatrix tasks={tasks} filter={filter} />
        </>
      )}
      
      {!activeTodoList && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Please create a to-do list to get started.
          </p>
        </div>
      )}
      
      <DebugInfo />
    </div>
  );
};

/**
 * Home page component
 * Input: None
 * Process: Set up providers and render app content
 * Output: Complete app with providers
 */
export default function Home() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TasksProvider>
          <main className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <AppContent />
          </main>
        </TasksProvider>
      </AuthProvider>
    </ThemeProvider>
  );
} 