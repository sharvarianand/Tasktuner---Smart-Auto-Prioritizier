import { useState } from "react";
import { taskApi } from "@/lib/api";
import { toast } from "sonner";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "High" | "Medium" | "Low";
  category: "Academic" | "Personal" | "Work";
  completed: boolean;
  cancelled?: boolean;
  startDate?: string;
  dueDate?: string;
  startTime?: string;
  endTime?: string;
  points?: number;
  aiInsights?: Record<string, any>;
}

export interface UserStats {
  tasksCompleted: number;
  totalTasks: number;
  currentStreak: number;
  xpEarned: number;
  goalsProgress: number;
}

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    tasksCompleted: 0,
    totalTasks: 0,
    currentStreak: 0,
    xpEarned: 0,
    goalsProgress: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadTasksAndStats = async () => {
    try {
      setIsLoading(true);
      const [tasksData, statsData] = await Promise.all([
        taskApi.getTasks(),
        taskApi.getUserStats(),
      ]);
      setTasks(tasksData);
      setUserStats(statsData);
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (taskData: Partial<Task>) => {
    try {
      const task = await taskApi.createTask(taskData as any);
      setTasks([task, ...tasks]);
      toast.success("Task added! Now stop making excuses 🔥");
      await loadTasksAndStats();
      return task;
    } catch (error) {
      toast.error("Failed to add task");
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const updated = await taskApi.updateTask(taskId, updates as any);
      setTasks(tasks.map((t) => (t.id === taskId ? updated : t)));
      toast.success("Task updated! 📝");
      return updated;
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await taskApi.deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
      toast.success("Task deleted! ✅");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updated = await updateTask(taskId, { completed: !task.completed });
    if (updated?.completed) {
      const points = task.points || 30;
      toast.success(`+${points} XP! You're on fire! 🎉`);
    }
  };

  return {
    tasks,
    userStats,
    isLoading,
    loadTasksAndStats,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
};



