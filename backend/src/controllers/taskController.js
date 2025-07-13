const db = require('../config/firebase');

// ✅ GET all tasks
const getTasks = async (req, res) => {
  try {
    const snapshot = await db.collection("tasks").get();
    const tasks = [];

    snapshot.forEach(doc => {
      tasks.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// ✅ POST create task
const createTask = async (req, res) => {
  try {
    const { title, description, deadline, priority } = req.body;

    const taskData = {
      title,
      description,
      deadline,
      priority,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("tasks").add(taskData);

    res.status(201).json({ id: docRef.id, ...taskData });
  } catch (error) {
    console.error("❌ Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// ✅ PUT update task
const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const updatedData = req.body;

    const taskRef = db.collection("tasks").doc(taskId);
    const doc = await taskRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    await taskRef.update({
      ...updatedData,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("❌ Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

// ✅ DELETE task
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    await db.collection("tasks").doc(taskId).delete();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

// ✅ POST mark task as complete
const markTaskComplete = async (req, res) => {
  try {
    const taskId = req.params.id;

    const taskRef = db.collection("tasks").doc(taskId);
    const doc = await taskRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    await taskRef.update({
      status: "completed",
      completedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "Task marked as complete" });
  } catch (error) {
    console.error("❌ Error completing task:", error);
    res.status(500).json({ error: "Failed to mark task complete" });
  }
};

// ✅ Export all controllers
module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  markTaskComplete,
};
