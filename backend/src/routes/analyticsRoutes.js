// src/routes/analyticsRoutes.js
const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

//  Analytics Endpoints
router.get("/completion-rate", analyticsController.getCompletionRate);
router.get("/weekly-performance", analyticsController.getWeeklyPerformance);
router.get("/common-priorities", analyticsController.getCommonPriorities);

//  Streak Logic Endpoints (within analytics)
router.get("/streak-tasks", analyticsController.getStreakTasks);
router.patch("/streak/:taskId", analyticsController.updateStreak);

module.exports = router;
