/**
 * TaskList component for displaying and managing tasks in priority quadrants
 * Handles task grouping by priority levels
 * Implements drag and drop functionality for changing task priorities
 */

'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { TaskFilter, PriorityLevel, Task as TaskType } from '../types';
import { useTaskContext } from '../context/TaskContext';
import Task from './Task';

// Simple FilterTabs component
const FilterTabs: React.FC<{
  currentFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}> = ({ currentFilter, onFilterChange }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold dark:text-white">Tasks</h2>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-3 py-1 rounded-md ${
            currentFilter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onFilterChange('active')}
          className={`px-3 py-1 rounded-md ${
            currentFilter === 'active'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => onFilterChange('completed')}
          className={`px-3 py-1 rounded-md ${
            currentFilter === 'completed'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Completed
        </button>
      </div>
    </div>
  );
};

const TaskList: React.FC = () => {
  const { filteredTasks, filter, setFilter, updateTaskPriority } = useTaskContext();
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleFilterChange = (newFilter: TaskFilter) => {
    setFilter(newFilter);
  };

  const onDragStart = (result: any) => {
    setIsDragging(true);
    setDraggedTaskId(result.draggableId);
    
    // Add a dragging class to the body for global styling
    document.body.classList.add('is-dragging');
    
    // Hide the drag preview ghost image for mobile
    if (window.navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
      const dragEl = document.querySelector(`[data-task-id="${result.draggableId}"]`);
      if (dragEl) {
        const style = window.getComputedStyle(dragEl);
        if (style.transform) {
          (dragEl as HTMLElement).style.transform = style.transform;
        }
      }
    }
  };

  const onDragEnd = (result: DropResult) => {
    setIsDragging(false);
    setDraggedTaskId(null);
    
    // Remove the dragging class from the body
    document.body.classList.remove('is-dragging');
    
    console.log('Drag ended:', result);
    
    // If dropped outside a valid droppable area, do nothing
    if (!result.destination) {
      console.log('Dropped outside valid area');
      return;
    }

    const sourceId = result.source.droppableId;
    const destinationId = result.destination.droppableId;
    
    // If the task was dropped in the same section, do nothing
    if (sourceId === destinationId) {
      console.log('Dropped in same section - no priority change needed');
      return;
    }

    const taskId = result.draggableId;
    const newPriority = parseInt(destinationId) as PriorityLevel;
    
    console.log(`Moving task ${taskId} to priority ${newPriority}`);
    
    // Update task priority using the context function
    updateTaskPriority(taskId, newPriority);
  };

  // Group tasks by priority to display in separate sections
  const tasksByPriority = {
    [PriorityLevel.URGENT_IMPORTANT]: filteredTasks.filter(
      (task) => task.priority === PriorityLevel.URGENT_IMPORTANT
    ),
    [PriorityLevel.IMPORTANT_NOT_URGENT]: filteredTasks.filter(
      (task) => task.priority === PriorityLevel.IMPORTANT_NOT_URGENT
    ),
    [PriorityLevel.URGENT_NOT_IMPORTANT]: filteredTasks.filter(
      (task) => task.priority === PriorityLevel.URGENT_NOT_IMPORTANT
    ),
    [PriorityLevel.NEITHER_URGENT_NOR_IMPORTANT]: filteredTasks.filter(
      (task) => task.priority === PriorityLevel.NEITHER_URGENT_NOR_IMPORTANT
    ),
  };

  // Priority level labels
  const priorityLabels = {
    [PriorityLevel.URGENT_IMPORTANT]: 'Urgent & Important (10 points)',
    [PriorityLevel.IMPORTANT_NOT_URGENT]: 'Important but Not Urgent (7 points)',
    [PriorityLevel.URGENT_NOT_IMPORTANT]: 'Urgent but Not Important (5 points)',
    [PriorityLevel.NEITHER_URGENT_NOR_IMPORTANT]: 'Neither Urgent nor Important (2 points)',
  };
  
  // Priority level colors
  const priorityColors = {
    [PriorityLevel.URGENT_IMPORTANT]: 'bg-priority-1',
    [PriorityLevel.IMPORTANT_NOT_URGENT]: 'bg-priority-2',
    [PriorityLevel.URGENT_NOT_IMPORTANT]: 'bg-priority-3',
    [PriorityLevel.NEITHER_URGENT_NOR_IMPORTANT]: 'bg-priority-4',
  };

  // Interactive text based on whether a task is being dragged
  const dragInstructions = isDragging 
    ? "Release to drop the task in a new priority level" 
    : "Drag tasks to change their priority level";

  const getDraggedTask = (taskId: string | null) => {
    if (!taskId) return null;
    return filteredTasks.find(task => task.id === taskId);
  };

  const draggedTask = getDraggedTask(draggedTaskId);

  return (
    <div className="mt-6">
      <FilterTabs currentFilter={filter} onFilterChange={handleFilterChange} />
      
      {filteredTasks.length === 0 ? (
        <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
          No tasks to display. Try changing the filter or add a new task.
        </div>
      ) : (
        <>
          <div className={`text-center text-sm p-2 rounded-lg transition-colors ${
            isDragging 
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
              : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
          }`}>
            <p>{dragInstructions}</p>
            {isDragging && draggedTask && (
              <p className="mt-1 text-xs">
                Moving: {draggedTask.title}
              </p>
            )}
          </div>
          
          <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {Object.entries(tasksByPriority).map(([priority, tasks]) => {
                const priorityNum = parseInt(priority) as PriorityLevel;
                const isDraggedOverSection = isDragging && draggedTask && draggedTask.priority !== priorityNum;
                
                return (
                  <div key={priority} className={`transition-transform duration-200 ${
                    isDragging && draggedTask && draggedTask.priority === priorityNum
                      ? 'opacity-90'
                      : isDragging && isDraggedOverSection
                        ? 'transform scale-102'
                        : ''
                  }`}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                      <h2 className={`text-center mb-3 p-2 rounded-lg text-white ${priorityColors[priorityNum]}`}>
                        {priorityLabels[priorityNum]} ({tasks.length})
                      </h2>
                      
                      <Droppable droppableId={priority}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`space-y-2 min-h-[120px] p-3 border-2 border-dashed rounded-lg transition-all ${
                              snapshot.isDraggingOver 
                                ? `bg-${priorityColors[priorityNum].split('-')[1]}-50 dark:bg-gray-700 border-${priorityColors[priorityNum].split('-')[1]}-400`
                                : isDragging && isDraggedOverSection
                                  ? 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                                  : 'border-gray-200 dark:border-gray-700'
                            }`}
                            data-priority={priority}
                            style={{
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {tasks.map((task, index) => (
                              <Draggable 
                                key={task.id} 
                                draggableId={task.id} 
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`touch-manipulation transition-all duration-150 ${
                                      snapshot.isDragging 
                                        ? 'opacity-90 shadow-md' 
                                        : 'hover:shadow-sm'
                                    }`}
                                    data-task-id={task.id}
                                    style={{
                                      ...provided.draggableProps.style,
                                      marginBottom: snapshot.isDragging ? 0 : '8px'
                                    }}
                                  >
                                    <Task task={task} dragging={snapshot.isDragging} />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            
                            {tasks.length === 0 && !snapshot.isDraggingOver && (
                              <div className="text-center p-4 text-gray-400 dark:text-gray-500 text-sm italic">
                                No tasks in this priority level
                              </div>
                            )}
                            
                            {isDragging && !snapshot.isDraggingOver && (
                              <div className="text-center p-1 text-xs text-blue-400 dark:text-blue-400">
                                Drop here for {priorityLabels[priorityNum].split(' (')[0]}
                              </div>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </>
      )}
    </div>
  );
};

export default TaskList; 