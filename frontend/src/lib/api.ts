const API_BASE_URL = 'http://localhost:3001/api';

// Get user ID from Clerk or session storage for demo
const getUserId = () => {
  // In a real app, this would come from Clerk authentication
  // For now, we'll use a demo user ID
  return 'demo-user-123';
};

// API client with authentication headers
const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const userId = getUserId();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error ${response.status}:`, errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Task API functions
export const taskApi = {
  // Get all tasks for user
  getTasks: async () => {
    try {
      return await apiClient('/tasks');
    } catch (error) {
      console.error('Failed to get tasks:', error);
      // Return empty array on error
      return [];
    }
  },

  // Create a new task
  createTask: async (task: {
    title: string;
    description?: string;
    priority: 'High' | 'Medium' | 'Low';
    category: 'Academic' | 'Personal' | 'Work';
    dueDate?: string;
    isDaily?: boolean;
  }) => {
    try {
      return await apiClient('/tasks', {
        method: 'POST',
        body: JSON.stringify(task),
      });
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (taskId: string, updates: {
    title?: string;
    description?: string;
    priority?: 'High' | 'Medium' | 'Low';
    category?: 'Academic' | 'Personal' | 'Work';
    completed?: boolean;
    dueDate?: string;
    isDaily?: boolean;
  }) => {
    try {
      return await apiClient(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (taskId: string) => {
    try {
      return await apiClient(`/tasks/${taskId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  },

  // Get user stats
  getUserStats: async () => {
    try {
      return await apiClient('/tasks/stats');
    } catch (error) {
      console.error('Failed to get user stats:', error);
      // Return default stats on error
      return {
        tasksCompleted: 0,
        totalTasks: 0,
        currentStreak: 0,
        xpEarned: 0,
        goalsProgress: 0
      };
    }
  },
};

export default apiClient;
