# Priority Task Manager

A web-based task management application with a priority-based system that helps users organize tasks based on importance and urgency using the Eisenhower Matrix framework.

## Features

- **Task Management**: Create, edit, delete, and mark tasks as complete
- **Priority System**: Four-level priority system based on the Eisenhower Matrix
  - Level 1: Urgent & Important (10 points)
  - Level 2: Important but Not Urgent (7 points)
  - Level 3: Urgent but Not Important (5 points)
  - Level 4: Neither Urgent nor Important (2 points)
- **Visual Distinction**: Each priority level has a distinct color for easy identification
- **Filtering**: Filter tasks by status (all, active, completed)
- **Responsive Design**: Works on desktop and mobile devices
- **Local Storage**: Task data is stored locally in the browser

## Tech Stack

- **Next.js**: React framework for building the application
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **react-beautiful-dnd**: Drag and drop functionality for task reordering
- **localStorage API**: For persisting task data between sessions

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. **Adding Tasks**: Click the "Add Task" button and fill out the form
2. **Managing Priority**: Use the priority dropdown on each task to change its priority level
3. **Filtering Tasks**: Use the filter buttons (All, Active, Completed) to filter tasks
4. **Completing Tasks**: Check the checkbox to mark a task as complete
5. **Viewing Details**: Click "Details" to view the full task description
6. **Deleting Tasks**: Click "Delete" to remove a task

## Future Enhancements

- Drag and drop between priority levels
- Task editing functionality
- Due date notifications
- User accounts and cloud synchronization
- Analytics and reporting on task completion 