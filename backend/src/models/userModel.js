const db = require("../config/firebase");

const createUser = async (uid, role = "student", preferences = {}) => {
  const userRef = db.collection("users").doc(uid);
  await userRef.set({
    uid,
    role,
    preferences,
    createdAt: new Date().toISOString(),
  });
};

const getUser = async (uid) => {
  const doc = await db.collection("users").doc(uid).get();
  return doc.exists ? doc.data() : null;
};

const updateUserPreferences = async (uid, newPrefs) => {
  const userRef = db.collection("users").doc(uid);
  await userRef.update({
    preferences: newPrefs,
    updatedAt: new Date().toISOString(),
  });
};

const updateUserRole = async (uid, newRole) => {
  const userRef = db.collection("users").doc(uid);
  await userRef.update({ role: newRole });
};

module.exports = {
  createUser,
  getUser,
  updateUserPreferences,
  updateUserRole,
};
