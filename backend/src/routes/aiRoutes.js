// src/routes/aiRoutes.js
const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const { generateRoast } = require("../controllers/roastController");
// const requireAuth = require('../middleware/authMiddleware'); // 🔐 Temporarily disabled for demo

// 🔐 Temporarily disable auth protection for demo mode
// router.use(requireAuth);

// Core AI functionality
router.post("/prioritize", aiController.prioritizeTasks);
router.post("/generate-tasks", aiController.generateTasksFromGoal);
router.post("/generate-roast", generateRoast);

// Advanced AI features
router.post("/feedback", aiController.recordUserFeedback);
router.post("/suggestions", aiController.getContextualSuggestions);
router.post("/analyze-patterns", aiController.analyzeUserPatterns);

module.exports = router;
