# 🔌 TaskTuner Mobile - API Integration Guide

This guide explains how the TaskTuner mobile app integrates with the existing backend APIs.

## 📡 Backend Connection

### API Base Configuration

The mobile app connects to your existing TaskTuner backend through a centralized API service:

```typescript
// src/config/constants.ts
export const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3001/api' // Android emulator
  : 'https://your-backend-url.com/api'; // Production
```

### API Service Layer

The app uses a robust API service (`src/services/api.ts`) that handles:

- **Automatic Authentication**: JWT token management
- **Request Interceptors**: Add auth headers and user ID
- **Response Interceptors**: Handle errors and token refresh
- **Retry Logic**: Automatic retry for failed requests
- **Offline Support**: Queue requests when offline

## 🔐 Authentication Integration

### Clerk Integration

The mobile app uses the same Clerk authentication as your web app:

```typescript
// App.tsx
import { ClerkProvider } from '@clerk/clerk-react';

const App = () => (
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
    {/* App components */}
  </ClerkProvider>
);
```

### Token Management

```typescript
// src/services/api.ts
class ApiService {
  private async setupInterceptors() {
    this.api.interceptors.request.use(async (config) => {
      // Add Clerk JWT token
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add user ID for backend
      const userId = await AsyncStorage.getItem('user_id');
      if (userId) {
        config.headers['x-user-id'] = userId;
      }
      
      return config;
    });
  }
}
```

## 📋 Task Management APIs

### Get Tasks

```typescript
// src/services/taskService.ts
export class TaskService {
  async getTasks(): Promise<Task[]> {
    const response = await apiService.get<ApiResponse<Task[]>>('/tasks');
    return response.data || [];
  }
}
```

**Backend Endpoint**: `GET /api/tasks`
**Headers**: `Authorization: Bearer <jwt>`, `x-user-id: <userId>`

### Create Task

```typescript
async createTask(taskData: CreateTaskForm): Promise<Task> {
  const response = await apiService.post<ApiResponse<Task>>('/tasks', taskData);
  return response.data!;
}
```

**Backend Endpoint**: `POST /api/tasks`
**Request Body**:
```json
{
  "title": "Complete project proposal",
  "description": "Write and submit the Q4 project proposal",
  "priority": "High",
  "category": "Work",
  "dueDate": "2024-01-15",
  "startTime": "09:00",
  "endTime": "11:00",
  "isDaily": false,
  "reminders": {
    "before": 15
  },
  "addToCalendar": true
}
```

### AI Prioritization

```typescript
async prioritizeTasks(tasks: Task[], userId?: string, userContext?: any) {
  const response = await apiService.post('/ai/prioritize', {
    tasks,
    userId,
    userContext
  });
  return response.data;
}
```

**Backend Endpoint**: `POST /api/ai/prioritize`
**Response**:
```json
{
  "prioritizedTasks": [
    {
      "id": "task-1",
      "title": "Urgent task",
      "aiPriority": 95,
      "aiRank": 1,
      "aiInsights": {
        "isUrgent": true,
        "priorityReason": "Deadline approaching",
        "timeRecommendation": "Do this first thing in the morning"
      }
    }
  ],
  "insights": {
    "summary": "3 urgent tasks, 2 overdue",
    "recommendations": ["Focus on high-priority tasks first"]
  }
}
```

## 🎯 Goals & AI Task Generation

### Create Goal

```typescript
// src/services/goalService.ts
async createGoal(goalData: CreateGoalForm): Promise<Goal> {
  const response = await apiService.post<ApiResponse<Goal>>('/goals', goalData);
  return response.data!;
}
```

**Backend Endpoint**: `POST /api/goals`

### Generate Tasks from Goal

```typescript
async generateTasksFromGoal(goalId: string, goalDescription: string) {
  const response = await apiService.post('/ai/generate-tasks', {
    goalId,
    goalDescription
  });
  return response.data;
}
```

**Backend Endpoint**: `POST /api/ai/generate-tasks`
**Request Body**:
```json
{
  "goalId": "goal-123",
  "goalDescription": "Crack GATE 2026 - Computer Science"
}
```

**Response**:
```json
{
  "generatedTasks": [
    {
      "title": "Complete Linear Algebra fundamentals",
      "description": "Study matrices, determinants, and vector spaces",
      "priority": "High",
      "category": "Academic",
      "estimatedDuration": 120
    },
    {
      "title": "Practice Data Structures problems",
      "description": "Solve 50 problems on arrays, linked lists, and trees",
      "priority": "High",
      "category": "Academic",
      "estimatedDuration": 180
    }
  ]
}
```

## 🎭 Voice & Roast Integration

### Generate Roast

```typescript
// src/services/roastService.ts
async generateRoast(taskTitle: string, role: string = 'student') {
  const response = await apiService.post('/ai/generate-roast', {
    taskTitle,
    role
  });
  return response.data;
}
```

**Backend Endpoint**: `POST /api/ai/generate-roast`
**Response**:
```json
{
  "roast": "You've moved 'Start Assignment' for the third time. Grow up."
}
```

### Voice Configuration

```typescript
// src/services/voiceService.ts
async generateVoiceRoast(roastText: string) {
  const response = await apiService.post('/voice/roast-audio', {
    roastText
  });
  return response.data;
}
```

**Backend Endpoint**: `POST /api/voice/roast-audio`
**Response**:
```json
{
  "success": true,
  "text": "You've moved 'Start Assignment' for the third time. Grow up.",
  "voiceConfig": {
    "rate": 0.9,
    "pitch": 0.6,
    "volume": 1.0
  }
}
```

## 📅 Calendar Integration

### Google Calendar OAuth

```typescript
// src/services/calendarService.ts
async getAuthUrl(): Promise<string> {
  const response = await apiService.get('/calendar/auth/url');
  return response.data.authUrl;
}
```

**Backend Endpoint**: `GET /api/calendar/auth/url`

### Create Calendar Event

```typescript
async createEventFromTask(taskId: string, startTime: string, duration: number) {
  const response = await apiService.post('/calendar/events', {
    taskId,
    startTime,
    duration
  });
  return response.data;
}
```

**Backend Endpoint**: `POST /api/calendar/events`

### Sync Calendar

```typescript
async syncCalendar() {
  const response = await apiService.post('/calendar/sync');
  return response.data;
}
```

**Backend Endpoint**: `POST /api/calendar/sync`

## 📊 Analytics Integration

### Dashboard Analytics

```typescript
// src/services/analyticsService.ts
async getDashboardAnalytics(): Promise<Analytics> {
  const response = await apiService.get('/analytics/dashboard');
  return response.data;
}
```

**Backend Endpoint**: `GET /api/analytics/dashboard`
**Response**:
```json
{
  "totalTasks": 45,
  "completedTasks": 32,
  "completionRate": 71.1,
  "currentStreak": 7,
  "longestStreak": 15,
  "totalPoints": 1250,
  "weeklyStats": [
    {
      "week": "2024-W01",
      "tasksCompleted": 8,
      "pointsEarned": 200
    }
  ],
  "categoryStats": [
    {
      "category": "Work",
      "total": 20,
      "completed": 15,
      "completionRate": 75.0
    }
  ]
}
```

### Leaderboard

```typescript
async getLeaderboard(): Promise<LeaderboardEntry[]> {
  const response = await apiService.get('/leaderboard');
  return response.data;
}
```

**Backend Endpoint**: `GET /api/leaderboard`

## 🔔 Notifications Integration

### Get Notifications

```typescript
// src/services/notificationService.ts
async getNotifications(): Promise<Notification[]> {
  const response = await apiService.get('/notifications');
  return response.data;
}
```

### Update Notification Settings

```typescript
async updateNotificationSettings(settings: NotificationSettings) {
  const response = await apiService.put('/notifications/settings', settings);
  return response.data;
}
```

**Backend Endpoint**: `PUT /api/notifications/settings`

## 🚨 Error Handling

### API Error Response Format

```typescript
interface ApiError {
  success: false;
  error: string;
  message?: string;
  details?: any;
}
```

### Error Handling in Services

```typescript
class TaskService {
  async getTasks(): Promise<Task[]> {
    try {
      const response = await apiService.get<ApiResponse<Task[]>>('/tasks');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks. Please try again.');
    }
  }
}
```

### Global Error Handling

```typescript
// src/services/api.ts
private handleError(error: any): Error {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || 'Server error';
    return new Error(message);
  } else if (error.request) {
    // Network error
    return new Error('Network error. Please check your connection.');
  } else {
    // Other error
    return new Error(error.message || 'An unexpected error occurred.');
  }
}
```

## 🔄 Offline Support

### Offline Task Queue

```typescript
// src/services/offlineService.ts
class OfflineService {
  async queueTaskAction(action: 'create' | 'update' | 'delete', task: Task) {
    const offlineAction: OfflineTask = {
      id: generateId(),
      task,
      action,
      timestamp: new Date().toISOString(),
      synced: false
    };
    
    await AsyncStorage.setItem(
      `offline_task_${offlineAction.id}`,
      JSON.stringify(offlineAction)
    );
  }
  
  async syncOfflineActions() {
    const keys = await AsyncStorage.getAllKeys();
    const offlineKeys = keys.filter(key => key.startsWith('offline_task_'));
    
    for (const key of offlineKeys) {
      const offlineAction = await AsyncStorage.getItem(key);
      if (offlineAction) {
        const action = JSON.parse(offlineAction);
        await this.syncAction(action);
        await AsyncStorage.removeItem(key);
      }
    }
  }
}
```

## 🧪 Testing API Integration

### Mock API Responses

```typescript
// src/services/__mocks__/taskService.ts
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    priority: 'High',
    category: 'Work',
    completed: false,
    points: 50,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const taskService = {
  getTasks: jest.fn().mockResolvedValue(mockTasks),
  createTask: jest.fn().mockResolvedValue(mockTasks[0]),
  updateTask: jest.fn().mockResolvedValue(mockTasks[0]),
  deleteTask: jest.fn().mockResolvedValue(undefined),
};
```

### Integration Tests

```typescript
// src/services/__tests__/taskService.test.ts
describe('TaskService', () => {
  it('should fetch tasks from API', async () => {
    const tasks = await taskService.getTasks();
    expect(tasks).toBeDefined();
    expect(Array.isArray(tasks)).toBe(true);
  });
  
  it('should create task via API', async () => {
    const newTask = await taskService.createTask({
      title: 'Test task',
      priority: 'Medium',
      category: 'Personal'
    });
    expect(newTask).toBeDefined();
    expect(newTask.title).toBe('Test task');
  });
});
```

## 📱 Mobile-Specific Considerations

### Network Status Handling

```typescript
// src/hooks/useNetworkStatus.ts
import NetInfo from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });
    
    return unsubscribe;
  }, []);
  
  return { isConnected };
};
```

### Background Sync

```typescript
// src/services/backgroundSync.ts
import BackgroundJob from 'react-native-background-job';

export const setupBackgroundSync = () => {
  BackgroundJob.register({
    jobKey: 'taskSync',
    period: 300000, // 5 minutes
  });
  
  BackgroundJob.on('taskSync', async () => {
    if (await NetInfo.fetch().then(state => state.isConnected)) {
      await syncOfflineActions();
    }
  });
};
```

## 🔧 Configuration

### Environment-Specific URLs

```typescript
// src/config/constants.ts
const getApiBaseUrl = () => {
  if (__DEV__) {
    return Platform.OS === 'ios' 
      ? 'http://localhost:3001/api'
      : 'http://10.0.2.2:3001/api';
  }
  return 'https://api.tasktuner.app/api';
};

export const API_BASE_URL = getApiBaseUrl();
```

### API Timeout Configuration

```typescript
// src/services/api.ts
this.api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});
```

This integration guide ensures seamless communication between your mobile app and existing backend, maintaining consistency with your web application while providing mobile-optimized features.
