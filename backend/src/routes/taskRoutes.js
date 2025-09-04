const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
// const requireAuth = require('../middleware/authMiddleware'); // 🔐 Temporarily disabled for demo

// 🔐 Temporarily disable auth protection for demo mode
// router.use(requireAuth);

// 📄 GET all tasks
router.get('/', taskController.getTasks);

// 🧠 GET AI-prioritized tasks
router.get('/prioritized', taskController.getPrioritizedTasks);

// 🔄 POST force AI reprioritization
router.post('/reprioritize', taskController.reprioritizeTasks);

// ➕ POST new task
router.post('/', taskController.createTask);

// 🗑️ DELETE all tasks for user
router.delete('/clear-all', taskController.clearAllTasks);

// 🔄 PUT update task by ID
router.put('/:id', taskController.updateTask);

// ❌ DELETE task by ID
router.delete('/:id', taskController.deleteTask);

// 📊 GET user stats
router.get('/stats', taskController.getUserStats);

module.exports = router;
