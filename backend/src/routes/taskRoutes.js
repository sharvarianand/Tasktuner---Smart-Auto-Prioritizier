const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
// const requireAuth = require('../middleware/authMiddleware'); // 🔐 Optional Clerk auth

// 🔐 Protect all task routes (enable when auth is ready)
// router.use(requireAuth);

// 📄 GET all tasks
router.get('/', taskController.getTasks);

// ➕ POST new task
router.post('/', taskController.createTask);

// 🔄 PUT update task by ID
router.put('/:id', taskController.updateTask);

// ❌ DELETE task by ID
router.delete('/:id', taskController.deleteTask);

// 📊 GET user stats
router.get('/stats', taskController.getUserStats);

module.exports = router;
