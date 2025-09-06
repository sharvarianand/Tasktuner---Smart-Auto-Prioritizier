import { toast } from 'sonner';

const notificationService = {
  // Roast-based notifications
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

  // Roast notification types
  showMotivationalRoast: (taskTitle: string) => {
    const motivationalRoasts = [
      `💪 "${taskTitle}" is calling your name! Time to show it who's boss!`,
      `🔥 Ready to crush "${taskTitle}"? Your future self will thank you!`,
      `⚡ "${taskTitle}" won't complete itself! Let's make it happen!`,
      `🎯 "${taskTitle}" is your next victory! Go get it!`,
      `💎 You've got this! "${taskTitle}" is about to be conquered!`,
      `🚀 Time to level up! "${taskTitle}" is your next achievement!`,
      `⭐ "${taskTitle}" is waiting for your magic touch!`,
      `🏆 Let's turn "${taskTitle}" into a success story!`
    ];
    
    const roast = motivationalRoasts[Math.floor(Math.random() * motivationalRoasts.length)];
    toast.success(roast);
    
    // Also show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification("🔥 Motivational Roast!", {
        body: roast,
        icon: '/favicon.ico',
        tag: 'motivational-roast'
      });
    }
  },

  showProcrastinationRoast: (taskTitle: string) => {
    const procrastinationRoasts = [
      `😏 Oh look, "${taskTitle}" is still there... waiting... judging...`,
      `🥴 "${taskTitle}" called. It said you're avoiding it. Again.`,
      `👀 "${taskTitle}" is giving you the side-eye from your task list!`,
      `😅 "${taskTitle}" is still waiting patiently... unlike you!`,
      `🤷‍♀️ "${taskTitle}" is wondering if you forgot about it. Again.`,
      `😬 "${taskTitle}" is getting lonely. Maybe give it some attention?`,
      `🙄 "${taskTitle}" is still there. Still waiting. Still judging.`,
      `😤 "${taskTitle}" is starting to take this personally!`
    ];
    
    const roast = procrastinationRoasts[Math.floor(Math.random() * procrastinationRoasts.length)];
    toast.warning(roast);
    
    // Also show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification("😏 Procrastination Roast!", {
        body: roast,
        icon: '/favicon.ico',
        tag: 'procrastination-roast'
      });
    }
  },

  showCompletionRoast: (taskTitle: string, points: number) => {
    const completionRoasts = [
      `🎉 "${taskTitle}" is DONE! You absolute legend! +${points} points!`,
      `🔥 BOOM! "${taskTitle}" just got demolished! +${points} points earned!`,
      `💪 "${taskTitle}" didn't stand a chance! +${points} points to you!`,
      `⭐ "${taskTitle}" is officially conquered! +${points} points!`,
      `🏆 "${taskTitle}" is history! You're on fire! +${points} points!`,
      `🚀 "${taskTitle}" just got completed like a boss! +${points} points!`,
      `💎 "${taskTitle}" is done and dusted! +${points} points earned!`,
      `🎯 Bullseye! "${taskTitle}" is complete! +${points} points!`
    ];
    
    const roast = completionRoasts[Math.floor(Math.random() * completionRoasts.length)];
    toast.success(roast);
    
    // Also show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification("🎉 Task Completed!", {
        body: roast,
        icon: '/favicon.ico',
        tag: 'completion-roast'
      });
    }
  },

  showOverdueRoast: (taskTitle: string) => {
    const overdueRoasts = [
      `⏰ "${taskTitle}" is overdue! Time to adult... just a little bit!`,
      `😅 "${taskTitle}" called. It's not happy about being late!`,
      `🚨 "${taskTitle}" is giving you the disappointed parent look!`,
      `😬 "${taskTitle}" is overdue and judging your life choices!`,
      `🤦‍♀️ "${taskTitle}" is still waiting... and it's getting impatient!`,
      `😤 "${taskTitle}" is overdue and taking it personally!`,
      `🙄 "${taskTitle}" is late and it's definitely your fault!`,
      `😱 "${taskTitle}" is overdue! The task police are coming!`
    ];
    
    const roast = overdueRoasts[Math.floor(Math.random() * overdueRoasts.length)];
    toast.error(roast);
    
    // Also show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification("⏰ Overdue Task!", {
        body: roast,
        icon: '/favicon.ico',
        tag: 'overdue-roast',
        requireInteraction: true
      });
    }
  },

  showGoalRoast: (goalTitle: string, action: 'created' | 'completed' | 'broken_down') => {
    const goalRoasts = {
      created: [
        `🎯 "${goalTitle}" is now your new obsession! Let's make it happen!`,
        `🔥 "${goalTitle}" just got added to your empire! Time to rule!`,
        `💪 "${goalTitle}" is officially on your hit list! Go get it!`,
        `⭐ "${goalTitle}" is your new mission! Accept it!`,
        `🚀 "${goalTitle}" is now part of your legacy! Make it count!`
      ],
      completed: [
        `🏆 "${goalTitle}" is DONE! You absolute legend!`,
        `🎉 "${goalTitle}" just got conquered! You're unstoppable!`,
        `💎 "${goalTitle}" is officially in the history books!`,
        `🔥 "${goalTitle}" is complete! You're on fire!`,
        `⭐ "${goalTitle}" is done and dusted! You're amazing!`
      ],
      broken_down: [
        `🧠 "${goalTitle}" just got AI-analyzed! Your tasks are ready!`,
        `⚡ "${goalTitle}" is now broken down into bite-sized victories!`,
        `🎯 "${goalTitle}" just got the treatment! Tasks incoming!`,
        `💪 "${goalTitle}" is now a battle plan! Let's execute!`,
        `🚀 "${goalTitle}" is ready for action! Your tasks await!`
      ]
    };
    
    const roasts = goalRoasts[action];
    const roast = roasts[Math.floor(Math.random() * roasts.length)];
    toast.success(roast);
    
    // Also show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification("🎯 Goal Update!", {
        body: roast,
        icon: '/favicon.ico',
        tag: 'goal-roast'
      });
    }
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