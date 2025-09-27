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
  clearThemeStorage: () => Promise<void>;
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
        // Handle case where theme might be stored as just a string (legacy data)
        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
          console.log('Found legacy theme format, converting to new format');
          const legacyTheme: Theme = {
            mode: savedTheme as 'light' | 'dark' | 'system',
            colors: THEME_CONFIG.light, // Will be updated by updateThemeColors
          };
          setThemeState(legacyTheme);
          // Save the corrected format
          await AsyncStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(legacyTheme));
        } else {
          // Try to parse as JSON
          const parsedTheme = JSON.parse(savedTheme);
          // Validate the parsed theme has the expected structure
          if (parsedTheme && typeof parsedTheme === 'object' && parsedTheme.mode) {
            setThemeState(parsedTheme);
          } else {
            console.log('Invalid theme format, using default');
            // Clear the corrupted data
            await AsyncStorage.removeItem(STORAGE_KEYS.theme);
          }
        }
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      // Clear any corrupted data
      try {
        await AsyncStorage.removeItem(STORAGE_KEYS.theme);
      } catch (clearError) {
        console.error('Error clearing corrupted theme data:', clearError);
      }
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

  const clearThemeStorage = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.theme);
      // Reset to default theme
      const defaultTheme: Theme = {
        mode: 'system',
        colors: THEME_CONFIG.light,
      };
      setThemeState(defaultTheme);
    } catch (error) {
      console.error('Error clearing theme storage:', error);
    }
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
    isDark,
    clearThemeStorage,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
