/**
 * Storage utility functions for the AI Todo List application
 * Handles saving and retrieving data from local storage or Firestore
 */

import { Task, FilterOption, PriorityLevel, TodoList } from '../types';
import { 
  saveTodoListsToFirestore, 
  loadTodoListsFromFirestore,
  saveActiveTodoListIdToFirestore,
  loadActiveTodoListIdFromFirestore,
  saveFilterToFirestore,
  loadFilterFromFirestore
} from './database';

const TODO_LISTS_STORAGE_KEY = 'ai-todo-lists';
const ACTIVE_TODO_LIST_ID_KEY = 'ai-active-todo-list-id';
const THEME_STORAGE_KEY = 'ai-todo-list-theme';
const FILTER_STORAGE_KEY = 'ai-todo-list-filter';

/**
 * Save todo lists to storage
 * Input: Array of todo lists and optional user ID
 * Process: Store in Firestore if user ID provided, otherwise localStorage
 * Output: None
 */
export const saveTodoLists = async (todoLists: TodoList[], userId?: string): Promise<void> => {
  if (userId) {
    // Save to Firestore if user is logged in
    await saveTodoListsToFirestore(userId, todoLists);
  } else if (typeof window !== 'undefined') {
    // Save to localStorage if no user is logged in
    localStorage.setItem(TODO_LISTS_STORAGE_KEY, JSON.stringify(todoLists));
  }
};

/**
 * Load todo lists from storage
 * Input: Optional user ID
 * Process: Retrieve from Firestore if user ID provided, otherwise localStorage
 * Output: Array of todo lists or empty array if none found
 */
export const loadTodoLists = async (userId?: string): Promise<TodoList[]> => {
  if (userId) {
    // Load from Firestore if user is logged in
    return await loadTodoListsFromFirestore(userId);
  } else if (typeof window !== 'undefined') {
    // Load from localStorage if no user is logged in
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
 * Save active todo list ID to storage
 * Input: Todo list ID and optional user ID
 * Process: Store in Firestore if user ID provided, otherwise localStorage
 * Output: None
 */
export const saveActiveTodoListId = async (activeTodoListId: string | null, userId?: string): Promise<void> => {
  if (userId) {
    // Save to Firestore if user is logged in
    await saveActiveTodoListIdToFirestore(userId, activeTodoListId);
  } else if (typeof window !== 'undefined') {
    // Save to localStorage if no user is logged in
    if (activeTodoListId) {
      localStorage.setItem(ACTIVE_TODO_LIST_ID_KEY, activeTodoListId);
    } else {
      localStorage.removeItem(ACTIVE_TODO_LIST_ID_KEY);
    }
  }
};

/**
 * Load active todo list ID from storage
 * Input: Optional user ID
 * Process: Retrieve from Firestore if user ID provided, otherwise localStorage
 * Output: Todo list ID or null if not found
 */
export const loadActiveTodoListId = async (userId?: string): Promise<string | null> => {
  if (userId) {
    // Load from Firestore if user is logged in
    return await loadActiveTodoListIdFromFirestore(userId);
  } else if (typeof window !== 'undefined') {
    // Load from localStorage if no user is logged in
    const activeTodoListId = localStorage.getItem(ACTIVE_TODO_LIST_ID_KEY);
    return activeTodoListId;
  }
  return null;
};

/**
 * Save theme preference to localStorage
 * Input: Dark mode boolean
 * Process: Store in localStorage
 * Output: None
 */
export const saveTheme = (darkMode: boolean): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(darkMode));
  }
};

/**
 * Load theme preference from localStorage
 * Input: None
 * Process: Retrieve from localStorage
 * Output: Dark mode boolean or false if not found
 */
export const loadTheme = (): boolean => {
  if (typeof window !== 'undefined') {
    const themeJson = localStorage.getItem(THEME_STORAGE_KEY);
    if (themeJson) {
      try {
        return JSON.parse(themeJson);
      } catch (error) {
        console.error('Failed to parse theme from localStorage:', error);
      }
    }
  }
  return false;
};

/**
 * Save filter preference to storage
 * Input: Filter option and optional user ID
 * Process: Store in Firestore if user ID provided, otherwise localStorage
 * Output: None
 */
export const saveFilter = async (filter: FilterOption, userId?: string): Promise<void> => {
  if (userId) {
    // Save to Firestore if user is logged in
    await saveFilterToFirestore(userId, filter);
  } else if (typeof window !== 'undefined') {
    // Save to localStorage if no user is logged in
    localStorage.setItem(FILTER_STORAGE_KEY, filter);
  }
};

/**
 * Load filter preference from storage
 * Input: Optional user ID
 * Process: Retrieve from Firestore if user ID provided, otherwise localStorage
 * Output: Filter option or default if not found
 */
export const loadFilter = async (userId?: string): Promise<FilterOption> => {
  if (userId) {
    // Load from Firestore if user is logged in
    return await loadFilterFromFirestore(userId, FilterOption.All) as FilterOption;
  } else if (typeof window !== 'undefined') {
    // Load from localStorage if no user is logged in
    const filter = localStorage.getItem(FILTER_STORAGE_KEY);
    if (filter && Object.values(FilterOption).includes(filter as FilterOption)) {
      return filter as FilterOption;
    }
  }
  return FilterOption.All;
};

/**
 * Migrate tasks from old format to new format
 * Input: Array of tasks
 * Process: Convert to todo lists format
 * Output: Array of todo lists
 */
export const migrateOldTasks = (tasks: Task[]): TodoList[] => {
  // This function remains unchanged as it doesn't involve Firestore
  // ... existing code ...
  
  // Create a default todo list with the tasks
  const defaultTodoList: TodoList = {
    id: 'default',
    name: 'My Tasks',
    tasks,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return [defaultTodoList];
};

/**
 * Migrate local data to Firestore
 * Input: User ID
 * Process: Load data from localStorage and save to Firestore
 * Output: Promise resolving when complete
 */
export const migrateLocalDataToFirestore = async (userId: string): Promise<void> => {
  if (typeof window !== 'undefined') {
    // Load todo lists from localStorage
    const todoListsJson = localStorage.getItem(TODO_LISTS_STORAGE_KEY);
    if (todoListsJson) {
      try {
        const todoLists = JSON.parse(todoListsJson);
        await saveTodoListsToFirestore(userId, todoLists);
      } catch (error) {
        console.error('Failed to migrate todo lists to Firestore:', error);
      }
    }
    
    // Load active todo list ID from localStorage
    const activeTodoListId = localStorage.getItem(ACTIVE_TODO_LIST_ID_KEY);
    if (activeTodoListId) {
      await saveActiveTodoListIdToFirestore(userId, activeTodoListId);
    }
    
    // Load filter from localStorage
    const filter = localStorage.getItem(FILTER_STORAGE_KEY);
    if (filter) {
      await saveFilterToFirestore(userId, filter);
    }
  }
}; 