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
 * Check if localStorage is available
 * Input: None
 * Process: Try to access localStorage
 * Output: Boolean indicating if localStorage is available
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__test_storage__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.error('localStorage is not available:', e);
    return false;
  }
};

/**
 * Save todo lists to storage
 * Input: Array of todo lists and optional user ID
 * Process: Store in Firestore if user ID provided, and always in localStorage as backup
 * Output: None
 */
export const saveTodoLists = async (todoLists: TodoList[], userId?: string): Promise<void> => {
  // Always save to localStorage as a backup, regardless of login state
  if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
    try {
      const todoListsJson = JSON.stringify(todoLists);
      localStorage.setItem(TODO_LISTS_STORAGE_KEY, todoListsJson);
      console.log('Saved todo lists to localStorage as backup:', todoLists.length, 'lists');
    } catch (error) {
      console.error('Failed to save todo lists to localStorage:', error);
    }
  }
  
  // If user is logged in, also save to Firestore
  if (userId) {
    try {
      console.log('Saving todo lists to Firestore for user:', userId);
      await saveTodoListsToFirestore(userId, todoLists);
    } catch (error) {
      console.error('Failed to save todo lists to Firestore:', error);
      // Continue execution - we already saved to localStorage as backup
    }
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
    try {
      console.log('Attempting to load todo lists from Firebase for user:', userId);
      const firebaseTodoLists = await loadTodoListsFromFirestore(userId);
      
      if (firebaseTodoLists && firebaseTodoLists.length > 0) {
        console.log('Successfully loaded todo lists from Firebase:', firebaseTodoLists.length, 'lists');
        return firebaseTodoLists;
      } else {
        console.log('No todo lists found in Firebase for user:', userId);
        // If no data in Firebase but user is logged in, try localStorage as fallback
        // This helps during the transition period
        if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
          const todoListsJson = localStorage.getItem(TODO_LISTS_STORAGE_KEY);
          if (todoListsJson) {
            try {
              const parsedLists = JSON.parse(todoListsJson);
              if (Array.isArray(parsedLists) && parsedLists.length > 0) {
                console.log('Found todo lists in localStorage as fallback:', parsedLists.length, 'lists');
                return parsedLists;
              }
            } catch (error) {
              console.error('Failed to parse localStorage fallback data:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading todo lists from Firebase:', error);
      // Fall back to localStorage if Firebase fails
      if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
        const todoListsJson = localStorage.getItem(TODO_LISTS_STORAGE_KEY);
        if (todoListsJson) {
          try {
            const parsedLists = JSON.parse(todoListsJson);
            if (Array.isArray(parsedLists) && parsedLists.length > 0) {
              console.log('Falling back to localStorage after Firebase error:', parsedLists.length, 'lists');
              return parsedLists;
            }
          } catch (error) {
            console.error('Failed to parse localStorage fallback data:', error);
          }
        }
      }
      return [];
    }
  } 
  
  // Load from localStorage if no user is logged in
  if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
    try {
      const todoListsJson = localStorage.getItem(TODO_LISTS_STORAGE_KEY);
      console.log('Loaded raw todo lists from localStorage:', todoListsJson);
      
      if (todoListsJson) {
        const parsedLists = JSON.parse(todoListsJson);
        if (Array.isArray(parsedLists)) {
          console.log('Successfully parsed todo lists from localStorage:', parsedLists.length, 'lists');
          return parsedLists;
        } else {
          console.error('Parsed todo lists is not an array:', parsedLists);
        }
      } else {
        console.log('No todo lists found in localStorage');
      }
    } catch (error) {
      console.error('Failed to parse todo lists from localStorage:', error);
    }
  } else {
    console.log('localStorage is not available or window is undefined');
  }
  
  // Return empty array if nothing found or error occurred
  console.log('Returning empty array for todo lists');
  return [];
};

/**
 * Save active todo list ID to storage
 * Input: Todo list ID and optional user ID
 * Process: Store in Firestore if user ID provided, and always in localStorage as backup
 * Output: None
 */
export const saveActiveTodoListId = async (activeTodoListId: string | null, userId?: string): Promise<void> => {
  // Always save to localStorage as a backup, regardless of login state
  if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
    try {
      if (activeTodoListId) {
        localStorage.setItem(ACTIVE_TODO_LIST_ID_KEY, activeTodoListId);
        console.log('Saved active todo list ID to localStorage as backup:', activeTodoListId);
      } else {
        localStorage.removeItem(ACTIVE_TODO_LIST_ID_KEY);
        console.log('Removed active todo list ID from localStorage');
      }
    } catch (error) {
      console.error('Failed to save active todo list ID to localStorage:', error);
    }
  }
  
  // If user is logged in, also save to Firestore
  if (userId) {
    try {
      console.log('Saving active todo list ID to Firestore for user:', userId);
      await saveActiveTodoListIdToFirestore(userId, activeTodoListId);
    } catch (error) {
      console.error('Failed to save active todo list ID to Firestore:', error);
      // Continue execution - we already saved to localStorage as backup
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
  } else if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
    // Load from localStorage if no user is logged in
    try {
      const activeTodoListId = localStorage.getItem(ACTIVE_TODO_LIST_ID_KEY);
      console.log('Loaded active todo list ID from localStorage:', activeTodoListId);
      return activeTodoListId;
    } catch (error) {
      console.error('Failed to load active todo list ID from localStorage:', error);
    }
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
  if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(darkMode));
      console.log('Saved theme to localStorage:', darkMode);
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
    }
  }
};

/**
 * Load theme preference from localStorage
 * Input: None
 * Process: Retrieve from localStorage
 * Output: Dark mode boolean or false if not found
 */
export const loadTheme = (): boolean => {
  if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
    try {
      const themeJson = localStorage.getItem(THEME_STORAGE_KEY);
      console.log('Loaded theme from localStorage:', themeJson);
      if (themeJson) {
        return JSON.parse(themeJson);
      }
    } catch (error) {
      console.error('Failed to parse theme from localStorage:', error);
    }
  }
  return false;
};

/**
 * Save filter preference to storage
 * Input: Filter option and optional user ID
 * Process: Store in Firestore if user ID provided, and always in localStorage as backup
 * Output: None
 */
export const saveFilter = async (filter: FilterOption, userId?: string): Promise<void> => {
  // Always save to localStorage as a backup, regardless of login state
  if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
    try {
      localStorage.setItem(FILTER_STORAGE_KEY, filter);
      console.log('Saved filter to localStorage as backup:', filter);
    } catch (error) {
      console.error('Failed to save filter to localStorage:', error);
    }
  }
  
  // If user is logged in, also save to Firestore
  if (userId) {
    try {
      console.log('Saving filter to Firestore for user:', userId);
      await saveFilterToFirestore(userId, filter);
    } catch (error) {
      console.error('Failed to save filter to Firestore:', error);
      // Continue execution - we already saved to localStorage as backup
    }
  }
};

/**
 * Load filter preference from storage
 * Input: Optional user ID
 * Process: Retrieve from Firestore if user ID provided, otherwise localStorage
 * Output: Filter option or default (All) if not found
 */
export const loadFilter = async (userId?: string): Promise<FilterOption> => {
  if (userId) {
    // Load from Firestore if user is logged in
    const filter = await loadFilterFromFirestore(userId, FilterOption.All);
    return filter as FilterOption;
  } else if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
    // Load from localStorage if no user is logged in
    try {
      const filter = localStorage.getItem(FILTER_STORAGE_KEY);
      console.log('Loaded filter from localStorage:', filter);
      if (filter && Object.values(FilterOption).includes(filter as FilterOption)) {
        return filter as FilterOption;
      }
    } catch (error) {
      console.error('Failed to load filter from localStorage:', error);
    }
  }
  
  // Return default filter if nothing found or error occurred
  console.log('No filter found, returning default (All)');
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
 * Process: Load data from localStorage and save to Firestore, but don't clear localStorage immediately
 * Output: Promise resolving when complete
 */
export const migrateLocalDataToFirestore = async (userId: string): Promise<void> => {
  if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
    console.log('Migrating local data to Firestore for user:', userId);
    
    let migrationSuccessful = true;
    
    // Load todo lists from localStorage
    const todoListsJson = localStorage.getItem(TODO_LISTS_STORAGE_KEY);
    if (todoListsJson) {
      try {
        const todoLists = JSON.parse(todoListsJson);
        console.log('Migrating todo lists to Firestore:', todoLists);
        await saveTodoListsToFirestore(userId, todoLists);
      } catch (error) {
        console.error('Failed to migrate todo lists to Firestore:', error);
        migrationSuccessful = false;
      }
    }
    
    // Load active todo list ID from localStorage
    const activeTodoListId = localStorage.getItem(ACTIVE_TODO_LIST_ID_KEY);
    if (activeTodoListId) {
      try {
        console.log('Migrating active todo list ID to Firestore:', activeTodoListId);
        await saveActiveTodoListIdToFirestore(userId, activeTodoListId);
      } catch (error) {
        console.error('Failed to migrate active todo list ID to Firestore:', error);
        migrationSuccessful = false;
      }
    }
    
    // Load filter from localStorage
    const filter = localStorage.getItem(FILTER_STORAGE_KEY);
    if (filter) {
      try {
        console.log('Migrating filter to Firestore:', filter);
        await saveFilterToFirestore(userId, filter);
      } catch (error) {
        console.error('Failed to migrate filter to Firestore:', error);
        migrationSuccessful = false;
      }
    }
    
    // Don't clear localStorage immediately to ensure data is not lost during transition
    // We'll keep data in both places for now
    if (migrationSuccessful) {
      console.log('Migration successful, but keeping localStorage data as backup');
      // We'll clear localStorage after confirming Firebase is working properly
      // localStorage.removeItem(TODO_LISTS_STORAGE_KEY);
      // localStorage.removeItem(ACTIVE_TODO_LIST_ID_KEY);
      // localStorage.removeItem(FILTER_STORAGE_KEY);
    }
  } else {
    console.log('localStorage is not available, skipping migration');
  }
}; 