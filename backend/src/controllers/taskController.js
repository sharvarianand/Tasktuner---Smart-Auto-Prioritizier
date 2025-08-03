const db = require('../config/firebase');

// ✅ GET all tasks for a specific user
const getTasks = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers['x-user-id']; // Support both auth methods
    
    if (!userId) {
      return res.status(401).json({ error: "User authentication required" });
    }

    const snapshot = await db.collection("tasks")
      .where("userId", "==", userId)
      .get();
      
    const tasks = [];

    snapshot.forEach(doc => {
      const taskData = doc.data();
      tasks.push({ 
        id: doc.id, 
        ...taskData,
        // Convert Firestore timestamp to ISO string if needed
        createdAt: taskData.createdAt?.toDate?.() || taskData.createdAt,
        dueDate: taskData.dueDate?.toDate?.() || taskData.dueDate,
        lastCompletedAt: taskData.lastCompletedAt?.toDate?.() || taskData.lastCompletedAt
      });
    });

    // Sort by createdAt on the client side
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// ✅ POST create task
const createTask = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({ error: "User authentication required" });
    }

    const { 
      title, 
      description, 
      deadline, 
      dueDate,
      startTime,
      endTime,
      priority, 
      category, 
      isDaily,
      points,
      reminders,
      addToCalendar
    } = req.body;

    const taskData = {
      userId,
      title,
      description: description || '',
      deadline: deadline || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      startTime: startTime || null,
      endTime: endTime || null,
      priority: priority || 'Medium',
      category: category || 'Personal',
      completed: false,
      isDaily: isDaily || false,
      points: points || (priority === 'High' ? 50 : priority === 'Medium' ? 30 : 15),
      status: "pending",
      createdAt: new Date(),
      lastCompletedAt: null,
      completedDates: [], // Track completion dates for daily tasks
      reminders: reminders || { before: 15, after: 0 },
      calendarEventId: null
    };

    // Create Google Calendar event if requested and time fields are provided
    if (addToCalendar && startTime && endTime && dueDate) {
      try {
        const GoogleCalendarService = require('../services/googleCalendarService');
        const calendarService = new GoogleCalendarService();
        
        // Combine date and time for calendar event
        const startDateTime = new Date(`${dueDate}T${startTime}`);
        const endDateTime = new Date(`${dueDate}T${endTime}`);
        
        const eventData = {
          title: title,
          description: description || `Task: ${title}`,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString()
        };
        
        const calendarEvent = await calendarService.createEvent(eventData);
        taskData.calendarEventId = calendarEvent.id;
        
        console.log('✅ Task added to Google Calendar:', calendarEvent.id);
      } catch (calendarError) {
        console.error('⚠️ Failed to add to calendar, but task will still be created:', calendarError.message);
        // Don't fail the task creation if calendar integration fails
      }
    }

    const docRef = await db.collection("tasks").add(taskData);
    
    const createdTask = { id: docRef.id, ...taskData };

    // Schedule notifications if reminders are set
    if (startTime && (reminders.before > 0 || reminders.after > 0)) {
      try {
        await scheduleTaskNotifications(createdTask);
      } catch (notificationError) {
        console.error('⚠️ Failed to schedule notifications:', notificationError.message);
        // Don't fail task creation if notification scheduling fails
      }
    }

    res.status(201).json(createdTask);
  } catch (error) {
    console.error("❌ Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// ✅ PUT update task (including completion handling for daily tasks)
const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user?.id || req.headers['x-user-id'];
    const updatedData = req.body;

    if (!userId) {
      return res.status(401).json({ error: "User authentication required" });
    }

    const taskRef = db.collection("tasks").doc(taskId);
    const doc = await taskRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    const taskData = doc.data();
    
    // Verify task belongs to user
    if (taskData.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Handle completion of daily tasks
    if (updatedData.completed && taskData.isDaily) {
      const today = new Date().toDateString();
      const completedDates = taskData.completedDates || [];
      
      // Only add today's date if not already completed today
      if (!completedDates.includes(today)) {
        completedDates.push(today);
        updatedData.completedDates = completedDates;
        updatedData.lastCompletedAt = new Date();
        
        // For daily tasks, don't set completed to true permanently
        // Instead track the completion dates
        updatedData.completed = true; // This will be used for UI feedback
      }
    } else if (updatedData.completed === false && taskData.isDaily) {
      // If unchecking a daily task, remove today from completed dates
      const today = new Date().toDateString();
      const completedDates = taskData.completedDates || [];
      updatedData.completedDates = completedDates.filter(date => date !== today);
    }

    await taskRef.update({
      ...updatedData,
      updatedAt: new Date(),
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
    const userId = req.user?.id || req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ error: "User authentication required" });
    }

    const taskRef = db.collection("tasks").doc(taskId);
    const doc = await taskRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Verify task belongs to user
    const taskData = doc.data();
    if (taskData.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    await taskRef.delete();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

// ✅ GET user stats and task summary
const getUserStats = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({ error: "User authentication required" });
    }

    const snapshot = await db.collection("tasks")
      .where("userId", "==", userId)
      .get();
      
    let tasksCompleted = 0;
    let totalTasks = 0;
    let xpEarned = 0;
    const today = new Date().toDateString();
    
    snapshot.forEach(doc => {
      const task = doc.data();
      totalTasks++;
      
      if (task.isDaily) {
        // For daily tasks, check if completed today
        if (task.completedDates && task.completedDates.includes(today)) {
          tasksCompleted++;
          xpEarned += task.points || 0;
        }
      } else {
        // For regular tasks, check if completed
        if (task.completed) {
          tasksCompleted++;
          xpEarned += task.points || 0;
        }
      }
    });

    // Calculate streak (simplified - would need more complex logic for real streak calculation)
    const currentStreak = await calculateUserStreak(userId);
    const goalsProgress = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

    const stats = {
      tasksCompleted,
      totalTasks,
      currentStreak,
      xpEarned,
      goalsProgress
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("❌ Error fetching user stats:", error);
    res.status(500).json({ error: "Failed to fetch user stats" });
  }
};

// Helper function to calculate user streak
const calculateUserStreak = async (userId) => {
  // Simplified streak calculation to avoid complex queries
  try {
    const snapshot = await db.collection("tasks")
      .where("userId", "==", userId)
      .get();
    
    let recentCompletions = 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    snapshot.forEach(doc => {
      const task = doc.data();
      if (task.lastCompletedAt && new Date(task.lastCompletedAt.toDate?.() || task.lastCompletedAt) >= oneWeekAgo) {
        recentCompletions++;
      }
    });
    
    return Math.min(recentCompletions, 7); // Cap at 7 days
  } catch (error) {
    console.error("Error calculating streak:", error);
    return 0;
  }
};

// Helper function to schedule task notifications
const scheduleTaskNotifications = async (task) => {
  if (!task.startTime || !task.dueDate) return;

  try {
    const { createNotification } = require('./notificationController');
    
    // Combine date and time for notification scheduling
    const taskDateTime = new Date(`${task.dueDate.toISOString().split('T')[0]}T${task.startTime}`);
    
    // Schedule "before start" notification
    if (task.reminders.before > 0) {
      const beforeTime = new Date(taskDateTime.getTime() - (task.reminders.before * 60 * 1000));
      
      // Only schedule if the notification time is in the future
      if (beforeTime > new Date()) {
        const beforeMessage = `⏰ Reminder: "${task.title}" starts in ${task.reminders.before} minutes!`;
        
        // Use setTimeout for demo purposes (in production, use a proper job scheduler like node-cron)
        const beforeDelay = beforeTime.getTime() - Date.now();
        if (beforeDelay > 0 && beforeDelay < 24 * 60 * 60 * 1000) { // Only schedule within 24 hours
          setTimeout(async () => {
            try {
              const notificationData = {
                userId: task.userId,
                message: beforeMessage,
                type: "task_reminder"
              };
              
              // Create notification in database
              await db.collection('notifications').add({
                ...notificationData,
                read: false,
                createdAt: new Date().toISOString(),
              });
              
              console.log(`📢 Before-start notification scheduled for task: ${task.title}`);
            } catch (error) {
              console.error('Error creating before-start notification:', error);
            }
          }, beforeDelay);
        }
      }
    }
    
    // Schedule "after end" notification
    if (task.reminders.after > 0 && task.endTime) {
      const taskEndDateTime = new Date(`${task.dueDate.toISOString().split('T')[0]}T${task.endTime}`);
      const afterTime = new Date(taskEndDateTime.getTime() + (task.reminders.after * 60 * 1000));
      
      if (afterTime > new Date()) {
        const afterMessage = `✅ Follow-up: How did "${task.title}" go? Don't forget to mark it complete!`;
        
        const afterDelay = afterTime.getTime() - Date.now();
        if (afterDelay > 0 && afterDelay < 24 * 60 * 60 * 1000) {
          setTimeout(async () => {
            try {
              const notificationData = {
                userId: task.userId,
                message: afterMessage,
                type: "task_followup"
              };
              
              await db.collection('notifications').add({
                ...notificationData,
                read: false,
                createdAt: new Date().toISOString(),
              });
              
              console.log(`📢 After-end notification scheduled for task: ${task.title}`);
            } catch (error) {
              console.error('Error creating after-end notification:', error);
            }
          }, afterDelay);
        }
      }
    }
  } catch (error) {
    console.error('Error scheduling task notifications:', error);
    throw error;
  }
};

// ✅ Export all controllers
module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getUserStats,
};
