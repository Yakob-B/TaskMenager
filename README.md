 # 🧠 Simple Task Manager API

This is a simple backend RESTful API built with **Node.js** and **Express.js** for the **Internship Entrance Challenge**.  
It handles basic task management functionality and stores data locally in a JSON file.

## 🎯 Role Applied For

**Backend Developer**

## 🚀 Features

- ✅ View all tasks → `GET /api/tasks`
- ✅ Add a new task → `POST /api/tasks`
- ✅ Mark task as completed → `PUT /api/tasks/:id`
- ✅ Delete a task → `DELETE /api/tasks/:id`
- ✅ Persistent task storage using a local `tasks.json` file
- ✅ Styled HTML home page at root `/` route

## 🛠 Technologies Used

- Node.js
- Express.js
- `fs` module for local JSON storage
- Vanilla HTML for the homepage

## 📁 Project Structure

TASKMENAGER/
├── server.js # Main server file
├── task.json # Data storage (auto-created if not exists)
├── package.json
└── .gitignore

## 📦 How to Run Locally

1. **Clone the repository:**

   git clone git remote add origin https://github.com/Yakob-B/TaskMenager.git
   cd TaskMenager
 2 Install dependencies:
  npm install
  Run the app:


node server.js
Access the app:

Visit http://localhost:3000 in your browser.

Use Postman or curl to test API endpoints under /api/tasks.

🔐 .gitignore

node_modules/
.env
tasks.json
