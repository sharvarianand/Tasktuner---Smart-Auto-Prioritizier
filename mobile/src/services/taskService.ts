import { apiService } from './api';
import { Task, CreateTaskForm, ApiResponse, PaginatedResponse } from '../types';
import { API_ENDPOINTS } from '../config/constants';

export class TaskService {
  // Get all tasks for user
  async getTasks(): Promise<Task[]> {
    try {
      const response = await apiService.get<ApiResponse<Task[]>>(API_ENDPOINTS.tasks.list);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  // Get prioritized tasks (AI-sorted)
  async getPrioritizedTasks(): Promise<{ prioritizedTasks: Task[]; insights: any }> {
    try {
      const response = await apiService.get<ApiResponse<{ prioritizedTasks: Task[]; insights: any }>>(
        `${API_ENDPOINTS.tasks.list}/prioritized`
      );
      return response.data || { prioritizedTasks: [], insights: {} };
    } catch (error) {
      console.error('Error fetching prioritized tasks:', error);
      throw error;
    }
  }

  // Create new task
  async createTask(taskData: CreateTaskForm): Promise<Task> {
    try {
      const response = await apiService.post<ApiResponse<Task>>(
        API_ENDPOINTS.tasks.create,
        taskData
      );
      return response.data!;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  // Update existing task
  async updateTask(taskId: string, taskData: Partial<CreateTaskForm>): Promise<Task> {
    try {
      const response = await apiService.put<ApiResponse<Task>>(
        API_ENDPOINTS.tasks.update.replace(':id', taskId),
        taskData
      );
      return response.data!;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  // Delete task
  async deleteTask(taskId: string): Promise<void> {
    try {
      await apiService.delete<ApiResponse>(API_ENDPOINTS.tasks.delete.replace(':id', taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  // Mark task as complete
  async completeTask(taskId: string): Promise<Task> {
    try {
      const response = await apiService.post<ApiResponse<Task>>(
        API_ENDPOINTS.tasks.complete.replace(':id', taskId)
      );
      return response.data!;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }

  // Get AI prioritization for tasks
  async prioritizeTasks(tasks: Task[], userId?: string, userContext?: any): Promise<{
    prioritizedTasks: Task[];
    insights: any;
  }> {
    try {
      const response = await apiService.post<ApiResponse<{
        prioritizedTasks: Task[];
        insights: any;
      }>>(
        API_ENDPOINTS.ai.prioritize,
        { tasks, userId, userContext }
      );
      return response.data!;
    } catch (error) {
      console.error('Error prioritizing tasks:', error);
      throw error;
    }
  }

  // Process voice/text input to create task
  async processInput(input: string, inputType: 'voice' | 'text'): Promise<Task> {
    try {
      const response = await apiService.post<ApiResponse<Task>>(
        API_ENDPOINTS.ai.processInput,
        { input, inputType }
      );
      return response.data!;
    } catch (error) {
      console.error('Error processing input:', error);
      throw error;
    }
  }

  // Get task by ID
  async getTaskById(taskId: string): Promise<Task> {
    try {
      const response = await apiService.get<ApiResponse<Task>>(
        `${API_ENDPOINTS.tasks.list}/${taskId}`
      );
      return response.data!;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  // Get tasks by category
  async getTasksByCategory(category: string): Promise<Task[]> {
    try {
      const response = await apiService.get<ApiResponse<Task[]>>(
        `${API_ENDPOINTS.tasks.list}?category=${category}`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching tasks by category:', error);
      throw error;
    }
  }

  // Get tasks by priority
  async getTasksByPriority(priority: string): Promise<Task[]> {
    try {
      const response = await apiService.get<ApiResponse<Task[]>>(
        `${API_ENDPOINTS.tasks.list}?priority=${priority}`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching tasks by priority:', error);
      throw error;
    }
  }

  // Get overdue tasks
  async getOverdueTasks(): Promise<Task[]> {
    try {
      const response = await apiService.get<ApiResponse<Task[]>>(
        `${API_ENDPOINTS.tasks.list}?overdue=true`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching overdue tasks:', error);
      throw error;
    }
  }

  // Get today's tasks
  async getTodaysTasks(): Promise<Task[]> {
    try {
      const response = await apiService.get<ApiResponse<Task[]>>(
        `${API_ENDPOINTS.tasks.list}?today=true`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching today\'s tasks:', error);
      throw error;
    }
  }

  // Search tasks
  async searchTasks(query: string): Promise<Task[]> {
    try {
      const response = await apiService.get<ApiResponse<Task[]>>(
        `${API_ENDPOINTS.tasks.list}?search=${encodeURIComponent(query)}`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error searching tasks:', error);
      throw error;
    }
  }
}

export const taskService = new TaskService();
export default taskService;
