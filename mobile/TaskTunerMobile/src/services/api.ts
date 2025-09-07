import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend URL - matches your server configuration
const API_BASE_URL = 'http://10.252.103.176:3001/api'; // Your backend server

// Get user ID from AsyncStorage or generate a demo ID
const getUserId = async (): Promise<string> => {
  const isDemoMode = await AsyncStorage.getItem('tasktuner-demo-mode') === 'true';
  if (isDemoMode) {
    return 'demo-user-123';
  }

  const userId = await AsyncStorage.getItem('tasktuner-user-id');
  return userId || 'anonymous-user';
};

// API client with authentication headers
const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const userId = await getUserId();

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

// Task API functions - connected to your backend
export const taskApi = {
  getTasks: async () => {
    try {
      return await apiClient('/tasks');
    } catch (error) {
      console.error('Failed to get tasks:', error);
      return [];
    }
  },
  
  createTask: async (task: any) => {
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

  updateTask: async (taskId: string, task: any) => {
    try {
      return await apiClient(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(task),
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  },

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

  getUserStats: async () => {
    try {
      return await apiClient('/user/stats');
    } catch (error) {
      console.error('Failed to get user stats:', error);
      return null;
    }
  },

  getPrioritizedTasks: async () => {
    try {
      return await apiClient('/tasks/prioritized');
    } catch (error) {
      console.error('Failed to get prioritized tasks:', error);
      return [];
    }
  }
};

// AI API functions - connected to your backend
export const aiApi = {
  generateRoast: async (taskTitle: string, role: string = 'user') => {
    try {
      return await apiClient('/ai/generate-roast', {
        method: 'POST',
        body: JSON.stringify({ taskTitle, role }),
      });
    } catch (error) {
      console.error('Failed to generate roast:', error);
      throw error;
    }
  },

  prioritizeTasks: async (tasks: any[]) => {
    try {
      return await apiClient('/ai/prioritize-tasks', {
        method: 'POST',
        body: JSON.stringify({ tasks }),
      });
    } catch (error) {
      console.error('Failed to prioritize tasks:', error);
      throw error;
    }
  }
};

// Voice API functions - connected to your backend
export const voiceApi = {
  generateVoiceRoast: async (taskTitle: string) => {
    try {
      return await apiClient('/voice/generate-roast', {
        method: 'POST',
        body: JSON.stringify({ taskTitle }),
      });
    } catch (error) {
      console.error('Failed to generate voice roast:', error);
      throw error;
    }
  }
};

// Analytics API functions - connected to your backend
export const analyticsApi = {
  getUserAnalytics: async () => {
    try {
      return await apiClient('/analytics/user');
    } catch (error) {
      console.error('Failed to get user analytics:', error);
      return null;
    }
  },

  getProductivityStats: async () => {
    try {
      return await apiClient('/analytics/productivity');
    } catch (error) {
      console.error('Failed to get productivity stats:', error);
      return null;
    }
  }
};

// Calendar API functions - connected to your backend
export const calendarApi = {
  syncCalendar: async () => {
    try {
      return await apiClient('/calendar/sync', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to sync calendar:', error);
      throw error;
    }
  },

  getCalendarEvents: async () => {
    try {
      return await apiClient('/calendar/events');
    } catch (error) {
      console.error('Failed to get calendar events:', error);
      return [];
    }
  }
};

// Goals API functions - connected to your backend
export const goalsApi = {
  getGoals: async () => {
    try {
      return await apiClient('/goals');
    } catch (error) {
      console.error('Failed to get goals:', error);
      return [];
    }
  },

  createGoal: async (goal: any) => {
    try {
      return await apiClient('/goals', {
        method: 'POST',
        body: JSON.stringify(goal),
      });
    } catch (error) {
      console.error('Failed to create goal:', error);
      throw error;
    }
  }
};

// Notifications API functions - connected to your backend
export const notificationsApi = {
  getNotifications: async () => {
    try {
      return await apiClient('/notifications');
    } catch (error) {
      console.error('Failed to get notifications:', error);
      return [];
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      return await apiClient(`/notifications/${notificationId}/read`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};
