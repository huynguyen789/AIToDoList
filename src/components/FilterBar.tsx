/**
 * FilterBar component
 * Provides options to filter tasks by status
 */

import React from 'react';
import { FilterOption } from '../types';
import { useTaskOperations } from '../hooks/useTaskOperations';

/**
 * FilterBar component
 * Input: None
 * Process: Handle filter selection
 * Output: Filter UI with options
 */
export const FilterBar: React.FC = () => {
  const { filter, setFilter } = useTaskOperations();
  
  /**
   * Handle filter change
   * Input: Filter option
   * Process: Update filter state
   * Output: None
   */
  const handleFilterChange = (newFilter: FilterOption) => {
    setFilter(newFilter);
  };
  
  return (
    <div className="flex items-center">
      <div className="relative mr-2 group">
        <span className="cursor-help text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </span>
        <div className="absolute right-0 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
          Filter your tasks by status: All tasks, Active (incomplete) tasks, or Completed tasks.
        </div>
      </div>
      
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          onClick={() => handleFilterChange(FilterOption.All)}
          className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
            filter === FilterOption.All
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600'
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => handleFilterChange(FilterOption.Active)}
          className={`px-4 py-2 text-sm font-medium border-t border-b ${
            filter === FilterOption.Active
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600'
          }`}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => handleFilterChange(FilterOption.Completed)}
          className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
            filter === FilterOption.Completed
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600'
          }`}
        >
          Completed
        </button>
      </div>
    </div>
  );
}; 