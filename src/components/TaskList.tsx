/**
 * TaskList component
 * Displays a list of tasks for a specific priority level
 */

import React from 'react';
import { Task as TaskComponent } from './Task';
import { Task as TaskType, PriorityLevel, PriorityLabels } from '../types';

interface TaskListProps {
  tasks: TaskType[];
  priority: PriorityLevel;
}

/**
 * TaskList component
 * Input: Array of tasks and priority level
 * Process: Render tasks for the priority level
 * Output: List of task components
 */
export const TaskList: React.FC<TaskListProps> = ({ tasks, priority }) => {
  // Filter tasks by priority
  const priorityTasks = tasks.filter(task => task.priority === priority);
  
  // Sort tasks by order
  const sortedTasks = [...priorityTasks].sort((a, b) => a.order - b.order);
  
  // Priority section colors
  const priorityColors = {
    [PriorityLevel.UrgentImportant]: 'border-red-500 bg-red-50 dark:bg-red-900/20',
    [PriorityLevel.ImportantNotUrgent]: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    [PriorityLevel.UrgentNotImportant]: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
    [PriorityLevel.NeitherUrgentNorImportant]: 'border-green-500 bg-green-50 dark:bg-green-900/20',
  };
  
  // Priority icons for empty state
  const priorityIcons = {
    [PriorityLevel.UrgentImportant]: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    [PriorityLevel.ImportantNotUrgent]: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    [PriorityLevel.UrgentNotImportant]: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    ),
    [PriorityLevel.NeitherUrgentNorImportant]: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    ),
  };
  
  return (
    <div className={`border-l-4 rounded-lg p-4 mb-6 ${priorityColors[priority]}`}>
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        {PriorityLabels[priority]}
      </h2>
      
      {sortedTasks.length === 0 ? (
        <div className="flex items-center justify-center py-2 text-gray-500 dark:text-gray-400 text-sm">
          {priorityIcons[priority]}
          <span className="ml-2">No tasks in this category</span>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map(task => (
            <TaskComponent key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}; 