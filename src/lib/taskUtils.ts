/**
 * Task utility functions for the AI Todo List application
 * Handles task operations like creation, sorting, and score calculation
 */

import { Task, PriorityLevel, PriorityScores, FilterOption } from '../types';

/**
 * Generate a unique ID for a task
 * Input: None
 * Process: Create a random string
 * Output: Unique ID string
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Create a new task
 * Input: Title and priority level
 * Process: Generate task with default values
 * Output: New task object
 */
export const createTask = (
  title: string, 
  priority: PriorityLevel = PriorityLevel.UrgentImportant
): Task => {
  const now = new Date().toISOString();
  
  return {
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    description: '',
    completed: false,
    priority,
    createdAt: now,
    updatedAt: now,
    order: 0, // Will be updated when added to the task list
  };
};

/**
 * Calculate the total score for a list of tasks
 * Input: Array of tasks
 * Process: Sum the scores of completed tasks
 * Output: Total score number
 */
export const calculateTotalScore = (tasks: Task[]): number => {
  return tasks
    .filter(task => task.completed)
    .reduce((total, task) => total + PriorityScores[task.priority], 0);
};

/**
 * Filter tasks based on the selected filter option
 * Input: Array of tasks and filter option
 * Process: Apply filter criteria
 * Output: Filtered array of tasks
 */
export const filterTasks = (
  tasks: Task[], 
  filter: FilterOption
): Task[] => {
  // Apply completion filter
  switch (filter) {
    case FilterOption.Active:
      return tasks.filter(task => !task.completed);
    case FilterOption.Completed:
      return tasks.filter(task => task.completed);
    default:
      return tasks;
  }
};

/**
 * Group tasks by priority level
 * Input: Array of tasks
 * Process: Group tasks into priority buckets
 * Output: Record with priority levels as keys and task arrays as values
 */
export const groupTasksByPriority = (tasks: Task[]): Record<PriorityLevel, Task[]> => {
  const grouped: Record<PriorityLevel, Task[]> = {
    [PriorityLevel.UrgentImportant]: [],
    [PriorityLevel.ImportantNotUrgent]: [],
    [PriorityLevel.UrgentNotImportant]: [],
    [PriorityLevel.NeitherUrgentNorImportant]: [],
  };

  tasks.forEach(task => {
    grouped[task.priority].push(task);
  });

  // Sort tasks within each priority by order
  Object.keys(grouped).forEach(priority => {
    grouped[priority as unknown as PriorityLevel].sort((a, b) => a.order - b.order);
  });

  return grouped;
};

/**
 * Update task orders after a task is moved
 * Input: Array of tasks and priority level
 * Process: Reassign order values sequentially
 * Output: Updated array of tasks
 */
export const updateTaskOrders = (tasks: Task[], priority: PriorityLevel): Task[] => {
  // Get tasks in the specified priority level
  const tasksInPriority = tasks
    .filter(task => task.priority === priority)
    .sort((a, b) => a.order - b.order);
  
  // Reassign order values
  const updatedTasksInPriority = tasksInPriority.map((task, index) => ({
    ...task,
    order: index
  }));
  
  // Replace tasks in the original array
  return tasks.map(task => {
    if (task.priority === priority) {
      const updatedTask = updatedTasksInPriority.find(t => t.id === task.id);
      return updatedTask || task;
    }
    return task;
  });
};

/**
 * Move a task up or down within its priority level
 * Input: Array of tasks, task ID, and direction
 * Process: Swap order values with adjacent task
 * Output: Updated array of tasks
 */
export const moveTask = (
  tasks: Task[],
  taskId: string,
  direction: 'up' | 'down'
): Task[] => {
  const taskToMove = tasks.find(task => task.id === taskId);
  if (!taskToMove) return tasks;
  
  // Get all tasks in the same priority level
  const tasksInPriority = tasks
    .filter(task => task.priority === taskToMove.priority)
    .sort((a, b) => a.order - b.order);
  
  // Find current index
  const currentIndex = tasksInPriority.findIndex(task => task.id === taskId);
  if (currentIndex === -1) return tasks;
  
  // Calculate target index
  let targetIndex = currentIndex;
  if (direction === 'up' && currentIndex > 0) {
    targetIndex = currentIndex - 1;
  } else if (direction === 'down' && currentIndex < tasksInPriority.length - 1) {
    targetIndex = currentIndex + 1;
  } else {
    // Can't move further in that direction
    return tasks;
  }
  
  // Swap orders
  const targetTask = tasksInPriority[targetIndex];
  const currentOrder = taskToMove.order;
  const targetOrder = targetTask.order;
  
  // Create updated tasks array
  return tasks.map(task => {
    if (task.id === taskToMove.id) {
      return { ...task, order: targetOrder };
    } else if (task.id === targetTask.id) {
      return { ...task, order: currentOrder };
    }
    return task;
  });
};

/**
 * Change a task's priority level
 * Input: Array of tasks, task ID, and new priority
 * Process: Update priority and recalculate orders
 * Output: Updated array of tasks
 */
export const changeTaskPriority = (
  tasks: Task[],
  taskId: string,
  newPriority: PriorityLevel
): Task[] => {
  const taskToUpdate = tasks.find(task => task.id === taskId);
  if (!taskToUpdate || taskToUpdate.priority === newPriority) {
    return tasks;
  }
  
  // Find highest order in the new priority level
  const tasksInNewPriority = tasks.filter(task => task.priority === newPriority);
  const highestOrder = tasksInNewPriority.length > 0
    ? Math.max(...tasksInNewPriority.map(task => task.order)) + 1
    : 0;
  
  // Update task with new priority and order
  const updatedTasks = tasks.map(task =>
    task.id === taskId
      ? {
          ...task,
          priority: newPriority,
          order: highestOrder,
          updatedAt: new Date().toISOString()
        }
      : task
  );
  
  // Update orders in the old priority level
  return updateTaskOrders(updatedTasks, taskToUpdate.priority);
};

/**
 * Format deadline for display
 * Input: Date string and optional time string
 * Process: Format date and time in user-friendly format
 * Output: Formatted deadline string
 */
export const formatDeadline = (date?: string, time?: string): string => {
  if (!date) return '';
  
  const deadlineDate = new Date(date);
  const formattedDate = deadlineDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  if (time) {
    return `${formattedDate} at ${time}`;
  }
  
  return formattedDate;
}; 