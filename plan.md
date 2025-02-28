# Priority Task Manager App - Developer Guide

## Project Overview

Create a web-based task management application with a priority-based system that helps users organize tasks based on importance and urgency. This MVP focuses on core functionality while providing a foundation for future enhancements.

## Core MVP Features

### 1. Basic Task Management

* Task creation with title, description, deadline
* Task editing and deletion
* Task completion tracking
* Task filtering (all, active, completed)

### 2. Four-Level Priority System

* Implementation of the Eisenhower Matrix framework:
  * Level 1: Urgent & Important (Score: 10 points)
  * Level 2: Important but Not Urgent (Score: 7 points)
  * Level 3: Urgent but Not Important (Score: 5 points)
  * Level 4: Neither Urgent nor Important (Score: 2 points)
* Visual distinction between priority levels
* Ability to change priority level via drag-and-drop
* Default sorting by priority level

To do:

* [X] Fix drag and drop bug
* [X] Make deadline optional when creating task

## Implementation Notes

### Drag and Drop Feature

- Successfully implemented drag and drop functionality to move tasks between priority levels
- Enhanced the visual experience with CSS transitions and animations for a more intuitive UX
- Added mobile-friendly touch interactions
- Tasks now clearly indicate they are draggable with a drag handle icon
- Fixed bug with drag and drop functionality to ensure tasks can be properly moved between priority levels

### Optional Deadline Feature

- Made the deadline field optional when creating or editing tasks
- Updated the UI to clearly indicate that deadline is optional
- Added proper handling for tasks without deadlines in the display
- Implemented smart sorting that prioritizes tasks with deadlines over those without
