/**
 * Types for the Priority Task Manager app
 * - PriorityLevel defines the 4 priority levels based on Eisenhower Matrix
 * - Task defines the structure of a task item with priority, status, etc.
 * - TaskFilter defines the possible task filtering options
 */

export enum PriorityLevel {
  URGENT_IMPORTANT = 1, // Score: 10 points
  IMPORTANT_NOT_URGENT = 2, // Score: 7 points
  URGENT_NOT_IMPORTANT = 3, // Score: 5 points
  NEITHER_URGENT_NOR_IMPORTANT = 4, // Score: 2 points
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  completed: boolean;
  deadline: string; // ISO date string
  createdAt: string; // ISO date string
}

export type TaskFilter = "all" | "active" | "completed"; 