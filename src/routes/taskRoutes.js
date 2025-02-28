/**
 * Task API Routes
 * - Defines HTTP endpoints for task operations
 * - Connects routes to TaskService methods
 */
const express = require('express');
const router = express.Router();
const taskService = require('../services/TaskService');

/**
 * GET /api/tasks
 * Input: query params (filter, sort)
 * Output: JSON array of tasks
 * Logic: Return filtered and sorted tasks
 */
router.get('/', (req, res) => {
  const { filter, sort } = req.query;
  
  // If sort=priority, use priority sorting
  if (sort === 'priority') {
    const ascending = req.query.order === 'asc';
    return res.json(taskService.getTasksByPriority(filter, ascending));
  }
  
  // Default to filtered tasks without special sorting
  return res.json(taskService.getFilteredTasks(filter));
});

/**
 * GET /api/tasks/:id
 * Input: task ID
 * Output: JSON task object or error
 * Logic: Return task with specified ID
 */
router.get('/:id', (req, res) => {
  const task = taskService.getTaskById(req.params.id);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  return res.json(task);
});

/**
 * POST /api/tasks
 * Input: task data (title, description, deadline, priorityLevel)
 * Output: JSON created task
 * Logic: Create new task with provided data
 */
router.post('/', (req, res) => {
  const { title, description, deadline, priorityLevel } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const task = taskService.createTask(title, description, deadline, priorityLevel);
  return res.status(201).json(task);
});

/**
 * PUT /api/tasks/:id
 * Input: task ID, update data
 * Output: JSON updated task or error
 * Logic: Update task with provided data
 */
router.put('/:id', (req, res) => {
  const task = taskService.updateTask(req.params.id, req.body);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  return res.json(task);
});

/**
 * PATCH /api/tasks/:id/priority
 * Input: task ID, priorityLevel
 * Output: JSON updated task or error
 * Logic: Update task priority level
 */
router.patch('/:id/priority', (req, res) => {
  const { priorityLevel } = req.body;
  
  if (priorityLevel === undefined) {
    return res.status(400).json({ error: 'Priority level is required' });
  }
  
  const task = taskService.updateTaskPriority(req.params.id, priorityLevel);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  return res.json(task);
});

/**
 * PATCH /api/tasks/:id/toggle
 * Input: task ID
 * Output: JSON updated task or error
 * Logic: Toggle task completion status
 */
router.patch('/:id/toggle', (req, res) => {
  const task = taskService.toggleTaskCompletion(req.params.id);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  return res.json(task);
});

/**
 * DELETE /api/tasks/:id
 * Input: task ID
 * Output: Success message or error
 * Logic: Delete task with specified ID
 */
router.delete('/:id', (req, res) => {
  const deleted = taskService.deleteTask(req.params.id);
  
  if (!deleted) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  return res.json({ message: 'Task deleted successfully' });
});

module.exports = router; 