// src/routes/aiRoutes.js
const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const { generateRoast } = require("../controllers/roastController");
// const requireAuth = require('../middleware/authMiddleware'); // 🔐 Temporarily disabled for demo

// 🔐 Temporarily disable auth protection for demo mode
// router.use(requireAuth);

router.post("/prioritize", aiController.prioritizeTasks);
router.post("/generate-tasks", aiController.generateTasksFromGoal);
router.post("/generate-roast", generateRoast);

module.exports = router;
