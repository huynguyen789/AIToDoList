/**
 * TodoListSelector component
 * Allows users to create, select, and delete to-do lists
 */

import React, { useState } from 'react';
import { useTaskOperations } from '../hooks/useTaskOperations';

/**
 * TodoListSelector component
 * Input: None
 * Process: Display todo lists and handle selection, creation, and deletion
 * Output: Todo list selector UI
 */
export const TodoListSelector: React.FC = () => {
  const { 
    todoLists, 
    activeTodoListId, 
    setActiveTodoList, 
    addTodoList, 
    updateTodoList, 
    deleteTodoList 
  } = useTaskOperations();
  
  const [newListName, setNewListName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  
  /**
   * Handle creating a new todo list
   * Input: Form event
   * Process: Create new list and reset form
   * Output: None
   */
  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newListName.trim()) {
      addTodoList(newListName);
      setNewListName('');
      setIsCreating(false);
    }
  };
  
  /**
   * Handle updating a todo list name
   * Input: Form event
   * Process: Update list name and reset form
   * Output: None
   */
  const handleUpdateList = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingListId && editingName.trim()) {
      updateTodoList(editingListId, editingName);
      setEditingListId(null);
      setEditingName('');
    }
  };
  
  /**
   * Start editing a todo list
   * Input: List ID and current name
   * Process: Set editing state
   * Output: None
   */
  const startEditing = (id: string, name: string) => {
    setEditingListId(id);
    setEditingName(name);
  };
  
  /**
   * Cancel editing
   * Input: None
   * Process: Reset editing state
   * Output: None
   */
  const cancelEditing = () => {
    setEditingListId(null);
    setEditingName('');
  };
  
  /**
   * Handle deleting a todo list
   * Input: List ID
   * Process: Confirm and delete list
   * Output: None
   */
  const handleDeleteList = (id: string) => {
    // Don't allow deleting the last list
    if (todoLists.length <= 1) {
      alert('Cannot delete the last to-do list.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this to-do list? All tasks in this list will be permanently deleted.')) {
      deleteTodoList(id);
    }
  };
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          To-Do Lists
        </h2>
        
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            + New List
          </button>
        )}
      </div>
      
      {isCreating && (
        <form onSubmit={handleCreateList} className="mb-4">
          <div className="flex">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List name"
              className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="mt-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Cancel
          </button>
        </form>
      )}
      
      <div className="space-y-2">
        {todoLists.map((list) => (
          <div 
            key={list.id}
            className={`p-3 rounded-md transition-colors ${
              list.id === activeTodoListId
                ? 'bg-blue-100 dark:bg-blue-900'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
            }`}
          >
            {editingListId === list.id ? (
              <form onSubmit={handleUpdateList} className="flex">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2 py-1 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="ml-1 px-2 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setActiveTodoList(list.id)}
                  className={`flex-1 text-left font-medium ${
                    list.id === activeTodoListId
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {list.name}
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    ({list.tasks.length} tasks)
                  </span>
                </button>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => startEditing(list.id, list.name)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    title="Edit list name"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => handleDeleteList(list.id)}
                    className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete list"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 