/**
 * Storage utility functions for the AI Todo List application
 * Handles saving and retrieving tasks from local storage
 */

import { Task, FilterOption, PriorityLevel, TodoList } from '../types';

const TODO_LISTS_STORAGE_KEY = 'ai-todo-lists';
const ACTIVE_TODO_LIST_ID_KEY = 'ai-active-todo-list-id';
const THEME_STORAGE_KEY = 'ai-todo-list-theme';
const FILTER_STORAGE_KEY = 'ai-todo-list-filter';

/**
 * Save todo lists to local storage
 * Input: Array of todo lists
 * Process: Stringify and store in localStorage
 * Output: None
 */
export const saveTodoLists = (todoLists: TodoList[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TODO_LISTS_STORAGE_KEY, JSON.stringify(todoLists));
  }
};

/**
 * Load todo lists from local storage
 * Input: None
 * Process: Retrieve and parse from localStorage
 * Output: Array of todo lists or empty array if none found
 */
export const loadTodoLists = (): TodoList[] => {
  if (typeof window !== 'undefined') {
    const todoListsJson = localStorage.getItem(TODO_LISTS_STORAGE_KEY);
    if (todoListsJson) {
      try {
        return JSON.parse(todoListsJson);
      } catch (error) {
        console.error('Failed to parse todo lists from localStorage:', error);
      }
    }
  }
  return [];
};

/**
 * Save active todo list ID to local storage
 * Input: Todo list ID
 * Process: Store in localStorage
 * Output: None
 */
export const saveActiveTodoListId = (id: string | null): void => {
  if (typeof window !== 'undefined') {
    if (id) {
      localStorage.setItem(ACTIVE_TODO_LIST_ID_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_TODO_LIST_ID_KEY);
    }
  }
};

/**
 * Load active todo list ID from local storage
 * Input: None
 * Process: Retrieve from localStorage
 * Output: Todo list ID or null if not found
 */
export const loadActiveTodoListId = (): string | null => {
  if (typeof window !== 'undefined') {
    const id = localStorage.getItem(ACTIVE_TODO_LIST_ID_KEY);
    return id;
  }
  return null;
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

/**
 * Migrate old tasks to new todo list format
 * Input: None
 * Process: Check for old tasks and convert to new format
 * Output: Array of todo lists
 */
export const migrateOldTasks = (): TodoList[] => {
  if (typeof window !== 'undefined') {
    const oldTasksKey = 'ai-todo-list-tasks';
    const oldTasksJson = localStorage.getItem(oldTasksKey);
    
    if (oldTasksJson) {
      try {
        const oldTasks = JSON.parse(oldTasksJson) as Task[];
        if (oldTasks.length > 0) {
          // Create a default todo list with the old tasks
          const defaultList: TodoList = {
            id: `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: 'My Tasks',
            tasks: oldTasks,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          // Remove old tasks from localStorage
          localStorage.removeItem(oldTasksKey);
          
          return [defaultList];
        }
      } catch (error) {
        console.error('Failed to migrate old tasks:', error);
      }
    }
  }
  
  return [];
}; 