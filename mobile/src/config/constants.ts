// API Configuration
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const apiBaseFromExtra = (Constants as any)?.expoConfig?.extra?.apiBaseUrl
  ?? (Constants as any)?.manifest?.extra?.apiBaseUrl;

const apiBaseFromEnv = process.env.EXPO_PUBLIC_API_BASE_URL;

function resolveLocalDefaultBaseUrl(): string {
  if (__DEV__) {
    if (Platform.OS === 'android') return 'http://10.0.2.2:3001/api';
    if (Platform.OS === 'ios') return 'http://127.0.0.1:3001/api';
    if (Platform.OS === 'web') return 'http://localhost:3001/api';
  }
  return 'https://your-backend-url.com/api';
}

export const API_BASE_URL = (apiBaseFromExtra as string)
  || (apiBaseFromEnv as string)
  || resolveLocalDefaultBaseUrl();

// Clerk Configuration
const clerkKeyFromExtra = (Constants as any)?.expoConfig?.extra?.clerkPublishableKey 
  ?? (Constants as any)?.manifest?.extra?.clerkPublishableKey;

export const CLERK_PUBLISHABLE_KEY = clerkKeyFromExtra 
  ?? process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY 
  ?? '';

// Log the Clerk configuration status for debugging
if (!CLERK_PUBLISHABLE_KEY && !__DEV__) {
  console.warn('Clerk publishable key is not set. Authentication features will be limited.');
}

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: "your-firebase-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// App Configuration
export const APP_CONFIG = {
  name: 'TaskTuner',
  version: '1.0.0',
  description: 'AI-powered productivity app that roasts you into action',
  supportEmail: 'support@tasktuner.app',
  website: 'https://tasktuner.app',
};

// Theme Configuration
export const THEME_CONFIG = {
  light: {
    primary: '#8b5cf6', // violet-500
    secondary: '#a78bfa', // violet-400
    accent: '#22d3ee', // cyan-400
    background: '#f8fafc', // slate-50
    surface: '#ffffff',
    text: '#0f172a', // slate-900
    textSecondary: '#475569', // slate-600
  },
  dark: {
    primary: '#8b5cf6', // violet-500
    secondary: '#a78bfa', // violet-400
    accent: '#22d3ee', // cyan-400
    background: '#0b1020', // deep navy
    surface: '#13172b', // slightly lighter navy
    text: '#e2e8f0', // slate-200
    textSecondary: '#94a3b8', // slate-400
  },
};

// Animation Configuration
export const ANIMATION_CONFIG = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// Voice Configuration
export const VOICE_CONFIG = {
  defaultRate: 1.0,
  defaultPitch: 1.0,
  defaultVolume: 0.8,
  supportedLanguages: ['en-US', 'en-GB'],
};

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  channels: {
    taskReminders: 'task-reminders',
    dailyStreaks: 'daily-streaks',
    roasts: 'roasts',
    achievements: 'achievements',
  },
  defaultReminderTime: 9, // 9 AM
  maxRetries: 3,
};

// Storage Keys
export const STORAGE_KEYS = {
  userPreferences: 'user_preferences',
  theme: 'theme',
  voiceSettings: 'voice_settings',
  notificationSettings: 'notification_settings',
  lastSyncTime: 'last_sync_time',
  offlineTasks: 'offline_tasks',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    signUp: '/auth/signup',
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    forgotPassword: '/auth/forgot-password',
  },
  // Tasks
  tasks: {
    list: '/tasks',
    create: '/tasks',
    update: '/tasks/:id',
    delete: '/tasks/:id',
    complete: '/tasks/:id/complete',
    prioritize: '/tasks/prioritize',
  },
  // AI
  ai: {
    prioritize: '/ai/prioritize',
    generateTasks: '/ai/generate-tasks',
    generateRoast: '/ai/generate-roast',
    processInput: '/ai/process-input',
  },
  // Calendar
  calendar: {
    events: '/calendar/events',
    createEvent: '/calendar/events',
    sync: '/calendar/sync',
    auth: '/calendar/auth/url',
  },
  // Goals
  goals: {
    list: '/goals',
    create: '/goals',
    update: '/goals/:id',
    delete: '/goals/:id',
  },
  // Analytics
  analytics: {
    dashboard: '/analytics/dashboard',
    streaks: '/analytics/streaks',
    completion: '/analytics/completion',
  },
  // User
  user: {
    profile: '/user/profile',
    preferences: '/user/preferences',
    stats: '/user/stats',
  },
  // Notifications
  notifications: {
    list: '/notifications',
    markRead: '/notifications/:id/read',
    settings: '/notifications/settings',
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  server: 'Server error. Please try again later.',
  auth: 'Authentication failed. Please sign in again.',
  validation: 'Please check your input and try again.',
  unknown: 'An unexpected error occurred.',
  offline: 'You are offline. Some features may not be available.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  taskCreated: 'Task created successfully!',
  taskUpdated: 'Task updated successfully!',
  taskCompleted: 'Great job! Task completed!',
  taskDeleted: 'Task deleted successfully!',
  goalCreated: 'Goal created successfully!',
  profileUpdated: 'Profile updated successfully!',
  settingsSaved: 'Settings saved successfully!',
};
