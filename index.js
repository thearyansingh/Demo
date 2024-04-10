// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/tasksDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Define task schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean
});

const Task = mongoose.model('Task', taskSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/async', (req, res) => {
  setTimeout(() => {
    res.send('Delayed response after 2 seconds');
  }, 2000);
});

// CRUD routes for tasks
// GET all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new task
app.post('/tasks', async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});