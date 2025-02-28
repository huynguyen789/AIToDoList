/**
 * Task Form component for adding/editing tasks
 * Manages form state and validation for creating or updating tasks
 * Supports both creating new tasks and editing existing ones
 */

'use client';

import React, { useState, useEffect } from 'react';
import { PriorityLevel, Task } from '../types';
import { useTaskContext } from '../context/TaskContext';
import { getPriorityInfo } from '../utils/taskUtils';
import { endOfDay, format, parse } from 'date-fns';

interface TaskFormProps {
  onClose?: () => void;
  taskToEdit?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, taskToEdit }) => {
  const { addTask, updateTask } = useTaskContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>(PriorityLevel.NEITHER_URGENT_NOR_IMPORTANT);
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');
  
  // Populate form when editing an existing task
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setPriority(taskToEdit.priority);
      
      // Format the ISO date string to YYYY-MM-DD for the date input
      // Ensure we're using the local date, not UTC
      const deadlineDate = new Date(taskToEdit.deadline);
      const formattedDate = format(deadlineDate, 'yyyy-MM-dd');
      setDeadline(formattedDate);
    }
  }, [taskToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!deadline) {
      setError('Deadline is required');
      return;
    }
    
    // Parse the date string to ensure we preserve the exact date selected
    // Format is 'yyyy-MM-dd' from the date input
    const [year, month, day] = deadline.split('-').map(Number);
    
    // Create a date using the exact year, month, day components
    // Note: JavaScript months are 0-indexed, so we subtract 1 from the month
    const deadlineDate = new Date(year, month - 1, day);
    
    // Set to end of day (11:59:59 PM)
    const endOfSelectedDay = endOfDay(deadlineDate);
    
    const taskData = {
      title,
      description,
      priority,
      deadline: endOfSelectedDay.toISOString(), // Store as ISO string with correct time
      completed: taskToEdit ? taskToEdit.completed : false,
    };
    
    if (taskToEdit) {
      // Update existing task
      updateTask({
        ...taskToEdit,
        ...taskData,
      });
    } else {
      // Add new task
      addTask(taskData);
    }
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority(PriorityLevel.NEITHER_URGENT_NOR_IMPORTANT);
    setDeadline('');
    setError('');
    
    if (onClose) {
      onClose();
    }
  };
  
  // Get today's date as the default minimum date for the deadline
  const getTodayDate = () => {
    const today = new Date();
    return format(today, 'yyyy-MM-dd');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 dark:text-white">
        {taskToEdit ? 'Edit Task' : 'Add New Task'}
      </h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Title*
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Task title"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Task description"
          rows={3}
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="priority" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Priority Level
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value) as PriorityLevel)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.values(PriorityLevel)
            .filter((value) => typeof value === 'number')
            .map((level) => (
              <option key={level} value={level}>
                {getPriorityInfo(level as PriorityLevel).label} ({getPriorityInfo(level as PriorityLevel).score} points)
              </option>
            ))}
        </select>
      </div>
      
      <div className="mb-6">
        <label htmlFor="deadline" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Deadline*
        </label>
        <input
          type="date"
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          min={getTodayDate()}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Deadline will be set to 11:59 PM on the selected date
        </p>
      </div>
      
      <div className="flex justify-end">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mr-2 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {taskToEdit ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm; 