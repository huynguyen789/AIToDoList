/**
 * DebugPanel component
 * Displays debug information about the current state
 */

import React from 'react';
import { useTaskOperations } from '../hooks/useTaskOperations';
import { FilterOption } from '../types';

/**
 * DebugPanel component
 * Input: None
 * Process: Display debug information
 * Output: Debug panel UI
 */
export const DebugPanel: React.FC = () => {
  const { tasks, activeTodoList, todoLists, filter, setFilter } = useTaskOperations();
  
  // Reset filter to "All"
  const resetFilter = () => {
    setFilter(FilterOption.All);
  };
  
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6 text-sm">
      <h3 className="font-bold mb-2">Debug Information</h3>
      
      <div className="mb-2">
        <strong>Active Todo List:</strong> {activeTodoList ? activeTodoList.name : 'None'} (ID: {activeTodoList?.id || 'None'})
      </div>
      
      <div className="mb-2 flex items-center">
        <strong>Current Filter:</strong> <span className="mx-2">{filter}</span>
        <button 
          onClick={resetFilter}
          className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Reset Filter to All
        </button>
      </div>
      
      <div className="mb-2">
        <strong>Todo Lists ({todoLists.length}):</strong>
        <ul className="ml-4">
          {todoLists.map(list => (
            <li key={list.id}>
              {list.name} - {list.tasks.length} tasks
              {list.id === activeTodoList?.id && ' (active)'}
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <strong>Tasks in Active List ({tasks.length}):</strong>
        <ul className="ml-4">
          {tasks.map(task => (
            <li key={task.id}>
              {task.title} - Priority: {task.priority} - Completed: {task.completed ? 'Yes' : 'No'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 