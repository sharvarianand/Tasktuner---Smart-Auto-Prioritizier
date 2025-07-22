import { useCallback, useRef } from 'react';

interface VoiceSettings {
  enabled: boolean;
  rate: number;
  pitch: number;
  volume: number;
  voice?: string;
}

interface UseVoiceNotificationsReturn {
  speak: (text: string, options?: Partial<VoiceSettings>) => Promise<void>;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  isVoiceSupported: boolean;
}

export const useVoiceNotifications = (defaultSettings: VoiceSettings = {
  enabled: true,
  rate: 1,
  pitch: 1,
  volume: 0.8
}): UseVoiceNotificationsReturn => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSpeakingRef = useRef(false);

  const isVoiceSupported = 'speechSynthesis' in window;

  const speak = useCallback(async (text: string, options: Partial<VoiceSettings> = {}) => {
    if (!isVoiceSupported || !defaultSettings.enabled) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      try {
        // Cancel any ongoing speech
        if (utteranceRef.current) {
          window.speechSynthesis.cancel();
        }

        const settings = { ...defaultSettings, ...options };
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.rate = settings.rate;
        utterance.pitch = settings.pitch;
        utterance.volume = settings.volume;

        // Find preferred voice
        const voices = window.speechSynthesis.getVoices();
        if (settings.voice) {
          const selectedVoice = voices.find(voice => voice.name === settings.voice);
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
        } else {
          // Auto-select a good voice for notifications
          const preferredVoice = voices.find(voice => 
            voice.lang.startsWith('en') && (
              voice.name.toLowerCase().includes('female') ||
              voice.name.toLowerCase().includes('samantha') ||
              voice.name.toLowerCase().includes('karen') ||
              voice.name.toLowerCase().includes('susan')
            )
          ) || voices.find(voice => voice.lang.startsWith('en'));
          
          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        }

        utterance.onstart = () => {
          isSpeakingRef.current = true;
        };

        utterance.onend = () => {
          isSpeakingRef.current = false;
          utteranceRef.current = null;
          resolve();
        };

        utterance.onerror = (event) => {
          isSpeakingRef.current = false;
          utteranceRef.current = null;
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        reject(error);
      }
    });
  }, [defaultSettings, isVoiceSupported]);

  const stopSpeaking = useCallback(() => {
    if (isVoiceSupported && utteranceRef.current) {
      window.speechSynthesis.cancel();
      isSpeakingRef.current = false;
      utteranceRef.current = null;
    }
  }, [isVoiceSupported]);

  return {
    speak,
    stopSpeaking,
    isSpeaking: isSpeakingRef.current,
    isVoiceSupported
  };
};

// Predefined voice messages for common task notifications
export const TASK_VOICE_MESSAGES = {
  taskCompleted: (taskTitle: string) => `Great job! You've completed "${taskTitle}". Keep the momentum going!`,
  taskAdded: (taskTitle: string) => `New task added: "${taskTitle}". Time to get started!`,
  taskOverdue: (taskTitle: string) => `Hey procrastinator! "${taskTitle}" is overdue. Stop making excuses and get it done!`,
  taskReminder: (taskTitle: string) => `Reminder: "${taskTitle}" is due soon. Don't let future you down!`,
  focusSessionStart: (duration: number) => `Focus session started for ${duration} minutes. Time to crush those distractions!`,
  focusSessionComplete: () => `Focus session complete! You're officially less of a procrastinator now. Well done!`,
  streakBroken: () => `Ouch! Your productivity streak is broken. Time to bounce back stronger!`,
  streakAchieved: (days: number) => `Awesome! You've maintained a ${days}-day productivity streak. You're on fire!`,
  goalReached: (goalName: string) => `Congratulations! You've reached your goal: "${goalName}". Time to set an even bigger one!`,
  motivationalPush: () => {
    const messages = [
      "Come on, you've got this! Stop scrolling and start doing!",
      "Your future self is counting on you. Don't let them down!",
      "Procrastination is just fear in disguise. Face it head on!",
      "The best time to start was yesterday. The second best time is now!",
      "You're capable of amazing things. Stop settling for mediocre!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
};

// Utility function for quick voice notifications
export const speakTaskNotification = async (
  type: keyof typeof TASK_VOICE_MESSAGES,
  param?: string | number,
  voiceSettings?: Partial<VoiceSettings>
) => {
  if (!('speechSynthesis' in window)) return;

  let message: string;
  
  switch (type) {
    case 'taskCompleted':
    case 'taskAdded':
    case 'taskOverdue':
    case 'taskReminder':
      message = TASK_VOICE_MESSAGES[type](param as string);
      break;
    case 'focusSessionStart':
      message = TASK_VOICE_MESSAGES[type](param as number);
      break;
    case 'streakAchieved':
      message = TASK_VOICE_MESSAGES[type](param as number);
      break;
    case 'goalReached':
      message = TASK_VOICE_MESSAGES[type](param as string);
      break;
    default:
      message = TASK_VOICE_MESSAGES[type]();
      break;
  }

  const utterance = new SpeechSynthesisUtterance(message);
  
  if (voiceSettings) {
    utterance.rate = voiceSettings.rate || 1;
    utterance.pitch = voiceSettings.pitch || 1;
    utterance.volume = voiceSettings.volume || 0.8;
  }

  return new Promise<void>((resolve) => {
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
};
