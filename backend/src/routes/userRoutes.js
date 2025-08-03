const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const requireAuth = require('../middleware/authMiddleware'); // 🔐 Clerk auth enabled

// 🔐 Protect all user routes
router.use(requireAuth);

router.post("/register", userController.registerUser);
router.get("/:uid", userController.getUserDetails);
router.put("/:uid/preferences", userController.updatePreferences);
router.put("/:uid/role", userController.updateRole);

module.exports = router;
