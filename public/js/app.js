/**
 * Priority Task Manager App
 * - Handles UI interactions
 * - Communicates with backend API
 * - Manages task display and organization
 */

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskMatrix = document.querySelector('.task-matrix');
const filterButtons = document.querySelectorAll('.filter-btn');
const taskLists = document.querySelectorAll('.task-list');

// State
let currentFilter = 'all';
let tasks = [];

/**
 * Initialize the application
 * Input: none
 * Output: none
 * Logic: Set up event listeners and load initial tasks
 */
function init() {
  // Load tasks from API
  fetchTasks();
  
  // Set up event listeners
  taskForm.addEventListener('submit', handleTaskSubmit);
  filterButtons.forEach(btn => {
    btn.addEventListener('click', handleFilterClick);
  });
  
  // Set up drag and drop
  setupDragAndDrop();
}

/**
 * Fetch tasks from API
 * Input: none
 * Output: none
 * Logic: Get tasks from API and update UI
 */
async function fetchTasks() {
  try {
    const response = await fetch(`/api/tasks?filter=${currentFilter}&sort=priority`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    
    tasks = await response.json();
    renderTasks();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    showNotification('Failed to load tasks', 'error');
  }
}

/**
 * Render tasks in the matrix
 * Input: none
 * Output: none
 * Logic: Clear and populate task lists based on priority levels
 */
function renderTasks() {
  // Clear all task lists
  taskLists.forEach(list => {
    list.innerHTML = '';
  });
  
  // Group tasks by priority level
  tasks.forEach(task => {
    const priorityLevel = task.priorityLevel;
    const taskList = document.querySelector(`.task-list[data-priority="${priorityLevel}"]`);
    
    if (taskList) {
      taskList.appendChild(createTaskElement(task));
    }
  });
}

/**
 * Create task DOM element
 * Input: task object
 * Output: DOM element
 * Logic: Create HTML for a task with all necessary data and event listeners
 */
function createTaskElement(task) {
  const taskElement = document.createElement('div');
  taskElement.className = `task-item${task.completed ? ' completed' : ''}`;
  taskElement.dataset.id = task.id;
  taskElement.draggable = true;
  
  // Format deadline if it exists
  const deadlineDisplay = task.deadline 
    ? new Date(task.deadline).toLocaleDateString() 
    : 'No deadline';
  
  taskElement.innerHTML = `
    <h3>${task.title}</h3>
    <p>${task.description || 'No description'}</p>
    <p class="deadline">Due: ${deadlineDisplay}</p>
    <div class="task-actions">
      <button class="complete-btn">${task.completed ? 'Uncomplete' : 'Complete'}</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;
  
  // Add event listeners
  taskElement.querySelector('.complete-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleTaskCompletion(task.id);
  });
  
  taskElement.querySelector('.delete-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    deleteTask(task.id);
  });
  
  // Drag events
  taskElement.addEventListener('dragstart', handleDragStart);
  
  return taskElement;
}

/**
 * Handle task form submission
 * Input: submit event
 * Output: none
 * Logic: Create new task with form data
 */
async function handleTaskSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(taskForm);
  const taskData = {
    title: formData.get('title'),
    description: formData.get('description'),
    deadline: formData.get('deadline'),
    priorityLevel: parseInt(formData.get('priorityLevel'))
  };
  
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });
    
    if (!response.ok) throw new Error('Failed to create task');
    
    const newTask = await response.json();
    tasks.push(newTask);
    renderTasks();
    taskForm.reset();
    showNotification('Task created successfully', 'success');
  } catch (error) {
    console.error('Error creating task:', error);
    showNotification('Failed to create task', 'error');
  }
}

/**
 * Toggle task completion status
 * Input: task ID
 * Output: none
 * Logic: Update task completion status via API
 */
async function toggleTaskCompletion(taskId) {
  try {
    const response = await fetch(`/api/tasks/${taskId}/toggle`, {
      method: 'PATCH'
    });
    
    if (!response.ok) throw new Error('Failed to update task');
    
    const updatedTask = await response.json();
    
    // Update task in local array
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index] = updatedTask;
      renderTasks();
    }
    
    showNotification(
      `Task marked as ${updatedTask.completed ? 'completed' : 'active'}`, 
      'success'
    );
  } catch (error) {
    console.error('Error updating task:', error);
    showNotification('Failed to update task', 'error');
  }
}

/**
 * Delete a task
 * Input: task ID
 * Output: none
 * Logic: Remove task via API
 */
async function deleteTask(taskId) {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Failed to delete task');
    
    // Remove task from local array
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks();
    
    showNotification('Task deleted successfully', 'success');
  } catch (error) {
    console.error('Error deleting task:', error);
    showNotification('Failed to delete task', 'error');
  }
}

/**
 * Handle filter button click
 * Input: click event
 * Output: none
 * Logic: Update filter and refresh tasks
 */
function handleFilterClick(e) {
  // Update active button
  filterButtons.forEach(btn => {
    btn.classList.remove('active');
  });
  e.target.classList.add('active');
  
  // Update filter and fetch tasks
  currentFilter = e.target.dataset.filter;
  fetchTasks();
}

/**
 * Set up drag and drop functionality
 * Input: none
 * Output: none
 * Logic: Add event listeners for drag and drop operations
 */
function setupDragAndDrop() {
  // Add drag event listeners to task lists
  taskLists.forEach(list => {
    list.addEventListener('dragover', handleDragOver);
    list.addEventListener('dragleave', handleDragLeave);
    list.addEventListener('drop', handleDrop);
  });
}

/**
 * Handle drag start event
 * Input: drag event
 * Output: none
 * Logic: Set drag data and add dragging class
 */
function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.id);
  e.target.classList.add('dragging');
}

/**
 * Handle drag over event
 * Input: drag event
 * Output: none
 * Logic: Allow drop and add visual feedback
 */
function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

/**
 * Handle drag leave event
 * Input: drag event
 * Output: none
 * Logic: Remove visual feedback
 */
function handleDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

/**
 * Handle drop event
 * Input: drop event
 * Output: none
 * Logic: Update task priority based on drop target
 */
async function handleDrop(e) {
  e.preventDefault();
  const taskId = e.dataTransfer.getData('text/plain');
  const newPriorityLevel = parseInt(e.currentTarget.dataset.priority);
  
  // Remove visual feedback
  document.querySelectorAll('.task-list').forEach(list => {
    list.classList.remove('drag-over');
  });
  document.querySelector(`.task-item[data-id="${taskId}"]`).classList.remove('dragging');
  
  // Update task priority
  try {
    const response = await fetch(`/api/tasks/${taskId}/priority`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ priorityLevel: newPriorityLevel })
    });
    
    if (!response.ok) throw new Error('Failed to update task priority');
    
    const updatedTask = await response.json();
    
    // Update task in local array
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index] = updatedTask;
      renderTasks();
    }
    
    showNotification('Task priority updated', 'success');
  } catch (error) {
    console.error('Error updating task priority:', error);
    showNotification('Failed to update task priority', 'error');
  }
}

/**
 * Show notification message
 * Input: message text, type (success/error)
 * Output: none
 * Logic: Create, show, and auto-remove notification element
 */
function showNotification(message, type) {
  // Create notification element if it doesn't exist
  let notification = document.querySelector('.notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);
  }
  
  // Set message and type
  notification.textContent = message;
  notification.className = `notification ${type}`;
  
  // Show notification
  notification.style.display = 'block';
  
  // Hide after 3 seconds
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 