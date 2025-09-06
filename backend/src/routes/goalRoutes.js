// src/routes/goalRoutes.js
const express = require("express");
const router = express.Router();
const {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  breakDownGoal,
  createTasksFromGoal,
  getGoalStats
} = require("../controllers/goalController");

// 🔐 Temporarily disable auth protection for demo mode
// router.use(requireAuth);

// Goals CRUD operations
router.get("/", getGoals);
router.post("/", createGoal);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);

// Goal AI operations
router.post("/:id/breakdown", breakDownGoal);
router.post("/:id/create-tasks", createTasksFromGoal);

// Goal statistics
router.get("/stats", getGoalStats);

module.exports = router;
