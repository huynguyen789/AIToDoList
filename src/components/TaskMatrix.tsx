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
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Eisenhower Matrix
      </h2>
      
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