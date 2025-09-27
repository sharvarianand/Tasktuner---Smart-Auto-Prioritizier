import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/constants';

/**
 * Utility functions for theme management
 */

/**
 * Clear theme storage and reset to default
 * Useful for fixing corrupted theme data
 */
export const clearThemeStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.theme);
    console.log('Theme storage cleared successfully');
  } catch (error) {
    console.error('Error clearing theme storage:', error);
    throw error;
  }
};

/**
 * Get current theme from storage without parsing
 * Useful for debugging theme issues
 */
export const getRawThemeFromStorage = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.theme);
  } catch (error) {
    console.error('Error getting raw theme from storage:', error);
    return null;
  }
};

/**
 * Check if theme storage contains valid data
 */
export const validateThemeStorage = async (): Promise<boolean> => {
  try {
    const rawTheme = await AsyncStorage.getItem(STORAGE_KEYS.theme);
    if (!rawTheme) return true; // No theme stored is valid
    
    // Check if it's a legacy string format
    if (rawTheme === 'light' || rawTheme === 'dark' || rawTheme === 'system') {
      console.log('Legacy theme format detected:', rawTheme);
      return false;
    }
    
    // Try to parse as JSON
    const parsed = JSON.parse(rawTheme);
    return parsed && typeof parsed === 'object' && parsed.mode;
  } catch (error) {
    console.error('Invalid theme data in storage:', error);
    return false;
  }
};

/**
 * Debug function to log current theme storage state
 */
export const debugThemeStorage = async (): Promise<void> => {
  try {
    const rawTheme = await AsyncStorage.getItem(STORAGE_KEYS.theme);
    console.log('Raw theme from storage:', rawTheme);
    
    if (rawTheme) {
      try {
        const parsed = JSON.parse(rawTheme);
        console.log('Parsed theme:', parsed);
      } catch (parseError) {
        console.log('Theme is not valid JSON:', parseError);
      }
    } else {
      console.log('No theme stored in AsyncStorage');
    }
  } catch (error) {
    console.error('Error debugging theme storage:', error);
  }
};
