import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useDemo } from '@/contexts/DemoContext';
import { taskApi } from '@/lib/api';

// Extend Window interface to include our custom property
declare global {
  interface Window {
    CURRENT_LEADERBOARD: typeof MOTIVATIONAL_LEADERBOARD;
  }
}

// Mock data for new users and demo mode
const MOCK_USER_DATA = {
  stats: {
    tasksCompleted: 0,
    currentStreak: 0,
    xpEarned: 0,
    goalsProgress: 0
  },
  recentTasks: [],
  upcomingEvents: [
    { time: "Next", title: "Start using TaskTuner", type: "productivity" },
    { time: "Soon", title: "Get your first roast", type: "motivation" },
    { time: "Today", title: "Build better habits", type: "personal" }
  ]
};

// Motivational leaderboard that always appears
export const MOTIVATIONAL_LEADERBOARD = [
  { id: 1, rank: 1, name: "Alex Chen", xp: 15420, streak: 42, tasksCompleted: 312, avatar: "AC", change: 'same' as const, badge: "Productivity Master 👑" },
  { id: 2, rank: 2, name: "Sarah Kim", xp: 14890, streak: 38, tasksCompleted: 298, avatar: "SK", change: 'up' as const, badge: "Streak Legend 🔥" },
  { id: 3, rank: 3, name: "Mike Johnson", xp: 13650, streak: 35, tasksCompleted: 275, avatar: "MJ", change: 'down' as const, badge: "Task Crusher 💪" },
  { id: 4, rank: 4, name: "Emma Davis", xp: 12980, streak: 31, tasksCompleted: 260, avatar: "ED", change: 'up' as const, badge: "Goal Getter 🎯" },
  { id: 5, rank: 5, name: "You", xp: 0, streak: 0, tasksCompleted: 0, avatar: "YU", change: 'up' as const, badge: "Rising Star ⭐" }, // Will be updated with real data
  { id: 6, rank: 6, name: "Ryan Wilson", xp: 11200, streak: 28, tasksCompleted: 224, avatar: "RW", change: 'same' as const, badge: "Consistency King 👑" },
  { id: 7, rank: 7, name: "Lisa Zhang", xp: 10850, streak: 25, tasksCompleted: 217, avatar: "LZ", change: 'up' as const, badge: "Focus Fighter 🥊" },
];

export const useUserData = () => {
  const { user, isLoaded } = useUser();
  const { isDemo } = useDemo();
  const [userData, setUserData] = useState(MOCK_USER_DATA);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    // In demo mode, always use mock data
    if (isDemo) {
      setUserData(MOCK_USER_DATA);
      setIsLoadingUserData(false);
      return;
    }

    // For real users, try to load their data
    loadUserData();
  }, [user, isLoaded, isDemo]);

  const loadUserData = async () => {
    if (!user) {
      setIsLoadingUserData(false);
      return;
    }

    try {
      // Load real user stats from the backend
      const userStats = await taskApi.getUserStats();
      
      // Update leaderboard with real user data
      const updatedLeaderboard = MOTIVATIONAL_LEADERBOARD.map(entry => 
        entry.name === "You" 
          ? { ...entry, xp: userStats.xpEarned, streak: userStats.currentStreak, tasksCompleted: userStats.tasksCompleted }
          : entry
      );

      // Get recent tasks for dashboard
      const allTasks = await taskApi.getTasks();
      const recentTasks = allTasks.slice(0, 3).map((task: any) => ({
        id: task.id,
        title: task.title,
        completed: task.completed,
        priority: task.priority,
        roast: task.roast || "Keep pushing forward!"
      }));

      setUserData({
        stats: userStats,
        recentTasks,
        upcomingEvents: [
          { time: "Today", title: "Complete daily tasks", type: "productivity" },
          { time: "This Week", title: "Reach weekly goals", type: "motivation" },
          { time: "Soon", title: "Level up your productivity", type: "personal" }
        ]
      });

      // Update global leaderboard
      window.CURRENT_LEADERBOARD = updatedLeaderboard;

    } catch (error) {
      console.error('Error loading user data:', error);
      // Fall back to mock data on error
      setUserData(MOCK_USER_DATA);
    }

    setIsLoadingUserData(false);
  };

  const updateUserTask = (taskId: string, updates: Partial<typeof userData.recentTasks[0]>) => {
    if (isDemo) {
      // In demo mode, show restriction
      return false;
    }

    setUserData(prev => ({
      ...prev,
      recentTasks: prev.recentTasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    }));

    // TODO: Sync with backend
    // syncTaskWithBackend(taskId, updates);
    return true;
  };

  const addUserTask = (task: Omit<typeof userData.recentTasks[0], 'id'>) => {
    if (isDemo) {
      return false;
    }

    const newTask = {
      ...task,
      id: `user-${user?.id}-${Date.now()}`
    };

    setUserData(prev => ({
      ...prev,
      recentTasks: [newTask, ...prev.recentTasks.slice(0, 4)] // Keep only 5 recent tasks
    }));

    // TODO: Sync with backend
    return true;
  };

  return {
    userData,
    isLoadingUserData,
    isNewUser: user ? Date.now() - new Date(user.createdAt!).getTime() < 24 * 60 * 60 * 1000 : false,
    updateUserTask,
    addUserTask,
    leaderboard: MOTIVATIONAL_LEADERBOARD.map(entry => 
      entry.name === "You" ? {
        ...entry,
        name: user?.firstName || user?.username || 'You',
        xp: userData.stats.xpEarned,
        streak: userData.stats.currentStreak,
        tasksCompleted: userData.stats.tasksCompleted,
        avatar: user?.firstName?.charAt(0).toUpperCase() + (user?.lastName?.charAt(0).toUpperCase() || user?.username?.charAt(1).toUpperCase() || 'U')
      } : entry
    ).sort((a, b) => b.xp - a.xp).map((entry, index) => ({ ...entry, rank: index + 1 }))
  };
};
