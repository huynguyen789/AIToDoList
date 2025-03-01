/**
 * Type definitions for the AI Todo List application
 * Contains interfaces and types used throughout the application
 */

// Task priority levels based on Eisenhower Matrix
export enum PriorityLevel {
  UrgentImportant = 1,      // Urgent & Important
  ImportantNotUrgent = 2,   // Important but Not Urgent
  UrgentNotImportant = 3,   // Urgent but Not Important
  NeitherUrgentNorImportant = 4  // Neither Urgent nor Important
}

// Score values for each priority level
export const PriorityScores: Record<PriorityLevel, number> = {
  [PriorityLevel.UrgentImportant]: 10,
  [PriorityLevel.ImportantNotUrgent]: 7,
  [PriorityLevel.UrgentNotImportant]: 5,
  [PriorityLevel.NeitherUrgentNorImportant]: 2
};

// Priority level labels for display
export const PriorityLabels: Record<PriorityLevel, string> = {
  [PriorityLevel.UrgentImportant]: "Urgent & Important",
  [PriorityLevel.ImportantNotUrgent]: "Important, Not Urgent",
  [PriorityLevel.UrgentNotImportant]: "Urgent, Not Important",
  [PriorityLevel.NeitherUrgentNorImportant]: "Neither Urgent nor Important"
};

// Shorter priority labels for compact display
export const ShortPriorityLabels: Record<PriorityLevel, string> = {
  [PriorityLevel.UrgentImportant]: "U+I",
  [PriorityLevel.ImportantNotUrgent]: "I",
  [PriorityLevel.UrgentNotImportant]: "U",
  [PriorityLevel.NeitherUrgentNorImportant]: "Low"
};

// Task interface
export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: string; // ISO date string
  deadlineTime?: string; // Time in HH:MM format
  completed: boolean;
  priority: PriorityLevel;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  order: number; // For ordering within priority level
}

// Todo list interface
export interface TodoList {
  id: string;
  name: string;
  tasks: Task[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Task filter options
export enum FilterOption {
  All = "all",
  Active = "active",
  Completed = "completed"
}

// Task context state
export interface TasksState {
  todoLists: TodoList[];
  activeTodoListId: string | null;
  filter: FilterOption;
  totalScore: number;
}

// Task context actions
export type TasksAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string } // task id
  | { type: 'TOGGLE_COMPLETE'; payload: string } // task id
  | { type: 'CHANGE_PRIORITY'; payload: { id: string; priority: PriorityLevel } }
  | { type: 'MOVE_TASK'; payload: { id: string; direction: 'up' | 'down' } }
  | { type: 'SET_FILTER'; payload: FilterOption }
  | { type: 'CALCULATE_SCORE' }
  | { type: 'ADD_TODO_LIST'; payload: { name: string } }
  | { type: 'UPDATE_TODO_LIST'; payload: { id: string; name: string } }
  | { type: 'DELETE_TODO_LIST'; payload: string } // todo list id
  | { type: 'SET_ACTIVE_TODO_LIST'; payload: string }; // todo list id

// Theme context
export interface ThemeState {
  darkMode: boolean;
}

export type ThemeAction = { type: 'TOGGLE_THEME' }; 