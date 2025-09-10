import { apiService } from './api';
import { Goal, CreateGoalForm, ApiResponse } from '../types';
import { API_ENDPOINTS } from '../config/constants';

export class GoalService {
  // Get all goals for user
  async getGoals(): Promise<Goal[]> {
    try {
      const response = await apiService.get<ApiResponse<Goal[]>>(API_ENDPOINTS.goals.list);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  }

  // Create new goal
  async createGoal(goalData: CreateGoalForm): Promise<Goal> {
    try {
      const response = await apiService.post<ApiResponse<Goal>>(
        API_ENDPOINTS.goals.create,
        goalData
      );
      return response.data!;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  }

  // Update existing goal
  async updateGoal(goalId: string, goalData: Partial<CreateGoalForm>): Promise<Goal> {
    try {
      const response = await apiService.put<ApiResponse<Goal>>(
        API_ENDPOINTS.goals.update.replace(':id', goalId),
        goalData
      );
      return response.data!;
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  }

  // Delete goal
  async deleteGoal(goalId: string): Promise<void> {
    try {
      await apiService.delete<ApiResponse>(API_ENDPOINTS.goals.delete.replace(':id', goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  }

  // Get goal by ID
  async getGoalById(goalId: string): Promise<Goal> {
    try {
      const response = await apiService.get<ApiResponse<Goal>>(
        `${API_ENDPOINTS.goals.list}/${goalId}`
      );
      return response.data!;
    } catch (error) {
      console.error('Error fetching goal:', error);
      throw error;
    }
  }

  // Generate tasks from goal using AI
  async generateTasksFromGoal(goalId: string, goalDescription: string): Promise<any> {
    try {
      const response = await apiService.post<ApiResponse<any>>(
        API_ENDPOINTS.ai.generateTasks,
        { goalId, goalDescription }
      );
      return response.data!;
    } catch (error) {
      console.error('Error generating tasks from goal:', error);
      throw error;
    }
  }

  // Update goal progress
  async updateGoalProgress(goalId: string, progress: number): Promise<Goal> {
    try {
      const response = await apiService.put<ApiResponse<Goal>>(
        `${API_ENDPOINTS.goals.list}/${goalId}/progress`,
        { progress }
      );
      return response.data!;
    } catch (error) {
      console.error('Error updating goal progress:', error);
      throw error;
    }
  }

  // Get goals by category
  async getGoalsByCategory(category: string): Promise<Goal[]> {
    try {
      const response = await apiService.get<ApiResponse<Goal[]>>(
        `${API_ENDPOINTS.goals.list}?category=${category}`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching goals by category:', error);
      throw error;
    }
  }

  // Get active goals
  async getActiveGoals(): Promise<Goal[]> {
    try {
      const response = await apiService.get<ApiResponse<Goal[]>>(
        `${API_ENDPOINTS.goals.list}?status=active`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching active goals:', error);
      throw error;
    }
  }

  // Get completed goals
  async getCompletedGoals(): Promise<Goal[]> {
    try {
      const response = await apiService.get<ApiResponse<Goal[]>>(
        `${API_ENDPOINTS.goals.list}?status=completed`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching completed goals:', error);
      throw error;
    }
  }

  // Search goals
  async searchGoals(query: string): Promise<Goal[]> {
    try {
      const response = await apiService.get<ApiResponse<Goal[]>>(
        `${API_ENDPOINTS.goals.list}?search=${encodeURIComponent(query)}`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error searching goals:', error);
      throw error;
    }
  }
}

export const goalService = new GoalService();
export default goalService;
