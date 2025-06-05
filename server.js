
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const TASKS_FILE = path.join(__dirname, 'tasks.json');

app.use(bodyParser.json());

// Load tasks from tasks.json with error handling
let tasks = [];
try {
  tasks = require('./tasks.json');
} catch (err) {
  console.warn('Warning: tasks.json not found or invalid. Starting with an empty task list.');
}

// Root route - serves simple HTML UI
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
          <p>You can access the API at <strong>http://localhost:3000/api/tasks</strong></p>
        </div>
      </body>
    </html>
  `);
});

// GET /api/tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// POST /api/tasks
app.post('/api/tasks', (req, res) => {
  const newId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const newTask = {
    id: newId,
    title: req.body.title,
    completed: false
  };
  tasks.push(newTask);
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id
app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  if (task) {
    task.completed = true;
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    res.json(task);
  } else {
    res.status(404).send('Task not found');
  }
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== taskId);
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});
