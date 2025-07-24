const db = require('../config/firebase');

// 🔹 Create Notification
const createNotification = async (req, res) => {
  try {
    const { userId, message, type = "system" } = req.body;

    const newNotification = {
      userId,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('notifications').add(newNotification);

    res.status(201).json({ id: docRef.id, ...newNotification });
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
};

// 🔹 Get Notifications by User
const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const snapshot = await db.collection('notifications')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// 🔹 Mark Notification as Read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection('notifications').doc(id).update({ read: true });

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("❌ Error updating notification:", error);
    res.status(500).json({ error: "Failed to update notification" });
  }
};

// 🔹 Delete Notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection('notifications').doc(id).delete();

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

// 🔹 Clear All Read Notifications for User
const clearReadNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const snapshot = await db.collection('notifications')
      .where('userId', '==', userId)
      .where('read', '==', true)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    res.status(200).json({ message: `Cleared ${snapshot.docs.length} read notifications` });
  } catch (error) {
    console.error("❌ Error clearing read notifications:", error);
    res.status(500).json({ error: "Failed to clear read notifications" });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
  clearReadNotifications,
};
