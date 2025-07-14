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

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
};
