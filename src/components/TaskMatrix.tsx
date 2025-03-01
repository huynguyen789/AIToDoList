/**
 * TaskMatrix component
 * Displays tasks organized in the Eisenhower Matrix (four priority levels)
 */

import React from 'react';
import { TaskList } from './TaskList';
import { Task, PriorityLevel, FilterOption } from '../types';
import { filterTasks } from '../lib/taskUtils';

interface TaskMatrixProps {
  tasks: Task[];
  filter: FilterOption;
}

/**
 * TaskMatrix component
 * Input: Array of tasks and current filter
 * Process: Filter tasks and organize by priority
 * Output: Four task lists in Eisenhower Matrix layout
 */
export const TaskMatrix: React.FC<TaskMatrixProps> = ({ tasks, filter }) => {
  // Apply current filter
  const filteredTasks = filterTasks(tasks, filter);
  
  return (
    <div className="mt-8">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Eisenhower Matrix
        </h2>
        <div className="relative ml-2 group">
          <span className="cursor-help text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </span>
          <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
            Organize tasks by urgency and importance. Focus on urgent & important tasks first, schedule important tasks, delegate urgent tasks, and minimize or eliminate non-urgent, non-important tasks.
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quadrant 1: Urgent & Important */}
        <TaskList 
          tasks={filteredTasks} 
          priority={PriorityLevel.UrgentImportant} 
        />
        
        {/* Quadrant 2: Important but Not Urgent */}
        <TaskList 
          tasks={filteredTasks} 
          priority={PriorityLevel.ImportantNotUrgent} 
        />
        
        {/* Quadrant 3: Urgent but Not Important */}
        <TaskList 
          tasks={filteredTasks} 
          priority={PriorityLevel.UrgentNotImportant} 
        />
        
        {/* Quadrant 4: Neither Urgent nor Important */}
        <TaskList 
          tasks={filteredTasks} 
          priority={PriorityLevel.NeitherUrgentNorImportant} 
        />
      </div>
    </div>
  );
}; 