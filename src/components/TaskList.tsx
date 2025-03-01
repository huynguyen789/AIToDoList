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
  
  return (
    <div className={`border-l-4 rounded-lg p-4 mb-6 ${priorityColors[priority]}`}>
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        {PriorityLabels[priority]}
      </h2>
      
      {sortedTasks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          No tasks in this category
        </p>
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