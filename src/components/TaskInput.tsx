/**
 * TaskInput component
 * Form for creating new tasks
 */

import React, { useState } from 'react';
import { PriorityLevel, PriorityLabels, ShortPriorityLabels, PriorityScores } from '../types';
import { useTaskOperations } from '../hooks/useTaskOperations';

/**
 * TaskInput component
 * Input: None
 * Process: Collect task data and create new task
 * Output: Form UI for task creation
 */
export const TaskInput: React.FC = () => {
  const { addTask } = useTaskOperations();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>(PriorityLevel.UrgentImportant);
  const [isExpanded, setIsExpanded] = useState(false);
  
  /**
   * Handle form submission
   * Input: Form event
   * Process: Create task and reset form
   * Output: None
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim()) {
      addTask(title, description, deadline, priority, deadlineTime);
      
      // Reset form
      setTitle('');
      setDescription('');
      setDeadline('');
      setDeadlineTime('');
      setPriority(PriorityLevel.UrgentImportant);
      setIsExpanded(false);
    }
  };
  
  /**
   * Toggle form expansion
   * Input: None
   * Process: Toggle expanded state
   * Output: None
   */
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Add New Task
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="What needs to be done?"
            required
          />
        </div>
        
        {!isExpanded ? (
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={toggleExpand}
              className="text-blue-500 hover:text-blue-700 text-sm dark:text-blue-400 dark:hover:text-blue-300"
            >
              + Add details
            </button>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Task
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Task description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Deadline Date
                </label>
                <input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="deadlineTime" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Deadline Time
                </label>
                <input
                  id="deadlineTime"
                  type="time"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="priority" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Priority
              </label>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(PriorityLabels).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPriority(Number(value) as PriorityLevel)}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors flex justify-between items-center ${
                      Number(value) === priority
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span>{label}</span>
                    <span className="text-xs font-normal ml-2">
                      ({ShortPriorityLabels[Number(value) as PriorityLevel]} - {PriorityScores[Number(value) as PriorityLevel]} points)
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={toggleExpand}
                className="text-gray-500 hover:text-gray-700 text-sm dark:text-gray-400 dark:hover:text-gray-300"
              >
                - Hide details
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Task
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}; 