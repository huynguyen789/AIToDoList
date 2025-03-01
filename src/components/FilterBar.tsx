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
    <div className="flex justify-center mb-8">
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