// Notification Service for browser notifications and task reminders
export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';
  private scheduledNotifications: Map<string, number> = new Map();

  private constructor() {
    this.requestPermission();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.permission = 'granted';
      return true;
    }

    if (Notification.permission === 'denied') {
      this.permission = 'denied';
      return false;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  public showNotification(title: string, options?: NotificationOptions): void {
    if (this.permission !== 'granted') {
      console.log('Notification permission not granted');
      return;
    }

    const defaultOptions: NotificationOptions = {
      icon: '/Tasktuner_logo.png',
      badge: '/Tasktuner_logo.png',
      tag: 'tasktuner-notification',
      requireInteraction: true,
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);
      
      // Auto close after 10 seconds if not manually closed
      setTimeout(() => {
        notification.close();
      }, 10000);

      notification.onclick = () => {
        window.focus();
        notification.close();
        // Navigate to tasks page if needed
        if (window.location.pathname !== '/tasks') {
          window.location.href = '/tasks';
        }
      };

    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  public scheduleTaskReminder(taskId: string, title: string, delay: number, type: 'before' | 'after'): void {
    const timeoutId = window.setTimeout(() => {
      const message = type === 'before' 
        ? `⏰ Task Starting Soon: "${title}"`
        : `✅ Task Follow-up: "${title}" - Don't forget to mark as complete!`;
      
      this.showNotification(message, {
        body: type === 'before' 
          ? 'Time to get focused and start working!'
          : 'How did it go? Mark your task as complete if finished.',
        tag: `task-${taskId}-${type}`,
        requireInteraction: true
      });
      
      // Remove from scheduled notifications
      this.scheduledNotifications.delete(`${taskId}-${type}`);
    }, delay);

    // Store the timeout ID to allow cancellation
    this.scheduledNotifications.set(`${taskId}-${type}`, timeoutId);
  }

  public cancelTaskReminder(taskId: string, type?: 'before' | 'after'): void {
    if (type) {
      const timeoutId = this.scheduledNotifications.get(`${taskId}-${type}`);
      if (timeoutId) {
        clearTimeout(timeoutId);
        this.scheduledNotifications.delete(`${taskId}-${type}`);
      }
    } else {
      // Cancel all reminders for this task
      ['before', 'after'].forEach(t => {
        const timeoutId = this.scheduledNotifications.get(`${taskId}-${t}`);
        if (timeoutId) {
          clearTimeout(timeoutId);
          this.scheduledNotifications.delete(`${taskId}-${t}`);
        }
      });
    }
  }

  public scheduleNotification(
    title: string, 
    delay: number, 
    options?: NotificationOptions
  ): number {
    return window.setTimeout(() => {
      this.showNotification(title, options);
    }, delay);
  }

  public cancelScheduledNotification(timeoutId: number): void {
    clearTimeout(timeoutId);
  }

  public getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  public showTaskNotifications(task: any): void {
    if (!task.startTime || !task.dueDate) return;

    try {
      // Calculate notification times
      const taskDate = new Date(`${task.dueDate}T${task.startTime}`);
      const now = new Date();
      
      // Schedule before notification
      if (task.reminders?.before && task.reminders.before > 0) {
        const beforeTime = new Date(taskDate.getTime() - (task.reminders.before * 60 * 1000));
        const beforeDelay = beforeTime.getTime() - now.getTime();
        
        if (beforeDelay > 0 && beforeDelay < 24 * 60 * 60 * 1000) { // Within 24 hours
          this.scheduleTaskReminder(task.id, task.title, beforeDelay, 'before');
        }
      }
      
      // Schedule after notification
      if (task.reminders?.after && task.reminders.after > 0 && task.endTime) {
        const taskEndDate = new Date(`${task.dueDate}T${task.endTime}`);
        const afterTime = new Date(taskEndDate.getTime() + (task.reminders.after * 60 * 1000));
        const afterDelay = afterTime.getTime() - now.getTime();
        
        if (afterDelay > 0 && afterDelay < 24 * 60 * 60 * 1000) { // Within 24 hours
          this.scheduleTaskReminder(task.id, task.title, afterDelay, 'after');
        }
      }
    } catch (error) {
      console.error('Error scheduling task notifications:', error);
    }
  }
}

export const notificationService = NotificationService.getInstance();
