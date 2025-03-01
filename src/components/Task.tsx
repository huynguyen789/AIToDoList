/**
 * Task component
 * Displays a single task with all its details and actions
 */

import React, { useState } from 'react';
import { Task as TaskType, PriorityLevel, PriorityLabels, PriorityScores, ShortPriorityLabels } from '../types';
import { useTaskOperations } from '../hooks/useTaskOperations';

interface TaskProps {
  task: TaskType;
}

/**
 * Task component
 * Input: Task object
 * Process: Render task with actions
 * Output: Task UI with interactive elements
 */
export const Task: React.FC<TaskProps> = ({ task }) => {
  const { toggleComplete, deleteTask, updateTask, moveTask, changePriority } = useTaskOperations();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [editedDeadline, setEditedDeadline] = useState(task.deadline || '');
  const [editedDeadlineTime, setEditedDeadlineTime] = useState(task.deadlineTime || '');
  const [editedPriority, setEditedPriority] = useState(task.priority);
  
  /**
   * Handle task completion toggle
   * Input: None
   * Process: Call toggle complete
   * Output: None
   */
  const handleToggleComplete = () => {
    toggleComplete(task.id);
  };
  
  /**
   * Handle task deletion
   * Input: None
   * Process: Call delete task
   * Output: None
   */
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };
  
  /**
   * Start editing task
   * Input: None
   * Process: Set editing state
   * Output: None
   */
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  /**
   * Save edited task
   * Input: None
   * Process: Update task with edited values
   * Output: None
   */
  const handleSave = () => {
    if (editedTitle.trim()) {
      updateTask({
        ...task,
        title: editedTitle,
        description: editedDescription,
        deadline: editedDeadline,
        deadlineTime: editedDeadlineTime,
        priority: editedPriority,
      });
      setIsEditing(false);
    }
  };
  
  /**
   * Cancel editing
   * Input: None
   * Process: Reset edited values
   * Output: None
   */
  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description || '');
    setEditedDeadline(task.deadline || '');
    setEditedDeadlineTime(task.deadlineTime || '');
    setEditedPriority(task.priority);
    setIsEditing(false);
  };
  
  /**
   * Format date for display
   * Input: ISO date string
   * Process: Format to readable date
   * Output: Formatted date string
   */
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  /**
   * Format deadline for display
   * Input: Date string and time string
   * Process: Combine and format for display
   * Output: Formatted deadline string
   */
  const formatDeadline = (dateString?: string, timeString?: string) => {
    if (!dateString) return '';
    
    let result = formatDate(dateString);
    
    if (timeString) {
      result += ` at ${timeString}`;
    }
    
    return result;
  };
  
  // Priority badge color classes
  const priorityColors = {
    [PriorityLevel.UrgentImportant]: 'bg-red-500',
    [PriorityLevel.ImportantNotUrgent]: 'bg-yellow-500',
    [PriorityLevel.UrgentNotImportant]: 'bg-blue-500',
    [PriorityLevel.NeitherUrgentNorImportant]: 'bg-green-500',
  };
  
  return (
    <div className={`border rounded-lg p-4 mb-4 shadow-sm transition-all ${
      task.completed ? 'opacity-70 bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'
    }`}>
      {isEditing ? (
        // Edit mode
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
              placeholder="Task title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
              placeholder="Task description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Deadline Date</label>
              <input
                type="date"
                value={editedDeadline}
                onChange={(e) => setEditedDeadline(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Deadline Time</label>
              <input
                type="time"
                value={editedDeadlineTime}
                onChange={(e) => setEditedDeadlineTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(PriorityLabels).map(([priority, label]) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setEditedPriority(Number(priority) as PriorityLevel)}
                  className={`py-2 px-3 rounded-md text-sm font-medium transition-colors flex justify-between items-center ${
                    Number(priority) === editedPriority
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <span>{label}</span>
                  <span className="text-xs font-normal ml-2">
                    ({ShortPriorityLabels[Number(priority) as PriorityLevel]} - {PriorityScores[Number(priority) as PriorityLevel]} points)
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // View mode
        <>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={handleToggleComplete}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              
              <div>
                <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                  {task.title}
                </h3>
                
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full text-white ${priorityColors[task.priority]}`}>
                    {ShortPriorityLabels[task.priority]}
                  </span>
                  
                  {task.deadline && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Due: {formatDeadline(task.deadline, task.deadlineTime)}
                    </span>
                  )}
                  
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full dark:bg-purple-900 dark:text-purple-200">
                    Score: {PriorityScores[task.priority]}
                  </span>
                </div>
                
                {task.description && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {task.description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex space-x-1">
              <button
                onClick={() => moveTask(task.id, 'up')}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Move Up"
              >
                ↑
              </button>
              <button
                onClick={() => moveTask(task.id, 'down')}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Move Down"
              >
                ↓
              </button>
              <button
                onClick={handleEdit}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Change Priority
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PriorityLabels).map(([priority, label]) => (
                <button
                  key={priority}
                  onClick={() => changePriority(task.id, Number(priority) as PriorityLevel)}
                  className={`text-xs px-2 py-1 rounded-md ${
                    Number(priority) === task.priority
                      ? `${priorityColors[Number(priority) as PriorityLevel]} text-white`
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                  }`}
                >
                  {ShortPriorityLabels[Number(priority) as PriorityLevel]}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 