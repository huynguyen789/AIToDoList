/**
 * Task component for displaying individual tasks
 * Handles rendering task information and actions like complete, edit, delete
 * Supports clicking on task to edit it
 * Designed to work with react-beautiful-dnd for drag and drop functionality
 */

'use client';

import React, { useState } from 'react';
import { formatDistance, isPast, isToday, format, startOfDay, endOfDay } from 'date-fns';
import { Task as TaskType, PriorityLevel } from '../types';
import { useTaskContext } from '../context/TaskContext';
import { getPriorityInfo, getPriorityClassName } from '../utils/taskUtils';
import TaskModal from './TaskModal';

interface TaskProps {
  task: TaskType;
  dragging?: boolean; // Optional prop to indicate if task is being dragged
}

const Task: React.FC<TaskProps> = ({ task, dragging = false }) => {
  const { toggleComplete, deleteTask, updateTaskPriority } = useTaskContext();
  const [showDetails, setShowDetails] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const priorityInfo = getPriorityInfo(task.priority);
  const priorityClass = getPriorityClassName(task.priority);
  
  // Create a date object from the ISO string
  // We need to maintain the exact date stored without timezone shifts
  const deadlineDate = new Date(task.deadline);
  
  // Get today's start and end for accurate comparison
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  
  // Check if deadline is in the past (before today)
  const isDeadlinePast = deadlineDate < todayStart;
  
  // Check if deadline is today (between start and end of today)
  const isDeadlineToday = deadlineDate >= todayStart && deadlineDate <= todayEnd;
  
  // Format the date for display
  const formattedDate = format(deadlineDate, 'MMM d, yyyy');
  
  // Get relative time description
  const formattedDeadline = formatDistance(
    deadlineDate,
    now,
    { addSuffix: true }
  );
  
  // Create a more descriptive deadline message
  let deadlineMessage;
  if (isDeadlinePast) {
    deadlineMessage = `Overdue: ${formattedDeadline} (${formattedDate})`;
  } else if (isDeadlineToday) {
    deadlineMessage = `Due today (${formattedDeadline})`;
  } else {
    deadlineMessage = `Due: ${formattedDeadline} (${formattedDate})`;
  }

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleComplete(task.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDetailsToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  return (
    <>
      <div 
        className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-l-4 transition-all ${
          task.completed ? 'opacity-60 border-gray-400' : `border-priority-${task.priority}`
        } ${dragging ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
      >
        {/* Wrap content in inner div that handles click events */}
        <div className="task-content cursor-pointer" onClick={handleEdit}>
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => {}}
                onClick={handleToggleComplete}
                className="mr-3 mt-1"
              />
              
              <div>
                <h3 className={`font-semibold ${
                  task.completed 
                    ? 'line-through text-gray-500 dark:text-gray-400' 
                    : 'dark:text-white'
                }`}>
                  {task.title}
                </h3>
                
                <div className={`text-sm mt-1 ${
                  isDeadlinePast && !task.completed 
                    ? 'text-red-500 dark:text-red-400 font-medium' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {deadlineMessage}
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              {task.description && (
                <button
                  onClick={handleDetailsToggle}
                  className="text-blue-500 dark:text-blue-400 text-sm mr-3"
                >
                  {showDetails ? 'Hide' : 'Details'}
                </button>
              )}
              
              <button
                onClick={handleDelete}
                className="text-red-500 dark:text-red-400 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
          
          {showDetails && task.description && (
            <div className="mt-3 pt-3 border-t dark:border-gray-700 text-gray-700 dark:text-gray-300">
              <p>{task.description}</p>
            </div>
          )}

          {/* Priority indicator for drag-and-drop context */}
          {dragging && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic text-center">
              Drag to a different priority level to change
            </div>
          )}
        </div>
      </div>
      
      <TaskModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        taskToEdit={task} 
      />
    </>
  );
};

export default Task; 