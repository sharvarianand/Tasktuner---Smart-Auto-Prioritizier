import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface VoiceSettings {
  enabled: boolean;
  rate: number;
  pitch: number;
  volume: number;
  autoSpeak: boolean;
  voice: string | null;
}

interface VoiceContextType {
  settings: VoiceSettings;
  updateSettings: (newSettings: Partial<VoiceSettings>) => void;
  toggleVoice: () => void;
  availableVoices: SpeechSynthesisVoice[];
  isSupported: boolean;
}

const defaultSettings: VoiceSettings = {
  enabled: false,
  rate: 1,
  pitch: 1,
  volume: 0.8,
  autoSpeak: true,
  voice: null
};

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const useVoiceContext = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoiceContext must be used within a VoiceProvider');
  }
  return context;
};

interface VoiceProviderProps {
  children: ReactNode;
}

export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<VoiceSettings>(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('tasktuner-voice-settings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const isSupported = 'speechSynthesis' in window;

  // Load available voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Auto-select a good default voice if none is selected
      if (!settings.voice && voices.length > 0) {
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && (
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('samantha') ||
            voice.name.toLowerCase().includes('karen')
          )
        ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
        
        if (preferredVoice) {
          updateSettings({ voice: preferredVoice.name });
        }
      }
    };

    loadVoices();
    
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [isSupported, settings.voice]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasktuner-voice-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<VoiceSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleVoice = () => {
    const newEnabled = !settings.enabled;
    updateSettings({ enabled: newEnabled });
    
    // Stop any current speech when disabling
    if (!newEnabled && isSupported) {
      window.speechSynthesis.cancel();
    }
  };

  const value: VoiceContextType = {
    settings,
    updateSettings,
    toggleVoice,
    availableVoices,
    isSupported
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
};
