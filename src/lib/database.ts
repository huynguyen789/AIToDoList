/**
 * Database service for the AI Todo List application
 * Handles Firestore operations for tasks and todo lists
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { TodoList } from '../types';

/**
 * Save todo lists to Firestore
 * Input: User ID and array of todo lists
 * Process: Store in Firestore under user's document
 * Output: Promise resolving when complete
 */
export const saveTodoListsToFirestore = async (userId: string, todoLists: TodoList[]): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, { todoLists }, { merge: true });
  } catch (error) {
    console.error('Error saving todo lists to Firestore:', error);
    throw error;
  }
};

/**
 * Load todo lists from Firestore
 * Input: User ID
 * Process: Retrieve from Firestore
 * Output: Promise resolving to array of todo lists or empty array if none found
 */
export const loadTodoListsFromFirestore = async (userId: string): Promise<TodoList[]> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists() && userDoc.data().todoLists) {
      return userDoc.data().todoLists as TodoList[];
    }
    
    return [];
  } catch (error) {
    console.error('Error loading todo lists from Firestore:', error);
    throw error;
  }
};

/**
 * Save active todo list ID to Firestore
 * Input: User ID and active todo list ID
 * Process: Store in Firestore under user's preferences
 * Output: Promise resolving when complete
 */
export const saveActiveTodoListIdToFirestore = async (userId: string, activeTodoListId: string | null): Promise<void> => {
  try {
    const userPrefsDocRef = doc(db, 'users', userId, 'preferences', 'app');
    await setDoc(userPrefsDocRef, { activeTodoListId }, { merge: true });
  } catch (error) {
    console.error('Error saving active todo list ID to Firestore:', error);
    throw error;
  }
};

/**
 * Load active todo list ID from Firestore
 * Input: User ID
 * Process: Retrieve from Firestore
 * Output: Promise resolving to active todo list ID or null if not found
 */
export const loadActiveTodoListIdFromFirestore = async (userId: string): Promise<string | null> => {
  try {
    const userPrefsDocRef = doc(db, 'users', userId, 'preferences', 'app');
    const userPrefsDoc = await getDoc(userPrefsDocRef);
    
    if (userPrefsDoc.exists() && userPrefsDoc.data().activeTodoListId) {
      return userPrefsDoc.data().activeTodoListId as string;
    }
    
    return null;
  } catch (error) {
    console.error('Error loading active todo list ID from Firestore:', error);
    throw error;
  }
};

/**
 * Save filter preference to Firestore
 * Input: User ID and filter value
 * Process: Store in Firestore under user's preferences
 * Output: Promise resolving when complete
 */
export const saveFilterToFirestore = async (userId: string, filter: string): Promise<void> => {
  try {
    const userPrefsDocRef = doc(db, 'users', userId, 'preferences', 'app');
    await setDoc(userPrefsDocRef, { filter }, { merge: true });
  } catch (error) {
    console.error('Error saving filter to Firestore:', error);
    throw error;
  }
};

/**
 * Load filter preference from Firestore
 * Input: User ID
 * Process: Retrieve from Firestore
 * Output: Promise resolving to filter value or default if not found
 */
export const loadFilterFromFirestore = async (userId: string, defaultFilter: string): Promise<string> => {
  try {
    const userPrefsDocRef = doc(db, 'users', userId, 'preferences', 'app');
    const userPrefsDoc = await getDoc(userPrefsDocRef);
    
    if (userPrefsDoc.exists() && userPrefsDoc.data().filter) {
      return userPrefsDoc.data().filter as string;
    }
    
    return defaultFilter;
  } catch (error) {
    console.error('Error loading filter from Firestore:', error);
    throw error;
  }
}; 