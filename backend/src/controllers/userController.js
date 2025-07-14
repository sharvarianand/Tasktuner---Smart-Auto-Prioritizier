const {
  createUser,
  getUser,
  updateUserPreferences,
  updateUserRole,
} = require("../models/userModel");

// POST /api/user/register
const registerUser = async (req, res) => {
  const { uid, role, preferences } = req.body;
  try {
    await createUser(uid, role, preferences);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("❌ Error creating user:", error.message);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// GET /api/user/:uid
const getUserDetails = async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await getUser(uid);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// PUT /api/user/:uid/preferences
const updatePreferences = async (req, res) => {
  const { uid } = req.params;
  const { preferences } = req.body;
  try {
    await updateUserPreferences(uid, preferences);
    res.status(200).json({ message: "Preferences updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update preferences" });
  }
};

// PUT /api/user/:uid/role
const updateRole = async (req, res) => {
  const { uid } = req.params;
  const { role } = req.body;
  try {
    await updateUserRole(uid, role);
    res.status(200).json({ message: "Role updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update role" });
  }
};

module.exports = {
  registerUser,
  getUserDetails,
  updatePreferences,
  updateRole,
};
