# AI Todo List Web App - Documentation

## Project Architecture

### Directory Structure

```
src/
├── app/             # Next.js app router
├── components/      # React components
├── context/         # React context providers
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
└── types/           # TypeScript type definitions
```

### Logic Map

1. **Data Flow**
   - User interactions trigger component events
   - Components call hook methods
   - Hooks dispatch actions to context
   - Context updates state
   - State changes trigger re-renders

2. **State Management**
   - TasksContext: Manages tasks state
   - ThemeContext: Manages dark/light mode

3. **Data Persistence**
   - Local storage for tasks and preferences

## Components

### Core Components

- **TaskInput**: Form for creating new tasks
- **Task**: Individual task display and actions
- **TaskList**: Renders list of tasks
- **TaskMatrix**: Organizes tasks by priority
- **FilterBar**: Controls for filtering tasks
- **Header**: App header with theme toggle

## Features

### Task Management

- Create, edit, delete tasks
- Mark tasks as complete/incomplete
- Set task priority using Eisenhower Matrix
- Add deadline date and time
- Reorder tasks within priority levels

### Priority System

- Four-level priority system based on Eisenhower Matrix
- Each priority level has a score value
- Completed tasks contribute to total score
- Compact priority display using short labels (U+I, I, U, Low) in task list
- Full priority labels in task creation/editing for better user understanding

## Design Decisions

1. **Priority Selection UI**
   - Different approaches for different contexts:
     - Task creation/editing: Full priority labels with short codes and points for clarity
     - Task display: Compact labels for space efficiency
   - Improved visual distinction between selected/unselected priorities
   - Vertical layout for priority selection in forms for better readability

2. **Deadline Implementation**
   - Added separate date and time inputs
   - Combined display format: "Date at Time"
   - Made both optional for flexibility

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

## Known Issues

- None currently identified 