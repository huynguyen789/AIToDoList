/**
 * Task Service
 * - Manages task operations
 * - Handles business logic for tasks
 * - Supports filtering and sorting by priority
 */
const Task = require('../models/Task');

class TaskService {
  constructor() {
    this.tasks = [];
  }

  /**
   * Create a new task
   * Input: task details (title, description, deadline, priorityLevel)
   * Output: created task object
   * Logic: Create task and add to collection
   */
  createTask(title, description, deadline, priorityLevel) {
    const task = new Task(title, description, deadline, priorityLevel);
    this.tasks.push(task);
    return task;
  }

  /**
   * Get all tasks
   * Input: none
   * Output: array of all tasks
   * Logic: Return full task collection
   */
  getAllTasks() {
    return this.tasks;
  }

  /**
   * Get filtered tasks
   * Input: filter type (string: 'all', 'active', 'completed')
   * Output: filtered array of tasks
   * Logic: Filter tasks based on completion status
   */
  getFilteredTasks(filter = 'all') {
    switch (filter.toLowerCase()) {
      case 'active':
        return this.tasks.filter(task => !task.completed);
      case 'completed':
        return this.tasks.filter(task => task.completed);
      default:
        return this.tasks;
    }
  }

  /**
   * Get sorted tasks by priority
   * Input: filter (optional), ascending (boolean, default false)
   * Output: sorted array of tasks
   * Logic: Sort tasks by priority score (descending by default)
   */
  getTasksByPriority(filter = 'all', ascending = false) {
    const filteredTasks = this.getFilteredTasks(filter);
    return filteredTasks.sort((a, b) => {
      return ascending 
        ? a.priorityScore - b.priorityScore 
        : b.priorityScore - a.priorityScore;
    });
  }

  /**
   * Get task by ID
   * Input: task ID (string)
   * Output: task object or null
   * Logic: Find task with matching ID
   */
  getTaskById(id) {
    return this.tasks.find(task => task.id === id) || null;
  }

  /**
   * Update task
   * Input: task ID (string), updates object
   * Output: updated task or null
   * Logic: Find task and apply updates if found
   */
  updateTask(id, updates) {
    const task = this.getTaskById(id);
    if (!task) return null;
    
    return task.update(updates);
  }

  /**
   * Update task priority level
   * Input: task ID (string), new priority level (number)
   * Output: updated task or null
   * Logic: Find task and update priority level if found
   */
  updateTaskPriority(id, priorityLevel) {
    return this.updateTask(id, { priorityLevel });
  }

  /**
   * Toggle task completion status
   * Input: task ID (string)
   * Output: updated task or null
   * Logic: Find task and toggle completion status
   */
  toggleTaskCompletion(id) {
    const task = this.getTaskById(id);
    if (!task) return null;
    
    return task.completed ? task.uncomplete() : task.complete();
  }

  /**
   * Delete task
   * Input: task ID (string)
   * Output: boolean success status
   * Logic: Remove task with matching ID from collection
   */
  deleteTask(id) {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== id);
    return this.tasks.length !== initialLength;
  }
}

module.exports = new TaskService(); 