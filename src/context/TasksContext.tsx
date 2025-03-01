/**
 * Tasks Context for the AI Todo List application
 * Provides global state management for tasks
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Task, TasksState, TasksAction, FilterOption, PriorityLevel, TodoList } from '../types';
import { 
  loadTodoLists, 
  saveTodoLists, 
  loadFilter, 
  saveFilter, 
  loadActiveTodoListId, 
  saveActiveTodoListId,
  migrateOldTasks
} from '../lib/storage';
import { calculateTotalScore, updateTaskOrders, moveTask, changeTaskPriority } from '../lib/taskUtils';

// Initial state
const initialState: TasksState = {
  todoLists: [],
  activeTodoListId: null,
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
  // Helper function to get active todo list
  const getActiveTodoList = () => {
    if (!state.activeTodoListId || !state.todoLists.length) return null;
    return state.todoLists.find(list => list.id === state.activeTodoListId) || null;
  };
  
  // Helper function to update a todo list
  const updateTodoList = (todoListId: string, updatedTasks: Task[]) => {
    return state.todoLists.map(todoList => 
      todoList.id === todoListId
        ? { 
            ...todoList, 
            tasks: updatedTasks,
            updatedAt: new Date().toISOString()
          }
        : todoList
    );
  };
  
  switch (action.type) {
    case 'ADD_TASK': {
      const activeTodoList = getActiveTodoList();
      if (!activeTodoList) return state;
      
      // Find highest order in the priority level
      const tasksInPriority = activeTodoList.tasks.filter(
        task => task.priority === action.payload.priority
      );
      const highestOrder = tasksInPriority.length > 0
        ? Math.max(...tasksInPriority.map(task => task.order)) + 1
        : 0;
      
      // Add new task with correct order
      const newTask = { ...action.payload, order: highestOrder };
      const updatedTasks = [...activeTodoList.tasks, newTask];
      
      const updatedTodoLists = updateTodoList(activeTodoList.id, updatedTasks);
      
      return {
        ...state,
        todoLists: updatedTodoLists,
        totalScore: calculateTotalScore(updatedTasks),
      };
    }
    
    case 'UPDATE_TASK': {
      const activeTodoList = getActiveTodoList();
      if (!activeTodoList) return state;
      
      const updatedTasks = activeTodoList.tasks.map(task =>
        task.id === action.payload.id ? { ...action.payload } : task
      );
      
      const updatedTodoLists = updateTodoList(activeTodoList.id, updatedTasks);
      
      return {
        ...state,
        todoLists: updatedTodoLists,
        totalScore: calculateTotalScore(updatedTasks),
      };
    }
    
    case 'DELETE_TASK': {
      const activeTodoList = getActiveTodoList();
      if (!activeTodoList) return state;
      
      const filteredTasks = activeTodoList.tasks.filter(task => task.id !== action.payload);
      const taskToDelete = activeTodoList.tasks.find(task => task.id === action.payload);
      
      // If task exists, update orders for its priority level
      let updatedTasks = filteredTasks;
      if (taskToDelete) {
        updatedTasks = updateTaskOrders(filteredTasks, taskToDelete.priority);
      }
      
      const updatedTodoLists = updateTodoList(activeTodoList.id, updatedTasks);
      
      return {
        ...state,
        todoLists: updatedTodoLists,
        totalScore: calculateTotalScore(updatedTasks),
      };
    }
    
    case 'TOGGLE_COMPLETE': {
      const activeTodoList = getActiveTodoList();
      if (!activeTodoList) return state;
      
      const updatedTasks = activeTodoList.tasks.map(task =>
        task.id === action.payload
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: new Date().toISOString(),
            }
          : task
      );
      
      const updatedTodoLists = updateTodoList(activeTodoList.id, updatedTasks);
      
      return {
        ...state,
        todoLists: updatedTodoLists,
        totalScore: calculateTotalScore(updatedTasks),
      };
    }
    
    case 'CHANGE_PRIORITY': {
      const activeTodoList = getActiveTodoList();
      if (!activeTodoList) return state;
      
      const updatedTasks = changeTaskPriority(
        activeTodoList.tasks,
        action.payload.id,
        action.payload.priority
      );
      
      const updatedTodoLists = updateTodoList(activeTodoList.id, updatedTasks);
      
      return {
        ...state,
        todoLists: updatedTodoLists,
        totalScore: calculateTotalScore(updatedTasks),
      };
    }
    
    case 'MOVE_TASK': {
      const activeTodoList = getActiveTodoList();
      if (!activeTodoList) return state;
      
      const updatedTasks = moveTask(
        activeTodoList.tasks,
        action.payload.id,
        action.payload.direction
      );
      
      const updatedTodoLists = updateTodoList(activeTodoList.id, updatedTasks);
      
      return {
        ...state,
        todoLists: updatedTodoLists,
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
      const activeTodoList = getActiveTodoList();
      const totalScore = activeTodoList 
        ? calculateTotalScore(activeTodoList.tasks)
        : 0;
        
      return {
        ...state,
        totalScore,
      };
    }
    
    case 'ADD_TODO_LIST': {
      const now = new Date().toISOString();
      const newTodoList: TodoList = {
        id: `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: action.payload.name,
        tasks: [],
        createdAt: now,
        updatedAt: now
      };
      
      const updatedTodoLists = [...state.todoLists, newTodoList];
      
      // Set as active if it's the first list
      const newActiveTodoListId = state.activeTodoListId || newTodoList.id;
      
      return {
        ...state,
        todoLists: updatedTodoLists,
        activeTodoListId: newActiveTodoListId,
      };
    }
    
    case 'UPDATE_TODO_LIST': {
      const updatedTodoLists = state.todoLists.map(todoList =>
        todoList.id === action.payload.id
          ? {
              ...todoList,
              name: action.payload.name,
              updatedAt: new Date().toISOString(),
            }
          : todoList
      );
      
      return {
        ...state,
        todoLists: updatedTodoLists,
      };
    }
    
    case 'DELETE_TODO_LIST': {
      // Don't allow deleting the last todo list
      if (state.todoLists.length <= 1) {
        return state;
      }
      
      const filteredTodoLists = state.todoLists.filter(
        todoList => todoList.id !== action.payload
      );
      
      // If deleting the active todo list, set a new active one
      let newActiveTodoListId = state.activeTodoListId;
      if (state.activeTodoListId === action.payload) {
        newActiveTodoListId = filteredTodoLists[0]?.id || null;
      }
      
      return {
        ...state,
        todoLists: filteredTodoLists,
        activeTodoListId: newActiveTodoListId,
      };
    }
    
    case 'SET_ACTIVE_TODO_LIST': {
      saveActiveTodoListId(action.payload);
      
      // Find the active todo list to calculate score
      const activeTodoList = state.todoLists.find(list => list.id === action.payload);
      const totalScore = activeTodoList 
        ? calculateTotalScore(activeTodoList.tasks)
        : 0;
      
      return {
        ...state,
        activeTodoListId: action.payload,
        totalScore,
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
  
  // Load todo lists and preferences from local storage on initial render
  useEffect(() => {
    // Try to migrate old tasks first
    const migratedLists = migrateOldTasks();
    
    // Load todo lists
    let todoLists = loadTodoLists();
    if (migratedLists.length > 0) {
      todoLists = migratedLists;
      saveTodoLists(todoLists);
    }
    
    // Create a default list if none exists
    if (todoLists.length === 0) {
      const defaultList: TodoList = {
        id: `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: 'My Tasks',
        tasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      todoLists = [defaultList];
    }
    
    // Set todo lists
    todoLists.forEach(todoList => {
      dispatch({ 
        type: 'ADD_TODO_LIST', 
        payload: { name: todoList.name } 
      });
      
      // Add tasks for each todo list
      if (todoList.tasks.length > 0) {
        // Set active todo list before adding tasks
        dispatch({ 
          type: 'SET_ACTIVE_TODO_LIST', 
          payload: todoList.id 
        });
        
        // Add each task
        todoList.tasks.forEach(task => {
          dispatch({ type: 'ADD_TASK', payload: task });
        });
      }
    });
    
    // Load active todo list ID
    const savedActiveTodoListId = loadActiveTodoListId();
    if (savedActiveTodoListId && todoLists.some(list => list.id === savedActiveTodoListId)) {
      dispatch({ 
        type: 'SET_ACTIVE_TODO_LIST', 
        payload: savedActiveTodoListId 
      });
    } else if (todoLists.length > 0) {
      // Set first list as active if no active list is saved
      dispatch({ 
        type: 'SET_ACTIVE_TODO_LIST', 
        payload: todoLists[0].id 
      });
    }
    
    // Load other preferences
    dispatch({ type: 'SET_FILTER', payload: loadFilter() });
    dispatch({ type: 'CALCULATE_SCORE' });
  }, []);
  
  // Save todo lists to local storage whenever they change
  useEffect(() => {
    saveTodoLists(state.todoLists);
  }, [state.todoLists]);
  
  // Save active todo list ID whenever it changes
  useEffect(() => {
    saveActiveTodoListId(state.activeTodoListId);
  }, [state.activeTodoListId]);
  
  return (
    <TasksContext.Provider value={{ state, dispatch }}>
      {children}
    </TasksContext.Provider>
  );
};

/**
 * Hook to access tasks context
 * Input: None
 * Process: Get context
 * Output: Context state and dispatch
 */
export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}; 