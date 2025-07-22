import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { useVoiceContext } from '@/contexts/VoiceContext';
import { TASK_VOICE_MESSAGES, speakTaskNotification } from '@/hooks/useVoiceNotifications';

interface TaskNotificationProps {
  type: 'taskCompleted' | 'taskAdded' | 'taskOverdue' | 'taskReminder' | 'focusSessionStart' | 'focusSessionComplete' | 'streakBroken' | 'streakAchieved' | 'goalReached' | 'motivationalPush';
  taskTitle?: string;
  duration?: number;
  days?: number;
  goalName?: string;
  showToast?: boolean;
  onComplete?: () => void;
}

const TaskNotification: React.FC<TaskNotificationProps> = ({
  type,
  taskTitle,
  duration,
  days,
  goalName,
  showToast = true,
  onComplete
}) => {
  const { settings } = useVoiceContext();

  useEffect(() => {
    const handleNotification = async () => {
      let message: string;
      let param: string | number | undefined;

      switch (type) {
        case 'taskCompleted':
        case 'taskAdded':
        case 'taskOverdue':
        case 'taskReminder':
          message = TASK_VOICE_MESSAGES[type](taskTitle || 'Unknown task');
          param = taskTitle;
          break;
        case 'focusSessionStart':
          message = TASK_VOICE_MESSAGES[type](duration || 25);
          param = duration;
          break;
        case 'streakAchieved':
          message = TASK_VOICE_MESSAGES[type](days || 1);
          param = days;
          break;
        case 'goalReached':
          message = TASK_VOICE_MESSAGES[type](goalName || 'Unknown goal');
          param = goalName;
          break;
        default:
          message = TASK_VOICE_MESSAGES[type]();
          break;
      }

      // Show toast notification
      if (showToast) {
        const getToastType = () => {
          switch (type) {
            case 'taskCompleted':
            case 'focusSessionComplete':
            case 'streakAchieved':
            case 'goalReached':
              return 'success';
            case 'taskOverdue':
            case 'streakBroken':
              return 'error';
            case 'taskReminder':
              return 'warning';
            default:
              return 'info';
          }
        };

        const toastType = getToastType();
        if (toastType === 'success') {
          toast.success(message);
        } else if (toastType === 'error') {
          toast.error(message);
        } else if (toastType === 'warning') {
          toast.warning(message);
        } else {
          toast.info(message);
        }
      }

      // Speak the notification if voice is enabled
      if (settings.enabled && settings.autoSpeak) {
        try {
          await speakTaskNotification(type, param, {
            rate: settings.rate,
            pitch: settings.pitch,
            volume: settings.volume
          });
        } catch (error) {
          console.error('Voice notification failed:', error);
        }
      }

      // Call completion callback
      if (onComplete) {
        onComplete();
      }
    };

    handleNotification();
  }, [type, taskTitle, duration, days, goalName, settings, showToast, onComplete]);

  return null; // This is a utility component that doesn't render anything
};

export default TaskNotification;

// Utility function to trigger task notifications programmatically
export const triggerTaskNotification = (props: TaskNotificationProps) => {
  // This would typically be handled by a notification context or service
  // For now, we'll just create the component instance
  return React.createElement(TaskNotification, props);
};

// Examples of how to use the TaskNotification component:
/*
// Task completed
<TaskNotification 
  type="taskCompleted" 
  taskTitle="Complete project proposal" 
/>

// Focus session started
<TaskNotification 
  type="focusSessionStart" 
  duration={45} 
/>

// Streak achieved
<TaskNotification 
  type="streakAchieved" 
  days={7} 
/>

// Goal reached
<TaskNotification 
  type="goalReached" 
  goalName="Finish all urgent tasks this week" 
/>

// Motivational push (no additional params needed)
<TaskNotification 
  type="motivationalPush" 
/>
*/
