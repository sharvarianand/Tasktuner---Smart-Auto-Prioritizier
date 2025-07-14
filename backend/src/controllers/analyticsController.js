// src/controllers/analyticsController.js
const db = require("../config/firebase");

// ✅ Task Completion Rate
const getCompletionRate = async (req, res) => {
  try {
    const snapshot = await db.collection("tasks").get();
    const total = snapshot.size;
    let completed = 0;

    snapshot.forEach((doc) => {
      if (doc.data().status === "completed") completed++;
    });

    const rate = total === 0 ? 0 : ((completed / total) * 100).toFixed(2);
    res.status(200).json({ total, completed, completionRate: rate });
  } catch (error) {
    console.error("Error getting completion rate:", error);
    res.status(500).json({ error: "Failed to calculate completion rate" });
  }
};

// ✅ Weekly Performance (tasks completed per day for the past 7 days)
const getWeeklyPerformance = async (req, res) => {
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    return d.toISOString().split("T")[0];
  });

  const performance = {};
  dates.forEach((date) => (performance[date] = 0));

  try {
    const snapshot = await db.collection("tasks").get();
    snapshot.forEach((doc) => {
      const data = doc.data();
      const completedDate = data.completedAt?.split("T")[0];
      if (completedDate && performance.hasOwnProperty(completedDate)) {
        performance[completedDate]++;
      }
    });
    res.status(200).json({ performance });
  } catch (error) {
    console.error("Error getting weekly performance:", error);
    res.status(500).json({ error: "Failed to get weekly performance" });
  }
};

// ✅ Common Priorities (count of tasks by priority)
const getCommonPriorities = async (req, res) => {
  try {
    const snapshot = await db.collection("tasks").get();
    const counts = { high: 0, medium: 0, low: 0 };

    snapshot.forEach((doc) => {
      const priority = doc.data().priority || "medium";
      counts[priority]++;
    });

    res.status(200).json({ priorities: counts });
  } catch (error) {
    console.error("Error getting common priorities:", error);
    res.status(500).json({ error: "Failed to get priorities" });
  }
};

// ✅ Streak Logic (in analytics)
const updateStreak = async (req, res) => {
  const { taskId } = req.params;
  const today = new Date().toISOString().split("T")[0];

  try {
    const taskRef = db.collection("tasks").doc(taskId);
    const doc = await taskRef.get();

    if (!doc.exists) return res.status(404).json({ error: "Task not found" });
    const task = doc.data();
    if (!task.isStreakTask) return res.status(400).json({ error: "Not a streak task" });

    const lastDate = task.lastCompleted?.split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    let newStreak = task.streakCount || 0;
    if (lastDate === today) {
      return res.status(200).json({ message: "Already completed today", streak: newStreak });
    }
    newStreak = lastDate === yesterday ? newStreak + 1 : 1;

    await taskRef.update({
      lastCompleted: today,
      streakCount: newStreak,
    });

    res.status(200).json({ message: "Streak updated", streak: newStreak });
  } catch (error) {
    console.error("Error updating streak:", error);
    res.status(500).json({ error: "Failed to update streak" });
  }
};

const getStreakTasks = async (req, res) => {
  try {
    const snapshot = await db.collection("tasks").where("isStreakTask", "==", true).get();
    const streakTasks = [];
    snapshot.forEach((doc) => streakTasks.push({ id: doc.id, ...doc.data() }));
    res.status(200).json({ streakTasks });
  } catch (error) {
    console.error("Error fetching streak tasks:", error);
    res.status(500).json({ error: "Failed to fetch streak tasks" });
  }
};

module.exports = {
  getCompletionRate,
  getWeeklyPerformance,
  getCommonPriorities,
  updateStreak,
  getStreakTasks,
};
