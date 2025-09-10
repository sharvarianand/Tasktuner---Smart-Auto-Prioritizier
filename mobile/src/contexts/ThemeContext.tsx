import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../types';
import { THEME_CONFIG, STORAGE_KEYS } from '../config/constants';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>({
    mode: 'system',
    colors: THEME_CONFIG.light,
  });

  const isDark = theme.mode === 'dark' || (theme.mode === 'system' && systemColorScheme === 'dark');

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    updateThemeColors();
  }, [theme.mode, systemColorScheme]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.theme);
      if (savedTheme) {
        const parsedTheme = JSON.parse(savedTheme);
        setThemeState(parsedTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const updateThemeColors = () => {
    const colors = isDark ? THEME_CONFIG.dark : THEME_CONFIG.light;
    setThemeState(prev => ({
      ...prev,
      colors,
    }));
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(newTheme));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = theme.mode === 'light' ? 'dark' : 'light';
    setTheme({
      ...theme,
      mode: newMode,
    });
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
