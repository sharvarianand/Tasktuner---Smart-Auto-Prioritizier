const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// const requireAuth = require('../middleware/authMiddleware'); // 🔐 Temporarily disabled for demo

// 🔐 Temporarily disable auth protection for demo mode
// router.use(requireAuth);

router.post("/register", userController.registerUser);
router.get("/:uid", userController.getUserDetails);
router.put("/:uid/preferences", userController.updatePreferences);
router.put("/:uid/role", userController.updateRole);

module.exports = router;
