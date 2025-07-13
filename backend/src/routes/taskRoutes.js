const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const requireAuth = require('../middleware/authMiddleware');

// Protect all task routes
router.use(requireAuth);

// GET all tasks
router.get('/', taskController.getTasks);

// POST new task
router.post('/', taskController.createTask);

// PUT update task
router.put('/:id', taskController.updateTask);

// DELETE task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
