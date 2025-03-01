# AI Todo List - Project Documentation

## Project Overview

The AI Todo List is a modern task management application that helps users organize tasks using the Eisenhower Matrix (prioritizing by urgency and importance). The app features:

- **Task prioritization** using four levels (Urgent & Important, Important but Not Urgent, etc.)
- **Multiple todo lists** for different areas of life (Work, Personal, Projects)
- **User authentication** with Firebase for cloud storage
- **Offline functionality** with localStorage for non-authenticated users
- **Dark/light mode** theme support
- **Score tracking** system based on task priority

## Architecture Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  User Interface │────▶│  Context Layer  │────▶│  Storage Layer  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ - TaskMatrix    │     │ - TasksContext  │     │ - localStorage  │
│ - TaskInput     │     │ - AuthContext   │     │ - Firebase      │
│ - TodoSelector  │     │ - ThemeContext  │     │   Firestore     │
│ - FilterBar     │     │ - Reducers      │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Core Components

### Context Layer
- **TasksContext**: Central state management for tasks, todo lists, and filters
- **AuthContext**: Handles user authentication (login, register, logout)
- **ThemeContext**: Manages dark/light mode preferences

### UI Components
- **TaskMatrix**: Displays tasks in the Eisenhower Matrix format
- **TaskInput**: Form for creating and editing tasks
- **TodoListSelector**: Interface for switching between multiple todo lists
- **FilterBar**: Controls for filtering tasks (All, Active, Completed)

### Storage Layer
- **localStorage**: Stores data for non-authenticated users
- **Firebase Firestore**: Stores data for authenticated users
- **Hybrid approach**: Uses both systems for redundancy and reliability

## Data Flow

1. User actions (add/edit/delete tasks) trigger dispatch calls to TasksContext
2. TasksReducer processes actions and updates application state
3. useEffect hooks in TasksProvider detect state changes and save to storage
4. Data is persisted to both localStorage and Firebase (when authenticated)
5. On page refresh or app restart, data is loaded from the appropriate storage

## Key Problems & Solutions

### 1. Task Loss on Page Refresh
**Problem**: Tasks would disappear when refreshing the page, especially after login.

**Solution**:
- Implemented comprehensive error handling for all storage operations
- Added checks for localStorage availability before operations
- Enhanced logging to track data flow and identify issues

### 2. Authentication/Storage Conflicts
**Problem**: Conflicts between localStorage and Firebase storage when users logged in/out.

**Solution**:
- Implemented a dual storage strategy that saves to both systems
- Created fallback mechanisms to use localStorage if Firebase fails
- Preserved localStorage data during login/logout transitions

### 3. Data Migration Issues
**Problem**: Data wasn't properly migrating between localStorage and Firebase.

**Solution**:
- Improved the migration process to maintain data in both places
- Added fallback to localStorage when Firebase has no data
- Enhanced error handling during migration

## Design Decisions

1. **Hybrid Storage Approach**: We use both localStorage and Firebase to ensure data is never lost, even if one system fails.

2. **Eisenhower Matrix**: Tasks are organized by urgency and importance, helping users prioritize effectively.

3. **Multiple Todo Lists**: Users can separate tasks into different contexts (work, personal, projects).

4. **Score System**: Each task has a point value based on priority, encouraging completion of important tasks.

## Future Improvements

- AI-powered task prioritization based on user patterns
- Time blocking integration for focused work
- Weekly/monthly review prompts
- Calendar system integration
