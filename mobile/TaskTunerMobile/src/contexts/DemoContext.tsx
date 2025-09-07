import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DemoContextType {
  isDemo: boolean;
  setDemoMode: (mode: boolean) => Promise<void>;
  isLoadingDemo: boolean;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};

interface DemoProviderProps {
  children: ReactNode;
}

export const DemoProvider: React.FC<DemoProviderProps> = ({ children }) => {
  const [isDemo, setIsDemo] = useState(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState(true);

  useEffect(() => {
    const loadDemoMode = async () => {
      try {
        const storedDemoMode = await AsyncStorage.getItem('tasktuner-demo-mode');
        setIsDemo(storedDemoMode === 'true');
      } catch (error) {
        console.error('Failed to load demo mode from AsyncStorage:', error);
      } finally {
        setIsLoadingDemo(false);
      }
    };
    loadDemoMode();
  }, []);

  const setDemoMode = async (mode: boolean) => {
    try {
      await AsyncStorage.setItem('tasktuner-demo-mode', String(mode));
      setIsDemo(mode);
    } catch (error) {
      console.error('Failed to set demo mode in AsyncStorage:', error);
    }
  };

  return (
    <DemoContext.Provider value={{ isDemo, setDemoMode, isLoadingDemo }}>
      {children}
    </DemoContext.Provider>
  );
};
