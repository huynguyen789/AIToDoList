/**
 * Main page component for the AI Todo List application
 * Serves as the entry point for the application
 */

'use client';

import React from 'react';
import { Header } from '../components/Header';
import { TaskInput } from '../components/TaskInput';
import { FilterBar } from '../components/FilterBar';
import { TodoListSelector } from '../components/TodoListSelector';
import { TaskMatrix } from '../components/TaskMatrix';
import { TasksProvider } from '../context/TasksContext';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { useTaskOperations } from '../hooks/useTaskOperations';

/**
 * App content component
 * Input: None
 * Process: Organize main app components
 * Output: Main app UI
 */
const AppContent = () => {
  const { tasks, filter, activeTodoList } = useTaskOperations();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      
      <div className="mb-6">
        <TodoListSelector />
      </div>
      
      {activeTodoList && (
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="w-full md:w-1/3">
            <FilterBar />
          </div>
          
          <div className="w-full md:w-2/3">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {activeTodoList.name}
              </h1>
            </div>
            
            <TaskInput />
            <TaskMatrix tasks={tasks} filter={filter} />
          </div>
        </div>
      )}
      
      {!activeTodoList && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Please create a to-do list to get started.
          </p>
        </div>
      )}
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