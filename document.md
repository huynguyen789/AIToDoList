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

   - **Task.tsx**: Represents the draggable item.
     - Includes visual indicators for when a task is being dragged.
     - Provides a drag handle icon for better usability.

3. **Data Flow:**

   ```
   User drags a task → onDragStart fires → Visual feedback begins → 
   User drops the task → onDragEnd fires → Priority is updated in TaskContext → 
   UI updates to reflect the new task arrangement
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
  updateTaskPriority(taskId, newPriority);
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
```

## Design Decisions

1. **Eisenhower Matrix for Priority Levels**: Implemented as four distinct quadrants that users can drag tasks between, providing a visual and intuitive way to categorize tasks.

2. **Context API for State Management**: Used React's Context API instead of prop drilling or a more complex state management library, which is appropriate for the application's size and complexity.

3. **Mobile-First Design**: The application is responsive and works well on both desktop and mobile devices, with special handling for touch interactions in the drag and drop functionality.

4. **Subtle Animations**: Used subtle animations to enhance the user experience without being distracting, particularly for the drag and drop functionality.

## Known Issues

None at present.

## Future Enhancements

- Persist task order within each priority level
- Add keyboard accessibility to the drag and drop functionality
- Allow reordering tasks within the same priority level
