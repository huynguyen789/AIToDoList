/**
 * Custom hook for task operations
 * Provides simplified methods for common task operations
 */

import { useTasks } from '../context/TasksContext';
import { Task, PriorityLevel, FilterOption } from '../types';
import { createTask } from '../lib/taskUtils';

/**
 * Hook for task operations
 * Input: None
 * Process: Wrap task context with simplified methods
 * Output: Methods for task operations and state
 */
export const useTaskOperations = () => {
  const { state, dispatch } = useTasks();
  
  /**
   * Add a new task
   * Input: Title, description, deadline, priority
   * Process: Create and dispatch new task
   * Output: None
   */
  const addTask = (
    title: string,
    description?: string,
    deadline?: string,
    priority: PriorityLevel = PriorityLevel.UrgentImportant
  ) => {
    if (!title.trim()) return;
    
    const newTask = createTask(title, priority);
    
    if (description) {
      newTask.description = description;
    }
    
    if (deadline) {
      newTask.deadline = deadline;
    }
    
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };
  
  /**
   * Update an existing task
   * Input: Task object with updates
   * Process: Dispatch update action
   * Output: None
   */
  const updateTask = (task: Task) => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        ...task,
        updatedAt: new Date().toISOString(),
      },
    });
  };
  
  /**
   * Delete a task
   * Input: Task ID
   * Process: Dispatch delete action
   * Output: None
   */
  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };
  
  /**
   * Toggle task completion status
   * Input: Task ID
   * Process: Dispatch toggle action
   * Output: None
   */
  const toggleComplete = (id: string) => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: id });
  };
  
  /**
   * Change task priority
   * Input: Task ID and new priority
   * Process: Dispatch change priority action
   * Output: None
   */
  const changePriority = (id: string, priority: PriorityLevel) => {
    dispatch({
      type: 'CHANGE_PRIORITY',
      payload: { id, priority },
    });
  };
  
  /**
   * Move task up or down within priority
   * Input: Task ID and direction
   * Process: Dispatch move task action
   * Output: None
   */
  const moveTask = (id: string, direction: 'up' | 'down') => {
    dispatch({
      type: 'MOVE_TASK',
      payload: { id, direction },
    });
  };
  
  /**
   * Set filter for tasks
   * Input: Filter option
   * Process: Dispatch set filter action
   * Output: None
   */
  const setFilter = (filter: FilterOption) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };
  
  return {
    tasks: state.tasks,
    filter: state.filter,
    totalScore: state.totalScore,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    changePriority,
    moveTask,
    setFilter,
  };
}; 