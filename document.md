# AI Todo List Web App

## Architecture

```
src/
├── app/        # Next.js app router
├── components/ # React components
├── context/    # Context providers
├── hooks/      # Custom hooks
├── lib/        # Utilities
└── types/      # TypeScript types
```

## Data Flow
- User interactions → Component events → Hooks → Context actions → State updates → Re-renders
- **State**: TasksContext (tasks), ThemeContext (dark/light mode)
- **Persistence**: Local storage + Firebase (when logged in)

## Key Components
- **TaskInput**: Create new tasks
- **Task**: Display individual task with actions
- **TaskList**: Render tasks list
- **TaskMatrix**: Organize by priority
- **FilterBar**: Task filtering
- **TodoListSelector**: Manage multiple lists
- **Header**: App header with theme toggle

## Core Features
1. **Task Management**
   - CRUD operations for tasks
   - Priority system (Eisenhower Matrix)
   - Deadlines with date/time
   - Task reordering

2. **Multiple Lists**
   - Create/switch/rename/delete lists
   - Each list has independent tasks

3. **Priority System**
   - Four levels based on Eisenhower Matrix
   - Point scoring for completed tasks
   - Compact display (U+I, I, U, Low)

4. **Firebase Integration**
   - Authentication (email/password)
   - Firestore data persistence
   - Local-to-cloud migration

## Design Decisions
- Different priority UIs for creation vs. display
- Separate date/time inputs for deadlines
- Intuitive layout with list selector at top

## Recent Changes

1. **Added Time Deadline Feature**

   - Extended Task interface with deadlineTime field
   - Updated TaskInput component with time input
   - Modified Task component to display and edit time
   - Added formatDeadline utility function
2. **Improved Priority Selection UI**

   - Created ShortPriorityLabels for compact display in task list
   - Used full priority labels in task creation/editing forms
   - Replaced dropdown with button grid
   - Added visual styling for better UX
   - Implemented in both creation and editing interfaces
3. **Added Multiple To-Do Lists Feature**

   - Created TodoList interface to represent separate to-do lists
   - Updated TasksState to manage multiple to-do lists
   - Created TodoListSelector component for creating, selecting, and deleting to-do lists
   - Modified TasksContext to handle operations on multiple to-do lists
   - Added migration utility to convert existing tasks to the new format
   - Updated UI to display the active to-do list and its tasks
4. **Reorganized UI Layout**

   - Moved TodoListSelector to the top for better visibility
   - Simplified the layout to make it more intuitive
   - Improved the flow from selecting a list to working with tasks
5. **Added Firebase Integration**

   - Implemented Firebase authentication (email/password)
   - Added login and registration UI
   - Created Firestore database integration for data persistence
   - Updated storage utilities to use Firestore when user is logged in
   - Added data migration from local storage to Firestore
   - Implemented loading states for better UX during data operations
6. **Enhanced UI with Tooltips and Visual Improvements**

   - Added tooltips to explain the Eisenhower Matrix, score system, and filters
   - Improved empty state display in the matrix with icons and more compact design
   - Fixed duplicate heading issue by reorganizing the layout
   - Made the Eisenhower Matrix use full screen width for better visibility
   - Improved visual consistency across components

## Known Issues

- None currently identified
