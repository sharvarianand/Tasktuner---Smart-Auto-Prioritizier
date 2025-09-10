// User Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Academic' | 'Personal' | 'Work';
  completed: boolean;
  completedAt?: string;
  cancelled?: boolean;
  startDate?: string;
  dueDate?: string;
  startTime?: string;
  endTime?: string;
  points: number;
  roast?: string;
  isDaily?: boolean;
  completedDates?: string[];
  calendarEventId?: string;
  goalId?: string;
  reminders?: {
    before?: number;
    after?: number;
  };
  // AI Prioritization fields
  aiPriority?: number;
  aiRank?: number;
  aiInsights?: {
    isUrgent?: boolean;
    isOverdue?: boolean;
    isOptimizedForTime?: boolean;
    requiresFocus?: boolean;
    nlpEnhanced?: boolean;
    priorityReason?: string;
    timeRecommendation?: string;
  };
  aiScore?: {
    urgency: number;
    importance: number;
    timefit: number;
    effort: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Goal Types
export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: 'Academic' | 'Personal' | 'Work' | 'Health' | 'Career';
  targetDate?: string;
  progress: number;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  allDay?: boolean;
  location?: string;
  attendees?: string[];
  taskId?: string;
  source: 'google' | 'tasktuner';
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface Analytics {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  weeklyStats: {
    week: string;
    tasksCompleted: number;
    pointsEarned: number;
  }[];
  categoryStats: {
    category: string;
    total: number;
    completed: number;
    completionRate: number;
  }[];
  priorityStats: {
    priority: string;
    total: number;
    completed: number;
    completionRate: number;
  }[];
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  profileImageUrl?: string;
  totalPoints: number;
  currentStreak: number;
  tasksCompleted: number;
  isCurrentUser?: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'task_reminder' | 'streak_reminder' | 'roast' | 'achievement' | 'general';
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

// Voice Types
export interface VoiceSettings {
  enabled: boolean;
  rate: number;
  pitch: number;
  volume: number;
  voice?: string;
  language: string;
}

// Theme Types
export interface Theme {
  mode: 'light' | 'dark' | 'system';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    success: string;
    warning: string;
    error: string;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Navigation Types
export type RootStackParamList = {
  Loading: undefined;
  Landing: undefined;
  Auth: undefined;
  Main: undefined;
  MainTabs: undefined;
  TaskDetail: { taskId: string };
  GoalDetail: { goalId: string };
  Settings: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Tasks: undefined;
  Calendar: undefined;
  Goals: undefined;
  Analytics: undefined;
  Leaderboard: undefined;
  Settings: undefined;
};

// Form Types
export interface CreateTaskForm {
  title: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Academic' | 'Personal' | 'Work';
  dueDate?: string;
  startTime?: string;
  endTime?: string;
  isDaily?: boolean;
  reminders?: {
    before?: number;
    after?: number;
  };
  addToCalendar?: boolean;
}

export interface CreateGoalForm {
  title: string;
  description?: string;
  category: 'Academic' | 'Personal' | 'Work' | 'Health' | 'Career';
  targetDate?: string;
}

export interface UpdateProfileForm {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
}

// Context Types
export interface AppContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  theme: Theme;
  voiceSettings: VoiceSettings;
  notificationSettings: NotificationSettings;
  updateUser: (user: User) => void;
  updateTheme: (theme: Theme) => void;
  updateVoiceSettings: (settings: VoiceSettings) => void;
  updateNotificationSettings: (settings: NotificationSettings) => void;
}

export interface NotificationSettings {
  enabled: boolean;
  taskReminders: boolean;
  dailyStreaks: boolean;
  roasts: boolean;
  achievements: boolean;
  reminderTime: number;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error?: string;
  data?: any;
}

// Offline Types
export interface OfflineTask {
  id: string;
  task: Task;
  action: 'create' | 'update' | 'delete';
  timestamp: string;
  synced: boolean;
}
