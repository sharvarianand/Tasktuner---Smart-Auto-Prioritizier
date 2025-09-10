import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { VoiceSettings } from '../types';
import { STORAGE_KEYS, VOICE_CONFIG } from '../config/constants';

interface VoiceContextType {
  settings: VoiceSettings;
  updateSettings: (settings: Partial<VoiceSettings>) => void;
  speak: (text: string) => Promise<void>;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  availableVoices: string[];
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

interface VoiceProviderProps {
  children: React.ReactNode;
}

export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<VoiceSettings>({
    enabled: true,
    rate: VOICE_CONFIG.defaultRate,
    pitch: VOICE_CONFIG.defaultPitch,
    volume: VOICE_CONFIG.defaultVolume,
    language: VOICE_CONFIG.supportedLanguages[0],
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<string[]>([]);

  useEffect(() => {
    loadVoiceSettings();
    loadAvailableVoices();
  }, []);

  const loadVoiceSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(STORAGE_KEYS.voiceSettings);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      }
    } catch (error) {
      console.error('Error loading voice settings:', error);
    }
  };

  const loadAvailableVoices = async () => {
    try {
      // This would typically load from the device's available voices
      // For now, we'll use a default set
      setAvailableVoices([
        'Default',
        'English (US)',
        'English (UK)',
        'English (Australia)',
      ]);
    } catch (error) {
      console.error('Error loading available voices:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<VoiceSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await AsyncStorage.setItem(STORAGE_KEYS.voiceSettings, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving voice settings:', error);
    }
  };

  const speak = async (text: string): Promise<void> => {
    if (!settings.enabled || !text.trim()) {
      return;
    }

    try {
      setIsSpeaking(true);
      
      await Speech.speak(text, {
        rate: settings.rate,
        pitch: settings.pitch,
        volume: settings.volume,
        language: settings.language,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
      
    } catch (error) {
      console.error('Error speaking text:', error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    try {
      // Stop any ongoing speech
      Speech.stop();
      setIsSpeaking(false);
      console.log('Stopped speaking');
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  };

  const value: VoiceContextType = {
    settings,
    updateSettings,
    speak,
    stopSpeaking,
    isSpeaking,
    availableVoices,
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
};
