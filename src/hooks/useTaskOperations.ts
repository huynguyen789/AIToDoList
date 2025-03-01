/**
 * Custom hook for task operations
 * Provides simplified methods for common task operations
 */

import { useTasksContext } from '../context/TasksContext';
import { Task, PriorityLevel, FilterOption, TodoList } from '../types';
import { createTask } from '../lib/taskUtils';

/**
 * Hook for task operations
 * Input: None
 * Process: Wrap task context with simplified methods
 * Output: Methods for task operations and state
 */
export const useTaskOperations = () => {
  const { state, dispatch } = useTasksContext();
  
  /**
   * Get active todo list
   * Input: None
   * Process: Find active todo list in state
   * Output: Active todo list or null
   */
  const getActiveTodoList = (): TodoList | null => {
    if (!state.activeTodoListId || !state.todoLists.length) return null;
    return state.todoLists.find(list => list.id === state.activeTodoListId) || null;
  };
  
  /**
   * Add a new task
   * Input: Title, description, deadline, priority, deadlineTime
   * Process: Create and dispatch new task
   * Output: None
   */
  const addTask = (
    title: string,
    description?: string,
    deadline?: string,
    priority: PriorityLevel = PriorityLevel.UrgentImportant,
    deadlineTime?: string
  ) => {
    if (!title.trim() || !state.activeTodoListId) return;
    
    const newTask = createTask(title, priority);
    
    if (description) {
      newTask.description = description;
    }
    
    if (deadline) {
      newTask.deadline = deadline;
    }
    
    if (deadlineTime) {
      newTask.deadlineTime = deadlineTime;
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
  
  /**
   * Add a new todo list
   * Input: List name
   * Process: Dispatch add todo list action
   * Output: None
   */
  const addTodoList = (name: string) => {
    if (!name.trim()) return;
    
    dispatch({
      type: 'ADD_TODO_LIST',
      payload: { name },
    });
  };
  
  /**
   * Update a todo list
   * Input: List ID and new name
   * Process: Dispatch update todo list action
   * Output: None
   */
  const updateTodoList = (id: string, name: string) => {
    if (!name.trim()) return;
    
    dispatch({
      type: 'UPDATE_TODO_LIST',
      payload: { id, name },
    });
  };
  
  /**
   * Delete a todo list
   * Input: List ID
   * Process: Dispatch delete todo list action
   * Output: None
   */
  const deleteTodoList = (id: string) => {
    dispatch({
      type: 'DELETE_TODO_LIST',
      payload: id,
    });
  };
  
  /**
   * Set active todo list
   * Input: List ID
   * Process: Dispatch set active todo list action
   * Output: None
   */
  const setActiveTodoList = (id: string) => {
    dispatch({
      type: 'SET_ACTIVE_TODO_LIST',
      payload: id,
    });
  };
  
  // Get tasks from active todo list
  const activeTodoList = getActiveTodoList();
  const tasks = activeTodoList ? activeTodoList.tasks : [];
  
  return {
    // State
    tasks: getActiveTodoList()?.tasks.filter(task => {
      if (state.filter === FilterOption.Active) return !task.completed;
      if (state.filter === FilterOption.Completed) return task.completed;
      return true;
    }) || [],
    filter: state.filter,
    totalScore: state.totalScore,
    todoLists: state.todoLists,
    activeTodoList: getActiveTodoList(),
    loading: state.loading,
    
    // Methods
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    changePriority,
    moveTask,
    setFilter,
    addTodoList,
    updateTodoList,
    deleteTodoList,
    setActiveTodoList,
  };
}; 