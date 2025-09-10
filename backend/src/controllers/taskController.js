const db = require('../config/firebase');
const aiController = require('./aiController');

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

// ✅ GET AI-prioritized tasks for a specific user
const getPrioritizedTasks = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({ error: "User authentication required" });
    }

    // Get all tasks first
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

    // Filter out completed tasks (unless they're daily tasks)
    const activeTasks = tasks.filter(task => {
      if (task.isDaily) {
        // For daily tasks, check if completed today
        const today = new Date().toDateString();
        const completedDates = task.completedDates || [];
        return !completedDates.includes(today);
      }
      return !task.completed;
    });

    if (activeTasks.length === 0) {
      return res.status(200).json({
        prioritizedTasks: [],
        insights: {
          summary: "All tasks completed! 🎉",
          recommendations: ["Take a well-deserved break", "Add new goals for tomorrow"],
          aiAnalysis: {
            totalTasks: 0,
            completedTasks: tasks.filter(t => t.completed).length,
            urgentTasks: 0,
            timeOptimizedTasks: 0
          }
        }
      });
    }

    // Get user context for better AI prioritization
    const userContext = {
      userId,
      currentTime: new Date(),
      completedTasksCount: tasks.filter(t => t.completed).length,
      averageCompletionTime: calculateAverageCompletionTime(tasks),
      productiveHours: getProductiveHours(tasks)
    };

    // Call AI prioritization
    const prioritizationRequest = {
      body: {
        tasks: activeTasks,
        userId,
        userContext
      }
    };

    // Mock response object for internal call
    let prioritizationResult = null;
    const mockRes = {
      status: () => mockRes,
      json: (data) => { prioritizationResult = data; }
    };

    await aiController.prioritizeTasks(prioritizationRequest, mockRes);

    if (!prioritizationResult) {
      throw new Error('AI prioritization failed');
    }

    // Enhance tasks with additional metadata
    const enhancedTasks = prioritizationResult.prioritizedTasks.map((task, index) => ({
      ...task,
      aiPriority: Math.max(1, 100 - (index * 3)), // Decreasing priority score
      aiRank: index + 1,
      aiInsights: {
        isUrgent: index < 3 && (task.dueDate && new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000)),
        isOverdue: task.dueDate && new Date(task.dueDate) < new Date(),
        isOptimizedForTime: checkTimeOptimization(task),
        requiresFocus: task.priority === 'High' || (task.description && task.description.length > 100),
        nlpEnhanced: true,
        priorityReason: generatePriorityReason(task, index),
        timeRecommendation: generateTimeRecommendation(task, index)
      },
      aiScore: {
        urgency: calculateUrgencyScore(task),
        importance: calculateImportanceScore(task),
        timefit: calculateTimeFitScore(task),
        effort: calculateEffortScore(task)
      }
    }));

    res.status(200).json({
      prioritizedTasks: enhancedTasks,
      insights: {
        summary: generateInsightsSummary(enhancedTasks),
        recommendations: generateRecommendations(enhancedTasks),
        aiAnalysis: {
          totalTasks: enhancedTasks.length,
          urgentTasks: enhancedTasks.filter(t => t.aiInsights.isUrgent).length,
          overdueTasks: enhancedTasks.filter(t => t.aiInsights.isOverdue).length,
          timeOptimizedTasks: enhancedTasks.filter(t => t.aiInsights.isOptimizedForTime).length,
          focusRecommended: enhancedTasks.filter(t => t.aiInsights.requiresFocus).length
        }
      }
    });

  } catch (error) {
    console.error("❌ Error in AI prioritization:", error);
    res.status(500).json({ error: "Failed to get prioritized tasks" });
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
      completedAt: null, // Timestamp when task was completed
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
        updatedData.completedAt = new Date(); // Set completion timestamp
        
        // For daily tasks, don't set completed to true permanently
        // Instead track the completion dates
        updatedData.completed = true; // This will be used for UI feedback
      }
    } else if (updatedData.completed === false && taskData.isDaily) {
      // If unchecking a daily task, remove today from completed dates
      const today = new Date().toDateString();
      const completedDates = taskData.completedDates || [];
      updatedData.completedDates = completedDates.filter(date => date !== today);
    } else if (updatedData.completed === true && !taskData.isDaily) {
      // For regular tasks, set completion timestamp
      updatedData.completedAt = new Date();
    } else if (updatedData.completed === false) {
      // If uncompleting a task, remove completion timestamp
      updatedData.completedAt = null;
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

// ✅ Force AI reprioritization endpoint
const reprioritizeTasks = async (req, res) => {
  try {
    console.log('🔄 Manual AI reprioritization requested');
    
    // Call getPrioritizedTasks with fresh AI analysis
    await getPrioritizedTasks(req, res);
    
  } catch (error) {
    console.error("❌ Error in manual reprioritization:", error);
    res.status(500).json({ error: "Failed to reprioritize tasks" });
  }
};

// ✅ Clear all tasks for user
const clearAllTasks = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Delete all tasks for the user
    const result = await db.collection('tasks').where('userId', '==', userId).get();
    
    const batch = db.batch();
    result.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    res.status(200).json({ 
      success: true, 
      message: 'All tasks cleared successfully',
      deletedCount: result.size
    });
    
  } catch (error) {
    console.error('Error clearing all tasks:', error);
    res.status(500).json({ error: 'Failed to clear all tasks' });
  }
};

// ✅ Export all controllers
module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getUserStats,
  getPrioritizedTasks,
  reprioritizeTasks,
  clearAllTasks,
};

// Helper functions for AI prioritization
const calculateAverageCompletionTime = (tasks) => {
  const completedTasks = tasks.filter(t => t.completed && t.completedAt && t.createdAt);
  if (completedTasks.length === 0) return 24; // Default 24 hours
  
  const totalTime = completedTasks.reduce((sum, task) => {
    const created = new Date(task.createdAt);
    const completed = new Date(task.completedAt);
    return sum + (completed - created) / (1000 * 60 * 60); // Convert to hours
  }, 0);
  
  return totalTime / completedTasks.length;
};

const getProductiveHours = (tasks) => {
  const completedTasks = tasks.filter(t => t.completed && t.completedAt);
  const hourCounts = {};
  
  completedTasks.forEach(task => {
    const hour = new Date(task.completedAt).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  
  // Return top 3 most productive hours
  return Object.entries(hourCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([hour]) => parseInt(hour));
};

const checkTimeOptimization = (task) => {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Check if task has optimal timing
  if (task.startTime) {
    const startHour = parseInt(task.startTime.split(':')[0]);
    const timeDiff = Math.abs(currentHour - startHour);
    return timeDiff <= 2; // Within 2 hours of optimal start time
  }
  
  // Default time optimization based on task type
  if (task.category === 'Work' && currentHour >= 9 && currentHour <= 17) return true;
  if (task.category === 'Personal' && (currentHour >= 18 || currentHour <= 8)) return true;
  
  return false;
};

const generatePriorityReason = (task, rank) => {
  if (rank === 0) {
    if (task.dueDate && new Date(task.dueDate) < new Date()) {
      return "Overdue task requiring immediate attention";
    }
    return "Highest priority based on urgency and impact analysis";
  }
  
  if (rank < 3) {
    return `High priority task ranked #${rank + 1} by AI analysis`;
  }
  
  if (task.priority === 'High') {
    return "Important task marked as high priority";
  }
  
  return `Optimally scheduled based on current time and task complexity`;
};

const generateTimeRecommendation = (task, rank) => {
  const now = new Date();
  const currentHour = now.getHours();
  
  if (rank === 0) {
    return "Start immediately for best results";
  }
  
  if (task.startTime) {
    return `Best started at ${task.startTime} as scheduled`;
  }
  
  if (task.category === 'Work' && currentHour < 17) {
    return "Ideal for current work hours";
  }
  
  if (task.priority === 'High') {
    return "Complete during peak energy hours";
  }
  
  return "Schedule when you have focused time available";
};

const calculateUrgencyScore = (task) => {
  if (!task.dueDate) return 30;
  
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60);
  
  if (hoursUntilDue < 0) return 100; // Overdue
  if (hoursUntilDue < 2) return 95;   // Due in 2 hours
  if (hoursUntilDue < 24) return 80;  // Due today
  if (hoursUntilDue < 72) return 60;  // Due in 3 days
  
  return 30; // Not urgent
};

const calculateImportanceScore = (task) => {
  const priorityMap = { 'High': 90, 'Medium': 60, 'Low': 30 };
  let score = priorityMap[task.priority] || 60;
  
  // Boost for work category
  if (task.category === 'Work') score += 10;
  
  // Boost for tasks with detailed descriptions
  if (task.description && task.description.length > 50) score += 5;
  
  return Math.min(score, 100);
};

const calculateTimeFitScore = (task) => {
  const now = new Date();
  const currentHour = now.getHours();
  
  if (task.startTime) {
    const startHour = parseInt(task.startTime.split(':')[0]);
    const timeDiff = Math.abs(currentHour - startHour);
    return Math.max(100 - (timeDiff * 10), 10);
  }
  
  // Default scoring based on category and time
  if (task.category === 'Work' && currentHour >= 9 && currentHour <= 17) return 85;
  if (task.category === 'Personal' && (currentHour >= 18 || currentHour <= 8)) return 75;
  
  return 50;
};

const calculateEffortScore = (task) => {
  const text = ((task.title || '') + ' ' + (task.description || '')).toLowerCase();
  
  // High effort keywords
  const complexKeywords = ['project', 'research', 'analyze', 'create', 'develop', 'design', 'plan'];
  // Low effort keywords  
  const simpleKeywords = ['call', 'email', 'buy', 'check', 'review', 'submit'];
  
  if (complexKeywords.some(word => text.includes(word))) return 80;
  if (simpleKeywords.some(word => text.includes(word))) return 30;
  
  // Based on description length
  const descLength = (task.description || '').length;
  if (descLength > 100) return 70;
  if (descLength > 50) return 50;
  
  return 40;
};

const generateInsightsSummary = (tasks) => {
  const urgentCount = tasks.filter(t => t.aiInsights.isUrgent).length;
  const overdueCount = tasks.filter(t => t.aiInsights.isOverdue).length;
  
  if (overdueCount > 0) {
    return `${overdueCount} overdue tasks need immediate attention`;
  }
  
  if (urgentCount > 0) {
    return `${urgentCount} urgent tasks require focus today`;
  }
  
  return `${tasks.length} tasks optimally prioritized for maximum productivity`;
};

const generateRecommendations = (tasks) => {
  const recommendations = [];
  const now = new Date();
  const currentHour = now.getHours();
  
  const overdueCount = tasks.filter(t => t.aiInsights.isOverdue).length;
  const urgentCount = tasks.filter(t => t.aiInsights.isUrgent).length;
  const focusCount = tasks.filter(t => t.aiInsights.requiresFocus).length;
  
  if (overdueCount > 0) {
    recommendations.push(`Start with overdue tasks immediately`);
  }
  
  if (urgentCount > 2) {
    recommendations.push(`Consider delegating or rescheduling lower priority tasks`);
  }
  
  if (currentHour >= 9 && currentHour <= 11 && focusCount > 0) {
    recommendations.push(`Morning peak hours - tackle complex tasks now`);
  }
  
  if (currentHour >= 15 && currentHour <= 17) {
    recommendations.push(`Afternoon energy dip - focus on routine tasks`);
  }
  
  if (tasks.length > 8) {
    recommendations.push(`Large task list - consider breaking down complex items`);
  }
  
  return recommendations.length > 0 ? recommendations : [`Tasks well prioritized - follow the AI order for best results`];
};
