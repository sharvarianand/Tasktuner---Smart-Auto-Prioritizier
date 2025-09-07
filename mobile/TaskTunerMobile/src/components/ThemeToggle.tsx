import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true); // Default to dark theme

  const toggleTheme = () => {
    setIsDark(!isDark);
    // In a real app, you would update the theme context here
    // For now, we'll just toggle the state
  };

  return (
    <TouchableOpacity style={styles.container} onPress={toggleTheme}>
      <Ionicons 
        name={isDark ? "sunny" : "moon"} 
        size={20} 
        color={isDark ? "#F59E0B" : "#8B5CF6"} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    marginLeft: 8,
  },
});

export default ThemeToggle;
