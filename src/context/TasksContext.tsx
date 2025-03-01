/**
 * Tasks Context for the AI Todo List application
 * Provides global state management for tasks
 */

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Task, TasksState, TasksAction, FilterOption, PriorityLevel, TodoList } from '../types';
import { 
  loadTodoLists, 
  saveTodoLists, 
  loadFilter, 
  saveFilter, 
  loadActiveTodoListId, 
  saveActiveTodoListId,
  migrateOldTasks,
  migrateLocalDataToFirestore
} from '../lib/storage';
import { calculateTotalScore, updateTaskOrders, moveTask, changeTaskPriority } from '../lib/taskUtils';
import { useAuth } from './AuthContext';

// Initial state
const initialState: TasksState = {
  todoLists: [],
  activeTodoListId: null,
  filter: FilterOption.All,
  totalScore: 0,
  loading: true,
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
      // We'll handle saving in the useEffect hook
      
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
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
      
    case 'INITIALIZE_DATA':
      return {
        ...state,
        todoLists: action.payload.todoLists,
        activeTodoListId: action.payload.activeTodoListId,
        filter: action.payload.filter,
        totalScore: calculateTotalScore(
          action.payload.activeTodoListId 
            ? action.payload.todoLists.find(list => list.id === action.payload.activeTodoListId)?.tasks || []
            : []
        ),
        loading: false,
      };
    
    default:
      return state;
  }
};

/**
 * Tasks Provider component
 * Input: Children components
 * Process: Manages tasks state and provides context
 * Output: Context provider with tasks state and dispatch
 */
export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(tasksReducer, initialState);
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Load data from storage on mount and when user changes
  useEffect(() => {
    // Skip if not on client side
    if (!isClient) return;
    
    const loadData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        console.log('Loading data from storage, user:', user?.uid);
        
        // If user is logged in, try to migrate local data to Firestore
        if (user && user.uid) {
          console.log('User is logged in, migrating local data to Firestore if needed');
          await migrateLocalDataToFirestore(user.uid);
        } else {
          console.log('User is not logged in, using localStorage only');
        }
        
        // Load data from appropriate storage
        let todoLists = await loadTodoLists(user?.uid);
        console.log('Loaded todo lists:', todoLists);
        
        // Create a default todo list if none exists
        if (todoLists.length === 0) {
          console.log('No todo lists found, creating default list');
          const defaultList: TodoList = {
            id: 'default-' + Date.now(),
            name: 'My Tasks',
            tasks: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          todoLists = [defaultList];
          
          // Save the default list immediately
          await saveTodoLists(todoLists, user?.uid);
        }
        
        // Set active todo list ID to the first list if none is set
        let activeTodoListId = await loadActiveTodoListId(user?.uid);
        console.log('Loaded active todo list ID:', activeTodoListId);
        
        if (!activeTodoListId && todoLists.length > 0) {
          console.log('No active todo list ID found, setting to first list');
          activeTodoListId = todoLists[0].id;
          await saveActiveTodoListId(activeTodoListId, user?.uid);
        }
        
        const filter = await loadFilter(user?.uid);
        console.log('Loaded filter:', filter);
        
        dispatch({
          type: 'INITIALIZE_DATA',
          payload: {
            todoLists,
            activeTodoListId,
            filter,
          },
        });
      } catch (error) {
        console.error('Error loading data:', error);
        // Initialize with empty data on error to prevent undefined state
        dispatch({
          type: 'INITIALIZE_DATA',
          payload: {
            todoLists: [],
            activeTodoListId: null,
            filter: FilterOption.All,
          },
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    loadData();
  }, [user, isClient]);
  
  // Save data to storage when state changes
  useEffect(() => {
    // Skip if not on client side
    if (!isClient) return;
    
    // Skip saving during initial load
    if (state.loading) {
      console.log('Skipping save during loading');
      return;
    }
    
    const saveData = async () => {
      try {
        console.log('Saving todo lists to storage:', state.todoLists);
        await saveTodoLists(state.todoLists, user?.uid);
        
        console.log('Saving active todo list ID to storage:', state.activeTodoListId);
        await saveActiveTodoListId(state.activeTodoListId, user?.uid);
        
        console.log('Saving filter to storage:', state.filter);
        await saveFilter(state.filter, user?.uid);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    
    saveData();
  }, [state.todoLists, state.activeTodoListId, state.filter, user, isClient]);
  
  return (
    <TasksContext.Provider value={{ state, dispatch }}>
      {children}
    </TasksContext.Provider>
  );
};

// Custom hook to use the tasks context
export const useTasksContext = () => useContext(TasksContext); 