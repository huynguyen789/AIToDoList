/**
 * Utility functions for task management
 * Includes functions for task sorting, filtering, and priority label retrieval
 */

import { Task, PriorityLevel, TaskFilter } from "../types";

/**
 * Sort tasks by priority level (higher priority first) and then by deadline
 * @param tasks - Array of tasks to sort
 * @returns Sorted array of tasks
 */
export const sortTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    // First sort by priority (lower number = higher priority)
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    
    // Then sort by deadline (earlier deadline first)
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });
};

/**
 * Filter tasks based on the selected filter
 * @param tasks - Array of tasks to filter
 * @param filter - Filter type (all, active, completed)
 * @returns Filtered array of tasks
 */
export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  switch (filter) {
    case "active":
      return tasks.filter(task => !task.completed);
    case "completed":
      return tasks.filter(task => task.completed);
    default:
      return tasks;
  }
};

/**
 * Get priority label and score for display
 * @param priority - Priority level enum value
 * @returns Object with label and score
 */
export const getPriorityInfo = (priority: PriorityLevel): { label: string; score: number } => {
  switch (priority) {
    case PriorityLevel.URGENT_IMPORTANT:
      return { label: "Urgent & Important", score: 10 };
    case PriorityLevel.IMPORTANT_NOT_URGENT:
      return { label: "Important but Not Urgent", score: 7 };
    case PriorityLevel.URGENT_NOT_IMPORTANT:
      return { label: "Urgent but Not Important", score: 5 };
    case PriorityLevel.NEITHER_URGENT_NOR_IMPORTANT:
      return { label: "Neither Urgent nor Important", score: 2 };
    default:
      return { label: "Unknown", score: 0 };
  }
};

/**
 * Get CSS class name for priority level styling
 * @param priority - Priority level enum value
 * @returns CSS class name for the priority level
 */
export const getPriorityClassName = (priority: PriorityLevel): string => {
  switch (priority) {
    case PriorityLevel.URGENT_IMPORTANT:
      return "bg-priority-1 text-white";
    case PriorityLevel.IMPORTANT_NOT_URGENT:
      return "bg-priority-2 text-white";
    case PriorityLevel.URGENT_NOT_IMPORTANT:
      return "bg-priority-3 text-white";
    case PriorityLevel.NEITHER_URGENT_NOR_IMPORTANT:
      return "bg-priority-4 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}; 