/**
 * Tasks Context for the AI Todo List application
 * Provides global state management for tasks
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Task, TasksState, TasksAction, FilterOption, PriorityLevel } from '../types';
import { loadTasks, saveTasks, loadFilter, saveFilter } from '../lib/storage';
import { calculateTotalScore, updateTaskOrders, moveTask, changeTaskPriority } from '../lib/taskUtils';

// Initial state
const initialState: TasksState = {
  tasks: [],
  filter: FilterOption.All,
  totalScore: 0,
};

// Create context
const TasksContext = createContext<{
  state: TasksState;
  dispatch: React.Dispatch<TasksAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

/**
 * Tasks reducer function
 * Input: Current state and action
 * Process: Apply state changes based on action type
 * Output: New state
 */
const tasksReducer = (state: TasksState, action: TasksAction): TasksState => {
  switch (action.type) {
    case 'ADD_TASK': {
      // Find highest order in the priority level
      const tasksInPriority = state.tasks.filter(
        task => task.priority === action.payload.priority
      );
      const highestOrder = tasksInPriority.length > 0
        ? Math.max(...tasksInPriority.map(task => task.order)) + 1
        : 0;
      
      // Add new task with correct order
      const newTask = { ...action.payload, order: highestOrder };
      const newTasks = [...state.tasks, newTask];
      
      return {
        ...state,
        tasks: newTasks,
        totalScore: calculateTotalScore(newTasks),
      };
    }
    
    case 'UPDATE_TASK': {
      const updatedTasks = state.tasks.map(task =>
        task.id === action.payload.id ? { ...action.payload } : task
      );
      
      return {
        ...state,
        tasks: updatedTasks,
        totalScore: calculateTotalScore(updatedTasks),
      };
    }
    
    case 'DELETE_TASK': {
      const filteredTasks = state.tasks.filter(task => task.id !== action.payload);
      const taskToDelete = state.tasks.find(task => task.id === action.payload);
      
      // If task exists, update orders for its priority level
      let updatedTasks = filteredTasks;
      if (taskToDelete) {
        updatedTasks = updateTaskOrders(filteredTasks, taskToDelete.priority);
      }
      
      return {
        ...state,
        tasks: updatedTasks,
        totalScore: calculateTotalScore(updatedTasks),
      };
    }
    
    case 'TOGGLE_COMPLETE': {
      const updatedTasks = state.tasks.map(task =>
        task.id === action.payload
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: new Date().toISOString(),
            }
          : task
      );
      
      return {
        ...state,
        tasks: updatedTasks,
        totalScore: calculateTotalScore(updatedTasks),
      };
    }
    
    case 'CHANGE_PRIORITY': {
      const updatedTasks = changeTaskPriority(
        state.tasks,
        action.payload.id,
        action.payload.priority
      );
      
      return {
        ...state,
        tasks: updatedTasks,
        totalScore: calculateTotalScore(updatedTasks),
      };
    }
    
    case 'MOVE_TASK': {
      const updatedTasks = moveTask(
        state.tasks,
        action.payload.id,
        action.payload.direction
      );
      
      return {
        ...state,
        tasks: updatedTasks,
      };
    }
    
    case 'SET_FILTER': {
      saveFilter(action.payload);
      return {
        ...state,
        filter: action.payload,
      };
    }
    
    case 'CALCULATE_SCORE': {
      return {
        ...state,
        totalScore: calculateTotalScore(state.tasks),
      };
    }
    
    default:
      return state;
  }
};

/**
 * Tasks Provider component
 * Input: Children components
 * Process: Provide tasks context to children
 * Output: Context provider with state and dispatch
 */
export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(tasksReducer, initialState);
  
  // Load tasks and filter from local storage on initial render
  useEffect(() => {
    const savedTasks = loadTasks();
    const savedFilter = loadFilter();
    
    if (savedTasks.length > 0) {
      savedTasks.forEach(task => {
        dispatch({ type: 'ADD_TASK', payload: task });
      });
    }
    
    dispatch({ type: 'SET_FILTER', payload: savedFilter });
    dispatch({ type: 'CALCULATE_SCORE' });
  }, []);
  
  // Save tasks to local storage whenever they change
  useEffect(() => {
    saveTasks(state.tasks);
  }, [state.tasks]);
  
  return (
    <TasksContext.Provider value={{ state, dispatch }}>
      {children}
    </TasksContext.Provider>
  );
};

/**
 * Custom hook to use the tasks context
 * Input: None
 * Process: Access context
 * Output: State and dispatch function
 */
export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}; 