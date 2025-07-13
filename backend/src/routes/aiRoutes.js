// src/routes/aiRoutes.js
const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const { generateRoast } = require("../controllers/roastController");

router.post("/prioritize", aiController.prioritizeTasks);
router.post("/generate-tasks", aiController.generateTasksFromGoal);
router.post("/generate-roast", generateRoast);

module.exports = router;
