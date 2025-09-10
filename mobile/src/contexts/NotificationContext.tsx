import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Removed static import of expo-notifications to avoid Expo Go warning in SDK 53
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { NotificationSettings } from '../types';
import { STORAGE_KEYS, NOTIFICATION_CONFIG } from '../config/constants';

let NotificationsModule: any = null;

interface NotificationContextType {
  settings: NotificationSettings;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  scheduleNotification: (title: string, body: string, data?: any) => Promise<void>;
  cancelNotification: (id: string) => Promise<void>;
  requestPermissions: () => Promise<boolean>;
  hasPermissions: boolean;
  isExpoGo: boolean;
  notificationsSupported: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    taskReminders: true,
    dailyStreaks: true,
    roasts: true,
    achievements: true,
    reminderTime: NOTIFICATION_CONFIG.defaultReminderTime,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
  });
  const [hasPermissions, setHasPermissions] = useState(false);
  
  // Check if running in Expo Go or Web
  const isExpoGo = Constants.appOwnership === 'expo';
  const isWeb = Platform.OS === 'web';
  const notificationsSupported = !isExpoGo && !isWeb;

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  useEffect(() => {
    const setupNotifications = async () => {
      if (!notificationsSupported) {
        setHasPermissions(false);
        return;
      }
      try {
        // Dynamically import to avoid Expo Go/web warnings
        const mod = await import('expo-notifications');
        NotificationsModule = mod;

        const { status } = await NotificationsModule.getPermissionsAsync();
        setHasPermissions(status === 'granted');
      } catch (error) {
        console.error('Error initializing notifications:', error);
        setHasPermissions(false);
      }
    };
    setupNotifications();
  }, [notificationsSupported]);

  const loadNotificationSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(STORAGE_KEYS.notificationSettings);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await AsyncStorage.setItem(STORAGE_KEYS.notificationSettings, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    if (!notificationsSupported) {
      console.warn('Notifications not supported in this environment. Use a development build on device.');
      return false;
    }
    try {
      const { status: existingStatus } = await NotificationsModule.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await NotificationsModule.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        return false;
      }
      setHasPermissions(true);
      if (Platform.OS === 'android') {
        await NotificationsModule.setNotificationChannelAsync('default', {
          name: 'default',
          importance: NotificationsModule.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  };

  const scheduleNotification = async (title: string, body: string, data?: any): Promise<void> => {
    if (!settings.enabled || !hasPermissions || !notificationsSupported) {
      return;
    }
    try {
      await NotificationsModule.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const cancelNotification = async (id: string): Promise<void> => {
    try {
      if (!notificationsSupported) return;
      await NotificationsModule.cancelScheduledNotificationAsync(id);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  };

  const value: NotificationContextType = {
    settings,
    updateSettings,
    scheduleNotification,
    cancelNotification,
    requestPermissions,
    hasPermissions,
    isExpoGo,
    notificationsSupported,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
