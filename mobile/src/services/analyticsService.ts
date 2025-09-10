import { apiService } from './api';
import { Analytics, LeaderboardEntry, ApiResponse } from '../types';
import { API_ENDPOINTS } from '../config/constants';

export class AnalyticsService {
  // Get dashboard analytics
  async getDashboardAnalytics(): Promise<Analytics> {
    try {
      const response = await apiService.get<ApiResponse<Analytics>>(
        API_ENDPOINTS.analytics.dashboard
      );
      return response.data!;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  }

  // Get streak analytics
  async getStreakAnalytics(): Promise<{
    currentStreak: number;
    longestStreak: number;
    streakHistory: { date: string; streak: number }[];
  }> {
    try {
      const response = await apiService.get<ApiResponse<{
        currentStreak: number;
        longestStreak: number;
        streakHistory: { date: string; streak: number }[];
      }>>(API_ENDPOINTS.analytics.streaks);
      return response.data!;
    } catch (error) {
      console.error('Error fetching streak analytics:', error);
      throw error;
    }
  }

  // Get completion analytics
  async getCompletionAnalytics(): Promise<{
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    dailyCompletion: { date: string; completed: number; total: number }[];
    weeklyCompletion: { week: string; completed: number; total: number }[];
    monthlyCompletion: { month: string; completed: number; total: number }[];
  }> {
    try {
      const response = await apiService.get<ApiResponse<{
        totalTasks: number;
        completedTasks: number;
        completionRate: number;
        dailyCompletion: { date: string; completed: number; total: number }[];
        weeklyCompletion: { week: string; completed: number; total: number }[];
        monthlyCompletion: { month: string; completed: number; total: number }[];
      }>>(API_ENDPOINTS.analytics.completion);
      return response.data!;
    } catch (error) {
      console.error('Error fetching completion analytics:', error);
      throw error;
    }
  }

  // Get leaderboard
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const response = await apiService.get<ApiResponse<LeaderboardEntry[]>>(
        '/leaderboard'
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }

  // Get user stats
  async getUserStats(): Promise<{
    totalPoints: number;
    tasksCompleted: number;
    currentStreak: number;
    longestStreak: number;
    averageCompletionTime: number;
    mostProductiveDay: string;
    mostProductiveTime: string;
    favoriteCategory: string;
  }> {
    try {
      const response = await apiService.get<ApiResponse<{
        totalPoints: number;
        tasksCompleted: number;
        currentStreak: number;
        longestStreak: number;
        averageCompletionTime: number;
        mostProductiveDay: string;
        mostProductiveTime: string;
        favoriteCategory: string;
      }>>(API_ENDPOINTS.user.stats);
      return response.data!;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  // Get productivity insights
  async getProductivityInsights(): Promise<{
    peakHours: { hour: number; productivity: number }[];
    weeklyPattern: { day: string; productivity: number }[];
    categoryPerformance: { category: string; performance: number }[];
    priorityPerformance: { priority: string; performance: number }[];
    recommendations: string[];
  }> {
    try {
      const response = await apiService.get<ApiResponse<{
        peakHours: { hour: number; productivity: number }[];
        weeklyPattern: { day: string; productivity: number }[];
        categoryPerformance: { category: string; performance: number }[];
        priorityPerformance: { priority: string; performance: number }[];
        recommendations: string[];
      }>>('/analytics/insights');
      return response.data!;
    } catch (error) {
      console.error('Error fetching productivity insights:', error);
      throw error;
    }
  }

  // Get time-based analytics
  async getTimeAnalytics(timeframe: 'day' | 'week' | 'month' | 'year'): Promise<{
    timeframe: string;
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    averageTimePerTask: number;
    mostProductiveDay: string;
    mostProductiveHour: number;
    categoryBreakdown: { category: string; count: number }[];
    priorityBreakdown: { priority: string; count: number }[];
  }> {
    try {
      const response = await apiService.get<ApiResponse<{
        timeframe: string;
        totalTasks: number;
        completedTasks: number;
        completionRate: number;
        averageTimePerTask: number;
        mostProductiveDay: string;
        mostProductiveHour: number;
        categoryBreakdown: { category: string; count: number }[];
        priorityBreakdown: { priority: string; count: number }[];
      }>>(`/analytics/time?timeframe=${timeframe}`);
      return response.data!;
    } catch (error) {
      console.error('Error fetching time analytics:', error);
      throw error;
    }
  }

  // Get goal analytics
  async getGoalAnalytics(): Promise<{
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    averageGoalCompletionTime: number;
    goalCategoryBreakdown: { category: string; count: number }[];
    goalProgressTrend: { date: string; progress: number }[];
  }> {
    try {
      const response = await apiService.get<ApiResponse<{
        totalGoals: number;
        activeGoals: number;
        completedGoals: number;
        averageGoalCompletionTime: number;
        goalCategoryBreakdown: { category: string; count: number }[];
        goalProgressTrend: { date: string; progress: number }[];
      }>>('/analytics/goals');
      return response.data!;
    } catch (error) {
      console.error('Error fetching goal analytics:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
