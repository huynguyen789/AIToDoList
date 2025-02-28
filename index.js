/**
 * Main application entry point
 * - Initializes Express server
 * - Sets up routes and middleware
 * - Starts the server
 */
const express = require('express');
const path = require('path');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Add this after your middleware setup
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/tasks', taskRoutes);

// Serve the main HTML file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * Start server
 * - Listens on specified port
 * - Logs confirmation message
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 