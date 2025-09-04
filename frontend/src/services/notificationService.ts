import { toast } from 'sonner';

const notificationService = {
  // Toast notifications
  success: (message: string) => {
    toast.success(message);
  },
  
  error: (message: string) => {
    toast.error(message);
  },
  
  info: (message: string) => {
    toast.info(message);
  },
  
  warning: (message: string) => {
    toast.warning(message);
  },

  // Request browser notification permission
  requestPermission: async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  },

  // Schedule motivational roasts (placeholder implementation)
  scheduleMotivationalRoasts: () => {
    // This is a placeholder implementation
    // In a real app, this would schedule notifications at specific times
    console.log('Scheduling motivational roasts...');
    
    // Example of scheduling a notification (commented out as it's just for reference)
    // setInterval(() => {
    //   const roasts = [
    //     "Time to get productive! Your tasks won't complete themselves.",
    //     "Remember why you started. You've got this!",
    //     "Small progress is still progress. Keep going!"
    //   ];
    //   const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
    //   notificationService.info(randomRoast);
    // }, 1000 * 60 * 60 * 2); // Every 2 hours
  },

  // Show a browser notification
  showNotification(title: string, options?: NotificationOptions) {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return null;
    }

    if (Notification.permission === 'granted') {
      return new Notification(title, options);
    } else if (Notification.permission !== 'denied') {
      // Request permission if not already determined
      this.requestPermission().then(permission => {
        if (permission === 'granted') {
          return new Notification(title, options);
        }
      });
    }
    return null;
  }
};

export default notificationService;