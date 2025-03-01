/**
 * Debug Info component for the AI Todo List application
 * Displays debugging information about localStorage
 */

import React, { useState, useEffect } from 'react';
import { useTasksContext } from '../context/TasksContext';

/**
 * Debug Info component
 * Input: None
 * Process: Displays debugging information about localStorage
 * Output: Debug UI
 */
export const DebugInfo: React.FC = () => {
  const { state } = useTasksContext();
  const [localStorageInfo, setLocalStorageInfo] = useState<Record<string, string>>({});
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const info: Record<string, string> = {};
        
        // Check localStorage availability
        try {
          const testKey = '__test_storage__';
          localStorage.setItem(testKey, testKey);
          localStorage.removeItem(testKey);
          info['localStorage'] = 'Available';
        } catch (e) {
          info['localStorage'] = 'Not available: ' + String(e);
        }
        
        // Get localStorage items
        info['ai-todo-lists'] = localStorage.getItem('ai-todo-lists') || 'Not found';
        info['ai-active-todo-list-id'] = localStorage.getItem('ai-active-todo-list-id') || 'Not found';
        info['ai-todo-list-filter'] = localStorage.getItem('ai-todo-list-filter') || 'Not found';
        
        setLocalStorageInfo(info);
      } catch (error) {
        console.error('Error getting localStorage info:', error);
      }
    }
  }, [state]);

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4">
        <button 
          onClick={() => setShowDebug(true)}
          className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-md max-h-96 overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Debug Info</h3>
        <button 
          onClick={() => setShowDebug(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-2">
        <div>
          <h4 className="font-medium">localStorage Status:</h4>
          <p className="text-sm">{localStorageInfo['localStorage']}</p>
        </div>
        
        <div>
          <h4 className="font-medium">Todo Lists:</h4>
          <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto max-h-32">
            {localStorageInfo['ai-todo-lists'] === 'Not found' 
              ? 'Not found' 
              : JSON.stringify(JSON.parse(localStorageInfo['ai-todo-lists']), null, 2)}
          </pre>
        </div>
        
        <div>
          <h4 className="font-medium">Active Todo List ID:</h4>
          <p className="text-sm">{localStorageInfo['ai-active-todo-list-id']}</p>
        </div>
        
        <div>
          <h4 className="font-medium">Filter:</h4>
          <p className="text-sm">{localStorageInfo['ai-todo-list-filter']}</p>
        </div>
        
        <div>
          <h4 className="font-medium">State:</h4>
          <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto max-h-32">
            {JSON.stringify({
              todoListsCount: state.todoLists.length,
              activeTodoListId: state.activeTodoListId,
              filter: state.filter,
              loading: state.loading
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}; 