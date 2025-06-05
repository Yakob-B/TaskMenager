const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const TASKS_FILE = path.join(__dirname, 'task.json');

app.use(express.json());

// Load tasks from tasks.json with error handling
let tasks = [];
try {
  tasks = require('./task.json');
} catch (err) {
  console.warn('Warning: tasks.json not found or invalid. Starting with an empty task list.');
}

// Helper function to save tasks to file
function saveTasks() {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

// Root route - serves simple HTML UI
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Task Manager API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
            margin: 0;
          }
          .container {
            text-align: center;
            padding: 20px;
            border: 2px solid #007bff;
            border-radius: 10px;
            background-color: #fff;
          }
          h1 {
            color: #007bff;
          }
          p {
            font-size: 18px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Task Manager API is Running</h1>
          <p>You can access the API at <strong>http://localhost:${PORT}/api/tasks</strong></p>
        </div>
      </body>
    </html>
  `);
});

// GET /api/tasks - get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// POST /api/tasks - add new task
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required and should be a string' });
  }

  const newId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const newTask = {
    id: newId,
    title,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - replace entire task (title and completed)
app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, completed } = req.body;

  if (!title || typeof title !== 'string' || typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Title must be string and completed must be boolean' });
  }

  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks[taskIndex] = { id: taskId, title, completed };
  saveTasks();
  res.json(tasks[taskIndex]);
});

// PATCH /api/tasks/:id - update parts of the task (title or completed)
app.patch('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, completed } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string') {
      return res.status(400).json({ error: 'Title must be a string' });
    }
    task.title = title;
  }

  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Completed must be a boolean' });
    }
    task.completed = completed;
  }

  saveTasks();
  res.json(task);
});

// DELETE /api/tasks/:id - delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== taskId);

  if (tasks.length === initialLength) {
    return res.status(404).json({ error: 'Task not found' });
  }

  saveTasks();
  res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});
