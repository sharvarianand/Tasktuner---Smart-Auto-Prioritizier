import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface NotificationItem {
  id: string;
  type: 'overdue' | 'procrastination' | 'motivation' | 'completion';
  task?: {
    title: string;
    points?: number;
  };
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  getUnreadNotifications: () => NotificationItem[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('tasktuner-notifications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
      } catch (error) {
        console.error('Failed to parse stored notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasktuner-notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Listen for custom notification events
  useEffect(() => {
    const handleTaskNotification = (event: CustomEvent) => {
      const { type, task, message, timestamp } = event.detail;
      
      addNotification({
        type,
        task,
        message,
        timestamp
      });
    };

    window.addEventListener('taskNotification', handleTaskNotification as EventListener);
    
    return () => {
      window.removeEventListener('taskNotification', handleTaskNotification as EventListener);
    };
  }, []);

  const addNotification = (notification: Omit<NotificationItem, 'id' | 'read'>) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      read: false
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep only last 50
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getUnreadNotifications = () => {
    return notifications.filter(notif => !notif.read);
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    getUnreadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
