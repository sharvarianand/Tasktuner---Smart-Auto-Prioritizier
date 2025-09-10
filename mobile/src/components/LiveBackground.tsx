import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

const LiveBackground: React.FC = () => {
  const { isDark } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
    },
    gradient1: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: height * 0.4,
      backgroundColor: isDark ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)',
    },
    gradient2: {
      position: 'absolute',
      top: height * 0.3,
      right: 0,
      width: width * 0.6,
      height: height * 0.3,
      backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.02)',
    },
    gradient3: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: width * 0.5,
      height: height * 0.4,
      backgroundColor: isDark ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.02)',
    },
    floatingCircle1: {
      position: 'absolute',
      top: height * 0.1,
      left: width * 0.1,
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
    },
    floatingCircle2: {
      position: 'absolute',
      top: height * 0.2,
      right: width * 0.15,
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
    },
    floatingCircle3: {
      position: 'absolute',
      bottom: height * 0.2,
      left: width * 0.2,
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
    },
    floatingCircle4: {
      position: 'absolute',
      bottom: height * 0.1,
      right: width * 0.1,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)',
    },
  });

  return (
    <View style={styles.container}>
      {/* Static gradients */}
      <View style={styles.gradient1} />
      <View style={styles.gradient2} />
      <View style={styles.gradient3} />
      
      {/* Static floating circles */}
      <View style={styles.floatingCircle1} />
      <View style={styles.floatingCircle2} />
      <View style={styles.floatingCircle3} />
      <View style={styles.floatingCircle4} />
    </View>
  );
};

export default LiveBackground;
