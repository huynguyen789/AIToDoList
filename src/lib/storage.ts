/**
 * Storage utility functions for the AI Todo List application
 * Handles saving and retrieving tasks from local storage
 */

import { Task, FilterOption, PriorityLevel } from '../types';

const TASKS_STORAGE_KEY = 'ai-todo-list-tasks';
const THEME_STORAGE_KEY = 'ai-todo-list-theme';
const FILTER_STORAGE_KEY = 'ai-todo-list-filter';

/**
 * Save tasks to local storage
 * Input: Array of tasks
 * Process: Stringify and store in localStorage
 * Output: None
 */
export const saveTasks = (tasks: Task[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }
};

/**
 * Load tasks from local storage
 * Input: None
 * Process: Retrieve and parse from localStorage
 * Output: Array of tasks or empty array if none found
 */
export const loadTasks = (): Task[] => {
  if (typeof window !== 'undefined') {
    const tasksJson = localStorage.getItem(TASKS_STORAGE_KEY);
    if (tasksJson) {
      try {
        return JSON.parse(tasksJson);
      } catch (error) {
        console.error('Failed to parse tasks from localStorage:', error);
      }
    }
  }
  return [];
};

/**
 * Save dark mode preference to local storage
 * Input: Boolean indicating dark mode status
 * Process: Store in localStorage
 * Output: None
 */
export const saveDarkMode = (isDarkMode: boolean): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(isDarkMode));
  }
};

/**
 * Load dark mode preference from local storage
 * Input: None
 * Process: Retrieve from localStorage
 * Output: Boolean indicating dark mode status, default false
 */
export const loadDarkMode = (): boolean => {
  if (typeof window !== 'undefined') {
    const darkModeJson = localStorage.getItem(THEME_STORAGE_KEY);
    if (darkModeJson) {
      try {
        return JSON.parse(darkModeJson);
      } catch (error) {
        console.error('Failed to parse dark mode from localStorage:', error);
      }
    }
  }
  return false;
};

/**
 * Save filter preference to local storage
 * Input: FilterOption enum value
 * Process: Store in localStorage
 * Output: None
 */
export const saveFilter = (filter: FilterOption): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FILTER_STORAGE_KEY, filter);
  }
};

/**
 * Load filter preference from local storage
 * Input: None
 * Process: Retrieve from localStorage
 * Output: FilterOption enum value, default All
 */
export const loadFilter = (): FilterOption => {
  if (typeof window !== 'undefined') {
    const filter = localStorage.getItem(FILTER_STORAGE_KEY) as FilterOption;
    if (filter && Object.values(FilterOption).includes(filter)) {
      return filter;
    }
  }
  return FilterOption.All;
}; 