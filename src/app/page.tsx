/**
 * Main page component for the AI Todo List application
 * Serves as the entry point for the application
 */

'use client';

import React from 'react';
import { Header } from '../components/Header';
import { TaskInput } from '../components/TaskInput';
import { FilterBar } from '../components/FilterBar';
import { TaskMatrix } from '../components/TaskMatrix';
import { TasksProvider } from '../context/TasksContext';
import { ThemeProvider } from '../context/ThemeContext';
import { useTaskOperations } from '../hooks/useTaskOperations';

/**
 * App content component
 * Input: None
 * Process: Organize main app components
 * Output: Main app UI
 */
const AppContent = () => {
  const { tasks, filter } = useTaskOperations();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <TaskInput />
      <FilterBar />
      <TaskMatrix tasks={tasks} filter={filter} />
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
      <TasksProvider>
        <main className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <AppContent />
        </main>
      </TasksProvider>
    </ThemeProvider>
  );
} 