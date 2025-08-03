// src/routes/aiRoutes.js
const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const { generateRoast } = require("../controllers/roastController");
const requireAuth = require('../middleware/authMiddleware'); // 🔐 Clerk auth enabled

// 🔐 Protect all AI routes
router.use(requireAuth);

router.post("/prioritize", aiController.prioritizeTasks);
router.post("/generate-tasks", aiController.generateTasksFromGoal);
router.post("/generate-roast", generateRoast);

module.exports = router;
