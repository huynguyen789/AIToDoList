# Priority Task Manager - Project Documentation

## Project Architecture

### Logic Map

```
App
├── TaskContext (State Management)
│   ├── Tasks data
│   ├── Task filtering
│   └── Task CRUD operations
├── Components
│   ├── TaskList (Container for tasks grouped by priority)
│   │   ├── FilterTabs (Filter tasks by completion status)
│   │   └── Task (Individual task item)
│   ├── TaskForm (For creating/editing tasks)
│   ├── TaskModal (Dialog for editing tasks)
│   └── DarkModeToggle
├── Utils
│   └── taskUtils (Helper functions for task operations)
└── Types
    ├── Task interface
    ├── PriorityLevel enum
    └── TaskFilter type
```

## Key Features

### Drag and Drop Task Priority Management

The Priority Task Manager implements drag and drop functionality to allow users to easily change a task's priority level by dragging it from one priority section to another.

#### Implementation Details

1. **Libraries Used:**
   - React Beautiful DnD (`react-beautiful-dnd`) - A beautiful and accessible drag and drop library for lists.

2. **Key Components:**

   - **TaskList.tsx**: Acts as the container for all drag and drop functionality.
     - Uses `DragDropContext` to establish the drag-and-drop environment.
     - Creates `Droppable` areas for each priority level.
     - Maps tasks to `Draggable` components.
     - Handles drag start and end events.
     - Detects touch devices for optimized mobile experience.
     - Provides visual feedback during dragging.
     - Scrolls to the destination container after dropping.

   - **Task.tsx**: Represents the draggable item.
     - Includes visual indicators for when a task is being dragged.
     - Provides a drag handle icon for better usability.
     - Enhances accessibility with screen reader support.
     - Improves visual feedback during dragging.

3. **Data Flow:**

   ```
   User drags a task → onDragStart fires → Visual feedback begins → 
   User drops the task → onDragEnd fires → Priority is updated in TaskContext → 
   UI updates to reflect the new task arrangement → Container scrolls into view
   ```

4. **Key Functions:**

   - `onDragStart`: Prepares the UI for dragging by setting state and adding CSS classes
   - `onDragEnd`: Processes the drop event and updates task priority if needed
   - `updateTaskPriority`: Context function that updates a task's priority in state

5. **UX Considerations:**

   - Visual feedback during dragging (subtle highlighting of the task being dragged)
   - Dropzone highlighting to indicate valid drop targets
   - Clear instructions in the UI about the drag and drop functionality
   - Cursor changes to indicate dragging state
   - Touch-friendly implementation for mobile devices
   - Improved drag handles with hover effects
   - Automatic scrolling to destination after dropping
   - Optimized for both mouse and touch interactions

#### Code Example

The core logic for handling the drag and drop operations:

```typescript
const onDragEnd = (result: DropResult) => {
  // Clean up drag state
  setIsDragging(false);
  setDraggedTaskId(null);
  document.body.classList.remove('is-dragging');
  
  // If dropped outside a valid droppable area, do nothing
  if (!result.destination) {
    return;
  }

  const sourceId = result.source.droppableId;
  const destinationId = result.destination.droppableId;
  
  // If the task was dropped in the same section, do nothing
  if (sourceId === destinationId) {
    return;
  }

  // Update the task's priority
  const taskId = result.draggableId;
  const newPriority = parseInt(destinationId) as PriorityLevel;
  
  try {
    // Update task priority using the context function
    updateTaskPriority(taskId, newPriority);
    
    // Add a small delay to allow the UI to update
    setTimeout(() => {
      // Find the destination container and scroll it into view if needed
      const destinationContainer = document.querySelector(`[data-priority="${destinationId}"]`);
      if (destinationContainer) {
        destinationContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  } catch (error) {
    console.error('Error updating task priority:', error);
  }
};
```

#### CSS Styling

The drag and drop experience is enhanced with subtle CSS transitions:

```css
/* Cursor changes during dragging */
.is-dragging {
  cursor: grabbing !important;
}

/* Subtle animation for dropzones */
@keyframes subtle-pulse-border {
  0% { border-color: rgba(59, 130, 246, 0.2); }
  50% { border-color: rgba(59, 130, 246, 0.4); }
  100% { border-color: rgba(59, 130, 246, 0.2); }
}

/* Touch device optimizations */
@media (pointer: coarse) {
  [data-rbd-draggable-id] {
    touch-action: none;
  }
  
  /* Make drag handles more prominent on touch devices */
  .drag-handle {
    opacity: 0.7 !important;
  }
}
```

### Optional Task Deadlines

Tasks can be created with or without deadlines, providing flexibility for users to manage tasks that don't have specific time constraints.

#### Implementation Details

1. **Data Structure:**
   - The `deadline` field in the Task interface is marked as optional with the `?` operator
   - When no deadline is provided, the field is simply omitted from the task object

2. **User Interface:**
   - The deadline field in the task creation form is marked as optional
   - A helper text indicates whether a deadline will be set
   - The Task component displays "No deadline set" for tasks without deadlines

3. **Task Sorting:**
   - Tasks with deadlines are sorted before tasks without deadlines
   - Within tasks that have no deadline, sorting falls back to creation date

#### Code Example

Handling optional deadlines in the sort function:

```typescript
export const sortTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    // First sort by priority
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    
    // Then sort by deadline (tasks with deadlines come first)
    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    } else if (a.deadline) {
      return -1; // Task A has a deadline, B doesn't
    } else if (b.deadline) {
      return 1;  // Task B has a deadline, A doesn't
    } else {
      // Neither has a deadline - sort by creation date
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });
};
```

## Design Decisions

1. **Eisenhower Matrix for Priority Levels**: Implemented as four distinct quadrants that users can drag tasks between, providing a visual and intuitive way to categorize tasks.

2. **Context API for State Management**: Used React's Context API instead of prop drilling or a more complex state management library, which is appropriate for the application's size and complexity.

3. **Mobile-First Design**: The application is responsive and works well on both desktop and mobile devices, with special handling for touch interactions in the drag and drop functionality.

4. **Subtle Animations**: Used subtle animations to enhance the user experience without being distracting, particularly for the drag and drop functionality.

5. **Optional Deadlines**: Made deadlines optional to support different types of tasks, while maintaining good sorting behavior through priority first, then deadline presence, then creation date.

6. **Improved Drag and Drop Experience**: Enhanced the drag and drop functionality with better visual feedback, touch device detection, and automatic scrolling to improve usability across all devices.

## Known Issues

None at present.

## Future Enhancements

- Persist task order within each priority level
- Add keyboard accessibility to the drag and drop functionality
- Allow reordering tasks within the same priority level
- Add recurring task support
