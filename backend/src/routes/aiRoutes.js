// src/routes/aiRoutes.js
const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

router.post("/prioritize", aiController.prioritizeTasks);

module.exports = router;
