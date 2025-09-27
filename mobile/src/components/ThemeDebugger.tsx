import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { debugThemeStorage, validateThemeStorage, clearThemeStorage } from '../utils/themeUtils';

/**
 * Debug component for theme issues
 * Only use this in development mode
 */
const ThemeDebugger: React.FC = () => {
  const { theme, clearThemeStorage: contextClearTheme } = useTheme();
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleDebugStorage = async () => {
    await debugThemeStorage();
  };

  const handleValidateStorage = async () => {
    const valid = await validateThemeStorage();
    setIsValid(valid);
    Alert.alert(
      'Theme Storage Validation',
      valid ? 'Theme storage is valid' : 'Theme storage has issues',
      [{ text: 'OK' }]
    );
  };

  const handleClearStorage = async () => {
    Alert.alert(
      'Clear Theme Storage',
      'This will reset your theme to default. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearThemeStorage();
              await contextClearTheme();
              Alert.alert('Success', 'Theme storage cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear theme storage');
            }
          },
        },
      ]
    );
  };

  if (!__DEV__) {
    return null; // Only show in development
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Theme Debugger
      </Text>
      
      <Text style={[styles.info, { color: theme.colors.textSecondary }]}>
        Current Theme: {theme.mode}
      </Text>
      
      <Text style={[styles.info, { color: theme.colors.textSecondary }]}>
        Is Dark: {theme.mode === 'dark' || (theme.mode === 'system' && 'system') ? 'Yes' : 'No'}
      </Text>
      
      {isValid !== null && (
        <Text style={[styles.info, { color: isValid ? theme.colors.success : theme.colors.error }]}>
          Storage Valid: {isValid ? 'Yes' : 'No'}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleDebugStorage}
      >
        <Text style={[styles.buttonText, { color: 'white' }]}>
          Debug Storage
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.secondary }]}
        onPress={handleValidateStorage}
      >
        <Text style={[styles.buttonText, { color: 'white' }]}>
          Validate Storage
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.error }]}
        onPress={handleClearStorage}
      >
        <Text style={[styles.buttonText, { color: 'white' }]}>
          Clear Storage
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ThemeDebugger;
