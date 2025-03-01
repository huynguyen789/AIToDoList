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
 * Create a new task with default values
 * Input: Task title and optional priority
 * Process: Generate task object with defaults
 * Output: New Task object
 */
export const createTask = (
  title: string,
  priority: PriorityLevel = PriorityLevel.UrgentImportant
): Task => {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title,
    description: '',
    completed: false,
    priority,
    createdAt: now,
    updatedAt: now,
    order: 0, // Will be updated when added to the list
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
 * Process: Apply filter logic
 * Output: Filtered array of tasks
 */
export const filterTasks = (tasks: Task[], filter: FilterOption): Task[] => {
  switch (filter) {
    case FilterOption.Active:
      return tasks.filter(task => !task.completed);
    case FilterOption.Completed:
      return tasks.filter(task => task.completed);
    case FilterOption.All:
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
  const priorityTasks = tasks.filter(task => task.priority === priority);
  
  // Sort by current order
  priorityTasks.sort((a, b) => a.order - b.order);
  
  // Reassign orders
  const updatedTasks = priorityTasks.map((task, index) => ({
    ...task,
    order: index,
  }));
  
  // Replace tasks of this priority with updated ones
  return tasks.map(task => 
    task.priority === priority 
      ? updatedTasks.find(t => t.id === task.id) || task 
      : task
  );
};

/**
 * Move a task up or down within its priority level
 * Input: Array of tasks, task ID, and direction
 * Process: Swap order with adjacent task
 * Output: Updated array of tasks
 */
export const moveTask = (
  tasks: Task[],
  taskId: string,
  direction: 'up' | 'down'
): Task[] => {
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) return tasks;
  
  const task = tasks[taskIndex];
  const priorityTasks = tasks.filter(t => t.priority === task.priority);
  priorityTasks.sort((a, b) => a.order - b.order);
  
  const taskPriorityIndex = priorityTasks.findIndex(t => t.id === taskId);
  
  // Can't move first task up or last task down
  if (
    (direction === 'up' && taskPriorityIndex === 0) ||
    (direction === 'down' && taskPriorityIndex === priorityTasks.length - 1)
  ) {
    return tasks;
  }
  
  // Swap orders with adjacent task
  const adjacentIndex = direction === 'up' ? taskPriorityIndex - 1 : taskPriorityIndex + 1;
  const adjacentTask = priorityTasks[adjacentIndex];
  
  const updatedTasks = tasks.map(t => {
    if (t.id === task.id) {
      return { ...t, order: adjacentTask.order };
    }
    if (t.id === adjacentTask.id) {
      return { ...t, order: task.order };
    }
    return t;
  });
  
  return updatedTasks;
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
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) return tasks;
  
  const task = tasks[taskIndex];
  if (task.priority === newPriority) return tasks;
  
  // Get highest order in the new priority level
  const tasksInNewPriority = tasks.filter(t => t.priority === newPriority);
  const highestOrder = tasksInNewPriority.length > 0
    ? Math.max(...tasksInNewPriority.map(t => t.order)) + 1
    : 0;
  
  // Update the task with new priority and order
  const updatedTasks = tasks.map(t => 
    t.id === taskId
      ? { ...t, priority: newPriority, order: highestOrder, updatedAt: new Date().toISOString() }
      : t
  );
  
  // Update orders in the old priority level
  return updateTaskOrders(updatedTasks, task.priority);
}; 