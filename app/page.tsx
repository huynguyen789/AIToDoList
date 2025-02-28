/**
 * Main page component for the Priority Task Manager app
 * Contains the overall page layout and handles task creation modal
 */

'use client';

import React, { useState } from 'react';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import DarkModeToggle from './components/DarkModeToggle';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2 dark:text-white">Priority Task Manager</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Organize your tasks using the Eisenhower Matrix
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              <button
                onClick={openModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                + Add Task
              </button>
            </div>
          </div>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {/* Task list component */}
          <TaskList />
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal isOpen={isModalOpen} onClose={closeModal} />
    </main>
  );
} 